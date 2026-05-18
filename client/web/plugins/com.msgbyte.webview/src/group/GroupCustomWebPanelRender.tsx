import React, { useMemo, useState } from 'react';
import { Translate } from '../translate';
import { FilterXSS, getDefaultWhiteList } from 'xss';
import { useWatch } from '@capital/common';
import {
  GroupExtraDataPanel,
  Icon,
  NoData,
  TextArea,
} from '@capital/component';
import styled from 'styled-components';

const EditModalContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
  border-radius: 12px;

  .html-editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 20px;
    border-bottom: 1px solid #f1f5f9;
    flex-shrink: 0;
  }

  .html-editor-tip {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    color: #94a3b8;
    font-size: 13px;
  }

  .html-editor-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .html-editor-action {
    height: 30px;
    padding: 0 10px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: #fff;
    color: #475569;
    font-size: 12px;
    cursor: pointer;

    &:hover {
      border-color: #94a3b8;
      color: #0f172a;
    }
  }

  .html-editor-body {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 42%);
    overflow: hidden;
  }

  .html-editor-code {
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr);
    background: #0f172a;
    color: #cbd5e1;
  }

  .html-editor-lines {
    padding: 14px 10px;
    overflow: hidden;
    border-right: 1px solid rgba(148, 163, 184, 0.18);
    color: #64748b;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      'Liberation Mono', 'Courier New', monospace;
    font-size: 13px;
    line-height: 20px;
    text-align: right;
    user-select: none;
  }

  .html-editor-codearea {
    min-width: 0;
    min-height: 0;

    textarea {
      height: 100% !important;
      min-height: 100%;
      resize: none;
      border: 0;
      border-radius: 0;
      box-shadow: none !important;
      background: #0f172a;
      color: #e2e8f0;
      caret-color: #38bdf8;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        'Liberation Mono', 'Courier New', monospace;
      font-size: 13px;
      line-height: 20px;
      tab-size: 2;
      padding: 14px;

      &::selection {
        background: rgba(56, 189, 248, 0.28);
      }
    }
  }

  .html-editor-preview {
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #e2e8f0;
    background: #f8fafc;
  }

  .html-editor-preview-title {
    height: 36px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-bottom: 1px solid #e2e8f0;
    color: #64748b;
    font-size: 12px;
    flex-shrink: 0;
  }

  .html-editor-preview-frame {
    flex: 1;
    min-height: 0;
    width: 100%;
    border: 0;
    background: #fff;
  }

  .html-editor-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    height: 32px;
    padding: 0 14px;
    border-top: 1px solid #f1f5f9;
    color: #94a3b8;
    font-size: 12px;
    flex-shrink: 0;
  }

  @media (max-width: 900px) {
    .html-editor-body {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(240px, 1fr) minmax(220px, 42%);
    }

    .html-editor-preview {
      border-left: 0;
      border-top: 1px solid #e2e8f0;
    }
  }
`;

const html5Template = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Custom Panel</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      body {
        margin: 0;
        padding: 24px;
      }

      main {
        display: grid;
        gap: 16px;
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>Hello HTML5</h1>
        <p>在这里编写现代 HTML 文档。</p>
      </header>

      <section>
        <details open>
          <summary>支持语义化标签</summary>
          <p>例如 main、section、article、details、figure、time、video、picture 等。</p>
        </details>
      </section>
    </main>
  </body>
</html>`;

const html5Tags = [
  'main',
  'section',
  'article',
  'nav',
  'header',
  'footer',
  'aside',
  'figure',
  'figcaption',
  'picture',
  'source',
  'video',
  'audio',
  'track',
  'canvas',
  'details',
  'summary',
  'dialog',
  'template',
  'slot',
  'progress',
  'meter',
  'time',
  'mark',
  'data',
  'output',
  'ruby',
  'rt',
  'rp',
  'wbr',
  'bdi',
  'bdo',
  'html',
  'head',
  'body',
  'meta',
  'style',
  'link',
  'title',
];

