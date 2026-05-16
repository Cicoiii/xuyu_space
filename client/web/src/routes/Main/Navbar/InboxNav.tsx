import { Icon } from 'tailchat-design';
import React from 'react';
import { t, useInboxList } from 'tailchat-shared';
import { NavbarNavItem } from './NavItem';
import styles from './Navbar.module.less';

/**
 * 收件箱
 */
export const InboxNav: React.FC = React.memo(() => {
  const inbox = useInboxList();
  const unreadCount = inbox.filter((i) => !i.readed).length;

  return (
    <NavbarNavItem
      name={t('收件箱')}
      to={'/main/inbox'}
      showPill={true}
      badge={unreadCount > 0}
      badgeCount={unreadCount}
      data-testid="inbox"
    >
      <Icon className={styles.iconDefault} icon="mdi:inbox-arrow-down" />
    </NavbarNavItem>
  );
});
InboxNav.displayName = 'InboxNav';
