import { TcService } from 'tailchat-server-sdk';
import type { TcContext } from 'tailchat-server-sdk';
import { TailchatRequester } from './requester';
import { createLangChainTools } from './tools';
import { DataPipeline } from './pipeline';
import { SecurityFilter } from './security'; 
import { z } from 'zod';

const DAILY_REPORT_PROMPT = `你是一个专业的办公助手，负责根据聊天记录和文档生成结构化日报。

【任务】
分析提供的聊天记录和项目文档，生成一份结构化的日报。

【输出格式】(必须严格遵循)
{
  "progress": ["进度描述1（包含msgId）", "进度描述2"],
  "decisions": ["决策1（包含msgId）", "决策2"],
  "blockers": ["阻碍1", "阻碍2"],
  "todos": ["待办1（包含负责人）", "待办2"]
}

【规则】
1. progress: 描述实际完成情况，每条后附上源消息ID
2. decisions: 达成共识的决策，包含相关消息ID
3. blockers: 提到的困难或延期风险
4. todos: 明确的任务分工，包含@提及的人员
5. 仅处理工作相关内容，忽略私人话题
6. 如果没有某类信息，该字段返回空数组[]`;

interface GenerateReportParams {
  channelIds: string[];
  panelIds?: string[];
  date?: string;
}

class DailyAgentService extends TcService {
  private requester: TailchatRequester;
  private pipeline: DataPipeline;
  private security: SecurityFilter;

  get serviceName() {
    return 'plugin:com.msgbyte.daily-agent';
  }

  onInit() {
    this.requester = new TailchatRequester(this);
    this.pipeline = new DataPipeline();
    this.security = new SecurityFilter();

    this.registerAction('generateReport', this.generateReport, {
      params: {
        channelIds: { type: 'array', items: 'string' },
        panelIds: { type: 'array', optional: true },
        date: { type: 'string', optional: true },
      },
    });

    this.registerAction('listChannels', this.listChannels, {
      params: z.object({}).shape,
    });

    this.registerAction('listPanels', this.listPanels, {
      params: z.object({}).shape,
    });

    this.registerAction('chat', this.chat, {
      params: {
        content: 'string',
        channelIds: { type: 'array', optional: true },
      },
    });

    this.registerAuthWhitelist(['/generateReport', '/listChannels', '/listPanels', '/chat']);
  }

  async generateReport(ctx: TcContext<GenerateReportParams>) {
    const { channelIds, panelIds = [], date } = ctx.params;
    const userId = ctx.meta.userId;
    const token = ctx.meta.token;

    const targetDate = date || new Date().toISOString().split('T')[0];

    const allMessages: Array<{
      content: string;
      msgId: string;
      converseId: string;
      sender: string;
      timestamp: number;
    }> = [];

    for (const channelId of channelIds) {
      const messages = await this.requester.getChatHistory(
        channelId,
        token,
        100
      );
      const cleaned = this.security.cleanMessages(messages, userId);
      allMessages.push(...cleaned);
    }

    const panelContents: Array<{ panelId: string; content: string }> = [];
    for (const panelId of panelIds) {
      const content = await this.requester.getPanelContent(panelId, token);
      panelContents.push({ panelId, content });
    }

    if (this.security.isLoopDetection(ctx.params as any)) {
      return {
        result: false,
        error: '检测到循环调用，请求已拒绝',
      };
    }

    const report = await this.pipeline.generate(
      allMessages,
      panelContents,
      targetDate,
      DAILY_REPORT_PROMPT
    );

    return {
      result: true,
      report,
      metadata: {
        channelCount: channelIds.length,
        panelCount: panelIds.length,
        messageCount: allMessages.length,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  async listChannels(ctx: TcContext) {
    const token = ctx.meta.token;
    return await this.requester.listUserChannels(token);
  }

  async listPanels(ctx: TcContext) {
    const token = ctx.meta.token;
    return await this.requester.listUserPanels(token);
  }

  async chat(ctx: TcContext<{ content: string; channelIds?: string[] }>) {
    const { content, channelIds = [] } = ctx.params;
    const token = ctx.meta.token;

    const tools = createLangChainTools(this.requester, token, ctx.meta.userId);
    const response = await this.pipeline.chatWithTools(
      content,
      tools,
      DAILY_REPORT_PROMPT
    );

    return { result: true, response };
  }
}

export default DailyAgentService;
