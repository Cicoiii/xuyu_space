import React, { PropsWithChildren, useState } from 'react';
import { Dropdown, MenuProps } from 'antd';
import { Icon } from 'tailchat-design';
import clsx from 'clsx';
import styles from './SectionHeader.module.less';

interface SectionHeaderProps extends PropsWithChildren {
  menu?: MenuProps;
  'data-testid'?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = React.memo(
  (props) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className={styles.header} data-testid={props['data-testid']}>
        {props.menu ? (
          <Dropdown
            className="overflow-hidden"
            onOpenChange={setVisible}
            menu={props.menu}
            placement="bottomRight"
            trigger={['click']}
          >
            <div className={styles.headerContent}>
              <header className={styles.headerTitle}>{props.children}</header>
              <Icon
                className={clsx(styles.chevron, {
                  [styles.chevronOpen]: visible,
                })}
                icon="mdi:chevron-down"
              />
            </div>
          </Dropdown>
        ) : (
          <header className={styles.headerTitleNoMenu}>
            {props.children}
          </header>
        )}
      </div>
    );
  }
);
SectionHeader.displayName = 'SectionHeader';
