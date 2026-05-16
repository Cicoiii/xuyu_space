interface ChatMessage {
  _id: string;
  content: string;
  plain?: string;
  converseId: string;
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
}

const SYSTEM_MESSAGE_TYPES = ['system', 'tip', 'recall', 'revoke'];
const SHORT_MESSAGE_THRESHOLD = 3;
const SENSITIVE_KEYWORDS = [
  '工资',
  '薪资',
  '奖金',
  '人事',
  '面试',
  '离职',
  '裁员',
  '私人',
  '私事',
  '秘密',
  '机密',
  '保密',
];

const SENSITIVE_PATTERNS = [
  /工资[0-9,，。.]+/i,
  /月薪|年薪|奖金/i,
  /[0-9]{6,}/,
];

export class SecurityFilter {
  private recentRequests: Map<string, number[]> = new Map();
  private requestHistory: Set<string> = new Set();

  cleanMessages(messages: ChatMessage[], userId: string): CleanedMessage[] {
    return messages
      .filter((msg) => this.isValidMessage(msg))
      .filter((msg) => !this.containsSensitiveContent(msg))
      .map((msg) => this.extractCleanMessage(msg));
  }

  private isValidMessage(msg: ChatMessage): boolean {
    if (SYSTEM_MESSAGE_TYPES.includes(msg.type || '')) {
      return false;
    }

    if (!msg.content && !msg.plain) {
      return false;
    }

    const content = msg.plain || msg.content || '';
    const plainText = this.stripEmojis(content);
    const wordCount = plainText.replace(/\s/g, '').length;

    if (wordCount < SHORT_MESSAGE_THRESHOLD) {
      return false;
    }

    if (this.isRecallMessage(content)) {
      return false;
    }

    return true;
  }

  private stripEmojis(text: string): string {
    return text.replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ''
    );
  }

  private isRecallMessage(content: string): boolean {
    const recallPatterns = [
      /撤回了一条消息/i,
      /recall/i,
      /已撤回/,
      /deleted message/i,
    ];
    return recallPatterns.some((pattern) => pattern.test(content));
  }

  private containsSensitiveContent(msg: ChatMessage): boolean {
    const content = (msg.plain || msg.content || '').toLowerCase();

    for (const keyword of SENSITIVE_KEYWORDS) {
      if (content.includes(keyword)) {
        return true;
      }
    }

    for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.test(content)) {
        return true;
      }
    }

    return false;
  }

  private extractCleanMessage(msg: ChatMessage): CleanedMessage {
    let content = msg.plain || msg.content || '';
    content = this.stripEmojis(content);
    content = this.normalizeWhitespace(content);

    return {
      content,
      msgId: msg._id,
      converseId: msg.converseId,
      sender: msg.sender?.nickname || 'Unknown',
      timestamp: new Date(msg.createdAt).getTime(),
    };
  }

  private normalizeWhitespace(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  isLoopDetection(requestId: string): boolean {
    const now = Date.now();
    const window = 60000;
    const maxRequests = 5;

    const timestamps = this.recentRequests.get(requestId) || [];
    const recentTimestamps = timestamps.filter((t) => now - t < window);

    if (recentTimestamps.length >= maxRequests) {
      return true;
    }

    recentTimestamps.push(now);
    this.recentRequests.set(requestId, recentTimestamps);

    return false;
  }

  checkSelfReference(content: string, agentId: string): boolean {
    const selfPatterns = [
      new RegExp(`^${agentId}[：:]`),
      new RegExp(`@${agentId}`),
      /你是谁/,
      /你的名字/,
    ];

    return selfPatterns.some((pattern) => pattern.test(content));
  }

  filterPrivateChats(
    channels: Array<{ _id: string; type: string; name?: string }>,
    _userId: string
  ): Array<{ _id: string; type: string; name?: string }> {
    return channels.filter((ch) => {
      if (ch.type === 'group' || ch.type === 'group converse') {
        return true;
      }

      const privateIndicators = [
        '私聊',
        'private',
        'personal',
        'direct message',
        'dm',
      ];
      const name = (ch.name || '').toLowerCase();

      return !privateIndicators.some((ind) => name.includes(ind));
    });
  }

  sanitizeOutput(
    report: any,
    messageMap: Map<string, string>
  ): any {
    if (!report) return report;

    const addSourceLink = (item: string, msgId: string): string => {
      if (msgId && messageMap.has(msgId)) {
        return `${item} [来源: msgId=${msgId}]`;
      }
      return item;
    };

    return {
      progress: (report.progress || []).map((item: string) => {
        const msgId = this.extractMsgId(item);
        return addSourceLink(item, msgId);
      }),
      decisions: (report.decisions || []).map((item: string) => {
        const msgId = this.extractMsgId(item);
        return addSourceLink(item, msgId);
      }),
      blockers: report.blockers || [],
      todos: report.todos || [],
    };
  }

  private extractMsgId(text: string): string | null {
    const match = text.match(/\[?msg[_-]?id[=:]?\s*([a-zA-Z0-9-]+)\]?/i);
    return match ? match[1] : null;
  }
}
