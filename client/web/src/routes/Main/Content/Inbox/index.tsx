import React from 'react';
import { Route, Routes } from 'react-router';
import { t } from 'tailchat-shared';
import { PageContent } from '../PageContent';
import { InboxContent } from './Content';
import { InboxSidebar } from './Sidebar';
import styles from './Inbox.module.less';
import { Icon } from 'tailchat-design';

export const Inbox: React.FC = React.memo(() => {
  return (
    <PageContent data-tc-role="content-inbox" sidebar={<InboxSidebar />}>
      <Routes>
        <Route path="/:inboxItemId" element={<InboxContent />} />
        <Route path="/" element={<InboxNoSelect />} />
      </Routes>
    </PageContent>
  );
});
Inbox.displayName = 'Inbox';

const InboxNoSelect: React.FC = React.memo(() => {
  return (
    <div className={styles.emptyState}>
      <Icon className={styles.emptyIcon} icon="mdi:email-outline" />
      <div className={styles.emptyTitle}>{t('收件箱')}</div>
      <div className={styles.emptyDesc}>
        {t('提及(@)您的消息会在这里出现哦')}
      </div>
    </div>
  );
});
InboxNoSelect.displayName = 'InboxNoSelect';
