import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Translate } from './translate';
import {
  useConverseMessageContext,
  getCachedUserInfo,
  getMessageTextDecorators,
  sharedEvent,
} from '@capital/common';
import {
  Markdown,
  LoadingSpinner,
  useChatInputActionContext,
  Icon,
} from '@capital/component';
import { pluginRequest } from './request';

type ActionType =
  | 'improve'
  | 'shorter'
  | 'longer'
  | 'translate'
  | 'summary'
  | 'chat';

interface AIResult {
  result: boolean;
  answer: string;
  usage?: number;
  reasoning?: string;
}

const BRAND = 'var(--tc-primary-color)';
const BRAND_HOVER = 'var(--tc-primary-hover-color)';
const BRAND_SUBTLE = 'var(--tc-primary-faint-strong-color)';
const SURFACE = 'var(--tc-surface-panel-color)';
const SURFACE_SOFT = 'var(--tc-surface-soft-color)';
const BORDER = 'var(--tc-border-color)';
const BORDER_SOFT = 'var(--tc-border-soft-color)';
const TEXT = 'var(--tc-text-color)';
const TEXT_SECONDARY = 'var(--tc-text-secondary-color)';
const TEXT_MUTED = 'var(--tc-text-muted-color)';

const actionItems: { key: ActionType; icon: string }[] = [
  { key: 'summary', icon: 'mdi:text-box-check-outline' },
  { key: 'improve', icon: 'mdi:auto-fix' },
  { key: 'shorter', icon: 'mdi:arrow-collapse-horizontal' },
  { key: 'longer', icon: 'mdi:arrow-expand-horizontal' },
  { key: 'translate', icon: 'mdi:translate' },
];

const actionLabel: Record<ActionType, string> = {
  chat: Translate.name,
  summary: Translate.summaryMessages,
  improve: Translate.improveText,
  shorter: Translate.makeShorter,
  longer: Translate.makeLonger,
  translate: Translate.translateInputText,
};

