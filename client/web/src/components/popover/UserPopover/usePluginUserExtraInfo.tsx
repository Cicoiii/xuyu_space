import { pluginUserExtraInfo } from '@/plugin/common';
import React from 'react';

export function usePluginUserExtraInfo(
  userExtra: Record<string, unknown> = {}
) {
  return (
    <>
      {pluginUserExtraInfo.map((item, i) => {
        const Component = item.component?.render;
        const value = userExtra[item.name];
        const hasValue =
          (Array.isArray(value) && value.length > 0) ||
          (typeof value === 'string' ? value.trim() !== '' : Boolean(value));

        if (!hasValue && item.displayWhenEmpty !== true) {
          return null;
        }

        if (Component) {
          // 自定义渲染方式
          const content = <Component value={value} />;

          if (!content && item.displayWhenEmpty !== true) {
            return null;
          }

          return (
            <div key={item.name + i} className="flex gap-2 py-0.5">
              <div className="w-24 shrink-0 text-gray-500">{item.label}:</div>
              <div className="min-w-0 flex-1">{content}</div>
            </div>
          );
        }

        // 默认渲染方式
        return (
          <div key={item.name + i} className="flex gap-2 py-0.5">
            <div className="w-24 shrink-0 text-gray-500">{item.label}:</div>
            <div className="min-w-0 flex-1 break-words select-text">
              {String(value)}
            </div>
          </div>
        );
      })}
    </>
  );
}
