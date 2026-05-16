import { Icon } from 'tailchat-design';
import type { MenuProps } from 'antd';
import React, { useCallback } from 'react';
import {
  ChatMessage,
  deleteMessage,
  clearConverseMessages,
  PERMISSION,
  recallMessage,
  sharedEvent,
  showSuccessToasts,
  t,
  useAsyncRequest,
  useChatBoxContext,
  useGroupInfoContext,
  useHasGroupPermission,
  useUserInfo,
  useUserId,
} from 'tailchat-shared';
import { openReconfirmModalP } from '@/components/Modal';
import copy from 'copy-to-clipboard';
import { getMessageTextDecorators } from '@/plugin/common';
import _compact from 'lodash/compact';

/**
 * 消息的会话操作
 */
export function useChatMessageItemAction(
  payload: ChatMessage,
  options: { onClick?: () => void }
): MenuProps {
  const context = useChatBoxContext();
  const groupInfo = useGroupInfoContext();
  const userInfo = useUserInfo();
  const currentUserId = useUserId();

  const [hasDeleteMessagePermission] = useHasGroupPermission(
    groupInfo?._id ?? '',
    [PERMISSION.core.deleteMessage]
  );

  const handleCopy = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      // 复制选中的文本
      copy(selection.toString());
      showSuccessToasts(t('复制选中文本成功'));
      return;
    }

    copy(getMessageTextDecorators().serialize(payload.content));
    showSuccessToasts(t('复制消息文本成功'));
  }, [payload.content]);

  const [, handleRecallMessage] = useAsyncRequest(async () => {
    if (await openReconfirmModalP()) {
      await recallMessage(payload._id);
      showSuccessToasts(t('消息撤回成功'));
    }
  }, [payload._id]);

  const [, handleDeleteMessage] = useAsyncRequest(async () => {
    if (await openReconfirmModalP({
      title: t('确认删除'),
      content: t('删除后消息将对所有成员隐藏，是否继续？'),
      okText: t('删除'),
      okButtonProps: { danger: true },
    })) {
      await deleteMessage(payload._id);
      showSuccessToasts(t('消息删除成功'));
    }
  }, [payload._id]);

  const [, handleClearLocalMessages] = useAsyncRequest(async () => {
    await clearConverseMessages(payload.converseId, 'local');
    showSuccessToasts(t('已清空本地消息'));
  }, [payload.converseId]);

  const isGroupOwner = groupInfo && groupInfo.owner === userInfo?._id;
  const isMessageAuthor = payload.author === currentUserId;

  // 权限判断：
  // 1. 群主：可以删除任何消息
  // 2. 有 deleteMessage 权限的管理员：可以删除任何消息
  // 3. 消息作者：可以删除自己的消息
  const canDeleteGlobal = isGroupOwner || hasDeleteMessagePermission || isMessageAuthor;

  return {
    onClick: options.onClick,
    items: _compact([
      {
        key: 'copy',
        label: t('复制'),
        icon: <Icon icon="mdi:content-copy" />,
        onClick: handleCopy,
      },
      context.hasContext && {
        key: 'reply',
        label: t('回复'),
        icon: <Icon icon="mdi:reply" />,
        onClick: () => sharedEvent.emit('replyMessage', payload),
      },
      // 撤回：作者或群主可在15分钟内撤回
      (isGroupOwner || isMessageAuthor) && !payload.hasRecall && {
        key: 'recall',
        label: t('撤回'),
        icon: <Icon icon="mdi:restore" />,
        onClick: handleRecallMessage,
      },
      // 清空本地消息
      {
        key: 'clearLocal',
        label: t('清空本地消息'),
        icon: <Icon icon="mdi:broom" />,
        onClick: handleClearLocalMessages,
      },
      // 全局删除（对所有人生效）
      canDeleteGlobal && {
        key: 'delete',
        label: t('删除消息'),
        danger: true,
        icon: <Icon icon="mdi:delete-outline" />,
        onClick: handleDeleteMessage,
      },
    ] as MenuProps['items']),
  };
}
