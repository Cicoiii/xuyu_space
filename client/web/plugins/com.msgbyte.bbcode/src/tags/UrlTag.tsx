import { Link } from '@capital/component';
import React from 'react';
import styled from 'styled-components';
import type { TagProps } from '../bbcode/type';

const UnderlineSpan = styled.span`
  text-decoration: underline;
  text-decoration-style: dotted;
`;

const FriendlyLink = styled.span`
  align-items: center;
  background: rgba(88, 101, 242, 0.1);
  border: 1px solid rgba(88, 101, 242, 0.18);
  border-radius: 6px;
  display: inline-flex;
  gap: 4px;
  line-height: 20px;
  max-width: 260px;
  padding: 0 6px;
  vertical-align: baseline;

  &::before {
    content: '↗';
    font-size: 12px;
    opacity: 0.75;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

function isBareUrl(text: string, url: string) {
  return text === url || text.replace(/\/$/, '') === url.replace(/\/$/, '');
}

function getFriendlyUrlText(url: string, text: string) {
  if (!isBareUrl(text, url)) {
    return text;
  }

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, '');
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);

    if (host === 'x.com' || host === 'twitter.com') {
      return pathParts[0] ? `X / @${pathParts[0]}` : 'X';
    }

    if (host.endsWith('youtube.com') || host === 'youtu.be') {
      return 'YouTube';
    }

    if (host.endsWith('zhihu.com')) {
      return '知乎';
    }

    if (host === 'music.163.com') {
      return '网易云音乐';
    }

    if (host.endsWith('bilibili.com')) {
      return '哔哩哔哩';
    }

    return host;
  } catch (e) {
    return text;
  }
}

export const UrlTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const text = node.content.join('');
  const url = node.attrs.url ?? text;
  const friendlyText = getFriendlyUrlText(url, text);
  const linkContent = isBareUrl(text, url) ? (
    <FriendlyLink title={url}>
      <span>{friendlyText}</span>
    </FriendlyLink>
  ) : (
    <UnderlineSpan>{friendlyText}</UnderlineSpan>
  );

  if (url.startsWith('/')) {
    // 内部地址，使用 react-router 进行导航
    return (
      <Link to={url} onContextMenu={(e) => e.stopPropagation()}>
        {linkContent}
      </Link>
    );
  }

  if (url.startsWith(window.location.origin)) {
    // 内部地址，使用 react-router 进行导航
    return (
      <Link
        to={url.replace(window.location.origin, '')}
        onContextMenu={(e) => e.stopPropagation()}
      >
        {linkContent}
      </Link>
    );
  }

  return (
    <a
      href={url}
      title={text}
      target="_blank"
      rel="noopener noreferrer"
      onContextMenu={(e) => e.stopPropagation()}
    >
      {linkContent}
    </a>
  );
});
UrlTag.displayName = 'UrlTag';
