import {
  GroupPanelType,
  TcContext,
  TcPureContext,
  TcService,
} from 'tailchat-server-sdk';

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

type AssistantAction = {
  type: string;
  title: string;
  payload: Record<string, any>;
  requireConfirm?: boolean;
};

interface GenerateReportParams {
  channelIds?: string[];
  date?: string;
  includeDM?: boolean;
  includeGroups?: boolean;
  maxConversations?: number;
}

interface GroupPanel {
  id: string;
  name: string;
  type: GroupPanelType;
}

interface UserGroup {
  _id: string;
  name: string;
  panels?: GroupPanel[];
}

interface ChannelInfo {
  id: string;
  name: string;
  type: 'group' | 'dm';
  groupId?: string;
}

interface ConverseInfo {
  _id: string;
  name?: string;
  type?: 'DM' | 'Multi' | 'Group';
  members?: string[];
}

interface ChatMessage {
  _id: string;
  content: string;
  plain?: string;
  converseId: string;
  author?: string;
  sender?: {
    _id: string;
    nickname: string;
  };
  createdAt: string;
  type?: string;
}

interface CleanedMessage {
  content: string;
  msgId: string;
  converseId: string;
  sender: string;
  timestamp: number;
  sourceName?: string;
  reasons?: string[];
  importance?: number;
}

interface FriendInfo {
  id: string;
  nickname?: string;
}

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
  chat: `你是"小序"，一款名为"序语空间"的办公协作平台的智能助手。你亲切、专业、高效，始终以帮助用户解决问题为第一目标。`,
};

const IMPORTANT_PATTERNS = {
  decision: [
    /决定|确认|定了|结论|方案|采用|不采用|上线|发布|合并|通过|同意|拍板/,
    /\b(decide|decided|confirm|confirmed|approved|ship|release|merge)\b/i,
  ],
  todo: [
    /待办|TODO|todo|需要|请|负责|安排|跟进|处理|修复|实现|补充|提交|同步|排查|验证|review/i,
    /@[\w\u4e00-\u9fa5-]+/,
  ],
  blocker: [
    /阻塞|卡住|风险|问题|失败|报错|延期|延迟|来不及|不可用|不能|无法|缺少|依赖|冲突/,
    /\b(block|blocked|risk|issue|failed|error|delay|missing|cannot|can't)\b/i,
  ],
  progress: [
    /完成|已|已经|推进|更新|修复|实现|接入|测试|验证|上线|发布|提交|合并/,
    /\b(done|fixed|implemented|updated|tested|deployed|released|merged)\b/i,
  ],
};

const PRIVATE_CHAT_PATTERNS = [
  /吃饭|午饭|晚饭|早饭|咖啡|周末|下班|睡觉|游戏|电影|哈哈|hhh|233|摸鱼/,
  /\b(lunch|dinner|coffee|weekend|movie|game|lol|haha)\b/i,
];

const DEFAULT_MAX_CONVERSATIONS = 20;
const FETCH_PAGES_PER_CONVERSATION = 3;

const getLocalDateString = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000)
    .toISOString()
    .split('T')[0];
};

class AIAssistantService extends TcService {
  private userNameCache = new Map<string, string>();

  get serviceName() {
    return 'plugin:com.msgbyte.ai-assistant';
  }

