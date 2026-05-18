import React, { useEffect, useMemo, useRef } from 'react';
import { setWebviewKernel } from '@capital/common';

interface ElectronWebviewKernelProps {
  className?: string;
  src: string;
}

type WebviewMessageType =
  | '$mount-webview'
  | '$unmount-webview'
  | '$update-webview-rect'
  | '$show-webview'
  | '$hide-webview';

function sendWebviewMessage(type: WebviewMessageType, payload: unknown) {
  window.electron?.ipcRenderer?.sendMessage(type, payload);
}

function getElementRect(element: HTMLElement) {
  const rect = element.getBoundingClientRect();

  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  };
}

const ElectronWebviewKernel: React.FC<ElectronWebviewKernelProps> = React.memo(
  (props) => {
    const ref = useRef<HTMLDivElement>(null);
    const key = useMemo(
      () => `electron-webview-${Math.random().toString(36).slice(2)}`,
      []
    );

    useEffect(() => {
      const element = ref.current;
      if (!element) {
        return;
      }

      const updateRect = () => {
        sendWebviewMessage('$update-webview-rect', {
          key,
          rect: getElementRect(element),
        });
      };

      sendWebviewMessage('$mount-webview', {
        key,
        url: props.src,
        rect: getElementRect(element),
      });

      window.addEventListener('resize', updateRect);
      const observer = new ResizeObserver(updateRect);
      observer.observe(element);

      return () => {
        observer.disconnect();
        window.removeEventListener('resize', updateRect);
        sendWebviewMessage('$unmount-webview', { key });
      };
    }, [key, props.src]);

    useEffect(() => {
      const onVisibilityChange = () => {
        sendWebviewMessage(document.hidden ? '$hide-webview' : '$show-webview', {
          key,
        });
      };

      document.addEventListener('visibilitychange', onVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', onVisibilityChange);
      };
    }, [key]);

    return <div ref={ref} className={props.className} />;
  }
);
ElectronWebviewKernel.displayName = 'ElectronWebviewKernel';

if (window.electron?.ipcRenderer) {
  setWebviewKernel(() => ElectronWebviewKernel);
}
