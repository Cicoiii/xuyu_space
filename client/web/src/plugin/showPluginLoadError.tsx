import { notification } from 'antd';
import React from 'react';
import { t } from 'tailchat-shared';

export function showPluginLoadError(loadErrorPluginNames: string[]) {
  notification.warning({
    message: t('插件加载失败'),
    description: (
      <div className="mt-1">
        {loadErrorPluginNames.map((name) => (
          <div key={name} className="text-xs text-gray-500 dark:text-gray-400">
            • {name}
          </div>
        ))}
      </div>
    ),
    duration: 3,
  });
}
