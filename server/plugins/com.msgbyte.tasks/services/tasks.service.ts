import {
  TcService,
  TcDbService,
  TcContext,
  NoPermissionError,
} from 'tailchat-server-sdk';
import type { TaskDocument, TaskModel, TaskPriority } from '../models/task';

/**
 * 任务管理服务
 */
interface TasksService
  extends TcService,
    TcDbService<TaskDocument, TaskModel> {}
class TasksService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.tasks';
  }

  onInit() {
    this.registerLocalDb(require('../models/task').default);

    this.registerAction('all', this.all);
    this.registerAction('add', this.add, {
      params: {
        title: 'string',
        desc: { optional: true, type: 'string' },
        priority: { optional: true, type: 'string', enum: ['high', 'medium', 'low'] },
        deadline: { optional: true, type: 'string' },
        tags: { optional: true, type: 'array', items: 'string' },
        assignee: { optional: true, type: 'array', items: 'string' },
      },
    });
    this.registerAction('done', this.done, {
      params: {
        taskId: 'string',
      },
    });
    this.registerAction('undone', this.undone, {
      params: {
        taskId: 'string',
      },
    });
    this.registerAction('update', this.update, {
      params: {
        taskId: 'string',
        title: { optional: true, type: 'string' },
        desc: { optional: true, type: 'string' },
        priority: { optional: true, type: 'string', enum: ['high', 'medium', 'low'] },
        deadline: { optional: true, type: 'string' },
        tags: { optional: true, type: 'array', items: 'string' },
        assignee: { optional: true, type: 'string' },
      },
    });
    this.registerAction('clearCompleted', this.clearCompleted);
    this.registerAction('batchDone', this.batchDone, {
      params: {
        taskIds: { type: 'array', items: 'string' },
      },
    });
  }

  /**
   * 列出所有任务，按加权排序 (deadline + priority)
   */
  private async all(ctx: TcContext) {
    const docs = await this.adapter.model
      .find({
        creator: ctx.meta.userId,
      })
      .exec();

    // 加权排序: 未完成优先，然后 priority 权重，最后 deadline
    const priorityWeight: Record<TaskPriority, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    const sorted = docs.sort((a, b) => {
      // 未完成排前面
      if (a.done !== b.done) return a.done ? 1 : -1;

      // priority 加权
      const pa = priorityWeight[a.priority || 'medium'] || 2;
      const pb = priorityWeight[b.priority || 'medium'] || 2;
      if (pa !== pb) return pb - pa;

      // deadline 近的排前面
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (a.deadline) return -1;
      if (b.deadline) return 1;

      // fallback: 创建时间倒序
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return await this.transformDocuments(ctx, {}, sorted);
  }

  /**
   * 新增任务
   */
  private async add(
    ctx: TcContext<{
      title: string;
      desc?: string;
      priority?: TaskPriority;
      deadline?: string;
      tags?: string[];
      assignee?: string[];
    }>
  ) {
    const { title, desc, priority, deadline, tags, assignee } = ctx.params;
    const docs = await this.adapter.model.create({
      creator: ctx.meta.userId,
      title,
      desc,
      priority: priority || 'medium',
      deadline: deadline ? new Date(deadline) : undefined,
      tags: tags || [],
      assignee,
      done: false,
    });

    return await this.transformDocuments(ctx, {}, docs);
  }

  /**
   * 完成任务
   */
  private async done(
    ctx: TcContext<{
      taskId: string;
    }>
  ) {
    const taskId = ctx.params.taskId;
    const t = ctx.meta.t;

    const res = await this.adapter.model.updateOne(
      {
        _id: taskId,
        creator: ctx.meta.userId,
      },
      {
        done: true,
      }
    );

    if (res.matchedCount === 0) {
      throw new NoPermissionError(t('没有修改权限'));
    }
  }

  /**
   * 取消完成任务
   */
  private async undone(
    ctx: TcContext<{
      taskId: string;
    }>
  ) {
    const taskId = ctx.params.taskId;
    const t = ctx.meta.t;

    const res = await this.adapter.model.updateOne(
      {
        _id: taskId,
        creator: ctx.meta.userId,
      },
      {
        done: false,
      }
    );

    if (res.matchedCount === 0) {
      throw new NoPermissionError(t('没有修改权限'));
    }
  }

  /**
   * 更新任务信息
   */
  private async update(
    ctx: TcContext<{
      taskId: string;
      title?: string;
      desc?: string;
      priority?: TaskPriority;
      deadline?: string;
      tags?: string[];
      assignee?: string[];
    }>
  ) {
    const { taskId, title, desc, priority, deadline, tags, assignee } = ctx.params;
    const t = ctx.meta.t;

    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (desc !== undefined) updateData.desc = desc;
    if (priority !== undefined) updateData.priority = priority;
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
    if (tags !== undefined) updateData.tags = tags;
    if (assignee !== undefined) updateData.assignee = assignee;

    const docs = await this.adapter.model.findOneAndUpdate(
      {
        _id: taskId,
        creator: ctx.meta.userId,
      },
      updateData,
      { new: true }
    );

    if (!docs) {
      throw new NoPermissionError(t('没有修改权限'));
    }

    return await this.transformDocuments(ctx, {}, docs);
  }

  /**
   * 清理已完成任务
   */
  private async clearCompleted(ctx: TcContext) {
    const t = ctx.meta.t;

    const res = await this.adapter.model.deleteMany({
      creator: ctx.meta.userId,
      done: true,
    });

    if (res.deletedCount === 0) {
      throw new NoPermissionError(t('没有修改权限'));
    }

    return { deletedCount: res.deletedCount };
  }

  /**
   * 批量完成任务
   */
  private async batchDone(
    ctx: TcContext<{
      taskIds: string[];
    }>
  ) {
    const { taskIds } = ctx.params;
    const t = ctx.meta.t;

    const res = await this.adapter.model.updateMany(
      {
        _id: { $in: taskIds },
        creator: ctx.meta.userId,
      },
      {
        done: true,
      }
    );

    if (res.matchedCount === 0) {
      throw new NoPermissionError(t('没有修改权限'));
    }

    return { matchedCount: res.matchedCount };
  }
}

export default TasksService;
