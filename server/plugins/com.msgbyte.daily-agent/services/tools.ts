import { z } from 'zod';
import type { TailchatRequester } from './requester';

export interface TailchatTool {
  name: string;
  description: string;
  schema: z.ZodObject<any>;
  handler: (params: any) => Promise<any>;
}

export function createLangChainTools(
  requester: TailchatRequester,
  token: string,
  userId: string
): TailchatTool[] {
  return [
    {
      name: 'get_chat_history',
      description: `获取指定频道的聊天记录。返回消息列表，每条消息包含发送者、内容和时间。
仅返回普通消息，过滤掉系统消息和撤回提示。
每个消息都有唯一的msgId，可用于溯源。`,
      schema: z.object({
        channelId: z.string().describe('频道/会话ID'),
        limit: z
          .number()
          .optional()
          .default(50)
          .describe('返回消息数量，默认50条'),
      }),
      handler: async ({ channelId, limit = 50 }: { channelId: string; limit?: number }) => {
        const messages = await requester.getChatHistory(channelId, token, limit);
        return {
          channelId,
          count: messages.length,
          messages: messages.map((m) => ({
            msgId: m._id,
            sender: m.sender?.nickname || 'Unknown',
            content: m.plain || m.content,
            timestamp: m.createdAt,
          })),
        };
      },
    },
    {
      name: 'get_md_panel_content',
      description: `获取Markdown面板的纯文本内容。
面板通常包含项目目标、文档、指南等结构化信息。
返回面板ID和提取的纯文本内容。`,
      schema: z.object({
        panelId: z.string().describe('面板ID'),
      }),
      handler: async ({ panelId }: { panelId: string }) => {
        const content = await requester.getPanelContent(panelId, token);
        return {
          panelId,
          content,
          wordCount: content.split(/\s+/).length,
        };
      },
    },
    {
      name: 'list_user_channels',
      description: `列出当前用户所在的所有活跃群组和私聊会话。
返回频道ID、名称和类型（group/converse）。
这是获取用户可访问数据范围的第一步。`,
      schema: z.object({}),
      handler: async () => {
        const channels = await requester.listUserChannels(token);
        return {
          total: channels.length,
          channels: channels.map((ch) => ({
            id: ch._id,
            name: ch.name,
            type: ch.type,
          })),
        };
      },
    },
    {
      name: 'search_messages',
      description: `在指定频道中搜索包含关键词的消息。
用于查找特定主题、决策或任务的讨论。
返回匹配的消息及其msgId便于溯源。`,
      schema: z.object({
        channelId: z.string().describe('频道ID'),
        keyword: z.string().describe('搜索关键词'),
      }),
      handler: async ({ channelId, keyword }: { channelId: string; keyword: string }) => {
        const messages = await requester.searchMessages(keyword, channelId, token);
        return {
          keyword,
          channelId,
          count: messages.length,
          results: messages.map((m) => ({
            msgId: m._id,
            sender: m.sender?.nickname || 'Unknown',
            content: m.plain || m.content,
            timestamp: m.createdAt,
          })),
        };
      },
    },
  ];
}

export function formatToolsForLLM(tools: TailchatTool[]): string {
  return tools
    .map(
      (tool) => `
## ${tool.name}
${tool.description}
参数: ${JSON.stringify(tool.schema.shape)}`
    )
    .join('\n');
}
