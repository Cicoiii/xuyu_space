import { Tooltip } from 'antd';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useEvent } from 'tailchat-shared';
import styles from './Navbar.module.less';

export const NavbarNavItem: React.FC<
  PropsWithChildren<{
    name: string;
    className?: string;
    to?: string;
    showPill?: boolean;
    badge?: boolean;
    badgeCount?: number;
    badgeMuted?: boolean;
    onClick?: () => void;
    ['data-testid']?: string;
  }>
> = React.memo((props) => {
  const { name, to, showPill = false, badge = false, badgeCount, badgeMuted = false } = props;
  const location = useLocation();
  const isActive = typeof to === 'string' && location.pathname.startsWith(to);
  const navigate = useNavigate();

  const handleClick = useEvent(() => {
    if (typeof to === 'string') {
      navigate(to);
    }
    props.onClick?.();
  });

  return (
    <div className={styles.navItemWrapper}>
      {/* 左侧指示条 */}
      {showPill && (
        <div
          className={clsx(styles.pill, {
            [styles.pillActive]: isActive,
          })}
        />
      )}

      {/* 未读圆点 — 放在 navItemWrapper 层，不受 overflow:hidden 影响 */}
      {badge && !badgeCount && <div className={styles.dot} />}

      {/* 未读数角标 */}
      {badge && badgeCount && badgeCount > 0 && (
        <div
          className={clsx(styles.badge, {
            [styles.badgeMuted]: badgeMuted,
          })}
        >
          {badgeCount > 99 ? '99+' : badgeCount}
        </div>
      )}

      <Tooltip
        title={name ? <div className="font-medium px-1 py-0.5">{name}</div> : null}
        placement="right"
        overlayClassName="navbar-tooltip"
      >
        <div
          className={clsx(styles.navItem, props.className, {
            [styles.active]: isActive,
          })}
          onClick={handleClick}
          data-testid={props['data-testid']}
        >
          {props.children}
        </div>
      </Tooltip>
    </div>
  );
});
NavbarNavItem.displayName = 'NavbarNavItem';
