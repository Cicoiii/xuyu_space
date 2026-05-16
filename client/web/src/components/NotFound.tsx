import React from 'react';
import { t } from 'tailchat-shared';
import { Icon } from 'tailchat-design';

interface NotFoundProps {
  message?: string;
}

/**
 * 没有数据或没找到数据
 */
export const NotFound: React.FC<NotFoundProps> = React.memo((props) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] select-none">
      <Icon
        className="text-5xl mb-3 text-gray-300 dark:text-gray-600"
        icon="mdi:file-search-outline"
      />
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {props.message ?? t('未找到内容')}
      </div>
    </div>
  );
});
NotFound.displayName = 'NotFound';
