import { localTrans } from '@capital/common';

export const T = {
  pluginName: localTrans({
    'zh-CN': '小序聊天',
    'en-US': 'XiaoXu Chat',
  }),
  placeholder: localTrans({
    'zh-CN': '输入消息，与 AI 对话...',
    'en-US': 'Type a message to chat with AI...',
  }),
  send: localTrans({
    'zh-CN': '发送',
    'en-US': 'Send',
  }),
  newChat: localTrans({
    'zh-CN': '新对话',
    'en-US': 'New Chat',
  }),
  thinking: localTrans({
    'zh-CN': '思考中...',
    'en-US': 'Thinking...',
  }),
  deepThinking: localTrans({
    'zh-CN': '深度思考中...',
    'en-US': 'Deep thinking...',
  }),
  networkError: localTrans({
    'zh-CN': '网络请求失败',
    'en-US': 'Network request failed',
  }),
  noApiKey: localTrans({
    'zh-CN': '未配置 AI 服务，请联系管理员',
    'en-US': 'AI service not configured, please contact admin',
  }),
  copy: localTrans({
    'zh-CN': '复制',
    'en-US': 'Copy',
  }),
  copied: localTrans({
    'zh-CN': '已复制',
    'en-US': 'Copied',
  }),
  thinkMode: localTrans({
    'zh-CN': '深度思考',
    'en-US': 'Deep Think',
  }),
  thinkModeDesc: localTrans({
    'zh-CN': '使用推理模型，回答更深入',
    'en-US': 'Use reasoning model for deeper answers',
  }),
  reasoningProcess: localTrans({
    'zh-CN': '思考过程',
    'en-US': 'Reasoning',
  }),
  expandReasoning: localTrans({
    'zh-CN': '展开思考',
    'en-US': 'Show reasoning',
  }),
  collapseReasoning: localTrans({
    'zh-CN': '收起思考',
    'en-US': 'Hide reasoning',
  }),
};
