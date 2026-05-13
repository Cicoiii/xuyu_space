import { Markdown } from '@/components/Markdown';
import { Problem } from '@/components/Problem';
import React from 'react';
import { MarkdownInboxItem, t } from 'tailchat-shared';
import styles from '../Inbox.module.less';

interface Props {
  info: MarkdownInboxItem;
}
export const InboxMarkdownContent: React.FC<Props> = React.memo((props) => {
  const info = props.info;

  const payload = info.payload;
  if (!payload) {
    return <Problem />;
  }

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderTitle}>
          {payload.title ?? t('新消息')}
        </div>
      </div>
      <div className={styles.contentBody}>
        <Markdown raw={payload.content ?? ''} />
      </div>
    </div>
  );
});
InboxMarkdownContent.displayName = 'InboxMarkdownContent';
