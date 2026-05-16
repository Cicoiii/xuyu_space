import React, { PropsWithChildren } from 'react';
import styles from './FullModal.module.less';

interface FullModalCommonTitleProps extends PropsWithChildren {
  extra?: React.ReactNode;
}
export const FullModalCommonTitle: React.FC<FullModalCommonTitleProps> =
  React.memo((props) => {
    return (
      <div className={styles.sectionTitle}>
        <div>{props.children}</div>
        <div>{props.extra}</div>
      </div>
    );
  });
FullModalCommonTitle.displayName = 'FullModalCommonTitle';
