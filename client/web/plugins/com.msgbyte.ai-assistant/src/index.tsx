import {
  regChatInputButton,
  regChatInputAction,
  Loadable,
  openModal,
  closeModal,
} from '@capital/common';
import { BaseChatInputButton } from '@capital/component';
import React from 'react';

const PLUGIN_ID = 'com.msgbyte.ai-assistant';
const PLUGIN_NAME = 'AI Assistant';

console.log(`Plugin ${PLUGIN_NAME}(${PLUGIN_NAME}) is loaded`);

const AssistantPopoverLoadable = Loadable(
  () =>
    import('./popover').then((m) => m.AssistantPopover),
  { componentName: `${PLUGIN_ID}:AssistantPopover` }
);

const CodeMarkdownPanelLoadable = Loadable(
  () => import('./code-markdown-panel').then((m) => m.CodeMarkdownPanel),
  { componentName: `${PLUGIN_ID}:CodeMarkdownPanel` }
);

regChatInputButton({
  render: () => {
    return (
      <BaseChatInputButton
        icon="eos-icons:ai"
        popoverContent={({ hidePopover }) => (
          <AssistantPopoverLoadable onCompleted={hidePopover} />
        )}
      />
    );
  },
});

regChatInputAction({
  label: '发送代码',
  onClick: (actions: { sendMsg: (msg: string) => void }) => {
    const key = openModal(
      <CodeMarkdownPanelLoadable
        mode="code"
        onSend={(content: string) => {
          actions.sendMsg(content);
          closeModal(key);
        }}
        onCancel={() => closeModal(key)}
      />
    );
  },
});

regChatInputAction({
  label: '发送 Markdown',
  onClick: (actions: { sendMsg: (msg: string) => void }) => {
    const key = openModal(
      <CodeMarkdownPanelLoadable
        mode="markdown"
        onSend={(content: string) => {
          actions.sendMsg(content);
          closeModal(key);
        }}
        onCancel={() => closeModal(key)}
      />
    );
  },
});
