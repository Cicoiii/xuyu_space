import React from 'react';
import { Spinner } from './Spinner';

interface LoadingSpinnerProps {
  tip?: string;
}
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(
  (props) => {
    return (
      <div>
        <Spinner />
        {props.tip}
      </div>
    );
  }
);
LoadingSpinner.displayName = 'LoadingSpinner';
