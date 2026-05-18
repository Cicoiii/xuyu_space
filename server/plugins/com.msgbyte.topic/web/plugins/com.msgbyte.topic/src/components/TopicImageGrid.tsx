import { parseUrlStr } from '@capital/common';
import { Image } from '@capital/component';
import React from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(88px, 128px));
  gap: 6px;
  max-width: 400px;
  margin-top: 8px;

  .topic-image-preview-item & {
    display: block;
    margin-top: 0;
  }

  .topic-image {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid var(--tc-border-soft-color);
    background: var(--tc-surface-soft-color);

    .ant-image,
    img {
      width: 100%;
      height: 100%;
      display: block;
    }

    img {
      object-fit: cover;
    }
  }
`;

export const TopicImageGrid: React.FC<{
  images?: string[];
}> = React.memo((props) => {
  const images = (props.images ?? []).filter(Boolean);

  if (images.length === 0) {
    return null;
  }

  return (
    <Root>
      {images.map((image, index) => (
        <div className="topic-image" key={`${image}-${index}`}>
          <Image preview={true} src={parseUrlStr(image)} />
        </div>
      ))}
    </Root>
  );
});
TopicImageGrid.displayName = 'TopicImageGrid';
