import React, { useState } from 'react';
import type { TaskItemType, TaskPriority } from './type';
import { useAsyncFn } from '@capital/common';
import { Checkbox } from '@capital/component';
import { Icon } from '@capital/component';
import { Translate } from '../translate';
import { request } from '../request';
import './TaskItem.less';

const PRIORITY_CONFIG: Record<TaskPriority, { color: string; label: string }> = {
  high: { color: '#ef4444', label: Translate.priorityHigh },
  medium: { color: '#f59e0b', label: Translate.priorityMedium },
  low: { color: '#22c55e', label: Translate.priorityLow },
};

function getDeadlineInfo(deadline?: string): { text: string; urgent: boolean } | null {
  if (!deadline) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { text: Translate.overdue, urgent: true };
  if (diff === 0) return { text: Translate.dueToday, urgent: true };
  return { text: `${diff}${Translate.daysLeft}`, urgent: diff <= 3 };
}

export const TaskItem: React.FC<{
  task: TaskItemType;
  selected?: boolean;
  onSelect?: (taskId: string, checked: boolean) => void;
  onRefresh?: () => void;
  onDetail?: (task: TaskItemType) => void;
}> = React.memo(({ task, selected, onSelect, onRefresh, onDetail }) => {
  const taskId = task._id;
  const [done, setDone] = useState(task.done);
  const [{ loading }, handleToggleDone] = useAsyncFn(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      if (checked) {
        await request.post('done', { taskId });
        setDone(true);
      } else {
        await request.post('undone', { taskId });
        setDone(false);
      }
      onRefresh && onRefresh();
    },
    [taskId, onRefresh]
  );

  const priority = task.priority || 'medium';
  const priorityCfg = PRIORITY_CONFIG[priority];
  const deadlineInfo = getDeadlineInfo(task.deadline);

  return (
    <div
      className={`plugin-task-item ${done ? 'plugin-task-item-done' : ''}`}
      onClick={() => onDetail && onDetail(task)}
    >
      <div
        className="plugin-task-item-priority-bar"
        style={{ backgroundColor: priorityCfg.color }}
      />

      {onSelect ? (
        <div className="plugin-task-item-select" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selected}
            onChange={(e) => onSelect(taskId, e.target.checked)}
          />
        </div>
      ) : (
        <div className="plugin-task-item-check" onClick={(e) => e.stopPropagation()}>
          <Checkbox disabled={loading} checked={done} onChange={handleToggleDone} />
        </div>
      )}

      <div className="plugin-task-item-body">
        <div className="plugin-task-item-header">
          <span className={`plugin-task-item-title ${done ? 'title-done' : ''}`}>
            {task.title}
          </span>
        </div>

        <div className="plugin-task-item-meta">
          <span
            className="plugin-task-item-priority-tag"
            style={{ color: priorityCfg.color }}
          >
            {priorityCfg.label}
          </span>

          {deadlineInfo && (
            <span className={`plugin-task-item-deadline ${deadlineInfo.urgent ? 'urgent' : ''}`}>
              <Icon icon="mdi:clock-outline" style={{ fontSize: 12, marginRight: 2 }} />
              {deadlineInfo.text}
            </span>
          )}


        </div>
      </div>

      {onDetail && (
        <div className="plugin-task-item-arrow">
          <Icon icon="mdi:chevron-right" style={{ fontSize: 18, color: 'rgba(0,0,0,0.25)' }} />
        </div>
      )}
    </div>
  );
});
TaskItem.displayName = 'TaskItem';
