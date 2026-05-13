import { MessageHighlightContainer } from '@/components/ChatBox/ChatMessageList/MessageHighlightContainer';
import { NormalMessageList } from '@/components/ChatBox/ChatMessageList/NormalList';
import { JumpToConverseButton } from '@/components/JumpToButton';
import { Problem } from '@/components/Problem';
import React from 'react';
import {
  MessageInboxItem,
  model,
  showErrorToasts,
  t,
  useAsync,
} from 'tailchat-shared';
import styles from '../Inbox.module.less';

interface Props {
  info: MessageInboxItem;
}
export const InboxMessageContent: React.FC<Props> = React.memo((props) => {
  const info = props.info;

  const payload = info.message ?? info.payload;
  if (!payload) {
    return <Problem />;
  }
  const { groupId, converseId, messageId } = payload;

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderTitle}>
          {t('提及我的消息')}
        </div>
      </div>
      <div className={styles.contentBody}>
        <NearbyMessages
          groupId={groupId}
          converseId={converseId}
          messageId={messageId}
        />
      </div>

      <JumpToConverseButton groupId={groupId} converseId={converseId} />
    </div>
  );
});
InboxMessageContent.displayName = 'InboxMessageContent';

export const NearbyMessages: React.FC<{
  groupId?: string;
  converseId: string;
  messageId: string;
}> = React.memo((props) => {
  const { value = [], loading } = useAsync(async () => {
    try {
      const list = await model.message.fetchNearbyMessage({
        groupId: props.groupId,
        converseId: props.converseId,
        messageId: props.messageId,
      });

      return list;
    } catch (err) {
      showErrorToasts(err);
      console.error(err);
    }
  }, [props.converseId, props.messageId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
        ...
      </div>
    );
  }

  return (
    <MessageHighlightContainer messageId={props.messageId}>
      <NormalMessageList
        messages={value}
        isLoadingMore={false}
        hasMoreMessage={false}
        onLoadMore={async () => {}}
      />
    </MessageHighlightContainer>
  );
});
NearbyMessages.displayName = 'NearbyMessages';
