import { Button, IconBtn } from '@capital/component';
import React from 'react';
import styled from 'styled-components';
import { Translate } from '../translate';
import { TopicImageGrid } from './TopicImageGrid';

const Root = styled.div`
  margin-top: 8px;

  .topic-image-composer-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--tc-border-soft-color);
  }

  .topic-image-composer-extra {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .topic-image-preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(88px, 128px));
    gap: 6px;
    max-width: 400px;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .topic-image-preview-item {
    position: relative;
  }

  .topic-image-remove {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.45);
    color: #fff;
    border-radius: 50%;
  }
`;

export const TopicImageComposer: React.FC<{
  images: string[];
  uploading: boolean;
  onUploadImage: () => void;
  onRemoveImage: (index: number) => void;
  action?: React.ReactNode;
}> = React.memo((props) => {
  return (
    <Root>
      {props.images.length > 0 && (
        <div className="topic-image-preview">
          {props.images.map((image, index) => (
            <div className="topic-image-preview-item" key={`${image}-${index}`}>
              <TopicImageGrid images={[image]} />
              <IconBtn
                className="topic-image-remove"
                size="small"
                title={Translate.removeImage}
                icon="mdi:close"
                onClick={() => props.onRemoveImage(index)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="topic-image-composer-actions">
        <Button disabled={props.uploading} onClick={props.onUploadImage}>
          {props.uploading ? Translate.loading : Translate.uploadImage}
        </Button>
        {props.action && (
          <div className="topic-image-composer-extra">{props.action}</div>
        )}
      </div>
    </Root>
  );
});
TopicImageComposer.displayName = 'TopicImageComposer';
