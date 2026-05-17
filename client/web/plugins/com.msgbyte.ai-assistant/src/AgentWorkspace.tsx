import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Icon } from '@capital/component';
import { pluginRequest } from './request';

interface Channel {
  id?: string;
  _id?: string;
  name: string;
  type: 'group' | 'dm' | string;
}

interface Report {
  highlights?: string[];
  progress?: string[];
  decisions?: string[];
  blockers?: string[];
  todos?: string[];
}

interface Metadata {
  channelCount?: number;
  messageCount?: number;
  importantMessageCount?: number;
}

interface AssistantAction {
  type: string;
  title: string;
  payload: Record<string, any>;
  requireConfirm?: boolean;
}

interface ChatItem {
  role: 'user' | 'assistant' | 'system';
  content: string;
  actions?: AssistantAction[];
}

const today = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000)
    .toISOString()
    .split('T')[0];
};

const sectionConfig = [
  ['highlights', '概览', 'mdi:sparkles', '#2563eb'],
  ['progress', '进度', 'mdi:trending-up', '#0f766e'],
  ['decisions', '决策', 'mdi:check-decagram', '#7c3aed'],
  ['blockers', '风险', 'mdi:alert-outline', '#dc2626'],
  ['todos', '待办', 'mdi:clipboard-check-outline', '#b45309'],
] as const;

const actionIcons: Record<string, string> = {
  create_task: 'mdi:calendar-check-outline',
  send_message: 'mdi:send-outline',
  send_dm: 'mdi:message-text-outline',
  notify_self: 'mdi:bell-outline',
  notify_users: 'mdi:bell-ring-outline',
  create_converse: 'mdi:account-multiple-plus-outline',
  create_group: 'mdi:account-group-outline',
  generate_report: 'mdi:file-document-outline',
};

