import clsx from 'clsx';
import React, { InputHTMLAttributes } from 'react';

export const EntryInput: React.FC<InputHTMLAttributes<HTMLInputElement>> =
  React.memo((props) => {
    return (
      <input
        {...props}
        className={clsx(
          'appearance-none relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand text-sm bg-gray-50',
          props.className
        )}
      >
        {props.children}
      </input>
    );
  });
EntryInput.displayName = 'EntryInput';