const globalAttrs = [
  'id',
  'class',
  'style',
  'title',
  'role',
  'lang',
  'dir',
  'hidden',
  'tabindex',
  'contenteditable',
  'draggable',
  'spellcheck',
  'translate',
  'part',
  'slot',
  'popover',
];

const mediaAttrs = [
  'src',
  'srcset',
  'sizes',
  'type',
  'media',
  'width',
  'height',
  'alt',
  'poster',
  'controls',
  'autoplay',
  'loop',
  'muted',
  'preload',
  'playsinline',
  'kind',
  'srclang',
  'label',
  'default',
  'loading',
  'decoding',
  'fetchpriority',
  'crossorigin',
  'referrerpolicy',
];

function uniqAttrs(attrs: string[]) {
  return Array.from(new Set(attrs));
}

function buildHtmlWhiteList() {
  const whiteList = {
    ...getDefaultWhiteList(),
  } as Record<string, string[]>;

  Object.keys(whiteList).forEach((tag) => {
    whiteList[tag] = uniqAttrs([...(whiteList[tag] ?? []), ...globalAttrs]);
  });

  html5Tags.forEach((tag) => {
    whiteList[tag] = uniqAttrs([...(whiteList[tag] ?? []), ...globalAttrs]);
  });

  whiteList.a = uniqAttrs([
    ...(whiteList.a ?? []),
    'href',
    'target',
    'rel',
    'download',
    'ping',
  ]);
  whiteList.img = uniqAttrs([...(whiteList.img ?? []), ...mediaAttrs]);
  whiteList.source = uniqAttrs([...(whiteList.source ?? []), ...mediaAttrs]);
  whiteList.picture = uniqAttrs([...(whiteList.picture ?? []), ...mediaAttrs]);
  whiteList.video = uniqAttrs([...(whiteList.video ?? []), ...mediaAttrs]);
  whiteList.audio = uniqAttrs([...(whiteList.audio ?? []), ...mediaAttrs]);
  whiteList.track = uniqAttrs([...(whiteList.track ?? []), ...mediaAttrs]);
  whiteList.iframe = uniqAttrs([
    ...(whiteList.iframe ?? []),
    'src',
    'srcdoc',
    'name',
    'width',
    'height',
    'allow',
    'allowfullscreen',
    'loading',
    'referrerpolicy',
    'sandbox',
  ]);
  whiteList.meta = ['charset', 'name', 'content', 'http-equiv'];
  whiteList.link = [
    ...globalAttrs,
    'href',
    'rel',
    'as',
    'type',
    'media',
    'sizes',
    'crossorigin',
    'referrerpolicy',
  ];
  whiteList.time = uniqAttrs([...(whiteList.time ?? []), 'datetime']);
  whiteList.data = uniqAttrs([...(whiteList.data ?? []), 'value']);
  whiteList.meter = uniqAttrs([
    ...(whiteList.meter ?? []),
    'value',
    'min',
    'max',
    'low',
    'high',
    'optimum',
  ]);
  whiteList.progress = uniqAttrs([
    ...(whiteList.progress ?? []),
    'value',
    'max',
  ]);

  return whiteList;
}

const xss = new FilterXSS({
  css: false,
  whiteList: buildHtmlWhiteList(),
  onIgnoreTagAttr(tag, name, value) {
    if (/^(data|aria)-[\w-]+$/i.test(name)) {
      return `${name}="${String(value).replace(/"/g, '&quot;')}"`;
    }
  },
});

function getInjectedStyle() {
  try {
    // 当前面板文本颜色
    const currentTextColor = document.defaultView.getComputedStyle(
      document.querySelector('.tc-content-background')
    ).color;

    return `<style>
      body { color: ${currentTextColor}; }
      img, video, iframe, canvas, svg { max-width: 100%; }
      table { border-collapse: collapse; }
    </style>`;
  } catch (e) {
    return '';
  }
}

