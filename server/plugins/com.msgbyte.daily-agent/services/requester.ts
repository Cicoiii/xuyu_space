import type { TcService } from 'tailchat-server-sdk';

interface ChatMessage {
  _id: string;
  content: string;
  plain?: string;
  converseId: string;
  sender: {
    _id: string;
    nickname: string;
  };
  createdAt: string;
  type?: string;
}

interface ChannelInfo {
  _id: string;
  name: string;
  type: 'group' | ' converse';
  lastMessage?: ChatMessage;
}

interface PanelInfo {
  _id: string;
  name: string;
  content?: string;
}

export class TailchatRequester {
  private baseUrl: string;
  private service: TcService;

  constructor(service: TcService) {
    this.baseUrl = process.env.API_URL || 'http://localhost:11000';
    this.service = service;
  }

  private async request<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api/${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getChatHistory(
    converseId: string,
    token: string,
    limit: number = 100
  ): Promise<ChatMessage[]> {
    try {
      const data = await this.request<{ messages: ChatMessage[] }>(
        `chat.message/fetchConverseMessage?converseId=${converseId}&limit=${limit}`,
        token
      );
      return data.messages || [];
    } catch (err) {
      this.service.logger.error(`Failed to fetch chat history: ${err}`);
      return [];
    }
  }

  async getPanelContent(panelId: string, token: string): Promise<string> {
    try {
      const data = await this.request<{ content: string }>(
        `plugin:com.msgbyte.webview/getPanelContent?panelId=${panelId}`,
        token
      );
      return data.content || '';
    } catch (err) {
      this.service.logger.error(`Failed to fetch panel content: ${err}`);
      return '';
    }
  }

  async listUserChannels(token: string): Promise<ChannelInfo[]> {
    try {
      const data = await this.request<{ list: ChannelInfo[] }>(
        'friend/conversations',
        token
      );
      return data.list || [];
    } catch (err) {
      this.service.logger.error(`Failed to list channels: ${err}`);
      return [];
    }
  }

  async listUserPanels(token: string): Promise<PanelInfo[]> {
    try {
      const data = await this.request<{ panels: PanelInfo[] }>(
        'plugin:com.msgbyte.webview/listPanels',
        token
      );
      return data.panels || [];
    } catch (err) {
      this.service.logger.error(`Failed to list panels: ${err}`);
      return [];
    }
  }

  async getUserInfo(userId: string, token: string): Promise<any> {
    try {
      return await this.request(`user/${userId}`, token);
    } catch (err) {
      this.service.logger.error(`Failed to get user info: ${err}`);
      return null;
    }
  }

  async searchMessages(
    keyword: string,
    converseId: string,
    token: string
  ): Promise<ChatMessage[]> {
    try {
      const data = await this.request<{ results: ChatMessage[] }>(
        `chat.message/search?converseId=${converseId}&keyword=${encodeURIComponent(keyword)}`,
        token
      );
      return data.results || [];
    } catch (err) {
      this.service.logger.error(`Failed to search messages: ${err}`);
      return [];
    }
  }
}
