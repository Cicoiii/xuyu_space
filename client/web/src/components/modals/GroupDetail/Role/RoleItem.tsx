import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import styles from '@/components/FullModal/FullModal.module.less';

export const RoleItem: React.FC<
  PropsWithChildren<{
    active: boolean;
    onClick?: () => void;
  }>
> = React.memo((props) => {
  return (
    <div
      className={clsx(styles.roleItem, {
        [styles.roleItemActive]: props.active,
      })}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
});
RoleItem.displayName = 'RoleItem';