  onInit() {
    this.registerAction('chat', this.chat, {
      params: {
        content: 'string',
        action: { type: 'string', optional: true },
        thinkMode: { type: 'boolean', optional: true, default: false },
      },
    });

    this.registerAction('assistant', this.assistant, {
      params: {
        content: 'string',
      },
    });

    this.registerAction('executeAction', this.executeAction, {
      params: {
        type: 'string',
        payload: { type: 'object', optional: true },
      },
    });

    this.registerAction('generateReport', this.generateReport, {
      params: {
        channelIds: { type: 'array', items: 'string', optional: true },
        date: { type: 'string', optional: true },
        includeDM: { type: 'boolean', optional: true },
        includeGroups: { type: 'boolean', optional: true },
        maxConversations: { type: 'number', optional: true },
      },
    });

    this.registerAction('listChannels', this.listChannels);

    // The old text helper is intentionally public. User-data actions above must
    // keep normal auth so ctx.meta.userId/token are available.
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
      const { answer, reasoning } = await this.callLLM(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content },
        ],
        {
          model,
          maxTokens,
          timeout: useThinkMode ? 120000 : 60000,
          temperature: useThinkMode ? undefined : 0.7,
          includeReasoning: useThinkMode,
        }
      );

      if (!answer && !reasoning) {
        return {
          result: false,
          answer: 'AI 返回内容为空，请稍后重试',
          usage: Date.now() - startTime,
        };
      }

      return {
        result: true,
        answer,
        ...(useThinkMode && reasoning ? { reasoning } : {}),
        usage: Date.now() - startTime,
      };
    } catch (err: any) {
      return {
        result: false,
        answer: `AI 调用失败: ${this.formatAIError(err)}`,
        usage: Date.now() - startTime,
      };
    }
  }

  async assistant(ctx: TcContext<{ content: string }>) {
    const content = (ctx.params.content || '').trim();
    if (!content) {
      return { result: false, reply: '请输入你想让我做什么。', actions: [] };
    }

    const localPlan = this.planWithRules(content);
    if (localPlan.actions.length > 0) {
      return { result: true, ...localPlan };
    }

    try {
      const [channels, friends] = await Promise.all([
        this.listAvailableChannels(ctx, {
          includeDM: true,
          includeGroups: true,
          maxConversations: 100,
        }),
        this.listFriends(ctx),
      ]);
      const plan = await this.planAssistantAction(content, {
        currentDate: getLocalDateString(),
        userName: ctx.meta.user?.nickname,
        channels,
        friends,
      });

      return {
        result: true,
        reply: plan.reply || '我可以帮你处理日程、消息、通知、群聊、群组和简报。',
        actions: this.normalizeAssistantActions(plan.actions),
      };
    } catch (err) {
      this.logger.error(`Assistant planning failed: ${err}`);
      return {
        result: true,
        reply:
          localPlan.reply ||
          '我可以帮你处理日程、消息、通知、群聊、群组和简报。',
        actions: localPlan.actions,
      };
    }
  }

  async executeAction(ctx: TcContext<{ type: string; payload?: Record<string, any> }>) {
    const { type, payload = {} } = ctx.params;

    switch (type) {
      case 'create_task':
        return { result: true, actionResult: await this.createTask(ctx, payload) };
      case 'send_message':
        return { result: true, actionResult: await this.sendMessage(ctx, payload) };
      case 'send_dm':
        return { result: true, actionResult: await this.sendDm(ctx, payload) };
      case 'notify_self':
        return {
          result: true,
          actionResult: await this.notifyUsers(ctx, {
            ...payload,
            userIds: [ctx.meta.userId],
          }),
        };
      case 'notify_users':
        return { result: true, actionResult: await this.notifyUsers(ctx, payload) };
      case 'create_converse':
        return {
          result: true,
          actionResult: await this.createConverse(ctx, payload),
        };
      case 'create_group':
        return { result: true, actionResult: await this.createGroup(ctx, payload) };
      case 'generate_report':
        return await this.generateReport({
          ...ctx,
          params: {
            channelIds: Array.isArray(payload.channelIds)
              ? payload.channelIds.map(String)
              : undefined,
            date: payload.date,
            includeDM: payload.includeDM ?? true,
            includeGroups: payload.includeGroups ?? true,
            maxConversations:
              typeof payload.maxConversations === 'number'
                ? payload.maxConversations
                : DEFAULT_MAX_CONVERSATIONS,
          },
        } as TcContext<GenerateReportParams>);
      default:
        return { result: false, error: `不支持的动作: ${type}` };
    }
  }

  async listChannels(ctx: TcContext) {
    const channels = await this.listAvailableChannels(ctx, {
      includeDM: true,
      includeGroups: true,
      maxConversations: 100,
    });

    return { result: true, channels };
  }

  async generateReport(ctx: TcContext<GenerateReportParams>) {
    const {
      channelIds = [],
      date,
      includeDM = true,
      includeGroups = true,
      maxConversations = DEFAULT_MAX_CONVERSATIONS,
    } = ctx.params;
    const targetDate = date || getLocalDateString();
    const channels =
      channelIds.length > 0
        ? await this.resolveChannels(ctx, channelIds, maxConversations)
        : await this.listAvailableChannels(ctx, {
            includeDM,
            includeGroups,
            maxConversations,
          });

    const allMessages: CleanedMessage[] = [];
    for (const channel of channels) {
      const messages = await this.fetchRecentMessages(ctx, channel.id);
      const messagesWithSender = await this.attachSenderNames(ctx, messages);
      allMessages.push(
        ...this.cleanMessages(messagesWithSender)
          .filter((message) => this.isMessageInDate(message.timestamp, targetDate))
          .map((message) => ({ ...message, sourceName: channel.name }))
      );
    }

    const importantMessages = this.selectImportantMessages(allMessages);
    const report =
      DEEPSEEK_API_KEY && importantMessages.length > 0
        ? await this.generateLLMReport(importantMessages, targetDate)
        : this.createFallbackReport(importantMessages, allMessages, targetDate);

    return {
      result: true,
      report,
      metadata: {
        channelCount: channels.length,
        messageCount: allMessages.length,
        importantMessageCount:
          report.progress.length +
          report.decisions.length +
          report.blockers.length +
          report.todos.length,
        channels,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  private async planAssistantAction(
    userMessage: string,
    context: {
      currentDate: string;
      userName?: string;
      channels: ChannelInfo[];
      friends: FriendInfo[];
    }
  ): Promise<{ reply: string; actions: AssistantAction[] }> {
    if (!DEEPSEEK_API_KEY) {
      return { reply: '', actions: [] };
    }

    const prompt = `你是"小序"，序语空间里的个人 Agent 助手。你可以帮用户整理简报、加日程/待办、发送消息、发通知、创建多人会话、创建群组。

当前日期: ${context.currentDate}
当前用户: ${context.userName ?? 'Unknown'}

可用会话:
${context.channels
  .slice(0, 80)
  .map((c) => `- id=${c.id} type=${c.type} name=${c.name}${c.groupId ? ` groupId=${c.groupId}` : ''}`)
  .join('\n')}

好友:
${context.friends
  .slice(0, 80)
  .map((f) => `- id=${f.id} nickname=${f.nickname ?? ''}`)
  .join('\n')}

请把用户请求转换为 JSON，只输出 JSON，不要输出 Markdown。
动作:
- create_task payload={ "title": string, "desc"?: string, "deadline"?: ISO日期字符串, "priority"?: "high"|"medium"|"low" }
- send_message payload={ "converseId": string, "groupId"?: string, "content": string }
- send_dm payload={ "userId": string, "content": string }
- notify_self payload={ "title": string, "content": string }
- notify_users payload={ "userIds": string[], "title": string, "content": string }
- create_converse payload={ "memberIds": string[] }
- create_group payload={ "name": string, "panelName"?: string }
- generate_report payload={ "date"?: YYYY-MM-DD字符串 }

有副作用的动作 requireConfirm 必须为 true。如果目标用户、会话不明确，不要猜 id，reply 里询问用户补充。
返回格式: {"reply":"...","actions":[{"type":"create_task","title":"添加日程","payload":{},"requireConfirm":true}]}

用户请求:
${userMessage}`;

    const { answer } = await this.callLLM([{ role: 'user', content: prompt }], {
      model: DEEPSEEK_MODEL,
      maxTokens: 2048,
      timeout: 60000,
      temperature: 0.2,
    });

    try {
      const parsed = JSON.parse(answer);
      return {
        reply: typeof parsed.reply === 'string' ? parsed.reply : '',
        actions: Array.isArray(parsed.actions) ? parsed.actions : [],
      };
    } catch {
      return { reply: answer, actions: [] };
    }
  }

  private async generateLLMReport(messages: CleanedMessage[], date: string) {
    const messageText = messages
      .slice(0, 160)
      .map(
        (m) =>
          `[${m.sourceName ?? m.converseId}] [${m.sender}] (${m.msgId}): ${m.content}`
      )
      .join('\n');
    const prompt = `根据以下聊天记录生成结构化简报，只输出 JSON:
{
  "highlights": ["概览"],
  "progress": ["进度（包含msgId）"],
  "decisions": ["决策（包含msgId）"],
  "blockers": ["风险"],
  "todos": ["待办"]
}

日期: ${date}
聊天记录:
${messageText}`;

    try {
      const { answer } = await this.callLLM([{ role: 'user', content: prompt }], {
        model: DEEPSEEK_MODEL,
        maxTokens: 2048,
        timeout: 60000,
        temperature: 0.4,
      });
      const parsed = JSON.parse(answer);
      return {
        highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
        progress: Array.isArray(parsed.progress) ? parsed.progress : [],
        decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
        blockers: Array.isArray(parsed.blockers) ? parsed.blockers : [],
        todos: Array.isArray(parsed.todos) ? parsed.todos : [],
      };
    } catch (err) {
      this.logger.warn(`LLM report failed, fallback: ${err}`);
      return this.createFallbackReport(messages, messages, date);
    }
  }

  private planWithRules(content: string): { reply: string; actions: AssistantAction[] } {
    const normalized = content.trim();
    if (/简报|日报|总结|汇总/.test(normalized)) {
      return {
        reply: '我可以为你生成今日简报。',
        actions: [
          {
            type: 'generate_report',
            title: '生成今日简报',
            payload: { date: getLocalDateString() },
            requireConfirm: false,
          },
        ],
      };
    }

    const groupMatch = normalized.match(
      /(?:帮我|请)?(?:创建|新建|建)(?:一个)?(?:群组|群|空间)[：:，,\s]*(.+)/
    );
    if (groupMatch) {
      return {
        reply: '我先为你准备一个创建群组动作，请确认后创建。',
        actions: [
          {
            type: 'create_group',
            title: '创建群组',
            payload: { name: groupMatch[1].trim(), panelName: '讨论' },
            requireConfirm: true,
          },
        ],
      };
    }

    const notifySelfMatch = normalized.match(
      /(?:提醒我|通知我|给我发通知)[：:，,\s]*(.+)/
    );
    if (notifySelfMatch) {
      return {
        reply: '我先为你准备一个通知动作，请确认后发送给你自己。',
        actions: [
          {
            type: 'notify_self',
            title: '通知自己',
            payload: { title: '小序通知', content: notifySelfMatch[1].trim() },
            requireConfirm: true,
          },
        ],
      };
    }

    const taskMatch = normalized.match(
      /(?:帮我|给我|请)?(?:加|添加|创建|新增|记)(?:一个)?(?:日程|待办|任务|提醒)?[：:，,\s]*(.+)/
    );
    if (
      taskMatch &&
      /日程|待办|任务|提醒|明天|今天|后天|下周|截止|deadline/i.test(normalized)
    ) {
      return {
        reply: '我先为你准备一个待办/日程动作，请确认后创建。',
        actions: [
          {
            type: 'create_task',
            title: '添加待办/日程',
            payload: {
              title: taskMatch[1].trim(),
              deadline: this.extractSimpleDeadline(normalized),
              priority: /紧急|重要|高优先级/.test(normalized)
                ? 'high'
                : 'medium',
            },
            requireConfirm: true,
          },
        ],
      };
    }

    if (/(?:创建|新建|建)(?:一个)?(?:群聊|多人会话)/.test(normalized)) {
      return {
        reply:
          '可以创建多人会话，不过我需要明确的成员信息。请告诉我要拉哪些好友，或配置 AI 后让我根据好友昵称匹配。',
        actions: [],
      };
    }

    if (/(?:发消息|发送消息|私信|告诉)/.test(normalized)) {
      return {
        reply:
          '可以发送消息，不过我需要明确的目标会话或好友。请说明发送给谁以及消息内容。',
        actions: [],
      };
    }

    return { reply: '', actions: [] };
  }

  private normalizeAssistantActions(actions: AssistantAction[] = []) {
    return actions
      .filter((action) => action && typeof action.type === 'string')
      .map((action) => ({
        type: action.type,
        title: action.title || this.getActionTitle(action.type),
        payload: action.payload ?? {},
        requireConfirm: action.requireConfirm !== false,
      }));
  }

  private getActionTitle(type: string) {
    const titleMap: Record<string, string> = {
      create_task: '添加待办/日程',
      send_message: '发送消息',
      send_dm: '发送私信',
      notify_self: '通知自己',
      notify_users: '发送通知',
      create_converse: '创建多人会话',
      create_group: '创建群组',
      generate_report: '生成简报',
    };
    return titleMap[type] ?? type;
  }

  private async listAvailableChannels(
    ctx: TcContext,
    options: {
      includeDM: boolean;
      includeGroups: boolean;
      maxConversations: number;
    }
  ): Promise<ChannelInfo[]> {
    const channels: ChannelInfo[] = [];
    if (options.includeGroups) {
      try {
        channels.push(...(await this.listGroupChannels(ctx)));
      } catch (err) {
        this.logger.error(`Failed to list group channels: ${err}`);
      }
    }
    if (options.includeDM) {
      try {
        channels.push(...(await this.listDmChannels(ctx)));
      } catch (err) {
        this.logger.error(`Failed to list DM channels: ${err}`);
      }
    }
    return (await this.sortChannelsByRecentMessage(ctx, channels)).slice(
      0,
      options.maxConversations
    );
  }

  private async resolveChannels(
    ctx: TcContext,
    channelIds: string[],
    maxConversations: number
  ) {
    const channelMap = new Map(
      (
        await this.listAvailableChannels(ctx, {
          includeDM: true,
          includeGroups: true,
          maxConversations: 1000,
        })
      ).map((channel) => [channel.id, channel])
    );
    return channelIds
      .map((channelId) => channelMap.get(channelId))
      .filter(Boolean)
      .slice(0, maxConversations) as ChannelInfo[];
  }

  private async listGroupChannels(ctx: TcContext): Promise<ChannelInfo[]> {
    const groups = await ctx.call<UserGroup[]>('group.getUserGroups');
    return groups.flatMap<ChannelInfo>((group) =>
      (group.panels ?? [])
        .filter((panel) => panel.type === GroupPanelType.TEXT)
        .map((panel) => ({
          id: panel.id,
          name: `${group.name} / ${panel.name}`,
          type: 'group',
          groupId: String(group._id),
        }))
    );
  }

  private async listDmChannels(ctx: TcContext): Promise<ChannelInfo[]> {
    const converseIds = await ctx.call<Array<string | { _id?: string }>>(
      'user.dmlist.getAllConverse'
    );
    const channels: ChannelInfo[] = [];
    for (const item of converseIds) {
      const converseId = typeof item === 'string' ? item : String(item?._id ?? item);
      if (!converseId) continue;
      try {
        const info = await ctx.call<ConverseInfo, { converseId: string }>(
          'chat.converse.findConverseInfo',
          { converseId }
        );
        channels.push({
          id: converseId,
          name: await this.getConverseDisplayName(ctx, info),
          type: 'dm',
        });
      } catch (err) {
        this.logger.warn(`Failed to resolve converse ${converseId}: ${err}`);
      }
    }
    return channels;
  }

  private async getConverseDisplayName(ctx: TcContext, info: ConverseInfo) {
    if (info.name) return `私聊 / ${info.name}`;
    const userId = ctx.meta.userId;
    const memberIds = (info.members ?? []).map(String).filter((id) => id !== userId);
    const names: string[] = [];
    for (const memberId of memberIds.slice(0, 3)) {
      names.push(await this.getUserName(ctx, memberId));
    }
    const label = names.length > 0 ? names.join(', ') : String(info._id);
    return info.type === 'Multi' ? `多人会话 / ${label}` : `私聊 / ${label}`;
  }

  private async sortChannelsByRecentMessage(ctx: TcContext, channels: ChannelInfo[]) {
    if (channels.length === 0) return [];
    try {
      const lastMessages = await ctx.call<
        Array<{ converseId: string; lastMessageId?: string } | null>,
        { converseIds: string[] }
      >('chat.message.fetchConverseLastMessages', {
        converseIds: channels.map((channel) => channel.id),
      });
      const lastMessageMap = new Map(
        (lastMessages ?? [])
          .filter(Boolean)
          .map((item) => [item!.converseId, item!.lastMessageId ?? ''])
      );
      return [...channels].sort((a, b) =>
        String(lastMessageMap.get(b.id) ?? '').localeCompare(
          String(lastMessageMap.get(a.id) ?? '')
        )
      );
    } catch {
      return channels;
    }
  }

  private async fetchRecentMessages(ctx: TcContext, converseId: string) {
    const messages: ChatMessage[] = [];
    let startId: string | undefined;
    for (let i = 0; i < FETCH_PAGES_PER_CONVERSATION; i++) {
      const page = await ctx.call<ChatMessage[], { converseId: string; startId?: string }>(
        'chat.message.fetchConverseMessage',
        { converseId, startId }
      );
      if (!Array.isArray(page) || page.length === 0) break;
      messages.push(...page);
      startId = page[page.length - 1]._id;
      if (page.length < 50) break;
    }
    return messages.reverse();
  }

  private async attachSenderNames(ctx: TcContext, messages: ChatMessage[]) {
    return Promise.all(
      messages.map(async (message) => {
        if (message.sender?.nickname || !message.author) return message;
        return {
          ...message,
          sender: {
            _id: String(message.author),
            nickname: await this.getUserName(ctx, String(message.author)),
          },
        };
      })
    );
  }

  private cleanMessages(messages: ChatMessage[]): CleanedMessage[] {
    return messages
      .filter((msg) => !['system', 'tip', 'recall', 'revoke'].includes(msg.type || ''))
      .map((msg) => ({
        content: this.normalizeText(msg.plain || msg.content || ''),
        msgId: msg._id,
        converseId: msg.converseId,
        sender: msg.sender?.nickname || 'Unknown',
        timestamp: new Date(msg.createdAt).getTime(),
      }))
      .filter((msg) => msg.content.replace(/\s/g, '').length >= 3);
  }

  private normalizeText(text: string) {
    return text
      .replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
        ''
      )
      .replace(/\s+/g, ' ')
      .trim();
  }

  private selectImportantMessages(messages: CleanedMessage[], limit = 160) {
    return messages
      .map((message) => {
        const { score, reasons } = this.scoreMessage(message.content);
        return { ...message, importance: score, reasons };
      })
      .filter((message) => (message.importance ?? 0) >= 2)
      .sort((a, b) => {
        const importanceDiff = (b.importance ?? 0) - (a.importance ?? 0);
        return importanceDiff === 0 ? b.timestamp - a.timestamp : importanceDiff;
      })
      .slice(0, limit)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  private scoreMessage(content: string) {
    const reasons: string[] = [];
    let score = 0;
    if (content.length >= 12) score += 1;
    if (content.length >= 40) score += 1;
    for (const [reason, patterns] of Object.entries(IMPORTANT_PATTERNS)) {
      if (patterns.some((pattern) => pattern.test(content))) {
        reasons.push(reason);
        score += reason === 'decision' || reason === 'blocker' ? 3 : 2;
      }
    }
    if (/https?:\/\/|www\./i.test(content)) score += 1;
    if (PRIVATE_CHAT_PATTERNS.some((pattern) => pattern.test(content))) score -= 2;
    return { score, reasons };
  }

  private createFallbackReport(
    importantMessages: CleanedMessage[],
    allMessages: CleanedMessage[],
    date: string
  ) {
    if (importantMessages.length === 0) {
      return {
        progress: [],
        decisions: [],
        blockers: [],
        todos: [],
        highlights:
          allMessages.length > 0
            ? [`${date} 未识别到明确的进度、决策、风险或待办。`]
            : [`${date} 暂无可用于生成简报的消息。`],
      };
    }
    const pick = (reason: string, max: number) =>
      importantMessages
        .filter((message) => message.reasons?.includes(reason))
        .slice(0, max)
        .map((message) => this.formatReportLine(message));
    return {
      highlights: [
        `已从 ${new Set(importantMessages.map((m) => m.converseId)).size} 个会话中筛选出 ${importantMessages.length} 条重要消息。`,
      ],
      progress: pick('progress', 8),
      decisions: pick('decision', 8),
      blockers: pick('blocker', 8),
      todos: pick('todo', 10),
    };
  }

  private formatReportLine(message: CleanedMessage) {
    const source = message.sourceName ? `【${message.sourceName}】` : '';
    const content =
      message.content.length > 120
        ? `${message.content.slice(0, 117)}...`
        : message.content;
    return `${source}${message.sender}: ${content} (msgId=${message.msgId})`;
  }

  private isMessageInDate(timestamp: number, targetDate: string) {
    if (!timestamp || !targetDate) return true;
    const date = new Date(timestamp);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000)
      .toISOString()
      .split('T')[0];
    return localDate === targetDate;
  }

  private async listFriends(ctx: TcContext): Promise<FriendInfo[]> {
    try {
      return await ctx.call<FriendInfo[]>('friend.getAllFriends');
    } catch {
      return [];
    }
  }

  private async getUserName(ctx: TcContext, userId: string) {
    const cachedName = this.userNameCache.get(userId);
    if (cachedName) return cachedName;
    try {
      const user = await ctx.call<any, { userId: string }>('user.getUserInfo', {
        userId,
      });
      const name = user?.nickname ?? userId;
      this.userNameCache.set(userId, name);
      return name;
    } catch {
      return userId;
    }
  }

  private async createTask(ctx: TcContext, payload: Record<string, any>) {
    const title = String(payload.title || '').trim();
    if (!title) throw new Error('待办标题不能为空');
    return await ctx.call('plugin:com.msgbyte.tasks.add', {
      title,
      desc: payload.desc ? String(payload.desc) : undefined,
      deadline: payload.deadline ? String(payload.deadline) : undefined,
      priority: ['high', 'medium', 'low'].includes(payload.priority)
        ? payload.priority
        : 'medium',
      tags: Array.isArray(payload.tags) ? payload.tags.map(String) : undefined,
    });
  }

  private async sendMessage(ctx: TcContext, payload: Record<string, any>) {
    const converseId = String(payload.converseId || '');
    const content = String(payload.content || '').trim();
    if (!converseId || !content) {
      throw new Error('发送消息需要 converseId 和 content');
    }
    return await ctx.call('chat.message.sendMessage', {
      converseId,
      groupId: payload.groupId ? String(payload.groupId) : undefined,
      content,
      plain: content,
      meta: {},
    });
  }

  private async sendDm(ctx: TcContext, payload: Record<string, any>) {
    const userId = String(payload.userId || '');
    const content = String(payload.content || '').trim();
    if (!userId || !content) throw new Error('发送私信需要 userId 和 content');
    const converse = await ctx.call<{ _id: string }, { memberIds: string[] }>(
      'chat.converse.createDMConverse',
      { memberIds: [userId] }
    );
    return await this.sendMessage(ctx, {
      converseId: String(converse._id),
      content,
    });
  }

  private async notifyUsers(ctx: TcContext, payload: Record<string, any>) {
    const userIds = Array.isArray(payload.userIds)
      ? payload.userIds.map(String)
      : [];
    const content = String(payload.content || '').trim();
    if (userIds.length === 0 || !content) {
      throw new Error('发送通知需要 userIds 和 content');
    }
    return await ctx.call('chat.inbox.batchAppend', {
      userIds,
      type: 'markdown',
      payload: {
        title: String(payload.title || '小序通知'),
        content,
        source: '小序助手',
      },
    });
  }

  private async createConverse(ctx: TcContext, payload: Record<string, any>) {
    const memberIds = Array.isArray(payload.memberIds)
      ? payload.memberIds.map(String).filter(Boolean)
      : [];
    if (memberIds.length === 0) throw new Error('创建会话需要至少一个成员');
    return await ctx.call('chat.converse.createDMConverse', { memberIds });
  }

  private async createGroup(ctx: TcContext, payload: Record<string, any>) {
    const name = String(payload.name || '').trim();
    if (!name) throw new Error('群组名称不能为空');
    return await ctx.call('group.createGroup', {
      name,
      panels: [
        {
          id: `${Date.now()}`,
          name: String(payload.panelName || '讨论'),
          type: GroupPanelType.TEXT,
        },
      ],
    });
  }

  private extractSimpleDeadline(content: string): string | undefined {
    const now = new Date();
    const date = new Date(now);
    if (/后天/.test(content)) date.setDate(now.getDate() + 2);
    else if (/明天/.test(content)) date.setDate(now.getDate() + 1);
    else if (/今天/.test(content)) date.setDate(now.getDate());
    else {
      const dateMatch = content.match(/(\d{1,2})[月/-](\d{1,2})[日号]?/);
      if (!dateMatch) return undefined;
      date.setMonth(Number(dateMatch[1]) - 1);
      date.setDate(Number(dateMatch[2]));
    }
    const timeMatch = content.match(
      /(上午|下午|晚上|中午|凌晨)?\s*(\d{1,2})(?:[:：点](\d{1,2})?)?/
    );
    if (timeMatch) {
      let hour = Number(timeMatch[2]);
      const minute = timeMatch[3] ? Number(timeMatch[3]) : 0;
      const period = timeMatch[1];
      if ((period === '下午' || period === '晚上') && hour < 12) hour += 12;
      if (period === '中午' && hour < 11) hour += 12;
      date.setHours(hour, minute, 0, 0);
    } else {
      date.setHours(9, 0, 0, 0);
    }
    return date.toISOString();
  }

  private async callLLM(
    messages: Array<{ role: string; content: string }>,
    options: {
      model: string;
      maxTokens: number;
      timeout: number;
      temperature?: number;
      includeReasoning?: boolean;
    }
  ) {
    const res = await fetch(`${DEEPSEEK_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: options.model,
        messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
      }),
      signal: AbortSignal.timeout(options.timeout),
    });
    const body: ChatCompletionResponse = await res.json();
    if (!res.ok) {
      const msg = (body as any)?.error?.message || `HTTP ${res.status}`;
      throw new Error(msg);
    }
    return {
      answer: body.choices?.[0]?.message?.content ?? '',
      reasoning: options.includeReasoning
        ? body.choices?.[0]?.message?.reasoning_content ?? ''
        : '',
    };
  }

  private formatAIError(err: any) {
    if (err.name === 'AbortError' || err.name === 'TimeoutError') {
      return '请求超时，请稍后重试';
    }
    if (err.cause?.code === 'ECONNREFUSED' || err.cause?.code === 'ENOTFOUND') {
      return '无法连接到 AI 服务，请检查网络或 API 地址配置';
    }
    return err.message || '未知错误';
  }
}

export default AIAssistantService;
