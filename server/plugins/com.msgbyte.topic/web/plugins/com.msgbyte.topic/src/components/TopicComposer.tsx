import {
  showToasts,
  showErrorToasts,
  useAsyncRequest,
  useCurrentUserInfo,
} from '@capital/common';
import { Button, TextArea, UserAvatar } from '@capital/component';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';
import { Translate } from '../translate';
import {
  getClipboardImageFile,
  openImageFile,
  uploadTopicImage,
} from '../utils';
import { TopicImageComposer } from './TopicImageComposer';
import { TopicAssistantTools } from './TopicAssistantTools';

const Root = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--tc-border-color);
  border-radius: 8px;
  background: var(--tc-surface-panel-color);
  color: var(--tc-text-color);

  .composer-avatar {
    flex: 0 0 auto;
    padding-top: 2px;
  }

  .composer-body {
    flex: 1;
    min-width: 0;
  }

  .composer-input {
    resize: none;
    border: 0;
    box-shadow: none;
    padding: 0;
    background: transparent;
    color: var(--tc-text-color);
    font-size: 14px;
    line-height: 1.6;

    &:focus {
      border: 0;
      box-shadow: none;
    }

    &::placeholder {
      color: var(--tc-text-muted-color);
    }
  }
`;

export interface TopicComposerRef {
  focus: () => void;
}

export const TopicComposer = React.memo(
  forwardRef<
    TopicComposerRef,
    {
      onCreate: (payload: {
        content: string;
        images: string[];
      }) => Promise<void>;
    }
  >((props, ref) => {
    const [text, setText] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const inputRef = useRef<any>(null);
    const userId = useCurrentUserInfo()._id;

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus?.();
      },
    }));

    const [{ loading }, handleCreate] = useAsyncRequest(async () => {
      const content = text.trim();

      if (!content && images.length === 0) {
        return;
      }

      await props.onCreate({
        content,
        images,
      });

      setText('');
      setImages([]);
      inputRef.current?.focus?.();
    }, [text, images, props.onCreate]);

    const [{ loading: uploading }, handleUploadImage] = useAsyncRequest(
      async () => {
        const file = await openImageFile();
        if (!file) {
          return;
        }

        try {
          const imageUrl = await uploadTopicImage(file);
          setImages((value) => [...value, imageUrl]);
          showToasts(Translate.uploadImage, 'success');
        } catch (err) {
          showErrorToasts(err);
        }
      },
      []
    );

    const handlePaste = async (e: React.ClipboardEvent) => {
      const file = getClipboardImageFile(e);
      if (!file) {
        return;
      }

      e.preventDefault();
      try {
        const imageUrl = await uploadTopicImage(file);
        setImages((value) => [...value, imageUrl]);
        showToasts(Translate.uploadImage, 'success');
      } catch (err) {
        showErrorToasts(err);
      }
    };

    return (
      <Root>
        <div className="composer-avatar">
          <UserAvatar userId={userId} size={36} />
        </div>

        <div className="composer-body">
          <TextArea
            ref={inputRef}
            className="composer-input"
            autoSize={{ minRows: 2, maxRows: 8 }}
            placeholder={Translate.createPlaceholder}
            value={text}
            maxLength={2000}
            showCount={false}
            onChange={(e) => setText(e.target.value)}
            onPaste={handlePaste}
          />

          <TopicImageComposer
            images={images}
            uploading={uploading}
            onUploadImage={handleUploadImage}
            onRemoveImage={(index) =>
              setImages((value) => value.filter((_, i) => i !== index))
            }
            action={
              <>
                <TopicAssistantTools value={text} onApply={setText} />
                <Button
                  type="primary"
                  loading={loading}
                  disabled={!text.trim() && images.length === 0}
                  onClick={handleCreate}
                >
                  {Translate.publish}
                </Button>
              </>
            }
          />
        </div>
      </Root>
    );
  })
);
TopicComposer.displayName = 'TopicComposer';
