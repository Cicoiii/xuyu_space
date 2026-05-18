import React from 'react';
import _get from 'lodash/get';
import type { LinkMeta } from './types';
import { parseUrlStr } from '@capital/common';
import { Image, Icon } from '@capital/component';

function getDisplayHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (e) {
    return url;
  }
}

export const UrlMetaBase: React.FC<{
  meta: LinkMeta;
}> = React.memo(({ meta }) => {
  const imageUrl = _get(meta, 'images.0');
  const videoUrl = _get(meta, 'videos.0');
  const siteName = _get(meta, 'siteName') || getDisplayHost(meta.url);
  const title = _get(meta, 'title') || siteName;
  const description = _get(meta, 'description');
  const favicon = _get(meta, 'favicons.0');

  return (
    <>
      <div className="basic" onClick={() => window.open(meta.url)}>
        <div className="summary">
          <div className="source">
            {favicon && (
              <img className="favicon" src={parseUrlStr(favicon)} alt="" />
            )}
            <span>{siteName}</span>
          </div>
          <div className="title">{title}</div>
          {description && <div className="description">{description}</div>}
          <div className="url">
            <span>{getDisplayHost(meta.url)}</span>
            <Icon icon="mdi:open-in-new" />
          </div>
        </div>
        {imageUrl && (
          <div className="image">
            <Image preview={true} src={parseUrlStr(imageUrl)} />
          </div>
        )}
      </div>
      {videoUrl && (
        <div className="video">
          <div
            className="openfull"
            onClick={(e) => {
              e.stopPropagation();
              window.open(videoUrl);
            }}
          >
            <Icon icon="mdi:open-in-new" />
          </div>
          <iframe src={videoUrl} />
        </div>
      )}
    </>
  );
});
UrlMetaBase.displayName = 'UrlMetaBase';
