import React, { useCallback, useRef } from 'react';
import { showToasts } from '@capital/common';
import { Icon } from '@capital/component';
import { Translate } from '../translate';
import { request } from '../request';
import './NewTask.less';

interface NewTaskProps {
  onSuccess?: () => void;
}

export const NewTask: React.FC<NewTaskProps> = React.memo((props) => {
  const { onSuccess } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateTask = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const title = (e.target as HTMLInputElement).value.trim();
        if (title === '') {
          showToasts(Translate.titleRequired, 'warning');
          return;
        }

        request.post('add', { title }).then(() => {
          if (inputRef.current) {
            inputRef.current.value = '';
          }
          onSuccess && onSuccess();
        });
      }
    },
    [onSuccess]
  );

  return (
    <div className="plugin-task-quick-add">
      <Icon icon="mdi:plus" className="plugin-task-quick-add-icon" />
      <input
        ref={inputRef}
        className="plugin-task-quick-add-input"
        placeholder={Translate.quickAddTip}
        onKeyDown={handleCreateTask}
      />
    </div>
  );
});
NewTask.displayName = 'NewTask';
