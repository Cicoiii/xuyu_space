import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createPluginRequest } from '@capital/common';
import { Icon, Markdown, LoadingSpinner } from '@capital/component';
import { T } from './translate';

const pluginRequest = createPluginRequest('com.msgbyte.ai-assistant');

const BLUE = '#2563eb';
const BLUE_HOVER = '#1d4ed8';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  /** 深度思考的推理过程 */
  reasoning?: string;
  /** 是否正在流式输出 */
  streaming?: boolean;
}

// ========== 复制按钮 ==========
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
      title={T.copy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: 5,
        border: 'none',
        backgroundColor: copied ? 'rgba(34,197,94,0.12)' : 'rgba(0,0,0,0.04)',
        color: copied ? '#22c55e' : '#94a3b8',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.15s ease',
        padding: 0,
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.08)';
          e.currentTarget.style.color = BLUE;
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)';
          e.currentTarget.style.color = '#94a3b8';
        }
      }}
    >
      <Icon icon={copied ? 'mdi:check' : 'mdi:content-copy'} style={{ fontSize: 12 }} />
    </button>
  );
});
CopyButton.displayName = 'CopyButton';

// ========== 流式打字动画 ==========
const STREAM_CHAR_INTERVAL = 18; // 每个字符的间隔(ms)

/** 逐字显示内容 */
const StreamingContent: React.FC<{ fullContent: string; onDone: () => void }> = React.memo(
  ({ fullContent, onDone }) => {
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
          lenRef.current = Math.min(lenRef.current + charsToAdd, fullContent.length);
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
  }
);
StreamingContent.displayName = 'StreamingContent';

// ========== 侧栏图标 + 浮窗 ==========
export const SidebarIcon: React.FC = React.memo(() => {
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
          backgroundColor: BLUE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BLUE_HOVER)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BLUE)}
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
          <FloatingWindow onClose={() => setVisible(false)} />,
          document.body
        )}
    </>
  );
});
SidebarIcon.displayName = 'SidebarIcon';