export const AgentWorkspace: React.FC = React.memo(() => {
  const [loading, setLoading] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      role: 'assistant',
      content:
        '我是小序，可以帮你生成简报、加日程、发消息、发通知、创建多人会话或创建群组。',
    },
  ]);
  const [report, setReport] = useState<Report | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [includeGroups, setIncludeGroups] = useState(true);
  const [includeDM, setIncludeDM] = useState(true);
  const [targetDate, setTargetDate] = useState(today());
  const [executingKey, setExecutingKey] = useState('');

  const selectedChannelSet = useMemo(
    () => new Set(selectedChannels),
    [selectedChannels]
  );

  const loadChannels = useCallback(async () => {
    setLoadingChannels(true);
    setError('');
    try {
      const { data } = await pluginRequest.get('listChannels');
      setChannels(
        Array.isArray(data) ? data : data?.channels ?? data?.list ?? []
      );
    } catch (err) {
      console.error('Failed to load channels:', err);
      setError('会话列表加载失败，请确认当前账号已登录');
    } finally {
      setLoadingChannels(false);
    }
  }, []);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const getChannelId = (channel: Channel) => channel.id || channel._id || '';

  const appendMessage = (message: ChatItem) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleAsk = async () => {
    const content = input.trim();
    if (!content || loading) return;

    setInput('');
    setError('');
    setLoading(true);
    appendMessage({ role: 'user', content });

    try {
      const { data } = await pluginRequest.post('assistant', { content });
      appendMessage({
        role: 'assistant',
        content: data?.reply || '我已理解你的请求。',
        actions: data?.actions || [],
      });
    } catch (err: any) {
      setError(err?.message || '助手请求失败');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setError('');
    setReport(null);
    setMetadata(null);

    try {
      const { data: result } = await pluginRequest.post('generateReport', {
        channelIds: selectedChannels,
        date: targetDate,
        includeGroups,
        includeDM,
        maxConversations: 20,
      });

      if (result.result) {
        setReport(result.report || {});
        setMetadata(result.metadata || null);
      } else {
        setError(result.error || '生成失败');
      }
    } catch (err: any) {
      setError(err?.message || '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (action: AssistantAction, key: string) => {
    setExecutingKey(key);
    setError('');

    try {
      const { data } = await pluginRequest.post('executeAction', {
        type: action.type,
        payload: action.payload || {},
      });

      if (data?.result === false) {
        setError(data.error || '执行失败');
        return;
      }

      if (action.type === 'generate_report' && data?.report) {
        setReport(data.report);
        setMetadata(data.metadata || null);
      }

      appendMessage({
        role: 'system',
        content: `已执行：${action.title}`,
      });
    } catch (err: any) {
      setError(err?.message || '执行失败');
    } finally {
      setExecutingKey('');
    }
  };

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderReportSection = (config: (typeof sectionConfig)[number]) => {
    const [key, title, icon, color] = config;
    const items = ((report as any)?.[key] || []) as string[];

    return (
      <Card
        key={key}
        size="small"
        title={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon icon={icon} style={{ color }} />
            {title}
          </span>
        }
        style={{ marginBottom: 12 }}
      >
        {items.length > 0 ? (
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            {items.map((item, i) => (
              <li key={i} style={{ marginBottom: 8, lineHeight: 1.6 }}>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ color: '#8c8c8c' }}>暂无明确内容</div>
        )}
      </Card>
    );
  };

  const renderAction = (action: AssistantAction, index: number) => {
    const key = `${action.type}-${index}-${action.title}`;

    return (
      <div
        key={key}
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 12,
          marginTop: 10,
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon icon={actionIcons[action.type] || 'mdi:flash-outline'} />
          <strong>{action.title}</strong>
        </div>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            background: '#f8fafc',
            borderRadius: 6,
            padding: 8,
            margin: '10px 0',
            maxHeight: 120,
            overflow: 'auto',
            fontSize: 12,
          }}
        >
          {JSON.stringify(action.payload || {}, null, 2)}
        </pre>
        <Button
          type="primary"
          disabled={Boolean(executingKey)}
          onClick={() => executeAction(action, key)}
        >
          {executingKey === key
            ? '执行中...'
            : action.requireConfirm === false
            ? '执行'
            : '确认执行'}
        </Button>
      </div>
    );
  };

  return (
    <div style={{ padding: 24, height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 16 }}>
        <div>
          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: 12,
              minHeight: 420,
              maxHeight: 'calc(100vh - 240px)',
              overflow: 'auto',
              background: '#f8fafc',
            }}
          >
            {messages.map((message, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 12,
                  display: 'flex',
                  justifyContent:
                    message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '86%',
                    borderRadius: 8,
                    padding: '10px 12px',
                    background:
                      message.role === 'user'
                        ? '#2563eb'
                        : message.role === 'system'
                        ? '#ecfdf5'
                        : '#fff',
                    color: message.role === 'user' ? '#fff' : '#0f172a',
                    border:
                      message.role === 'user' ? 'none' : '1px solid #e2e8f0',
                    lineHeight: 1.6,
                  }}
                >
                  <div>{message.content}</div>
                  {message.actions?.map(renderAction)}
                </div>
              </div>
            ))}
            {loading && <div style={{ color: '#64748b' }}>小序正在思考...</div>}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                  handleAsk();
                }
              }}
              placeholder="例如：明天上午10点提醒我跟进合同；给张三发消息说会议提前；建一个项目讨论群"
              style={{
                flex: 1,
                minHeight: 68,
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                padding: 10,
                resize: 'vertical',
              }}
            />
            <Button type="primary" disabled={loading} onClick={handleAsk}>
              <Icon icon="mdi:send" />
              发送
            </Button>
          </div>

          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: 10,
                borderRadius: 6,
                marginTop: 12,
              }}
            >
              {error}
            </div>
          )}
        </div>

        <div>
          <Card size="small" title="快捷简报" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="date"
                value={targetDate}
                onChange={(event) => setTargetDate(event.target.value)}
                style={{
                  height: 34,
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: '0 8px',
                }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={includeGroups}
                  onChange={(event) => setIncludeGroups(event.target.checked)}
                />
                群组
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={includeDM}
                  onChange={(event) => setIncludeDM(event.target.checked)}
                />
                私聊
              </label>
              <Button onClick={() => setAdvancedOpen((value) => !value)}>
                <Icon icon={advancedOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
                指定会话
              </Button>
              {advancedOpen && (
                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    maxHeight: 180,
                    overflow: 'auto',
                  }}
                >
                  {loadingChannels && (
                    <div style={{ padding: 10, color: '#64748b' }}>
                      正在加载...
                    </div>
                  )}
                  {!loadingChannels &&
                    channels.map((channel) => {
                      const channelId = getChannelId(channel);
                      const selected = selectedChannelSet.has(channelId);
                      return (
                        <div
                          key={channelId}
                          style={{
                            padding: '8px 10px',
                            cursor: 'pointer',
                            background: selected ? '#eff6ff' : '#fff',
                            borderBottom: '1px solid #f1f5f9',
                            lineHeight: 1.5,
                          }}
                          onClick={() => channelId && toggleChannel(channelId)}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            readOnly
                            style={{ marginRight: 8, pointerEvents: 'none' }}
                          />
                          {channel.name}
                        </div>
                      );
                    })}
                  {!loadingChannels && channels.length === 0 && (
                    <div style={{ padding: 10, color: '#64748b' }}>
                      暂无可用会话
                    </div>
                  )}
                </div>
              )}
              <Button type="primary" disabled={loading} onClick={handleGenerateReport}>
                <Icon icon="mdi:file-document-edit-outline" />
                生成简报
              </Button>
            </div>
          </Card>

          {report && (
            <div>
              <div
                style={{
                  background: '#ecfdf5',
                  border: '1px solid #bbf7d0',
                  padding: 10,
                  borderRadius: 6,
                  marginBottom: 12,
                  color: '#166534',
                  lineHeight: 1.6,
                }}
              >
                读取 {metadata?.channelCount ?? 0} 个会话、
                {metadata?.messageCount ?? 0} 条消息，提取{' '}
                {metadata?.importantMessageCount ?? 0} 条重点。
              </div>
              {sectionConfig.map(renderReportSection)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AgentWorkspace.displayName = 'AgentWorkspace';
