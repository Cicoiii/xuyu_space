import {
  FriendRequest,
  t,
  acceptFriendRequest,
  denyFriendRequest,
  useAsyncRequest,
  useCachedUserInfo,
} from 'tailchat-shared';
import React from 'react';
import { Avatar, Icon } from 'tailchat-design';
import styles from './Friends.module.less';

export const RequestReceived: React.FC<{
  requests: FriendRequest[];
}> = React.memo((props) => {
  const [{ loading: acceptLoading }, handleAccept] = useAsyncRequest(
    async (requestId) => {
      await acceptFriendRequest(requestId);
    },
    []
  );

  const [{ loading: denyLoading }, handleDeny] = useAsyncRequest(
    async (requestId) => {
      await denyFriendRequest(requestId);
    },
    []
  );

  if (props.requests.length === 0) {
    return (
      <div className={styles.empty}>
        <Icon icon="mdi:inbox-outline" className={styles.emptyIcon} />
        <span>{t('暂无待处理的好友请求')}</span>
      </div>
    );
  }

  const loading = acceptLoading || denyLoading;

  return (
    <>
      <div className={styles.requestLabel}>{t('待处理')}</div>
      {props.requests.map(({ _id, from }) => (
        <RequestItem
          key={from}
          userId={from}
          loading={loading}
          onAccept={() => handleAccept(_id)}
          onDeny={() => handleDeny(_id)}
        />
      ))}
    </>
  );
});
RequestReceived.displayName = 'RequestReceived';

const RequestItem: React.FC<{
  userId: string;
  loading: boolean;
  onAccept: () => void;
  onDeny: () => void;
}> = React.memo((props) => {
  const userInfo = useCachedUserInfo(props.userId);

  return (
    <div className={styles.friendItem}>
      <div className={styles.friendAvatar}>
        <Avatar src={userInfo.avatar} name={userInfo.nickname} />
      </div>
      <div className={styles.friendInfo}>
        <span className={styles.friendName}>{userInfo.nickname}</span>
      </div>
      <div className={styles.friendActions} style={{ opacity: 1 }}>
        <button
          className={styles.actionBtn}
          title={t('接受')}
          disabled={props.loading}
          onClick={props.onAccept}
        >
          <Icon icon="mdi:check" />
        </button>
        <button
          className={`${styles.actionBtn} ${styles.danger}`}
          title={t('拒绝')}
          disabled={props.loading}
          onClick={props.onDeny}
        >
          <Icon icon="mdi:close" />
        </button>
      </div>
    </div>
  );
});
RequestItem.displayName = 'RequestItem';