// ========== 可拖拽浮窗 ==========
const FloatingWindow: React.FC<{ onClose: () => void }> = React.memo(({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkMode, setThinkMode] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<number, boolean>>({});
  const listRef = useRef<HTMLDivElement>(null);

  // --- 拖拽 ---
  const posRef = useRef({ x: window.innerWidth - 440, y: 60 });
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const [pos, setPos] = useState(posRef.current);

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

  // --- 滚动到底部 ---
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // --- 流式输出完成回调 ---
  const handleStreamDone = useCallback((index: number) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === index ? { ...m, streaming: false } : m))
    );
  }, []);

  // --- 发送消息 ---
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const recent = [...messages, userMsg].slice(-10);
      const contextContent = recent
        .map((m) => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`)
        .join('\n');

      const res = await pluginRequest.post('chat', {
        content: contextContent,
        action: 'chat',
        thinkMode,
      });
      const data = res.data as { result: boolean; answer: string; reasoning?: string };

      const answerContent = data.result
        ? data.answer
        : data.answer || T.networkError;

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: answerContent,
          reasoning: data.reasoning || undefined,
          streaming: true,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: T.networkError, streaming: true },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, thinkMode]);

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
    setMessages([]);
    setInput('');
    setExpandedReasoning({});
  }, []);

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
        backgroundColor: '#fff',
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

      {/* 标题栏 */}
      <div
        onMouseDown={handleDragStart}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: BLUE,
          color: '#fff',
          cursor: 'move',
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon icon="mdi:creation" style={{ fontSize: 18 }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>{T.pluginName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} data-no-drag>
          {/* 深度思考开关 */}
          <button
            onClick={() => setThinkMode((v) => !v)}
            title={T.thinkModeDesc}
            style={{
              height: 28,
              padding: '0 10px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: thinkMode
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(255,255,255,0.15)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              fontWeight: thinkMode ? 700 : 400,
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.35)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = thinkMode
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(255,255,255,0.15)')
            }
          >
            <Icon icon="mdi:brain" style={{ fontSize: 14 }} />
            {T.thinkMode}
          </button>
          <button
            onClick={handleNewChat}
            title={T.newChat}
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
              transition: 'background-color 0.12s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')
            }
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
              transition: 'background-color 0.12s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')
            }
          >
            <Icon icon="mdi:close" style={{ fontSize: 16 }} />
          </button>
        </div>
      </div>

      {/* 消息列表 */}
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
          backgroundColor: '#f8fafc',
        }}
      >
        {messages.length === 0 && !loading && (
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
                backgroundColor: 'rgba(37,99,235,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon icon="mdi:creation" style={{ fontSize: 24, color: BLUE }} />
            </div>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>{T.placeholder}</span>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: msg.role === 'user' ? '8px 12px' : '10px 12px',
                borderRadius:
                  msg.role === 'user'
                    ? '12px 12px 4px 12px'
                    : '12px 12px 12px 4px',
                fontSize: 13,
                lineHeight: 1.6,
                backgroundColor: msg.role === 'user' ? BLUE : '#fff',
                color: msg.role === 'user' ? '#fff' : '#334155',
                boxShadow:
                  msg.role === 'assistant' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                position: 'relative',
              }}
            >
              {msg.role === 'assistant' ? (
                <>
                  {msg.streaming ? (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                      <StreamingContent
                        fullContent={msg.content}
                        onDone={() => handleStreamDone(i)}
                      />
                      <span
                        style={{
                          display: 'inline-block',
                          width: 2,
                          height: 14,
                          backgroundColor: BLUE,
                          borderRadius: 1,
                          animation: 'blink 0.8s ease-in-out infinite',
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {/* 推理过程折叠区 */}
                      {msg.reasoning && (
                        <div style={{ marginBottom: 4 }}>
                          <button
                            onClick={() =>
                              setExpandedReasoning((prev) => ({
                                ...prev,
                                [i]: !prev[i],
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
                              transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = 'rgba(139,92,246,0.14)')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = 'rgba(139,92,246,0.08)')
                            }
                          >
                            <Icon
                              icon={expandedReasoning[i] ? 'mdi:chevron-down' : 'mdi:chevron-right'}
                              style={{ fontSize: 14 }}
                            />
                            <Icon icon="mdi:brain" style={{ fontSize: 12 }} />
                            {expandedReasoning[i] ? T.collapseReasoning : T.expandReasoning}
                          </button>
                          {expandedReasoning[i] && (
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
                              {msg.reasoning}
                            </div>
                          )}
                        </div>
                      )}
                      {/* 正文 */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Markdown raw={msg.content} />
                        </div>
                        <CopyButton text={msg.content} />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {msg.content}
                </span>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}
          >
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '12px 12px 12px 4px',
                backgroundColor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <LoadingSpinner />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{thinkMode ? T.deepThinking : T.thinking}</span>
            </div>
          </div>
        )}
      </div>

      {/* 输入区 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          padding: '10px 14px 14px',
          borderTop: '1px solid #f1f5f9',
          flexShrink: 0,
          backgroundColor: '#fff',
        }}
      >
        {/* 深度思考模式指示条 */}
        {thinkMode && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 8,
              backgroundColor: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.15)',
            }}
          >
            <Icon icon="mdi:brain" style={{ fontSize: 14, color: '#7c3aed' }} />
            <span style={{ fontSize: 11, color: '#7c3aed', fontWeight: 500 }}>
              {T.thinkMode}
            </span>
            <span style={{ fontSize: 11, color: '#a78bfa' }}>
              — {T.thinkModeDesc}
            </span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={T.placeholder}
          rows={1}
          style={{
            flex: 1,
            minHeight: 36,
            maxHeight: 100,
            resize: 'none',
            borderRadius: 10,
            border: '1px solid #e2e8f0',
            padding: '7px 12px',
            fontSize: 13,
            lineHeight: 1.5,
            color: '#334155',
            backgroundColor: '#f8fafc',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: 'none',
            backgroundColor: input.trim() && !loading ? BLUE : '#e2e8f0',
            color: input.trim() && !loading ? '#fff' : '#94a3b8',
            cursor: input.trim() && !loading ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (input.trim() && !loading)
              e.currentTarget.style.backgroundColor = BLUE_HOVER;
          }}
          onMouseLeave={(e) => {
            if (input.trim() && !loading)
              e.currentTarget.style.backgroundColor = BLUE;
          }}
        >
          <Icon icon="mdi:send" style={{ fontSize: 18 }} />
        </button>
        </div>
      </div>
    </div>
  );
});
FloatingWindow.displayName = 'FloatingWindow';
