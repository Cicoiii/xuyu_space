import { Avatar } from 'tailchat-design';
import React from 'react';
import {
  t,
  useDMConverseList,
  useUserInfo,
  useUnread,
  useAppSelector,
} from 'tailchat-shared';
import { NavbarNavItem } from './NavItem';
import styles from './Navbar.module.less';

function usePersonalUnread(): boolean {
  const converse = useDMConverseList();
  const unreads = useUnread(converse.map((converse) => String(converse._id)));

  return unreads.some((u) => u === true);
}

export const PersonalNav: React.FC = React.memo(() => {
  const userInfo = useUserInfo();
  const unread = usePersonalUnread();
  const hasFriendRequest = useAppSelector(
    (state) =>
      state.user.friendRequests.findIndex(
        (item) => item.to === state.user.info?._id
      ) >= 0
  );

  const badge = unread || hasFriendRequest;

  return (
    <div data-tc-role="navbar-personal">
      <NavbarNavItem
        name={t('我')}
        to={'/main/personal'}
        showPill={true}
        badge={badge}
      >
        <Avatar
          className={styles.avatarShape}
          shape="square"
          size={36}
          name={userInfo?.nickname}
          src={userInfo?.avatar}
        />
      </NavbarNavItem>
    </div>
  );
});
PersonalNav.displayName = 'PersonalNav';
