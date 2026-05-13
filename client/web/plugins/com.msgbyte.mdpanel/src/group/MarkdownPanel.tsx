import React, { useEffect, useState } from 'react';
import {
  GroupExtraDataPanel,
  Markdown,
  MarkdownEditor,
  Icon,
} from '@capital/component';
import { Translate } from '../translate';

/** 阅读模式 — 干净、现代的展示 */
const mainContentStyle: React.CSSProperties = {
  padding: '20px 24px',
  maxHeight: '100%',
  overflowY: 'auto',
};

/** 编辑弹窗 — 全屏沉浸式 */
const editModalStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: '#fff',
  borderRadius: 12,
};

const editHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 20px',
  borderBottom: '1px solid #f1f5f9',
  flexShrink: 0,
};

const editBodyStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
};

/** 编辑提示条 */
const editTipStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#94a3b8',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const MarkdownEditorRender: React.FC<{ dataMap: Record<string, string> }> =
  React.memo((props) => {
    const [text, setText] = useState(() => props.dataMap['markdown']);

    useEffect(() => {
      props.dataMap['markdown'] = text;
    }, [text]);

    return (
      <div style={{ height: '100%' }}>
        <MarkdownEditor
          value={text}
          onChange={(val: string) => setText(val)}
          imageUsage="group"
        />
      </div>
    );
  });
MarkdownEditorRender.displayName = 'MarkdownEditorRender';

const MarkdownPanel: React.FC = React.memo(() => {
  return (
    <GroupExtraDataPanel
      names={['markdown']}
      render={(dataMap: Record<string, string>) => {
        return (
          <div style={mainContentStyle}>
            <Markdown raw={dataMap['markdown'] ?? ''} allowIframe={true} />
          </div>
        );
      }}
      renderEdit={(dataMap: Record<string, string>) => {
        return (
          <div style={editModalStyle}>
            <div style={editHeaderStyle}>
              <div style={editTipStyle}>
                <Icon icon="mdi:pencil-outline" style={{ fontSize: 16 }} />
                {Translate.editTip}
              </div>
            </div>
            <div style={editBodyStyle}>
              <MarkdownEditorRender dataMap={dataMap} />
            </div>
          </div>
        );
      }}
    />
  );
});
MarkdownPanel.displayName = 'MarkdownPanel';

export default MarkdownPanel;
