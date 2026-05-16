import type { PluginCustomPanel } from '@/plugin/common';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { Icon } from 'tailchat-design';
import { NavbarNavItem } from './NavItem';
import styles from './Navbar.module.less';

const defaultUseIsShow = () => true;

/**
 * 导航栏自定义选项
 * 用于插件
 */
export const NavbarCustomNavItem: React.FC<{
  panelInfo: PluginCustomPanel;
  /**
   * 是否包含背景
   */
  withBg: boolean;
}> = React.memo(({ panelInfo, withBg }) => {
  const useIsShow = useMemo(() => panelInfo.useIsShow ?? defaultUseIsShow, []);
  const isShow = useIsShow();

  if (!isShow) {
    return null;
  }

  // 如果提供了 onClick，则不跳转路由，直接使用 onClick
  const navProps = panelInfo.onClick
    ? { onClick: panelInfo.onClick }
    : { to: `/main/custom/${panelInfo.name}` };

  // 如果提供了 renderIcon，使用自定义图标渲染
  const iconElement = panelInfo.renderIcon ? (
    <panelInfo.renderIcon />
  ) : (
    <Icon
      className={clsx(withBg ? styles.iconDefault : styles.iconDefault)}
      icon={panelInfo.icon}
    />
  );

  return (
    <NavbarNavItem
      key={panelInfo.name}
      name={panelInfo.renderIcon ? '' : panelInfo.label}
      {...navProps}
      data-testid={`navbar-custom-${panelInfo.name}`}
    >
      {iconElement}
    </NavbarNavItem>
  );
});
NavbarCustomNavItem.displayName = 'NavbarCustomNavItem';
