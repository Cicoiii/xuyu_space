import { Icon } from 'tailchat-design';
import React, { PropsWithChildren } from 'react';
import { useReducer } from 'react';
import styles from './GroupSection.module.less';

export const GroupSection: React.FC<
  PropsWithChildren<{
    header: string;
  }>
> = React.memo((props) => {
  const [isShow, switchShow] = useReducer((v) => !v, true);

  return (
    <div>
      <div
        className={styles.sectionHeader}
        onClick={switchShow}
      >
        <Icon
          className={styles.sectionIcon}
          icon="mdi:chevron-right"
          rotate={isShow ? 90 : 0}
        />
        <div>{props.header}</div>
      </div>
      <div
        className={styles.sectionContent}
        style={{
          maxHeight: isShow ? 'var(--max-height)' : 0,
        }}
        ref={(ref) =>
          ref?.style.setProperty('--max-height', `${ref.scrollHeight}px`)
        }
      >
        {props.children}
      </div>
    </div>
  );
});
GroupSection.displayName = 'GroupSection';
