import React, { useState, useCallback } from 'react';
import { localTrans, sharedEvent } from '@capital/common';
import { Icon } from '@capital/component';

const BRAND = 'var(--tc-primary-color)';
const BRAND_HOVER = 'var(--tc-primary-hover-color)';
const SURFACE = 'var(--tc-surface-panel-color)';
const SURFACE_SOFT = 'var(--tc-surface-soft-color)';
const BORDER = 'var(--tc-border-color)';
const TEXT = 'var(--tc-text-color)';
const TEXT_SECONDARY = 'var(--tc-text-secondary-color)';
const TEXT_MUTED = 'var(--tc-text-muted-color)';

const T = {
  sendCode: localTrans({ 'zh-CN': '发送代码', 'en-US': 'Send Code' }),
  sendMarkdown: localTrans({ 'zh-CN': '发送 Markdown', 'en-US': 'Send Markdown' }),
  language: localTrans({ 'zh-CN': '语言', 'en-US': 'Language' }),
  placeholder: localTrans({ 'zh-CN': '请输入内容...', 'en-US': 'Enter content...' }),
  send: localTrans({ 'zh-CN': '发送', 'en-US': 'Send' }),
  cancel: localTrans({ 'zh-CN': '取消', 'en-US': 'Cancel' }),
};

const LANGUAGES = [
  'bash',
  'javascript',
  'typescript',
  'python',
  'java',
  'c',
  'cpp',
  'go',
  'rust',
  'sql',
  'html',
  'css',
  'json',
  'yaml',
  'xml',
];

interface CodeMarkdownPanelProps {
  mode: 'code' | 'markdown';
  onSend: (content: string) => void;
  onCancel: () => void;
}

export const CodeMarkdownPanel: React.FC<CodeMarkdownPanelProps> = React.memo(
  (props) => {
    const { mode } = props;
    const [text, setText] = useState('');
    const [lang, setLang] = useState('javascript');

    const handleSend = useCallback(() => {
      if (!text.trim()) return;
      const wrapped =
        mode === 'code'
          ? `[code language=${lang}]${text}[/code]`
          : `[md]${text}[/md]`;
      props.onSend(wrapped);
      setTimeout(() => sharedEvent.emit('sendMessage'), 300);
    }, [text, lang, mode, props.onSend]);

    return (
      <div
        style={{
          width: 440,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
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
            <Icon
              icon={mode === 'code' ? 'mdi:code-tags' : 'mdi:language-markdown-outline'}
              style={{ fontSize: 16, color: '#fff' }}
            />
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>
            {mode === 'code' ? T.sendCode : T.sendMarkdown}
          </span>
        </div>

        {/* Language selector (code mode only) */}
        {mode === 'code' && (
          <div style={{ padding: '0 20px 10px' }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: TEXT_MUTED,
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {T.language}
            </div>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                width: '100%',
                height: 36,
                borderRadius: 8,
                border: `1px solid ${BORDER}`,
                padding: '0 10px',
                fontSize: 13,
                color: TEXT,
                backgroundColor: SURFACE_SOFT,
                outline: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = BRAND)}
              onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Textarea */}
        <div style={{ padding: '0 20px 10px', flex: 1 }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={T.placeholder}
            autoFocus
            style={{
              width: '100%',
              minHeight: 180,
              maxHeight: '50vh',
              resize: 'vertical',
              borderRadius: 12,
              border: `1px solid ${BORDER}`,
              padding: '12px 14px',
              fontSize: 13,
              lineHeight: 1.6,
              color: TEXT,
              backgroundColor: SURFACE_SOFT,
              outline: 'none',
              fontFamily:
                mode === 'code'
                  ? "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace"
                  : 'inherit',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = BRAND)}
            onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
          />
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            padding: '4px 20px 18px',
          }}
        >
          <button
            onClick={props.onCancel}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              color: TEXT_SECONDARY,
              backgroundColor: SURFACE_SOFT,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--tc-border-soft-color)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = SURFACE_SOFT)}
          >
            {T.cancel}
          </button>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              color: '#fff',
              backgroundColor: BRAND,
              border: 'none',
              cursor: text.trim() ? 'pointer' : 'default',
              opacity: text.trim() ? 1 : 0.5,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (text.trim()) e.currentTarget.style.backgroundColor = BRAND_HOVER;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = BRAND;
            }}
          >
            {T.send}
          </button>
        </div>
      </div>
    );
  }
);
CodeMarkdownPanel.displayName = 'CodeMarkdownPanel';
