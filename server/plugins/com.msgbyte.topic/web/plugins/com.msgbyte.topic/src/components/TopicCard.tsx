import React, { useMemo, useReducer, useState } from 'react';
import {
  getMessageRender,
  showMessageTime,
  showErrorToasts,
  showSuccessToasts,
  showToasts,
  useAsyncRequest,
  useCurrentUserInfo,
  useGroupInfo,
} from '@capital/common';
import {
  IconBtn,
  TextArea,
  UserName,
  UserAvatar,
  MessageAckContainer,
  Popconfirm,
  Button,
} from '@capital/component';
import styled from 'styled-components';
import type { GroupTopic } from '../types';
import { Translate } from '../translate';
import { request } from '../request';
import { TopicComments } from './TopicComments';
import {
  extractContentImages,
  getClipboardImageFile,
  openImageFile,
  uploadTopicImage,
} from '../utils';
import { TopicImageGrid } from './TopicImageGrid';
import { TopicImageComposer } from './TopicImageComposer';
import { TopicAssistantTools } from './TopicAssistantTools';
import { useTopicStore } from '../store';

const Root = styled.div`
  background: var(--tc-surface-panel-color);
  color: var(--tc-text-color);
  border: 1px solid var(--tc-border-color);
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 10px;
  width: auto;
  display: flex;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &:hover {
    border-color: var(--tc-primary-light-strong-color);
  }

  .left {
    margin-right: 12px;
  }

  .right {
    flex: 1;
    user-select: text;

    .header {
      display: flex;
      align-items: baseline;
      line-height: 22px;
      gap: 6px;

      .name {
        font-weight: 600;
        color: var(--tc-text-color);
      }

      .date {
        color: var(--tc-text-muted-color);
        font-size: 12px;
      }
    }

    .body {
      .content {
        margin-top: 6px;
        color: var(--tc-text-color);
        line-height: 1.65;
        white-space: pre-wrap;
        word-break: break-word;
      }
    }

    .footer {
      display: flex;
      gap: 6px;
      align-items: center;
      margin-top: 10px;
      color: var(--tc-text-secondary-color);

      .count {
        font-size: 12px;
        color: var(--tc-text-muted-color);
        margin-right: 6px;
      }
    }
  }
`;

const ReplyBox = styled.div`
  padding: 10px;
  margin-top: 10px;
  border: 1px solid var(--tc-border-soft-color);
  border-radius: 8px;
  background: var(--tc-surface-soft-color);

  .dark & {
    background: var(--tc-surface-soft-color);
  }

  .reply-input {
    resize: none;
    border: 0;
    box-shadow: none;
    padding: 0;
    background: transparent;
    color: var(--tc-text-color);

    &:focus {
      border: 0;
      box-shadow: none;
    }
  }
`;

