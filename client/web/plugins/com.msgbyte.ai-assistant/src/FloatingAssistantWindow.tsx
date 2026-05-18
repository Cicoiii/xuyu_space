import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon, LoadingSpinner, Markdown } from '@capital/component';
import { pluginRequest } from './request';

type AssistantMode = 'chat' | 'agent';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  streaming?: boolean;
}

interface AgentAction {
  type: string;
  title: string;
  payload: Record<string, any>;
  requireConfirm?: boolean;
}

interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  actions?: AgentAction[];
}

const BRAND = 'var(--tc-primary-color)';
const BRAND_HOVER = 'var(--tc-primary-hover-color)';
const SURFACE = 'var(--tc-surface-panel-color)';
const SURFACE_SOFT = 'var(--tc-surface-soft-color)';
const CONTENT_BG = 'var(--tc-content-background-color)';
const BORDER = 'var(--tc-border-color)';
const BORDER_SOFT = 'var(--tc-border-soft-color)';
const TEXT = 'var(--tc-text-color)';
const TEXT_MUTED = 'var(--tc-text-muted-color)';

const STREAM_CHAR_INTERVAL = 18;

const modeMeta: Record<AssistantMode, { label: string; icon: string }> = {
  chat: { label: 'Chat', icon: 'mdi:message-text-outline' },
  agent: { label: 'Agent', icon: 'mdi:creation-outline' },
};

const actionIcons: Record<string, string> = {
  create_task: 'mdi:calendar-check-outline',
  send_message: 'mdi:send-outline',
  send_dm: 'mdi:message-text-outline',
  notify_self: 'mdi:bell-outline',
  notify_users: 'mdi:bell-ring-outline',
  create_converse: 'mdi:account-multiple-plus-outline',
  create_group: 'mdi:account-group-outline',
};

const CopyButton: React.FC<{ text: string }> = React.memo(({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      title="复制"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: 5,
        border: 'none',
        backgroundColor: copied ? 'rgba(34,197,94,0.12)' : SURFACE_SOFT,
        color: copied ? '#22c55e' : TEXT_MUTED,
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.15s ease',
        padding: 0,
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = 'var(--tc-primary-soft-color)';
          e.currentTarget.style.color = BRAND;
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = SURFACE_SOFT;
          e.currentTarget.style.color = TEXT_MUTED;
        }
      }}
    >
      <Icon icon={copied ? 'mdi:check' : 'mdi:content-copy'} style={{ fontSize: 12 }} />
    </button>
  );
});
CopyButton.displayName = 'CopyButton';

const StreamingContent: React.FC<{ fullContent: string; onDone: () => void }> =
  React.memo(({ fullContent, onDone }) => {
    const [displayLen, setDisplayLen] = useState(0);
    const lenRef = useRef(0);
    const rafRef = useRef<number>(0);
    const lastTimeRef = useRef(0);

    useEffect(() => {
      lenRef.current = 0;
      setDisplayLen(0);
      lastTimeRef.current = 0;

      const tick = (timestamp: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const elapsed = timestamp - lastTimeRef.current;

        if (elapsed >= STREAM_CHAR_INTERVAL) {
          const charsToAdd = Math.floor(elapsed / STREAM_CHAR_INTERVAL);
          lenRef.current = Math.min(
            lenRef.current + charsToAdd,
            fullContent.length
          );
          setDisplayLen(lenRef.current);
          lastTimeRef.current = timestamp;
        }

        if (lenRef.current < fullContent.length) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          onDone();
        }
      };

      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
    }, [fullContent, onDone]);

    return <Markdown raw={fullContent.slice(0, displayLen)} />;
  });
StreamingContent.displayName = 'StreamingContent';

export const AssistantBubbleIcon: React.FC = React.memo(() => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setVisible(true);
        }}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: BRAND,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_HOVER)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.55 3.36 17.01L2.07 21.93L7.17 20.71C8.57 21.5 10.22 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C10.44 20 8.98 19.54 7.76 18.76L7.46 18.58L4.39 19.31L5.15 16.37L4.95 16.05C4.08 14.78 3.6 13.28 3.6 11.7C3.6 7.19 7.19 3.6 11.7 3.6C16.21 3.6 20.4 7.19 20.4 12C20.4 16.81 16.81 20 12 20Z"
            fill="white"
          />
          <circle cx="8" cy="12" r="1.5" fill="white" />
          <circle cx="12" cy="12" r="1.5" fill="white" />
          <circle cx="16" cy="12" r="1.5" fill="white" />
        </svg>
      </div>

      {visible &&
        createPortal(
          <FloatingAssistantWindow onClose={() => setVisible(false)} />,
          document.body
        )}
    </>
  );
});
AssistantBubbleIcon.displayName = 'AssistantBubbleIcon';

