import type { AvatarProps } from 'antd';
import clsx from 'clsx';
import _isEmpty from 'lodash/isEmpty';
import React from 'react';
import { Avatar } from 'tailchat-design';
import {
  useCachedOnlineStatus,
  useCachedUserInfo,
  UserBaseInfo,
} from 'tailchat-shared';
import { UserPopover } from './popover/UserPopover';
import { TcPopover } from './TcPopover';

interface UserAvatarProps extends AvatarProps {
  userId: string;
  popover?: boolean;
}

/**
 * 用户头像组件
 */
export const UserAvatar: React.FC<UserAvatarProps> = React.memo((props) => {
  const { userId, popover = true, ...avatarProps } = props;
  const cachedUserInfo = useCachedUserInfo(userId);
  const [isOnline] = useCachedOnlineStatus([userId]);

  const avatar = (
    <Avatar
      {...avatarProps}
      className={clsx(avatarProps.className, { 'cursor-pointer': popover })}
      src={cachedUserInfo.avatar}
      name={cachedUserInfo.nickname}
      isOnline={isOnline}
    />
  );

  if (!popover) {
    return avatar;
  }

  return (
    <TcPopover
      content={
        !_isEmpty(cachedUserInfo) && (
          <UserPopover userInfo={cachedUserInfo as UserBaseInfo} />
        )
      }
      placement="top"
      trigger="click"
    >
      {avatar}
    </TcPopover>
  );
});
UserAvatar.displayName = 'UserAvatar';
