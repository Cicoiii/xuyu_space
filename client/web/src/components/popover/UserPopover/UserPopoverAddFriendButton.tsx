import { IconBtn } from '@/components/IconBtn';
import { useTcPopoverContext } from '@/components/TcPopover';
import { Tooltip } from 'antd';
import React from 'react';
import {
  addFriendRequest,
  showToasts,
  t,
  useAppSelector,
  useAsyncRequest,
  useGlobalConfigStore,
  useUserId,
} from 'tailchat-shared';

export const UserPopoverAddFriendButton: React.FC<{
  userId: string;
}> = React.memo((props) => {
  const targetUserId = props.userId;
  const currentUserId = useUserId();
  const disableAddFriend = useGlobalConfigStore(
    (state) => state.disableAddFriend
  );
  const isFriend = useAppSelector((state) =>
    state.user.friends.some((friend) => friend.id === targetUserId)
  );
  const hasFriendRequest = useAppSelector((state) =>
    state.user.friendRequests.some(
      (request) =>
        (request.from === currentUserId && request.to === targetUserId) ||
        (request.from === targetUserId && request.to === currentUserId)
    )
  );
  const { closePopover } = useTcPopoverContext();

  const canAddFriend =
    !disableAddFriend &&
    currentUserId !== targetUserId &&
    !isFriend &&
    !hasFriendRequest;

  const [{ loading }, handleAddFriend] = useAsyncRequest(async () => {
    await addFriendRequest(targetUserId);
    showToasts(t('已发送申请'), 'success');
    closePopover();
  }, [targetUserId, closePopover]);

  if (!canAddFriend) {
    return null;
  }

  return (
    <Tooltip title={t('申请好友')}>
      <IconBtn
        icon="mdi:account-plus-outline"
        loading={loading}
        onClick={handleAddFriend}
      />
    </Tooltip>
  );
});
UserPopoverAddFriendButton.displayName = 'UserPopoverAddFriendButton';
