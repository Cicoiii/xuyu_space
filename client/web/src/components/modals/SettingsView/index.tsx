import { FullModal } from '@/components/FullModal';
import {
  SidebarView,
  SidebarViewMenuType,
} from '@/components/SidebarView';
import { pluginCustomPanel } from '@/plugin/common';
import React, { useCallback, useMemo } from 'react';
import { t } from 'tailchat-shared';
import { SettingsAbout } from './About';
import { SettingsAccount } from './Account';
import { SettingsSystem } from './System';

interface SettingsViewProps {
  onClose: () => void;
}
export const SettingsView: React.FC<SettingsViewProps> = React.memo((props) => {
  const handleChangeVisible = useCallback(
    (visible: boolean) => {
      if (visible === false && typeof props.onClose === 'function') {
        props.onClose();
      }
    },
    [props.onClose]
  );

  const menu: SidebarViewMenuType[] = useMemo(() => {
    const common: SidebarViewMenuType = {
      type: 'group',
      title: t('设置'),
      children: [
        {
          type: 'item',
          title: t('账户信息'),
          content: <SettingsAccount />,
        },
        {
          type: 'item',
          title: t('系统设置'),
          content: <SettingsSystem />,
        },
        {
          type: 'item',
          title: t('关于'),
          content: <SettingsAbout />,
        },
      ],
    };

    const more: SidebarViewMenuType[] = pluginCustomPanel
      .filter(
        (p) =>
          p.position === 'setting' &&
          !p.name.startsWith('com.msgbyte.openapi')
      )
      .map((p) => ({
        type: 'group' as const,
        title: p.label,
        children: [
          {
            type: 'item' as const,
            title: p.label,
            content: React.createElement(p.render),
          },
        ],
      }));

    return [common, ...more];
  }, []);

  return (
    <FullModal onChangeVisible={handleChangeVisible}>
      <SidebarView menu={menu} defaultContentPath="0.children.0.content" />
    </FullModal>
  );
});
SettingsView.displayName = 'SettingsView';
