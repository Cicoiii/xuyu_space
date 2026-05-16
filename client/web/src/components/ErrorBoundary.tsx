import React, { PropsWithChildren } from 'react';
import { t } from 'tailchat-shared';
import { Problem } from './Problem';

interface ErrorBoundaryProps {
  message?: React.ReactNode;
  description?: string;
}

const defaultState = {
  error: undefined,
  info: {
    componentStack: '',
  },
};

export class ErrorBoundary extends React.Component<
  PropsWithChildren<ErrorBoundaryProps>,
  {
    error?: Error | null;
    info: {
      componentStack?: string;
    };
  }
> {
  state = defaultState;

  componentDidCatch(error: Error | null, info: any) {
    this.setState({ error, info });
  }

  reset = () => {
    this.setState(defaultState);
  };

  render() {
    const { message, description, children } = this.props;
    const { error, info } = this.state;
    const componentStack =
      info && info.componentStack ? info.componentStack : null;
    const errorMessage =
      typeof message === 'undefined' ? (error || '').toString() : message;
    const errorDescription =
      typeof description === 'undefined' ? componentStack : description;

    if (error) {
      return (
        <Problem
          text={
            <div className="space-y-3">
              <div className="text-base font-medium text-gray-700 dark:text-gray-200">
                {t('页面出现了一些问题')}
              </div>
              <div
                className="text-xs text-gray-400 dark:text-gray-500 break-all max-w-sm"
                title={errorDescription ?? ''}
              >
                {errorMessage}
              </div>
              <button
                className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-white dark:bg-coolGray-800 hover:bg-gray-50 dark:hover:bg-coolGray-700 transition-colors cursor-pointer"
                onClick={this.reset}
              >
                {t('重试')}
              </button>
            </div>
          }
        />
      );
    }

    return children;
  }
}
