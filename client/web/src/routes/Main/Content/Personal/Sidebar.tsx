import React, { PropsWithChildren } from 'react';
import { Icon } from 'tailchat-design';
import {
  t,
  useDMConverseList,
  useUserInfo,
  useGlobalConfigStore,
  useAppSelector,
} from 'tailchat-shared';
import { SidebarDMItem } from './SidebarDMItem';
import { openModal } from '@/components/Modal';
import { CreateDMConverse } from '@/components/modals/CreateDMConverse';
import { pluginCustomPanel } from '@/plugin/common';
import { CustomSidebarItem } from '../CustomSidebarItem';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Sidebar.module.less';

const SidebarSection: React.FC<
  PropsWithChildren<{
    action?: React.ReactNode;
  }>
> = React.memo((props) => {
  return (
    <div className={styles.sectionHeader}>
      <span>{props.children}</span>
      {props.action && <div className={styles.sectionAction}>{props.action}</div>}
    </div>
  );
});
SidebarSection.displayName = 'SidebarSection';

interface NavItemProps {
  name: string;
  icon: React.ReactElement;
  to: string;
  badge?: boolean;
}

const NavItem: React.FC<NavItemProps> = React.memo((props) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(props.to);

  return (
    <Link
      to={props.to}
      className={clsx(styles.navItem, { [styles.active]: isActive })}
    >
      <span className={styles.navIcon}>{props.icon}</span>
      <span className={styles.navLabel}>{props.name}</span>
      {props.badge && <span className={styles.navBadge} />}
    </Link>
  );
});
NavItem.displayName = 'NavItem';

/**
 * 个人面板侧边栏组件
 */
export const PersonalSidebar: React.FC = React.memo(() => {
  const converseList = useDMConverseList();
  const userInfo = useUserInfo();
  const disablePluginStore = useGlobalConfigStore(
    (state) => state.disablePluginStore
  );
  const hasFriendRequest = useAppSelector(
    (state) =>
      state.user.friendRequests.findIndex(
        (item) => item.to === state.user.info?._id
      ) >= 0
  );

  return (
    <div className={styles.sidebarWrapper} data-tc-role="sidebar-personal">
      <div className={styles.sidebarHeader}>{userInfo?.nickname}</div>

      <div className={styles.sidebarContent}>
        <NavItem
          name={t('好友')}
          icon={<Icon icon="mdi:account-multiple-outline" />}
          to="/main/personal/friends"
          badge={hasFriendRequest}
        />

        {!disablePluginStore && (
          <NavItem
            name={t('插件中心')}
            icon={<Icon icon="mdi:puzzle-outline" />}
            to="/main/personal/plugins"
          />
        )}

        {/* 插件自定义面板 */}
        {pluginCustomPanel
          .filter((p) => p.position === 'personal')
          .map((p) => (
            <CustomSidebarItem key={p.name} panelInfo={p} />
          ))}

        <SidebarSection
          action={
            <Icon
              icon="mdi:plus"
              onClick={() => openModal(<CreateDMConverse />)}
            />
          }
        >
          {t('私信')}
        </SidebarSection>

        {converseList.map((converse) => (
          <SidebarDMItem key={converse._id} converse={converse} />
        ))}
      </div>
    </div>
  );
});
PersonalSidebar.displayName = 'PersonalSidebar';
