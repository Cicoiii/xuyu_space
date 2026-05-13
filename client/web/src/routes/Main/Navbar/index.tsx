import React from 'react';
import { GroupNav } from './GroupNav';
import { MobileMenuBtn } from './MobileMenuBtn';
import { SettingBtn } from './SettingBtn';
import { PersonalNav } from './PersonalNav';
import { InboxNav } from './InboxNav';
import { InstallBtn } from './InstallBtn';
import { ReactQueryDevBtn } from './ReactQueryDevBtn';
import { pluginCustomPanel } from '@/plugin/common';
import { NavbarCustomNavItem } from './CustomNavItem';
import { QuickSwitcherNav } from './QuickSwitcherNav';
import styles from './Navbar.module.less';

/**
 * 导航栏组件
 */
export const Navbar: React.FC = React.memo(() => {
  return (
    <div data-tc-role="navbar" className={styles.navbar}>
      <MobileMenuBtn />

      {/* 顶部导航项 */}
      <div className={styles.navTop}>
        <PersonalNav />
        <InboxNav />
        <QuickSwitcherNav />
        {pluginCustomPanel
          .filter((p) => p.position === 'navbar-personal')
          .map((p) => (
            <NavbarCustomNavItem key={p.name} panelInfo={p} withBg={true} />
          ))}
      </div>

      <div className={styles.divider} />

      {/* 群组列表 - 可滚动 */}
      <div className={styles.navMiddle}>
        <GroupNav />
      </div>

      <div data-tc-role="navbar-settings" className={styles.navBottom}>
        {pluginCustomPanel
          .filter((p) => p.position === 'navbar-more')
          .map((p) => (
            <NavbarCustomNavItem key={p.name} panelInfo={p} withBg={false} />
          ))}
        <ReactQueryDevBtn />
        <InstallBtn />
        <SettingBtn />
      </div>
    </div>
  );
});
Navbar.displayName = 'Navbar';
