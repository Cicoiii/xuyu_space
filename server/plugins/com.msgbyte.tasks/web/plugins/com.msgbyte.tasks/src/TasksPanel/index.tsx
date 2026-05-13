import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAsyncFn } from '@capital/common';
import { Button, Popconfirm, Tag, Input, TextArea, Checkbox, Icon } from '@capital/component';
import type { TaskItemType, TaskPriority } from './type';
import { TaskItem } from './TaskItem';
import { NewTask } from './NewTask';
import { Translate } from '../translate';
import { request } from '../request';
import './index.less';

const PRIORITY_CONFIG: Record<TaskPriority, { color: string; label: string }> = {
  high: { color: '#ef4444', label: Translate.priorityHigh },
  medium: { color: '#f59e0b', label: Translate.priorityMedium },
  low: { color: '#22c55e', label: Translate.priorityLow },
};

const TaskDrawer: React.FC<{
  task: TaskItemType | null;
  visible: boolean;
  onClose: () => void;
  onRefresh: () => void;
}> = React.memo(({ task, visible, onClose, onRefresh }) => {
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPriority, setEditPriority] = useState<TaskPriority>('medium');
  const [editDeadline, setEditDeadline] = useState('');

  useEffect(() => {
    if (task && visible) {
      setEditTitle(task.title);
      setEditDesc(task.desc || '');
      setEditPriority(task.priority || 'medium');
      setEditDeadline(task.deadline ? task.deadline.substring(0, 16) : '');
      setEditMode(false);
    }
  }, [task, visible]);

  const handleSave = useCallback(async () => {
    if (!task) return;
    await request.post('update', {
      taskId: task._id,
      title: editTitle,
      desc: editDesc,
      priority: editPriority,
      deadline: editDeadline || undefined,
    });
    setEditMode(false);
    onRefresh();
  }, [task, editTitle, editDesc, editPriority, editDeadline, onRefresh]);



  if (!task || !visible) return null;

  const priorityCfg = PRIORITY_CONFIG[task.priority || 'medium'];
  const isOverdue = task.deadline && !task.done && new Date(task.deadline) < new Date();

  return (
    <div className="plugin-task-drawer-overlay" onClick={onClose}>
      <div className="plugin-task-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="plugin-task-drawer-header">
          <div className="plugin-task-drawer-title">{Translate.taskDetail}</div>
          <div className="plugin-task-drawer-header-actions">
            {!editMode && (
              <Button type="text" size="small" onClick={() => setEditMode(true)}>
                {Translate.edit}
              </Button>
            )}
            <Button type="text" size="small" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        <div className="plugin-task-drawer-body">
          {editMode ? (
            <>
              <div className="plugin-task-drawer-field">
                <label>{Translate.insertTip}</label>
                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>
              <div className="plugin-task-drawer-field">
                <label>{Translate.desc}</label>
                <TextArea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="plugin-task-drawer-field">
                <label>{Translate.priority}</label>
                <div className="plugin-task-drawer-priority-options">
                  {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map((p) => (
                    <div
                      key={p}
                      className={`plugin-task-drawer-priority-item ${editPriority === p ? 'active' : ''}`}
                      style={{
                        borderColor: editPriority === p ? PRIORITY_CONFIG[p].color : 'transparent',
                        backgroundColor: editPriority === p ? `${PRIORITY_CONFIG[p].color}15` : 'transparent',
                      }}
                      onClick={() => setEditPriority(p)}
                    >
                      <span
                        className="plugin-task-drawer-priority-dot"
                        style={{ backgroundColor: PRIORITY_CONFIG[p].color }}
                      />
                      {PRIORITY_CONFIG[p].label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="plugin-task-drawer-field">
                <label>{Translate.deadline}</label>
                <Input
                  type="datetime-local"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                />
              </div>

              <div className="plugin-task-drawer-actions">
                <Button onClick={() => setEditMode(false)}>{Translate.cancel}</Button>
                <Button type="primary" onClick={handleSave}>{Translate.save}</Button>
              </div>
            </>
          ) : (
            <>
              <div className="plugin-task-drawer-read-title">
                {task.title}
                {task.done && <Tag color="green" style={{ marginLeft: 8 }}>{Translate.done}</Tag>}
              </div>

              <div className="plugin-task-drawer-meta">
                <div className="plugin-task-drawer-meta-item">
                  <Icon icon="mdi:flag" style={{ color: priorityCfg.color, fontSize: 16 }} />
                  <span style={{ color: priorityCfg.color, fontWeight: 600 }}>{priorityCfg.label}</span>
                </div>
                <div className={`plugin-task-drawer-meta-item ${isOverdue ? 'overdue' : ''}`}>
                  <Icon icon="mdi:clock-outline" style={{ fontSize: 16 }} />
                  <span>
                    {task.deadline
                      ? new Date(task.deadline).toLocaleString()
                      : Translate.noDeadline}
                  </span>
                </div>
              </div>



              <div className="plugin-task-drawer-desc">
                <label>{Translate.desc}</label>
                <div className="plugin-task-drawer-desc-content">
                  {task.desc || Translate.noDesc}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
TaskDrawer.displayName = 'TaskDrawer';

type TabKey = 'undone' | 'done';

const TasksPanel: React.FC = React.memo(() => {
  const [{ value }, fetch] = useAsyncFn(
    () => request.get('all').then(({ data }) => data),
    []
  );
  const tasks: TaskItemType[] = Array.isArray(value) ? value : [];

  const [activeTab, setActiveTab] = useState<TabKey>('undone');
  const [batchMode, setBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailTask, setDetailTask] = useState<TaskItemType | null>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const unDoneTasks = useMemo(() => tasks.filter((t) => !t.done), [tasks]);
  const doneTasks = useMemo(() => tasks.filter((t) => t.done), [tasks]);

  const displayTasks = activeTab === 'undone' ? unDoneTasks : doneTasks;

  const handleSelect = useCallback((taskId: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(taskId);
      else next.delete(taskId);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(new Set(unDoneTasks.map((t) => t._id)));
      } else {
        setSelectedIds(new Set());
      }
    },
    [unDoneTasks]
  );

  const handleBatchDone = useCallback(async () => {
    if (selectedIds.size === 0) return;
    await request.post('batchDone', { taskIds: Array.from(selectedIds) });
    setSelectedIds(new Set());
    setBatchMode(false);
    fetch();
  }, [selectedIds, fetch]);

  const handleClearCompleted = useCallback(async () => {
    await request.post('clearCompleted');
    fetch();
  }, [fetch]);

  return (
    <div className="plugin-tasks-panel">
      <div className="plugin-task-header">
        <span className="plugin-task-header-title">{Translate.tasks}</span>
        <div className="plugin-task-header-actions">
          <button
            className={`plugin-task-header-btn ${batchMode ? 'active' : ''}`}
            title={Translate.batchDone}
            onClick={() => {
              setBatchMode(!batchMode);
              setSelectedIds(new Set());
            }}
          >
            <Icon icon={batchMode ? 'mdi:close' : 'mdi:checkbox-multiple-marked-outline'} />
          </button>
          {doneTasks.length > 0 && (
            <Popconfirm
              title={Translate.confirmClear}
              onConfirm={handleClearCompleted}
            >
              <button className="plugin-task-header-btn danger" title={Translate.clearCompleted}>
                <Icon icon="mdi:delete-sweep-outline" />
              </button>
            </Popconfirm>
          )}
        </div>
      </div>

      <div className="plugin-task-tabs">
        <button
          className={`plugin-task-tab ${activeTab === 'undone' ? 'active' : ''}`}
          onClick={() => setActiveTab('undone')}
        >
          {Translate.undone}
          {unDoneTasks.length > 0 && (
            <span className="plugin-task-tab-badge">{unDoneTasks.length}</span>
          )}
        </button>
        <button
          className={`plugin-task-tab ${activeTab === 'done' ? 'active' : ''}`}
          onClick={() => setActiveTab('done')}
        >
          {Translate.done}
          {doneTasks.length > 0 && (
            <span className="plugin-task-tab-badge">{doneTasks.length}</span>
          )}
        </button>
      </div>

      <div className="plugin-task-content">
        <NewTask onSuccess={fetch} />

        {batchMode && activeTab === 'undone' && unDoneTasks.length > 0 && (
          <div className="plugin-task-batch-bar">
            <Checkbox
              checked={selectedIds.size === unDoneTasks.length && unDoneTasks.length > 0}
              indeterminate={selectedIds.size > 0 && selectedIds.size < unDoneTasks.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
            >
              {Translate.selectAll}
            </Checkbox>
            {selectedIds.size > 0 && (
              <>
                <span className="plugin-task-batch-count">
                  {Translate.selected} {selectedIds.size}
                </span>
                <Button type="primary" size="small" onClick={handleBatchDone}>
                  {Translate.done}
                </Button>
              </>
            )}
          </div>
        )}

        {displayTasks.length === 0 ? (
          <div className="plugin-task-empty">
            <Icon
              icon={activeTab === 'undone' ? 'mdi:checkbox-marked-circle-outline' : 'mdi:check-all'}
              className="plugin-task-empty-icon"
            />
            <span>{activeTab === 'undone' ? Translate.emptyUndone : Translate.emptyDone}</span>
          </div>
        ) : (
          <div className="plugin-task-list">
            {displayTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                selected={selectedIds.has(task._id)}
                onSelect={batchMode && activeTab === 'undone' ? handleSelect : undefined}
                onRefresh={fetch}
                onDetail={!batchMode ? setDetailTask : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <TaskDrawer
        task={detailTask}
        visible={!!detailTask}
        onClose={() => setDetailTask(null)}
        onRefresh={fetch}
      />
    </div>
  );
});
TasksPanel.displayName = 'TasksPanel';

export default TasksPanel;
