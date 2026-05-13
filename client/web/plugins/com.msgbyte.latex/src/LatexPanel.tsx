import React, { useState, useMemo, useCallback } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { localTrans, sharedEvent } from '@capital/common';
import { Icon } from '@capital/component';

const BLUE = '#2563eb';
const BLUE_HOVER = '#1d4ed8';

const T = {
  title: localTrans({ 'zh-CN': 'LaTeX 公式', 'en-US': 'LaTeX Formula' }),
  placeholder: localTrans({
    'zh-CN': '输入 LaTeX 公式，如 E=mc^2',
    'en-US': 'Enter LaTeX formula, e.g. E=mc^2',
  }),
  preview: localTrans({ 'zh-CN': '预览', 'en-US': 'Preview' }),
  send: localTrans({ 'zh-CN': '发送', 'en-US': 'Send' }),
  cancel: localTrans({ 'zh-CN': '取消', 'en-US': 'Cancel' }),
  examples: localTrans({ 'zh-CN': '示例', 'en-US': 'Examples' }),
};

const EXAMPLES = [
  { label: 'E=mc²', formula: 'E = mc^2' },
  { label: '∫', formula: '\\int_{a}^{b} f(x)\\,dx' },
  { label: '∑', formula: '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}' },
  { label: '√', formula: '\\sqrt{x^2 + y^2}' },
  { label: '矩阵', formula: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
  { label: '分数', formula: '\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}' },
];

interface LatexPanelProps {
  onSend: (content: string) => void;
  onCancel: () => void;
}

export const LatexPanel: React.FC<LatexPanelProps> = React.memo((props) => {
  const [text, setText] = useState('');

  const previewHtml = useMemo(() => {
    if (!text.trim()) return '';
    try {
      return katex.renderToString(text, {
        throwOnError: false,
        displayMode: true,
      });
    } catch {
      return `<span style="color:#ef4444;">Formula error</span>`;
    }
  }, [text]);

  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    props.onSend(`[latex]${text}[/latex]`);
    setTimeout(() => sharedEvent.emit('sendMessage'), 300);
  }, [text, props.onSend]);

  return (
    <div
      style={{
        width: 480,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        background: '#fff',
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
            backgroundColor: BLUE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon icon="mdi:function-variant" style={{ fontSize: 16, color: '#fff' }} />
        </div>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
          {T.title}
        </span>
      </div>

      {/* Examples */}
      <div style={{ padding: '0 20px 10px' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#94a3b8',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {T.examples}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => setText(ex.formula)}
              style={{
                padding: '4px 10px',
                borderRadius: 16,
                fontSize: 12,
                fontWeight: 500,
                color: BLUE,
                backgroundColor: 'rgba(37,99,235,0.08)',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.16)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.08)')
              }
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: '0 20px 10px' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={T.placeholder}
          autoFocus
          style={{
            width: '100%',
            minHeight: 64,
            maxHeight: 120,
            resize: 'vertical',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            padding: '10px 14px',
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace",
            color: '#334155',
            backgroundColor: '#f8fafc',
            outline: 'none',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
        />
      </div>

      {/* Preview */}
      <div style={{ padding: '0 20px 10px' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#94a3b8',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {T.preview}
        </div>
        <div
          style={{
            minHeight: 48,
            maxHeight: 160,
            overflow: 'auto',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            padding: '12px 16px',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {text.trim() ? (
            <span dangerouslySetInnerHTML={{ __html: previewHtml }} />
          ) : (
            <span style={{ color: '#cbd5e1', fontSize: 13 }}>
              {T.placeholder}
            </span>
          )}
        </div>
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
            color: '#64748b',
            backgroundColor: '#f1f5f9',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
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
            backgroundColor: BLUE,
            border: 'none',
            cursor: text.trim() ? 'pointer' : 'default',
            opacity: text.trim() ? 1 : 0.5,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (text.trim()) e.currentTarget.style.backgroundColor = BLUE_HOVER;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = BLUE;
          }}
        >
          {T.send}
        </button>
      </div>
    </div>
  );
});
LatexPanel.displayName = 'LatexPanel';