function buildPreviewDocument(html: string) {
  const sanitized = xss.process(html);
  const injectedStyle = getInjectedStyle();

  if (/<html[\s>]/i.test(sanitized)) {
    if (/<head[\s>]/i.test(sanitized)) {
      return sanitized.replace(/<head([^>]*)>/i, `<head$1>${injectedStyle}`);
    }

    return sanitized.replace(
      /<html([^>]*)>/i,
      `<html$1><head>${injectedStyle}</head>`
    );
  }

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${injectedStyle}
  </head>
  <body>
    ${sanitized}
  </body>
</html>`;
}

const GroupCustomWebPanelRender: React.FC<{ html: string }> = (props) => {
  const html = props.html;
  const previewDocument = useMemo(() => buildPreviewDocument(html), [html]);

  if (!html) {
    return <NoData />;
  }

  return (
    <iframe
      className="w-full h-full border-0"
      sandbox="allow-forms allow-modals allow-popups allow-same-origin"
      srcDoc={previewDocument}
    />
  );
};
GroupCustomWebPanelRender.displayName = 'GroupCustomWebPanelRender';

const GroupCustomWebPanelEditor: React.FC<{
  initValue: string;
  onChange: (html: string) => void;
}> = React.memo((props) => {
  const [html, setHtml] = useState(() => props.initValue ?? '');
  const previewDocument = useMemo(() => buildPreviewDocument(html), [html]);
  const lineCount = Math.max(html.split('\n').length, 1);
  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, index) => index + 1).join('\n'),
    [lineCount]
  );

  useWatch([html], () => {
    props.onChange(html);
  });

  const handleUseTemplate = () => {
    setHtml((current) => (current.trim() === '' ? html5Template : current));
  };

  return (
    <>
      <div className="html-editor-header">
        <div className="html-editor-tip">
          <Icon icon="mdi:language-html5" style={{ fontSize: 16 }} />
          {Translate.editTip}
        </div>

        <div className="html-editor-actions">
          <button
            type="button"
            className="html-editor-action"
            onClick={handleUseTemplate}
          >
            {Translate.insertHTML5Template}
          </button>
        </div>
      </div>

      <div className="html-editor-body">
        <div className="html-editor-code">
          <pre className="html-editor-lines">{lineNumbers}</pre>
          <div className="html-editor-codearea">
            <TextArea
              value={html}
              placeholder={html5Template}
              spellCheck={false}
              onChange={(e) => setHtml(e.target.value)}
            />
          </div>
        </div>

        <div className="html-editor-preview">
          <div className="html-editor-preview-title">
            {Translate.realtimePreview}
          </div>
          <iframe
            className="html-editor-preview-frame"
            sandbox="allow-forms allow-modals allow-popups allow-same-origin"
            srcDoc={previewDocument}
          />
        </div>
      </div>

      <div className="html-editor-footer">
        <span>
          {lineCount} {Translate.lines}
        </span>
        <span>
          {html.length} {Translate.characters}
        </span>
      </div>
    </>
  );
});
GroupCustomWebPanelEditor.displayName = 'GroupCustomWebPanelEditor';

const GroupCustomWebPanel: React.FC<{ panelInfo: any }> = (props) => {
  return (
    <GroupExtraDataPanel
      names={['html']}
      render={(dataMap: Record<string, string>) => {
        return (
          <GroupCustomWebPanelRender
            html={dataMap['html'] ?? props.panelInfo?.meta?.html ?? ''}
          />
        );
      }}
      renderEdit={(dataMap: Record<string, string>) => {
        return (
          <EditModalContent>
            <GroupCustomWebPanelEditor
              initValue={dataMap['html'] ?? props.panelInfo?.meta?.html ?? ''}
              onChange={(html) => (dataMap['html'] = html)}
            />
          </EditModalContent>
        );
      }}
    />
  );
};
GroupCustomWebPanel.displayName = 'GroupCustomWebPanel';

export default GroupCustomWebPanel;
