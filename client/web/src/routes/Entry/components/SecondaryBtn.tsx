import clsx from 'clsx';
import React, { ButtonHTMLAttributes } from 'react';

export const SecondaryBtn: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> =
  React.memo((props) => {
    return (
      <button
        {...props}
        className={clsx(
          'w-full py-2 px-4 border border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 transition-colors',
          props.className
        )}
      >
        {props.children}
      </button>
    );
  });
SecondaryBtn.displayName = 'SecondaryBtn';
