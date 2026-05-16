import { z } from 'zod';
import type { TailchatTool } from './tools';

const DAILY_REPORT_SCHEMA = z.object({
  progress: z
    .array(z.string())
    .describe('工作进度列表，每条需包含msgId溯源'),
  decisions: z
    .array(z.string())
    .describe('决策列表，需包含相关msgId'),
  blockers: z
    .array(z.string())
    .describe('阻碍和风险列表'),
  todos: z
    .array(z.string())
    .describe('待办任务列表，需包含负责人'),
});

interface ParsedMessage {
  content: string;
  msgId: string;
  converseId: string;
  sender: string;
  timestamp: number;
}

interface PanelContent {
  panelId: string;
  content: string;
}

const CHUNK_SIZE = 20;
const CHUNK_OVERLAP = 5;

export class DataPipeline {
  private deepseekApiUrl: string;
  private deepseekApiKey: string;
  private model: string;

  constructor() {
    this.deepseekApiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
    this.deepseekApiKey = process.env.DEEPSEEK_API_KEY || '';
    this.model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  }

  async generate(
    messages: ParsedMessage[],
    panels: PanelContent[],
    date: string,
    systemPrompt: string
  ): Promise<any> {
    if (!this.deepseekApiKey) {
      throw new Error('DEEPSEEK_API_KEY not configured');
    }

    const mapResults = await this.mapPhase(messages, panels);
    const report = await this.reducePhase(mapResults, date, systemPrompt);

    return report;
  }

  private async mapPhase(
    messages: ParsedMessage[],
    _panels: PanelContent[]
  ): Promise<string[]> {
    const chunks = this.chunkMessages(messages, CHUNK_SIZE, CHUNK_OVERLAP);
    const mapPrompts = chunks.map((chunk) => this.createMapPrompt(chunk));

    const results: string[] = [];
    for (const prompt of mapPrompts) {
      try {
        const result = await this.callLLM(prompt, 'extract_key_info');
        results.push(result);
      } catch (err) {
        console.error('Map phase error:', err);
      }
    }

    return results;
  }

  private async reducePhase(
    mapResults: string[],
    date: string,
    systemPrompt: string
  ): Promise<any> {
    const reduceInput = mapResults.join('\n---\n');
    const userPrompt = `
【日期】${date}

【提取的信息】
${reduceInput}

请根据以上信息，生成结构化日报。严格遵循以下JSON格式：
{
  "progress": ["进度描述（包含msgId）", ...],
  "decisions": ["决策（包含msgId）", ...],
  "blockers": ["阻碍", ...],
  "todos": ["任务@负责人", ...]
}
`;

    const response = await this.callLLM(
      systemPrompt + '\n\n' + userPrompt,
      'daily_report'
    );

    try {
      const parsed = JSON.parse(response);
      return DAILY_REPORT_SCHEMA.parse(parsed);
    } catch {
      return {
        progress: [`解析失败，原始输出: ${response}`],
        decisions: [],
        blockers: [],
        todos: [],
      };
    }
  }

  private createMapPrompt(chunk: ParsedMessage[]): string {
    const messageTexts = chunk
      .map((m) => `[${m.sender}] (${m.msgId}): ${m.content}`)
      .join('\n');

    return `【任务】从以下聊天记录中提取关键信息

【格式要求】
提取以下四类信息：
1. 关键事件：重要的讨论话题和结果
2. 参与人：提到的主要人员
3. 决策：达成的结论或决定
4. 待办：明确的任务分配

【聊天记录】
${messageTexts}

【输出格式】
## 关键事件
- ...

## 参与人
- ...

## 决策
- ...

## 待办
- ...`;
  }

  private chunkMessages(
    messages: ParsedMessage[],
    size: number,
    overlap: number
  ): ParsedMessage[][] {
    const chunks: ParsedMessage[][] = [];
    for (let i = 0; i < messages.length; i += size - overlap) {
      chunks.push(messages.slice(i, i + size));
    }
    return chunks;
  }

  async chatWithTools(
    userMessage: string,
    tools: TailchatTool[],
    systemPrompt: string
  ): Promise<string> {
    if (!this.deepseekApiKey) {
      throw new Error('DEEPSEEK_API_KEY not configured');
    }

    const toolsDescription = tools
      .map(
        (t) =>
          `- ${t.name}: ${t.description}\n  params: ${JSON.stringify(t.schema.shape)}`
      )
      .join('\n');

    const messages: any[] = [
      {
        role: 'system',
        content:
          systemPrompt +
          `\n\n【可用工具】\n${toolsDescription}\n\n【工具调用格式】\n当你需要使用工具时，返回：\n{"tool": "工具名", "params": {...}}\n\n【规则】\n1. 先理解用户需求\n2. 如需数据，调用相应工具\n3. 基于工具返回结果回答\n4. 所有回答需溯源到具体msgId`,
      },
      { role: 'user', content: userMessage },
    ];

    let maxIterations = 5;
    while (maxIterations-- > 0) {
      const response = await this.callLLM(messages, 'agent');

      let toolCall = null;
      try {
        toolCall = JSON.parse(response);
      } catch {
        return response;
      }

      if (!toolCall.tool || !toolCall.params) {
        return response;
      }

      const tool = tools.find((t) => t.name === toolCall.tool);
      if (!tool) {
        return `未知工具: ${toolCall.tool}`;
      }

      const result = await tool.handler(toolCall.params);
      messages.push({ role: 'assistant', content: response });
      messages.push({
        role: 'system',
        content: `【工具${toolCall.tool}返回结果】\n${JSON.stringify(result, null, 2)}`,
      });
    }

    return '已达到最大迭代次数，请稍后重试';
  }

  private async callLLM(
    prompt: string | any[],
    _mode: string
  ): Promise<string> {
    const messages = typeof prompt === 'string' ? [{ role: 'user', content: prompt }] : prompt;

    const response = await fetch(`${this.deepseekApiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API Error: ${err}`);
    }

    const body: any = await response.json();
    return body.choices?.[0]?.message?.content || '';
  }
}
