import type { PluginCustomPanel } from '@/plugin/common';
import React, { useMemo } from 'react';
import { Icon } from 'tailchat-design';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Personal/Sidebar.module.less';

const defaultUseIsShow = () => true;

/**
 * 导航栏自定义选项
 * 用于插件
 */
export const CustomSidebarItem: React.FC<{
  panelInfo: PluginCustomPanel;
}> = React.memo(({ panelInfo }) => {
  const useIsShow = useMemo(() => panelInfo.useIsShow ?? defaultUseIsShow, []);
  const isShow = useIsShow();
  const location = useLocation();
  const to = `/main/personal/custom/${panelInfo.name}`;
  const isActive = location.pathname.startsWith(to);

  if (!isShow) {
    return null;
  }

  return (
    <Link to={to} className={clsx(styles.navItem, { [styles.active]: isActive })}>
      <span className={styles.navIcon}>
        <Icon icon={panelInfo.icon} />
      </span>
      <span className={styles.navLabel}>{panelInfo.label}</span>
    </Link>
  );
});
CustomSidebarItem.displayName = 'CustomSidebarItem';
