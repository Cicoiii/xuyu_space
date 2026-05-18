import React, { useState } from 'react';
import { Button, Icon } from '@capital/component';
import { pluginRequest } from './request';

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

const actionIcons: Record<string, string> = {
  create_task: 'mdi:calendar-check-outline',
  send_message: 'mdi:send-outline',
  send_dm: 'mdi:message-text-outline',
  notify_self: 'mdi:bell-outline',
  notify_users: 'mdi:bell-ring-outline',
  create_converse: 'mdi:account-multiple-plus-outline',
  create_group: 'mdi:account-group-outline',
};

export const AgentWorkspace: React.FC = React.memo(() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      role: 'assistant',
      content:
        '我是小序，可以帮你加日程、发消息、发通知、创建多人会话或创建群组。',
    },
  ]);
  const [executingKey, setExecutingKey] = useState('');

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
            lineHeight: 1.6,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
});

AgentWorkspace.displayName = 'AgentWorkspace';