export const TopicCard: React.FC<{
  topic: GroupTopic;
}> = React.memo((props) => {
  const topic: Partial<GroupTopic> = props.topic ?? {};
  const [showReply, toggleShowReply] = useReducer((state) => !state, false);
  const [comment, setComment] = useState('');
  const [commentImages, setCommentImages] = useState<string[]>([]);
  const groupInfo = useGroupInfo(topic.groupId);
  const groupOwnerId = groupInfo?.owner;
  const userId = useCurrentUserInfo()._id;
  const updateTopicItem = useTopicStore((state) => state.updateTopicItem);
  const upvotes = topic.upvotes ?? [];
  const hasUpvoted = upvotes.includes(userId);
  const topicContent = useMemo(() => {
    const { text, images } = extractContentImages(topic.content);

    return {
      text,
      images: [...images, ...(topic.images ?? [])],
    };
  }, [topic.content, topic.images]);

  const [{ loading }, handleComment] = useAsyncRequest(async () => {
    const content = comment.trim();

    if (!content && commentImages.length === 0) {
      return;
    }

    const { data: updatedTopic } = await request.post('createComment', {
      groupId: topic.groupId,
      panelId: topic.panelId,
      topicId: topic._id,
      content,
      images: commentImages,
    });

    if (updatedTopic && topic.panelId) {
      updateTopicItem(topic.panelId, updatedTopic);
    }

    setComment('');
    setCommentImages([]);
    toggleShowReply();
    showSuccessToasts();
  }, [
    topic.groupId,
    topic.panelId,
    topic._id,
    comment,
    commentImages,
    updateTopicItem,
  ]);

  const [{ loading: upvoting }, handleTopicUpvote] = useAsyncRequest(
    async () => {
      await request.post('toggleTopicUpvote', {
        groupId: topic.groupId,
        panelId: topic.panelId,
        topicId: topic._id,
      });
    },
    [topic.groupId, topic.panelId, topic._id]
  );

  const [{ loading: uploading }, handleUploadReplyImage] = useAsyncRequest(
    async () => {
      const file = await openImageFile();
      if (!file) {
        return;
      }

      try {
        const imageUrl = await uploadTopicImage(file);
        setCommentImages((value) => [...value, imageUrl]);
        showToasts(Translate.uploadImage, 'success');
      } catch (err) {
        showErrorToasts(err);
      }
    },
    []
  );

  const handlePasteReply = async (e: React.ClipboardEvent) => {
    const file = getClipboardImageFile(e);
    if (!file) {
      return;
    }

    e.preventDefault();
    try {
      const imageUrl = await uploadTopicImage(file);
      setCommentImages((value) => [...value, imageUrl]);
      showToasts(Translate.uploadImage, 'success');
    } catch (err) {
      showErrorToasts(err);
    }
  };

  const [, handleDeleteTopic] = useAsyncRequest(async () => {
    await request.post('delete', {
      groupId: topic.groupId,
      panelId: topic.panelId,
      topicId: topic._id,
    });
  }, []);

  return (
    <MessageAckContainer converseId={topic.panelId} messageId={topic._id}>
      <Root>
        <div className="left">
          <UserAvatar userId={topic.author} />
        </div>

        <div className="right">
          <div className="header">
            <div className="name">
              <UserName userId={topic.author} />
            </div>
            <div className="date">{showMessageTime(topic.createdAt)}</div>
          </div>

          <div className="body">
            {topicContent.text && (
              <div className="content">{getMessageRender(topicContent.text)}</div>
            )}
            <TopicImageGrid images={topicContent.images} />

            {Array.isArray(topic.comments) && topic.comments.length > 0 && (
              <TopicComments
                topic={topic as GroupTopic}
                currentUserId={userId}
              />
            )}
          </div>

          <div className="footer">
            <IconBtn
              title={hasUpvoted ? Translate.cancelUpvote : Translate.upvote}
              icon={hasUpvoted ? 'mdi:thumb-up' : 'mdi:thumb-up-outline'}
              active={hasUpvoted}
              disabled={upvoting}
              onClick={handleTopicUpvote}
            />
            {upvotes.length > 0 && <span className="count">{upvotes.length}</span>}

            <IconBtn
              title={Translate.reply}
              icon="mdi:message-reply-text-outline"
              onClick={toggleShowReply}
            />

            {userId === groupOwnerId && (
              <Popconfirm
                title={Translate.topicDeleteConfimTip}
                onConfirm={handleDeleteTopic}
              >
                <IconBtn title={Translate.delete} icon="mdi:delete-outline" />
              </Popconfirm>
            )}
          </div>

          {showReply && (
            <ReplyBox>
              <TextArea
                autoFocus
                className="reply-input"
                placeholder={Translate.replyThisTopic}
                disabled={loading}
                value={comment}
                autoSize={{ minRows: 2, maxRows: 6 }}
                maxLength={1000}
                showCount={false}
                onChange={(e) => setComment(e.target.value)}
                onPaste={handlePasteReply}
                onPressEnter={handleComment}
              />
              <TopicImageComposer
                images={commentImages}
                uploading={uploading}
                onUploadImage={handleUploadReplyImage}
                onRemoveImage={(index) =>
                  setCommentImages((value) =>
                    value.filter((_, i) => i !== index)
                  )
                }
                action={
                  <>
                    <TopicAssistantTools value={comment} onApply={setComment} />
                    <Button
                      type="primary"
                      loading={loading}
                      disabled={!comment.trim() && commentImages.length === 0}
                      onClick={handleComment}
                    >
                      {Translate.reply}
                    </Button>
                  </>
                }
              />
            </ReplyBox>
          )}
        </div>
      </Root>
    </MessageAckContainer>
  );
});
TopicCard.displayName = 'TopicCard';
