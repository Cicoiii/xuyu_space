import React from 'react';
import problemSvg from '@assets/images/problem.svg';
import { t } from 'tailchat-shared';
import clsx from 'clsx';

interface ProblemProps {
  className?: string;
  style?: React.CSSProperties;
  text?: React.ReactNode;
}

/**
 * 问题页面占位
 */
export const Problem: React.FC<ProblemProps> = React.memo((props) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center w-full h-full min-h-[200px] select-none',
        props.className
      )}
      style={props.style}
    >
      <img
        className="w-28 h-28 mb-4 opacity-80"
        src={problemSvg}
        alt=""
        draggable={false}
      />

      <div className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs leading-relaxed">
        {props.text ?? t('出现了一些问题')}
      </div>
    </div>
  );
});
Problem.displayName = 'Problem';
