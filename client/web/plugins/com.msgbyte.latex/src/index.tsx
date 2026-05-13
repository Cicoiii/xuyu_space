import { regChatInputAction, Loadable, openModal, closeModal } from '@capital/common';
import React from 'react';

const PLUGIN_ID = 'com.msgbyte.latex';

console.log(`Plugin LaTeX Formula(${PLUGIN_ID}) is loaded`);

const LatexPanelLoadable = Loadable(
  () => import('./LatexPanel').then((m) => m.LatexPanel),
  { componentName: `${PLUGIN_ID}:LatexPanel` }
);

regChatInputAction({
  label: '发送 LaTeX',
  onClick: (actions: { sendMsg: (msg: string) => void }) => {
    const key = openModal(
      <LatexPanelLoadable
        onSend={(content: string) => {
          actions.sendMsg(content);
          closeModal(key);
        }}
        onCancel={() => closeModal(key)}
      />
    );
  },
});
