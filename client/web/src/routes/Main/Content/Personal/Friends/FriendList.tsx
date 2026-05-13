import React, { useMemo } from 'react';
import {
  createDMConverse,
  isValidStr,
  removeFriend,
  showAlert,
  showErrorToasts,
  showToasts,
  t,
  useAppDispatch,
  useAppSelector,
  useAsyncRequest,
  useEvent,
  useGlobalConfigStore,
  useUserInfoList,
  useUserSearch,
  userActions,
  useCachedUserInfo,
  useCachedOnlineStatus,
  useFriendNickname,
} from 'tailchat-shared';
import { closeModal, openModal } from '@/components/Modal';
import { SetFriendNickname } from '@/components/modals/SetFriendNickname';
import { Icon, Avatar } from 'tailchat-design';
import { Virtuoso } from 'react-virtuoso';
import { Dropdown } from 'antd';
import { useNavigate } from 'react-router';
import styles from './Friends.module.less';

/**
 * 好友行项
 */
const FriendRow: React.FC<{
  userId: string;
  onMessage: (userId: string) => void;
  onSetNickname: (userId: string) => void;
  onRemove: (userId: string) => void;
}> = React.memo((props) => {
  const userInfo = useCachedUserInfo(props.userId);
  const [isOnline] = useCachedOnlineStatus([props.userId]);
  const friendNickname = useFriendNickname(props.userId);

  return (
    <div className={styles.friendItem}>
      <div className={styles.friendAvatar}>
        <Avatar
          src={userInfo.avatar}
          name={userInfo.nickname}
          isOnline={isOnline}
        />
      </div>

      <div className={styles.friendInfo}>
        <span className={styles.friendName}>
          {userInfo.nickname}
          <span className={styles.friendDiscriminator}>
            #{userInfo.discriminator}
          </span>
          {isValidStr(friendNickname) && (
            <span className={styles.friendNickname}>
              ({friendNickname})
            </span>
          )}
        </span>
      </div>

      <div className={styles.friendActions}>
        <button
          className={styles.actionBtn}
          title={t('发送消息')}
          onClick={() => props.onMessage(props.userId)}
        >
          <Icon icon="mdi:message-text-outline" />
        </button>

        <Dropdown
          menu={{
            items: [
              {
                key: 'setNickname',
                onClick: () => props.onSetNickname(props.userId),
                label: isValidStr(friendNickname)
                  ? t('更改好友昵称')
                  : t('添加好友昵称'),
              },
              {
                key: 'delete',
                danger: true,
                onClick: () => props.onRemove(props.userId),
                label: t('删除'),
              },
            ],
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <button className={styles.actionBtn}>
            <Icon icon="mdi:dots-vertical" />
          </button>
        </Dropdown>
      </div>
    </div>
  );
});
FriendRow.displayName = 'FriendRow';

/**
 * 好友列表
 */
export const FriendList: React.FC<{
  onSwitchToAddFriend: () => void;
}> = React.memo((props) => {
  const friends = useAppSelector((state) => state.user.friends);
  const friendIds = useMemo(() => friends.map((f) => f.id), [friends]);
  const userInfos = useUserInfoList(friendIds);
  const { searchText, setSearchText, searchResult } = useUserSearch(userInfos);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const disableAddFriend = useGlobalConfigStore(
    (state) => state.disableAddFriend
  );

  const [, handleCreateConverse] = useAsyncRequest(
    async (targetId: string) => {
      const converse = await createDMConverse([targetId]);
      navigate(`/main/personal/converse/${converse._id}`);
    },
    [navigate]
  );

  const handleSetFriendNickname = useEvent(async (userId: string) => {
    const key = openModal(
      <SetFriendNickname
        userId={userId}
        onSuccess={() => {
          closeModal(key);
        }}
      />
    );
  });

  const handleRemoveFriend = useEvent(async (targetId: string) => {
    showAlert({
      message: t(
        '是否要从自己的好友列表中删除对方? 注意:你不会从对方的好友列表消失'
      ),
      onConfirm: async () => {
        try {
          await removeFriend(targetId);
          showToasts(t('好友删除成功'), 'success');
          dispatch(userActions.removeFriend(targetId));
        } catch (err) {
          showErrorToasts(err);
        }
      },
    });
  });

  if (friends.length === 0) {
    return (
      <div className={styles.empty}>
        <Icon icon="mdi:account-group-outline" className={styles.emptyIcon} />
        <span>{t('暂无好友')}</span>
        {!disableAddFriend && (
          <button
            className={styles.emptyAction}
            onClick={props.onSwitchToAddFriend}
          >
            {t('立即添加')}
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className={styles.searchBar}>
        <Icon icon="mdi:magnify" className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder={t('搜索好友')}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Virtuoso
        style={{ height: 'calc(100% - 50px)' }}
        data={searchResult}
        itemContent={(index, item) => (
          <FriendRow
            key={item._id}
            userId={item._id}
            onMessage={handleCreateConverse}
            onSetNickname={handleSetFriendNickname}
            onRemove={handleRemoveFriend}
          />
        )}
      />
    </>
  );
});
FriendList.displayName = 'FriendList';
