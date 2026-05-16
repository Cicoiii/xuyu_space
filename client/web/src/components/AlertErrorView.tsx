import React, { useState } from 'react';
import clsx from 'clsx';
import { t } from 'tailchat-shared';
import { Icon } from 'tailchat-design';

/**
 * 用于接口错误显示的组件
 * @deprecated 请使用 ErrorView
 */
export const AlertErrorView: React.FC<{
  error: Error;
}> = React.memo(({ error }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full h-full select-text flex flex-col items-center justify-center min-h-[200px] p-6">
      <Icon
        className="text-4xl mb-3 text-red-400 dark:text-red-500"
        icon="mdi:alert-circle-outline"
      />
      <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        {String(error.name)}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
        {String(error.message)}
      </div>
      <button
        className={clsx(
          'mt-2 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer',
          { hidden: show }
        )}
        onClick={() => setShow(true)}
      >
        {t('显示详情')}
      </button>
      {show && (
        <pre className="mt-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-coolGray-800 rounded-md p-3 max-w-md max-h-40 overflow-auto break-all">
          {String(error.stack)}
        </pre>
      )}
    </div>
  );
});
AlertErrorView.displayName = 'AlertErrorView';
