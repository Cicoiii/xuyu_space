import { getMessageRender } from '@capital/common';
import { IconBtn, UserAvatar, UserName } from '@capital/component';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import type { GroupTopic } from '../types';
import _takeRight from 'lodash/takeRight';
import { Translate } from '../translate';
import { request } from '../request';
import { extractContentImages } from '../utils';
import { TopicImageGrid } from './TopicImageGrid';

const Root = styled.div`
  padding: 10px 0 0;
  margin-top: 10px;
  border-top: 1px solid var(--tc-border-soft-color);

  .show-more {
    font-size: 12px;
    cursor: pointer;
    color: var(--tc-primary-color);
    margin-bottom: 8px;

    &:hover {
      color: var(--tc-primary-hover-color);
    }
  }

  .comment-item {
    display: flex;
    gap: 8px;
    padding: 8px 0;

    .left {
      flex: 0 0 auto;
    }

    .right {
      flex: 1;
      min-width: 0;

      .username {
        font-weight: bold;
        line-height: 24px;
        color: var(--tc-text-color);
      }

      .content {
        margin-top: 2px;
        color: var(--tc-text-color);
        line-height: 1.55;
        word-break: break-word;
      }

      .meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 4px;

        .badge {
          border-radius: 3px;
          padding: 1px 5px;
          font-size: 12px;
          line-height: 18px;
          background: var(--tc-primary-soft-color);
          color: var(--tc-primary-color);
        }

        .count {
          font-size: 12px;
          color: var(--tc-text-muted-color);
        }
      }
    }
  }
`;

/**
 * 话题评论
 */
export const TopicComments: React.FC<{
  topic: GroupTopic;
  currentUserId: string;
}> = React.memo((props) => {
  const [showAllComment, setShowAllComment] = useState(false);
  const { topic, currentUserId } = props;
  const sortedComments = useMemo(() => {
    return [...(topic.comments ?? [])].sort((a, b) => {
      if (a.pinned === b.pinned) {
        return 0;
      }

      return a.pinned ? -1 : 1;
    });
  }, [topic.comments]);
  const visibleComments = useMemo(() => {
    if (showAllComment) {
      return sortedComments;
    }

    const pinnedComments = sortedComments.filter((comment) => comment.pinned);
    const normalComments = sortedComments.filter((comment) => !comment.pinned);

    if (pinnedComments.length >= 2) {
      return pinnedComments;
    }

    return [
      ...pinnedComments,
      ..._takeRight(normalComments, 2 - pinnedComments.length),
    ];
  }, [showAllComment, sortedComments]);

  const handleCommentUpvote = (commentId: string) => {
    request.post('toggleCommentUpvote', {
      groupId: topic.groupId,
      panelId: topic.panelId,
      topicId: topic._id,
      commentId,
    });
  };

  const handleCommentPinned = (commentId: string) => {
    request.post('toggleCommentPinned', {
      groupId: topic.groupId,
      panelId: topic.panelId,
      topicId: topic._id,
      commentId,
    });
  };

  return (
    <Root>
      {sortedComments.length > 2 && !showAllComment && (
        <div className="show-more" onClick={() => setShowAllComment(true)}>
          {Translate.loadMore}...
        </div>
      )}

      {visibleComments.map((comment) => {
        const upvotes = comment.upvotes ?? [];
        const hasUpvoted = upvotes.includes(currentUserId);
        const isTopicAuthor = currentUserId === topic.author;
        const { text, images } = extractContentImages(comment.content);
        const commentImages = [...images, ...(comment.images ?? [])];

        return (
          <div key={comment.id} className="comment-item">
            <div className="left">
              <UserAvatar userId={comment.author} size={24} />
            </div>

            <div className="right">
              <div className="username">
                <UserName userId={comment.author} />
              </div>
              {text && <div className="content">{getMessageRender(text)}</div>}
              <TopicImageGrid images={commentImages} />
              <div className="meta">
                {comment.pinned && (
                  <span className="badge">{Translate.pinned}</span>
                )}
                {comment.authorLiked && (
                  <span className="badge">{Translate.authorLiked}</span>
                )}
                <IconBtn
                  size="small"
                  title={hasUpvoted ? Translate.cancelUpvote : Translate.upvote}
                  icon={hasUpvoted ? 'mdi:thumb-up' : 'mdi:thumb-up-outline'}
                  active={hasUpvoted}
                  onClick={() => handleCommentUpvote(comment.id)}
                />
                {upvotes.length > 0 && (
                  <span className="count">{upvotes.length}</span>
                )}
                {isTopicAuthor && (
                  <IconBtn
                    size="small"
                    title={
                      comment.pinned
                        ? Translate.unpinComment
                        : Translate.pinComment
                    }
                    icon={comment.pinned ? 'mdi:pin-off' : 'mdi:pin-outline'}
                    active={comment.pinned}
                    onClick={() => handleCommentPinned(comment.id)}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </Root>
  );
});
TopicComments.displayName = 'TopicComments';