const FloatingAssistantWindow: React.FC<{ onClose: () => void }> = React.memo(
  ({ onClose }) => {
    const [mode, setMode] = useState<AssistantMode>('chat');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [expandedReasoning, setExpandedReasoning] = useState<Record<number, boolean>>({});
    const [executingKey, setExecutingKey] = useState('');
    const listRef = useRef<HTMLDivElement>(null);

    const posRef = useRef({ x: window.innerWidth - 440, y: 60 });
    const dragRef = useRef<{
      startX: number;
      startY: number;
      origX: number;
      origY: number;
    } | null>(null);
    const [pos, setPos] = useState(posRef.current);

    const activeMessages = mode === 'chat' ? chatMessages : agentMessages;
    const placeholder =
      mode === 'chat'
        ? '输入消息，与 AI 对话...'
        : '例如：明天上午10点提醒我跟进合同；给张三发消息说会议提前；建一个项目讨论群';

    useEffect(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, [activeMessages, loading, mode]);

    const handleDragStart = useCallback((e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-no-drag]')) return;
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: posRef.current.x,
        origY: posRef.current.y,
      };
      const handleMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        posRef.current = {
          x: dragRef.current.origX + ev.clientX - dragRef.current.startX,
          y: dragRef.current.origY + ev.clientY - dragRef.current.startY,
        };
        setPos({ ...posRef.current });
      };
      const handleUp = () => {
        dragRef.current = null;
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    }, []);

    const handleStreamDone = useCallback((index: number) => {
      setChatMessages((prev) =>
        prev.map((message, i) =>
          i === index ? { ...message, streaming: false } : message
        )
      );
    }, []);

    const handleChatSend = useCallback(
      async (text: string) => {
        const userMsg: ChatMessage = { role: 'user', content: text };
        const recent = [...chatMessages, userMsg].slice(-10);
        setChatMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
          const contextContent = recent
            .map((message) => `${message.role === 'user' ? '用户' : 'AI'}: ${message.content}`)
            .join('\n');
          const { data } = await pluginRequest.post('chat', {
            content: contextContent,
            action: 'chat',
            thinkMode: false,
          });
          setChatMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: data?.result ? data.answer : data?.answer || '网络请求失败',
              reasoning: data?.reasoning || undefined,
              streaming: true,
            },
          ]);
        } catch {
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', content: '网络请求失败', streaming: true },
          ]);
        } finally {
          setLoading(false);
        }
      },
      [chatMessages]
    );

    const handleAgentSend = useCallback(async (text: string) => {
      setAgentMessages((prev) => [...prev, { role: 'user', content: text }]);
      setLoading(true);

      try {
        const { data } = await pluginRequest.post('assistant', { content: text });
        setAgentMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data?.reply || '我已理解你的请求。',
            actions: data?.actions || [],
          },
        ]);
      } catch {
        setAgentMessages((prev) => [
          ...prev,
          { role: 'assistant', content: '助手请求失败，请稍后重试。' },
        ]);
      } finally {
        setLoading(false);
      }
    }, []);

    const handleSend = useCallback(() => {
      const text = input.trim();
      if (!text || loading) return;
      setInput('');
      if (mode === 'chat') {
        handleChatSend(text);
      } else {
        handleAgentSend(text);
      }
    }, [handleAgentSend, handleChatSend, input, loading, mode]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      },
      [handleSend]
    );

    const handleNewChat = useCallback(() => {
      if (mode === 'chat') {
        setChatMessages([]);
        setExpandedReasoning({});
      } else {
        setAgentMessages([]);
      }
      setInput('');
    }, [mode]);

    const executeAction = useCallback(async (action: AgentAction, key: string) => {
      setExecutingKey(key);
      try {
        const { data } = await pluginRequest.post('executeAction', {
          type: action.type,
          payload: action.payload || {},
        });

        if (data?.result === false) {
          setAgentMessages((prev) => [
            ...prev,
            { role: 'system', content: data.error || '执行失败' },
          ]);
          return;
        }

        setAgentMessages((prev) => [
          ...prev,
          {
            role: 'system',
            content: `已执行：${action.title}`,
          },
        ]);
      } catch {
        setAgentMessages((prev) => [
          ...prev,
          { role: 'system', content: '执行失败，请稍后重试。' },
        ]);
      } finally {
        setExecutingKey('');
      }
    }, []);

    const renderModeSwitch = useMemo(
      () => (
        <div
          data-no-drag
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 2,
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.15)',
            gap: 2,
          }}
        >
          {(Object.keys(modeMeta) as AssistantMode[]).map((item) => {
            const active = mode === item;
            return (
              <button
                key={item}
                onClick={() => setMode(item)}
                style={{
                  height: 26,
                  padding: '0 9px',
                  borderRadius: 6,
                  border: 'none',
                  backgroundColor: active ? 'rgba(255,255,255,0.32)' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  fontWeight: active ? 700 : 500,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon icon={modeMeta[item].icon} style={{ fontSize: 13 }} />
                {modeMeta[item].label}
              </button>
            );
          })}
        </div>
      ),
      [mode]
    );

    const renderChatMessage = (message: ChatMessage, index: number) => (
      <div
        key={`chat-${index}`}
        style={{
          display: 'flex',
          justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
        }}
      >
        <div
          style={{
            maxWidth: '85%',
            padding: message.role === 'user' ? '8px 12px' : '10px 12px',
            borderRadius:
              message.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
            fontSize: 13,
            lineHeight: 1.6,
            backgroundColor: message.role === 'user' ? BRAND : SURFACE,
            color: message.role === 'user' ? '#fff' : TEXT,
            boxShadow: message.role === 'assistant' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
          }}
        >
          {message.role === 'assistant' ? (
            message.streaming ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                <StreamingContent
                  fullContent={message.content}
                  onDone={() => handleStreamDone(index)}
                />
                <span
                  style={{
                    display: 'inline-block',
                    width: 2,
                    height: 14,
                    backgroundColor: BRAND,
                    borderRadius: 1,
                    animation: 'blink 0.8s ease-in-out infinite',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {message.reasoning && (
                  <div style={{ marginBottom: 4 }}>
                    <button
                      onClick={() =>
                        setExpandedReasoning((prev) => ({
                          ...prev,
                          [index]: !prev[index],
                        }))
                      }
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        border: 'none',
                        background: 'rgba(139,92,246,0.08)',
                        color: '#7c3aed',
                        borderRadius: 6,
                        padding: '3px 8px',
                        fontSize: 11,
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      <Icon
                        icon={
                          expandedReasoning[index]
                            ? 'mdi:chevron-down'
                            : 'mdi:chevron-right'
                        }
                        style={{ fontSize: 14 }}
                      />
                      <Icon icon="mdi:brain" style={{ fontSize: 12 }} />
                      {expandedReasoning[index] ? '收起思考' : '展开思考'}
                    </button>
                    {expandedReasoning[index] && (
                      <div
                        style={{
                          marginTop: 6,
                          padding: '8px 10px',
                          borderRadius: 8,
                          backgroundColor: 'rgba(139,92,246,0.05)',
                          border: '1px solid rgba(139,92,246,0.12)',
                          fontSize: 12,
                          lineHeight: 1.6,
                          color: '#6d28d9',
                          maxHeight: 200,
                          overflowY: 'auto',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {message.reasoning}
                      </div>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Markdown raw={message.content} />
                  </div>
                  <CopyButton text={message.content} />
                </div>
              </div>
            )
          ) : (
            <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {message.content}
            </span>
          )}
        </div>
      </div>
    );

    const renderAction = (action: AgentAction, index: number) => {
      const key = `${action.type}-${index}-${action.title}`;
      return (
        <div
          key={key}
          style={{
            marginTop: 8,
            padding: 10,
            borderRadius: 10,
            border: `1px solid ${BORDER_SOFT}`,
            backgroundColor: CONTENT_BG,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <Icon icon={actionIcons[action.type] || 'mdi:flash-outline'} />
            {action.title}
          </div>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: SURFACE_SOFT,
              borderRadius: 8,
              padding: 8,
              margin: '8px 0',
              maxHeight: 120,
              overflow: 'auto',
              fontSize: 12,
              color: TEXT,
            }}
          >
            {JSON.stringify(action.payload || {}, null, 2)}
          </pre>
          <button
            onClick={() => executeAction(action, key)}
            disabled={Boolean(executingKey)}
            style={{
              height: 30,
              padding: '0 12px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: executingKey ? BORDER : BRAND,
              color: executingKey ? TEXT_MUTED : '#fff',
              cursor: executingKey ? 'default' : 'pointer',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {executingKey === key
              ? '执行中...'
              : action.requireConfirm === false
              ? '执行'
              : '确认执行'}
          </button>
        </div>
      );
    };

    const renderAgentMessage = (message: AgentMessage, index: number) => (
      <div
        key={`agent-${index}`}
        style={{
          display: 'flex',
          justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
        }}
      >
        <div
          style={{
            maxWidth: '88%',
            padding: message.role === 'user' ? '8px 12px' : '10px 12px',
            borderRadius:
              message.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
            fontSize: 13,
            lineHeight: 1.6,
            backgroundColor:
              message.role === 'user'
                ? BRAND
                : message.role === 'system'
                ? 'rgba(34,197,94,0.1)'
                : SURFACE,
            color: message.role === 'user' ? '#fff' : TEXT,
            boxShadow: message.role !== 'user' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
          }}
        >
          {message.role === 'user' ? (
            <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {message.content}
            </span>
          ) : (
            <>
              <Markdown raw={message.content} />
              {message.actions?.map(renderAction)}
            </>
          )}
        </div>
      </div>
    );

    return (
      <div
        style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          width: 400,
          height: 540,
          zIndex: 9999,
          borderRadius: 14,
          boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: SURFACE,
          color: TEXT,
          animation: 'fadeInScale 0.2s ease',
        }}
      >
        <style>{`
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.95) translateY(8px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `}</style>

        <div
          onMouseDown={handleDragStart}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: BRAND,
            color: '#fff',
            cursor: 'move',
            flexShrink: 0,
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon icon="mdi:creation" style={{ fontSize: 18 }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>小序助手</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} data-no-drag>
            {renderModeSwitch}
            <button
              onClick={handleNewChat}
              title="新对话"
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon icon="mdi:plus" style={{ fontSize: 16 }} />
            </button>
            <button
              onClick={onClose}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon icon="mdi:close" style={{ fontSize: 16 }} />
            </button>
          </div>
        </div>

        <div
          ref={listRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            backgroundColor: CONTENT_BG,
          }}
        >
          {activeMessages.length === 0 && !loading && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '32px 0',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: 'var(--tc-primary-soft-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  icon={modeMeta[mode].icon}
                  style={{ fontSize: 24, color: BRAND }}
                />
              </div>
              <span style={{ fontSize: 13, color: TEXT_MUTED }}>
                {mode === 'chat'
                  ? '输入消息，与 AI 对话...'
                  : 'Agent 模式可处理日程、通知、消息和群组动作'}
              </span>
            </div>
          )}

          {mode === 'chat'
            ? chatMessages.map(renderChatMessage)
            : agentMessages.map(renderAgentMessage)}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px 12px 12px 4px',
                  backgroundColor: SURFACE,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <LoadingSpinner />
                <span style={{ fontSize: 12, color: TEXT_MUTED }}>
                  思考中...
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            padding: '10px 14px 14px',
            borderTop: `1px solid ${BORDER_SOFT}`,
            flexShrink: 0,
            backgroundColor: SURFACE,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              style={{
                flex: 1,
                minHeight: 36,
                maxHeight: 100,
                resize: 'none',
                borderRadius: 10,
                border: `1px solid ${BORDER}`,
                padding: '7px 12px',
                fontSize: 13,
                lineHeight: 1.5,
                color: TEXT,
                backgroundColor: SURFACE_SOFT,
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = BRAND)}
              onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                border: 'none',
                backgroundColor: input.trim() && !loading ? BRAND : BORDER,
                color: input.trim() && !loading ? '#fff' : TEXT_MUTED,
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (input.trim() && !loading) e.currentTarget.style.backgroundColor = BRAND_HOVER;
              }}
              onMouseLeave={(e) => {
                if (input.trim() && !loading) e.currentTarget.style.backgroundColor = BRAND;
              }}
            >
              <Icon icon="mdi:send" style={{ fontSize: 18 }} />
            </button>
          </div>
        </div>
      </div>
    );
  }
);
FloatingAssistantWindow.displayName = 'FloatingAssistantWindow';
