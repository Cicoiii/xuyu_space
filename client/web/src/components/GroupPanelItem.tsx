import { Badge, BadgeProps, Space } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './GroupPanelItem.module.less';

/**
 * 群组面板项
 * 用于侧边栏
 */
export const GroupPanelItem: React.FC<{
  name: string;
  icon: React.ReactNode;
  to: string;
  dimmed?: boolean; // 颜色暗淡
  badge?: boolean;
  badgeProps?: BadgeProps;
  extraBadge?: React.ReactNode[];
}> = React.memo((props) => {
  const { icon, name, to, dimmed = false, badge } = props;
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link className="block" to={to}>
      <div
        className={clsx(styles.item, {
          [styles.active]: isActive,
          [styles.dimmed]: dimmed,
        })}
      >
        <div className={styles.icon}>
          {icon}
        </div>

        <span className={styles.name}>
          {name}
        </span>

        <Space className={styles.badgeArea}>
          {badge === true && <Badge status="error" {...props.badgeProps} />}
          {props.extraBadge}
        </Space>
      </div>
    </Link>
  );
});
GroupPanelItem.displayName = 'GroupPanelItem';
