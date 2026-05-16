import React, { useCallback, useState } from 'react';
import { AddFriend } from './AddFriend';
import { t, useAppSelector, useGlobalConfigStore } from 'tailchat-shared';
import { RequestSend } from './RequestSend';
import { RequestReceived } from './RequestReceived';
import { FriendList } from './FriendList';
import clsx from 'clsx';
import styles from './Friends.module.less';

type TabKey = 'all' | 'sent' | 'received' | 'add';

/**
 * 好友面板
 */
export const FriendPanel: React.FC = React.memo(() => {
  const friendRequests = useAppSelector((state) => state.user.friendRequests);
  const userId = useAppSelector((state) => state.user.info?._id);
  const [activeKey, setActiveKey] = useState<TabKey>('all');
  const disableAddFriend = useGlobalConfigStore(
    (state) => state.disableAddFriend
  );

  const send = friendRequests.filter((item) => item.from === userId);
  const received = friendRequests.filter((item) => item.to === userId);

  const handleSwitchToAddFriend = useCallback(() => {
    setActiveKey('add');
  }, []);

  const renderContent = () => {
    switch (activeKey) {
      case 'sent':
        return <RequestSend requests={send} />;
      case 'received':
        return <RequestReceived requests={received} />;
      case 'add':
        return <AddFriend />;
      default:
        return <FriendList onSwitchToAddFriend={handleSwitchToAddFriend} />;
    }
  };

  return (
    <div className={styles.panel}>
      {/* 顶栏 */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>{t('好友')}</span>
      </div>

      {/* 标签栏 */}
      <div className={styles.tabs}>
        <button
          className={clsx(styles.tab, { [styles.active]: activeKey === 'all' })}
          onClick={() => setActiveKey('all')}
        >
          {t('全部')}
        </button>

        {!disableAddFriend && (
          <>
            <button
              className={clsx(styles.tab, {
                [styles.active]: activeKey === 'sent',
              })}
              onClick={() => setActiveKey('sent')}
            >
              {t('已发送')}
              {send.length > 0 && (
                <span className={styles.tabBadge}>{send.length}</span>
              )}
            </button>

            <button
              className={clsx(styles.tab, {
                [styles.active]: activeKey === 'received',
              })}
              onClick={() => setActiveKey('received')}
            >
              {t('待处理')}
              {received.length > 0 && (
                <span className={styles.tabBadge}>{received.length}</span>
              )}
            </button>

            <button
              className={clsx(styles.tab, styles.tabAdd, {
                [styles.active]: activeKey === 'add',
              })}
              onClick={() => setActiveKey('add')}
            >
              {t('添加好友')}
            </button>
          </>
        )}
      </div>

      {/* 内容区 */}
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
});
FriendPanel.displayName = 'FriendPanel';
