import { TcService, TcPureContext } from 'tailchat-server-sdk';

const DEEPSEEK_API_URL =
  process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
const DEEPSEEK_THINK_MODEL =
  process.env.DEEPSEEK_THINK_MODEL || 'deepseek-reasoner';

type ActionType =
  | 'improve'
  | 'shorter'
  | 'longer'
  | 'translate'
  | 'summary'
  | 'chat';

const SYSTEM_PROMPTS: Record<ActionType, string> = {
  improve:
    '你是一位专业的文字编辑。请对用户提供的文本进行润色，使其表达更流畅、更专业，同时保持原意不变。仅输出润色后的文本，不要添加任何解释或评论。保持原文语言不变。',
  shorter:
    '你是一位专业的文字编辑。请将用户提供的文本精简，去除冗余内容，使表达更简洁有力，同时保持核心信息完整。仅输出精简后的文本，不要添加任何解释或评论。保持原文语言不变。',
  longer:
    '你是一位专业的文字编辑。请将用户提供的文本扩写，补充细节和论据，使内容更充实丰富，同时保持原意不变。仅输出扩写后的文本，不要添加任何解释或评论。保持原文语言不变。',
  translate:
    '你是一位专业翻译。请将用户提供的文本翻译为目标语言。规则：如果原文是中文则翻译为英文，如果原文是英文则翻译为中文。仅输出翻译结果，不要添加任何解释、注释或拼音。',
  summary:
    '你将收到一段聊天记录，请对其进行总结摘要。要求：1. 提炼核心话题和关键结论；2. 使用清晰的 Markdown 格式，包含标题和要点列表；3. 简明扼要，突出重点；4. 标注发言者的重要观点。',
  chat: `你是"小序"，一款名为"序语空间"的办公协作平台的智能助手。你的核心定位如下：

【身份】
你是小序，序语空间的 AI 智能助手。你亲切、专业、高效，始终以帮助用户解决问题为第一目标。

【使命】
1. 职场办公：帮助用户处理日常工作——撰写文档、整理思路、润色文案、分析数据、生成方案、解答职场疑问，提升办公效率。
2. 公益助残：你特别关注听障群体，致力于用技术弥合沟通鸿沟。当涉及听障相关话题时，你会主动提供实用建议，如：文字沟通技巧、语音转文字工具推荐、手语学习资源、无障碍办公方案等。

【行为准则】
- 回答简洁专业，避免冗余
- 优先给出可操作的建议和方案
- 对听障用户保持额外的耐心和体贴，推荐无障碍替代方案
- 涉及医疗、法律等专业领域时提醒用户咨询专业人士
- 用中文回答，除非用户明确使用其他语言`,
};

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
      reasoning_content?: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class AIAssistantService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.ai-assistant';
  }

  onInit() {
    this.registerAction('chat', this.chat, {
      params: {
        content: 'string',
        action: {
          type: 'string',
          optional: true,
        },
        thinkMode: {
          type: 'boolean',
          optional: true,
          default: false,
        },
      },
    });
    this.registerAuthWhitelist(['/chat']);
  }

  async chat(
    ctx: TcPureContext<{ content: string; action?: string; thinkMode?: boolean }>
  ) {
    const { content, action, thinkMode } = ctx.params;
    const startTime = Date.now();
    const actionType = (action as ActionType) || 'chat';
    const useThinkMode = thinkMode === true;

    if (!DEEPSEEK_API_KEY) {
      return {
        result: false,
        answer: '未配置 DEEPSEEK_API_KEY 环境变量，请联系管理员',
        usage: 0,
      };
    }

    if (!content || content.trim().length === 0) {
      return {
        result: false,
        answer: '输入内容不能为空',
        usage: 0,
      };
    }

    const systemPrompt = SYSTEM_PROMPTS[actionType] || SYSTEM_PROMPTS.chat;

    try {
      const model = useThinkMode ? DEEPSEEK_THINK_MODEL : DEEPSEEK_MODEL;
      const maxTokens = useThinkMode ? 8192 : 2048;

      const res = await fetch(
        `${DEEPSEEK_API_URL}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content },
            ],
            temperature: useThinkMode ? undefined : 0.7,
            max_tokens: maxTokens,
          }),
          signal: AbortSignal.timeout(useThinkMode ? 120000 : 60000),
        }
      );

      const body: ChatCompletionResponse = await res.json();

      if (!res.ok) {
        const msg =
          (body as any)?.error?.message || `HTTP ${res.status}`;
        return {
          result: false,
          answer: `AI 调用失败: ${msg}`,
          usage: Date.now() - startTime,
        };
      }

      const answer = body.choices?.[0]?.message?.content ?? '';
      const reasoningContent =
        body.choices?.[0]?.message?.reasoning_content ?? '';

      if (!answer && !reasoningContent) {
        return {
          result: false,
          answer: 'AI 返回内容为空，请稍后重试',
          usage: Date.now() - startTime,
        };
      }

      return {
        result: true,
        answer,
        ...(useThinkMode && reasoningContent
          ? { reasoning: reasoningContent }
          : {}),
        usage: Date.now() - startTime,
      };
    } catch (err: any) {
      let msg = err.message || '未知错误';
      if (err.name === 'AbortError' || err.name === 'TimeoutError') {
        msg = '请求超时，请稍后重试';
      } else if (
        err.cause?.code === 'ECONNREFUSED' ||
        err.cause?.code === 'ENOTFOUND'
      ) {
        msg = '无法连接到 AI 服务，请检查网络或 API 地址配置';
      }
      return {
        result: false,
        answer: `AI 调用失败: ${msg}`,
        usage: Date.now() - startTime,
      };
    }
  }
}

export default AIAssistantService;