export const AssistantPopover: React.FC<{
  onCompleted: () => void;
}> = React.memo((props) => {
  const { messages } = useConverseMessageContext();
  const { message, setMessage, sendMsg } = useChatInputActionContext();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<AIResult | null>(null);
  const [showReasoning, setShowReasoning] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [value]);

  const handleCallAI = useCallback(
    async (content: string, action: ActionType = 'chat') => {
      setLoading(true);
      setValue(null);
      setShowReasoning(false);
      try {
        const res = await pluginRequest.post('chat', {
          content,
          action,
          thinkMode: false,
        });
        setValue(res.data);
      } catch {
        setValue({ result: false, answer: Translate.networkError });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSummary = useCallback(async () => {
    const plainMessages = (
      await Promise.all(
        [...messages]
          .filter((item) => !item.hasRecall)
          .slice(messages.length - 30, messages.length)
          .map(
            async (item) =>
              `${
                (await getCachedUserInfo(item.author)).nickname
              }: ${getMessageTextDecorators().serialize(
                item.content ?? ''
              )}`
          )
      )
    ).join('\n');

    handleCallAI(plainMessages, 'summary');
  }, [messages, handleCallAI]);

  const handleApplyResult = useCallback(
    (answer: string) => {
      setMessage(`[md]${answer}[/md]`);
      props.onCompleted();
    },
    [setMessage, props.onCompleted]
  );

  const handleSendResult = useCallback(
    (answer: string) => {
      sendMsg(`[md]${answer}[/md]`);
      setTimeout(() => {
        sharedEvent.emit('sendMessage');
      }, 300);
      props.onCompleted();
    },
    [sendMsg, props.onCompleted]
  );

  const hasInput = typeof message === 'string' && message.length > 0;
  const showResult = value !== null && !loading;
  const hasReasoning = value?.reasoning && value.reasoning.trim().length > 0;

  return (
    <div
      style={{
        width: 400,
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        background: SURFACE,
        color: TEXT,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 8px 40px rgba(0,0,0,0.08)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '16px 20px 12px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            backgroundColor: BRAND,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon icon="mdi:creation" style={{ fontSize: 16, color: '#fff' }} />
        </div>
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: TEXT,
            letterSpacing: '-0.01em',
          }}
        >
          {Translate.name}
        </span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Result / Loading / Empty */}
        {loading ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '48px 20px',
            }}
          >
            <LoadingSpinner />
            <span style={{ fontSize: 13, color: TEXT_MUTED }}>
              {Translate.aiThinking}
            </span>
          </div>
        ) : value !== null ? (
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '0 20px 8px' }}>
            {value.result ? (
              <div
                ref={resultRef}
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                }}
              >
                {/* Reasoning section (collapsible) */}
                {hasReasoning && (
                  <div style={{ marginBottom: 8 }}>
                    <button
                      onClick={() => setShowReasoning((prev) => !prev)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '5px 10px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        color: TEXT_SECONDARY,
                        backgroundColor: SURFACE_SOFT,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = BORDER_SOFT;
                        e.currentTarget.style.color = TEXT;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = SURFACE_SOFT;
                        e.currentTarget.style.color = TEXT_SECONDARY;
                      }}
                    >
                      <Icon
                        icon={showReasoning ? 'mdi:chevron-down' : 'mdi:chevron-right'}
                        style={{ fontSize: 14 }}
                      />
                      <Icon icon="mdi:head-lightbulb-outline" style={{ fontSize: 13 }} />
                      {showReasoning ? Translate.hideReasoning : Translate.showReasoning}
                    </button>
                    {showReasoning && (
                      <div
                        style={{
                          marginTop: 6,
                          padding: '10px 14px',
                          fontSize: 12,
                          lineHeight: 1.7,
                          color: TEXT_SECONDARY,
                          backgroundColor: 'var(--tc-warning-soft-color, rgba(234,179,8,0.12))',
                          borderLeft: '3px solid #eab308',
                          borderRadius: '0 8px 8px 0',
                          maxHeight: 200,
                          overflowY: 'auto',
                        }}
                      >
                        <Markdown raw={value.reasoning!} />
                      </div>
                    )}
                  </div>
                )}

                {/* Answer section */}
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: TEXT,
                    backgroundColor: SURFACE_SOFT,
                    borderRadius: 12,
                    padding: '14px 16px',
                  }}
                >
                  <Markdown raw={value.answer} />
                </div>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: 'var(--tc-dangerous-soft-color, rgba(239,68,68,0.12))',
                  borderRadius: 12,
                  padding: '12px 16px',
                  fontSize: 13,
                }}
              >
                <div style={{ color: TEXT_SECONDARY, marginBottom: 4 }}>
                  {Translate.serviceBusy}
                </div>
                <div style={{ color: '#ef4444' }}>{value.answer}</div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ flex: 1 }} />
        )}

        {/* Action buttons row */}
        {showResult && value.result && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: '8px 20px 14px',
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => handleApplyResult(value.answer)}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                color: BRAND,
                backgroundColor: 'transparent',
                border: '1px solid var(--tc-primary-strong-color)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = BRAND_SUBTLE;
                e.currentTarget.style.borderColor = BRAND;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'var(--tc-primary-strong-color)';
              }}
            >
              {Translate.apply}
            </button>
            <button
              onClick={() => handleSendResult(value.answer)}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                color: '#fff',
                backgroundColor: BRAND,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = BRAND_HOVER;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = BRAND;
              }}
            >
              {Translate.send}
            </button>
          </div>
        )}
      </div>

      {/* Quick actions - pill chips like ChatGPT suggestions */}
      <div
        style={{
          padding: '6px 20px 18px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: TEXT_MUTED,
            marginBottom: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {Translate.helpMeTo}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {actionItems.map((item) => {
            const disabled = item.key !== 'summary' && !hasInput;
            return (
              <button
                key={item.key}
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  if (item.key === 'summary') {
                    handleSummary();
                  } else {
                    handleCallAI(message, item.key);
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  border: disabled ? `1px solid ${BORDER_SOFT}` : `1px solid ${BORDER}`,
                  backgroundColor: disabled ? SURFACE_SOFT : 'transparent',
                  color: disabled ? TEXT_MUTED : TEXT_SECONDARY,
                  cursor: disabled ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={
                  disabled
                    ? undefined
                    : (e) => {
                        e.currentTarget.style.backgroundColor = BRAND_SUBTLE;
                        e.currentTarget.style.borderColor = 'var(--tc-primary-shadow-color)';
                        e.currentTarget.style.color = BRAND;
                      }
                }
                onMouseLeave={
                  disabled
                    ? undefined
                    : (e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = BORDER;
                        e.currentTarget.style.color = TEXT_SECONDARY;
                      }
                }
              >
                <Icon
                  className="flex-shrink-0"
                  icon={item.icon}
                  style={{ fontSize: 13, opacity: disabled ? 0.4 : 0.55 }}
                />
                {actionLabel[item.key]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
AssistantPopover.displayName = 'AssistantPopover';
