import React, { useMemo, useState } from 'react';
import {
  BasicInboxItem,
  chatActions,
  InboxItem,
  isValidStr,
  model,
  t,
  useAppDispatch,
  useAsyncRequest,
  useInboxList,
} from 'tailchat-shared';
import clsx from 'clsx';
import _orderBy from 'lodash/orderBy';
import { GroupName } from '@/components/GroupName';
import { ConverseName } from '@/components/ConverseName';
import { getMessageRender, pluginInboxItemMap } from '@/plugin/common';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Dropdown } from 'antd';
import { Icon } from 'tailchat-design';
import { openReconfirmModalP } from '@/components/Modal';
import { Virtuoso } from 'react-virtuoso';
import styles from './Inbox.module.less';

const buildLink = (itemId: string) => `/main/inbox/${itemId}`;

/**
 * 收件箱侧边栏组件
 */
export const InboxSidebar: React.FC = React.memo(() => {
  const inbox = useInboxList();
  const list = useMemo(() => _orderBy(inbox, 'createdAt', 'desc'), [inbox]);
  const dispatch = useAppDispatch();

  const fullList = list;
  const unreadList = list.filter((item) => item.readed === false);

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const [, handleAllAck] = useAsyncRequest(async () => {
    unreadList.forEach((item) => {
      dispatch(chatActions.setInboxItemAck(item._id));
    });

    await model.inbox.setInboxAck(unreadList.map((item) => item._id));
  }, [unreadList]);

  const [, handleClear] = useAsyncRequest(async () => {
    const res = await openReconfirmModalP({
      title: t('确认清空收件箱么?'),
    });
    if (res) {
      await model.inbox.clearInbox();
    }
  }, [unreadList]);

  const renderInbox = (item: InboxItem) => {
    if (item.type === 'message') {
      const payload: Partial<model.inbox.InboxItem['payload']> =
        item.message ?? item.payload ?? {};
      let title: React.ReactNode = '';
      if (isValidStr(payload.groupId)) {
        title = <GroupName groupId={payload.groupId} />;
      } else if (isValidStr(payload.converseId)) {
        title = <ConverseName converseId={payload.converseId} />;
      }

      return (
        <InboxSidebarItem
          key={item._id}
          title={title}
          desc={getMessageRender(payload.messageSnippet ?? '')}
          source={'序语空间'}
          readed={item.readed}
          to={buildLink(item._id)}
        />
      );
    }

    if (item.type === 'markdown') {
      const payload: Partial<model.inbox.InboxItem['payload']> =
        item.payload ?? {};
      const title = payload.title || t('新消息');

      return (
        <InboxSidebarItem
          key={item._id}
          title={title}
          desc={t('点击查看详情')}
          source={payload.source ?? '序语空间'}
          readed={item.readed}
          to={buildLink(item._id)}
        />
      );
    }

    // For plugins
    const _item = item as BasicInboxItem;
    if (pluginInboxItemMap[_item.type]) {
      const info = pluginInboxItemMap[_item.type];
      const preview = info.getPreview(_item);

      return (
        <InboxSidebarItem
          key={_item._id}
          title={preview.title}
          desc={preview.desc}
          source={info.source ?? 'Unknown'}
          readed={_item.readed}
          to={buildLink(_item._id)}
        />
      );
    }

    return null;
  };

  const displayList = activeTab === 'unread' ? unreadList : fullList;

  return (
    <div className={styles.sidebarWrapper} data-tc-role="sidebar-inbox">
      {/* 顶栏 */}
      <div className={styles.sidebarHeader}>
        <div className={styles.headerTitle}>{t('收件箱')}</div>
        <div className={styles.headerActions}>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'readAll',
                  label: t('所有已读'),
                  onClick: handleAllAck,
                },
                {
                  key: 'clear',
                  label: t('清空收件箱'),
                  danger: true,
                  onClick: handleClear,
                },
              ],
            }}
            trigger={['click']}
          >
            <div className={styles.headerActionBtn}>
              <Icon icon="mdi:dots-horizontal" />
            </div>
          </Dropdown>
        </div>
      </div>

      {/* 标签切换 */}
      <div className={styles.tabs}>
        <div
          className={clsx(styles.tab, {
            [styles.tabActive]: activeTab === 'all',
          })}
          onClick={() => setActiveTab('all')}
        >
          {t('全部')}
        </div>
        <div
          className={clsx(styles.tab, {
            [styles.tabActive]: activeTab === 'unread',
          })}
          onClick={() => setActiveTab('unread')}
        >
          {t('未读')}
          {unreadList.length > 0 && (
            <span className={styles.tabBadge}>{unreadList.length}</span>
          )}
        </div>
      </div>

      {/* 列表 */}
      <div className={styles.listArea}>
        <Virtuoso
          data={displayList}
          itemContent={(index, item) => renderInbox(item)}
        />
      </div>
    </div>
  );
});
InboxSidebar.displayName = 'InboxSidebar';

const InboxSidebarItem: React.FC<{
  title: React.ReactNode;
  desc: React.ReactNode;
  source: string;
  readed: boolean;
  to: string;
}> = React.memo((props) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(props.to);

  return (
    <Link to={props.to} style={{ textDecoration: 'none' }}>
      <div
        className={clsx(styles.inboxItem, {
          [styles.active]: isActive,
        })}
      >
        {/* 未读指示条 */}
        {!props.readed && <div className={styles.unreadBar} />}

        <div className={styles.itemTitle}>
          {props.title || <span>&nbsp;</span>}
        </div>
        <div className={styles.itemDesc}>{props.desc}</div>
        <div className={styles.itemSource}>
          {t('来自')}: {props.source}
        </div>
      </div>
    </Link>
  );
});
InboxSidebarItem.displayName = 'InboxSidebarItem';
