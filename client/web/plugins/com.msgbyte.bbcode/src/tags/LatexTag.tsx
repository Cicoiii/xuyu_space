import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { TagProps } from '../bbcode/type';

export const LatexTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const text = node.content.join('');

  const html = useMemo(() => {
    try {
      return katex.renderToString(text, {
        throwOnError: false,
        displayMode: true,
      });
    } catch {
      return `<span style="color:#ef4444;">LaTeX Error: ${text}</span>`;
    }
  }, [text]);

  return (
    <span
      style={{
        display: 'inline-block',
        maxWidth: '100%',
        overflowX: 'auto',
        padding: '4px 0',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});
LatexTag.displayName = 'LatexTag';
