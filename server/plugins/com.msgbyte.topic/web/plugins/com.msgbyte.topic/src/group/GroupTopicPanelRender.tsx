import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TopicCard } from '../components/TopicCard';
import {
  showSuccessToasts,
  useAsyncRequest,
  useGlobalSocketEvent,
  useGroupPanelContext,
} from '@capital/common';
import {
  Button,
  LoadingOnFirst,
} from '@capital/component';
import { request } from '../request';
import { Translate } from '../translate';
import styled from 'styled-components';
import { useTopicStore } from '../store';
import type { GroupTopic } from '../types';
import { TopicComposer } from '../components/TopicComposer';

const Root = styled(LoadingOnFirst)`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  padding: 12px;
  background: var(--tc-content-background-color);

  .topic-composer-wrap {
    max-width: 760px;
    width: 100%;
    margin: 0 auto 12px;
  }

  .list {
    height: 100%;
    overflow: auto;
    padding-bottom: 72px;
  }

  .topic-feed {
    max-width: 760px;
    width: 100%;
    margin: 0 auto;
  }

  .topic-load-more {
    display: flex;
    justify-content: center;
    padding: 8px 0 16px;
  }

`;

const PAGE_SIZE = 20;

const GroupTopicPanelRender: React.FC = React.memo(() => {
  const panelInfo = useGroupPanelContext();
  const { panelId, groupId } = panelInfo;
  const {
    topicMap,
    addTopicPanel,
    addTopicItem,
    deleteTopicItem,
    updateTopicItem,
    resetTopicPanel,
  } = useTopicStore();
  const topicList = topicMap[panelId];
  const currentPageRef = useRef(1);
  const [hasMore, setHasMore] = useState(true);

  const [{ loading }, fetch] = useAsyncRequest(
    async (page = 1) => {
      if (!groupId || !panelId) {
        return [];
      }

      const { data: list } = await request.post('list', {
        groupId,
        panelId,
        page,
        size: PAGE_SIZE,
      });

      if (Array.isArray(list)) {
        addTopicPanel(panelId, list);
        if (page === 1) {
          setHasMore(true);
        }
        if (list.length !== PAGE_SIZE) {
          // 没有更多了
          setHasMore(false);
        }
      }
    },
    [groupId, panelId, addTopicPanel]
  );

  useEffect(() => {
    /**
     * 加载的时候获取列表
     */
    fetch();

    return () => {
      // 因为监听更新只在当前激活的面板中监听，还没添加到全局，因此为了保持面板状态需要清理面板状态
      // TODO: 增加群组级别的更新监听新增后可以移除
      resetTopicPanel(panelId);
    };
  }, []);

  const handleLoadMore = useCallback(() => {
    currentPageRef.current += 1;
    fetch(currentPageRef.current);
  }, [fetch]);

  useGlobalSocketEvent(
    'plugin:com.msgbyte.topic.create',
    (topic: GroupTopic) => {
      /**
       * 仅处理当前面板的话题更新
       */
      if (topic.panelId === panelId) {
        addTopicItem(panelId, topic);
      }
    }
  );

  useGlobalSocketEvent(
    'plugin:com.msgbyte.topic.delete',
    (info: { panelId: string; topicId: string }) => {
      /**
       * 仅处理当前面板的话题更新
       */
      if (info.panelId === panelId) {
        deleteTopicItem(panelId, info.topicId);
      }
    }
  );

  useGlobalSocketEvent(
    'plugin:com.msgbyte.topic.update',
    (topic: GroupTopic) => {
      /**
       * 仅处理当前面板的话题更新
       */
      if (topic.panelId === panelId) {
        updateTopicItem(panelId, topic);
      }
    }
  );

  const handleCreateTopic = useCallback(
    async ({ content, images }: { content: string; images: string[] }) => {
      const { data: topic } = await request.post('create', {
        groupId,
        panelId,
        content,
        images,
      });

      if (topic) {
        addTopicItem(panelId, topic);
      }

      showSuccessToasts();
    },
    [groupId, panelId, addTopicItem]
  );

  return (
    <Root spinning={loading}>
      <div className="topic-composer-wrap">
        <TopicComposer onCreate={handleCreateTopic} />
      </div>

      <div className="list">
        <div className="topic-feed">
          {Array.isArray(topicList) &&
            topicList.map((item) => <TopicCard key={item._id} topic={item} />)}

          <div className="topic-load-more">
            {Array.isArray(topicList) && topicList.length > 0 && hasMore ? (
              <Button type="link" disabled={loading} onClick={handleLoadMore}>
                {loading ? Translate.loading : Translate.loadMore}
              </Button>
            ) : Array.isArray(topicList) && topicList.length > 0 ? (
              <Button type="link" disabled={true} onClick={handleLoadMore}>
                {Translate.noMore}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Root>
  );
});
GroupTopicPanelRender.displayName = 'GroupTopicPanelRender';

export default GroupTopicPanelRender;
