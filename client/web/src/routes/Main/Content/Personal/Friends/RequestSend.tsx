import {
  cancelFriendRequest,
  FriendRequest,
  t,
  useAsyncFn,
  useCachedUserInfo,
} from 'tailchat-shared';
import React from 'react';
import { Avatar, Icon } from 'tailchat-design';
import styles from './Friends.module.less';

export const RequestSend: React.FC<{
  requests: FriendRequest[];
}> = React.memo((props) => {
  const [{ loading }, handleCancel] = useAsyncFn(async (requestId) => {
    await cancelFriendRequest(requestId);
  }, []);

  if (props.requests.length === 0) {
    return (
      <div className={styles.empty}>
        <Icon icon="mdi:send-outline" className={styles.emptyIcon} />
        <span>{t('暂无已发送的好友请求')}</span>
      </div>
    );
  }

  return (
    <>
      <div className={styles.requestLabel}>{t('已发送')}</div>
      {props.requests.map(({ _id, to }) => (
        <SendItem
          key={to}
          userId={to}
          loading={loading}
          onCancel={() => handleCancel(_id)}
        />
      ))}
    </>
  );
});
RequestSend.displayName = 'RequestSend';

const SendItem: React.FC<{
  userId: string;
  loading: boolean;
  onCancel: () => void;
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
          className={`${styles.actionBtn} ${styles.danger}`}
          title={t('取消')}
          disabled={props.loading}
          onClick={props.onCancel}
        >
          <Icon icon="mdi:close" />
        </button>
      </div>
    </div>
  );
});
SendItem.displayName = 'SendItem';
