import React from 'react';
import { NavbarNavItem } from './NavItem';
import { t } from 'tailchat-shared';
import { Icon } from 'tailchat-design';
import { openQuickSwitcher } from '@/components/QuickSwitcher';
import styles from './Navbar.module.less';

export const QuickSwitcherNav: React.FC = React.memo(() => {
  return (
    <NavbarNavItem
      name={t('快速搜索、跳转') + ' | ctrl + k'}
      onClick={() => {
        openQuickSwitcher();
      }}
      data-testid="search"
    >
      <Icon className={styles.iconDefault} icon="mdi:magnify" />
    </NavbarNavItem>
  );
});
QuickSwitcherNav.displayName = 'QuickSwitcherNav';
