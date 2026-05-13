import {
  chatActions,
  ChatConverseState,
  getCachedUserInfo,
  model,
  useAppDispatch,
  useAsync,
  useAsyncRequest,
  useDMConverseName,
  useUnread,
  useUserId,
} from 'tailchat-shared';
import React from 'react';
import { CombinedAvatar, Icon } from 'tailchat-design';
import _without from 'lodash/without';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Sidebar.module.less';

interface SidebarDMItemProps {
  converse: ChatConverseState;
}
export const SidebarDMItem: React.FC<SidebarDMItemProps> = React.memo(
  (props) => {
    const converse = props.converse;
    const converseId = converse._id;
    const name = useDMConverseName(converse);
    const userId = useUserId();
    const [hasUnread] = useUnread([converseId]);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const isActive = location.pathname === `/main/personal/converse/${converseId}`;

    const { value: avatarEl } = useAsync(async () => {
      if (!userId) {
        return;
      }

      const userInfos = await Promise.all(
        _without<string>(converse.members, userId).map((memberUserId) =>
          getCachedUserInfo(memberUserId)
        )
      );

      return (
        <CombinedAvatar
          items={userInfos.map((user) => ({
            name: user.nickname,
            src: user.avatar,
          }))}
        />
      );
    }, [converse.members, userId]);

    const [, handleRemove] = useAsyncRequest(async () => {
      dispatch(chatActions.removeConverse({ converseId }));
      await model.user.removeUserDMConverse(converseId);
    }, [converseId]);

    return (
      <Link
        to={`/main/personal/converse/${converseId}`}
        className={clsx(styles.dmItem, { [styles.active]: isActive })}
      >
        <div className={styles.dmAvatar}>{avatarEl}</div>
        <span className={styles.dmName}>{name}</span>
        {hasUnread && <span className={styles.dmUnread} />}
        <span
          className={styles.dmClose}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleRemove();
          }}
        >
          <Icon icon="mdi:close" />
        </span>
      </Link>
    );
  }
);
SidebarDMItem.displayName = 'SidebarDMItem';
