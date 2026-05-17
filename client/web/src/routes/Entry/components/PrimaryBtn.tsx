import clsx from 'clsx';
import { Icon } from 'tailchat-design';
import React, { ButtonHTMLAttributes } from 'react';
import _omit from 'lodash/omit';

export const PrimaryBtn: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
  }
> = React.memo((props) => {
  return (
    <button
      disabled={props.loading}
      {..._omit(props, ['loading'])}
      className={clsx(
        'w-full h-10 py-2 px-4 mb-2 border border-transparent text-sm font-medium rounded-lg text-white bg-brand hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 transition-colors',
        props.className
      )}
    >
      {props.loading ? (
        <Icon className="animate-spin inline" icon="mdi:loading" />
      ) : (
        props.children
      )}
    </button>
  );
});
PrimaryBtn.displayName = 'PrimaryBtn';
