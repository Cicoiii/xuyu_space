import {
  regChatInputButton,
  regChatInputAction,
  regCustomPanel,
  Loadable,
  openModal,
  closeModal,
} from '@capital/common';
import { BaseChatInputButton } from '@capital/component';
import React from 'react';
import { AssistantBubbleIcon } from './FloatingAssistantWindow';

const PLUGIN_ID = 'com.msgbyte.ai-assistant';
const PLUGIN_NAME = '小序助手';

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

const SettingsPanelLoadable = Loadable(
  () => import('./SettingsPanel'),
  { componentName: `${PLUGIN_ID}:SettingsPanel` }
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

regCustomPanel({
  position: 'navbar-group',
  icon: 'mdi:creation',
  name: `${PLUGIN_ID}/assistant`,
  label: '小序助手',
  render: () => null,
  renderIcon: AssistantBubbleIcon,
  onClick: () => {},
});

regCustomPanel({
  position: 'setting',
  icon: 'mdi:tune-variant',
  name: `${PLUGIN_ID}/settings`,
  label: '小序助手',
  render: SettingsPanelLoadable,
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
