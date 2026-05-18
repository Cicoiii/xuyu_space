import _ from 'lodash';
import { TcService, TcDbService, TcContext, call } from 'tailchat-server-sdk';
import type { GroupTopicDocument, GroupTopicModel } from '../models/topic';

/**
 * 社区话题
 */
interface GroupTopicService
  extends TcService,
    TcDbService<GroupTopicDocument, GroupTopicModel> {}
class GroupTopicService extends TcService {
  get serviceName(): string {
    return 'plugin:com.msgbyte.topic';
  }

  onInit(): void {
    this.registerLocalDb(require('../models/topic').default);

    this.registerAction('list', this.list, {
      params: {
        groupId: 'string',
        panelId: 'string',
        page: { type: 'number', optional: true },
        size: { type: 'number', optional: true },
      },
    });
    this.registerAction('create', this.create, {
      params: {
        groupId: 'string',
        panelId: 'string',
        content: { type: 'string', optional: true },
        images: { type: 'array', items: 'string', optional: true },
        meta: { type: 'object', optional: true },
      },
    });
    this.registerAction('createComment', this.createComment, {
      params: {
        groupId: 'string',
        panelId: 'string',
        topicId: 'string',
        content: { type: 'string', optional: true },
        images: { type: 'array', items: 'string', optional: true },
        replyCommentId: { type: 'string', optional: true },
      },
    });
    this.registerAction('toggleTopicUpvote', this.toggleTopicUpvote, {
      params: {
        groupId: 'string',
        panelId: 'string',
        topicId: 'string',
      },
    });
    this.registerAction('toggleCommentUpvote', this.toggleCommentUpvote, {
      params: {
        groupId: 'string',
        panelId: 'string',
        topicId: 'string',
        commentId: 'string',
      },
    });
    this.registerAction('toggleCommentPinned', this.toggleCommentPinned, {
      params: {
        groupId: 'string',
        panelId: 'string',
        topicId: 'string',
        commentId: 'string',
      },
    });
    this.registerAction('delete', this.delete, {
      params: {
        groupId: 'string',
        panelId: 'string',
        topicId: 'string',
      },
    });
  }

  protected onInited(): void {
    this.setPanelFeature('com.msgbyte.topic/grouppanel', ['subscribe']);
  }

  /**
   * 获取所有Topic
   */
  async list(
    ctx: TcContext<{
      groupId: string;
      panelId: string;
      page?: number;
      size?: number;
    }>
  ) {
    const { groupId, panelId, page = 1, size = 20 } = ctx.params;
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;

    // 鉴权
    const group = await call(ctx).getGroupInfo(groupId);
    const isMember = group.members.some((member) => {
      return String(member.userId) === userId;
    });
    if (!isMember) {
      throw new Error(t('不是该群组成员'));
    }

    const topic = await this.adapter.model
      .find({
        groupId,
        panelId,
      })
      .limit(size)
      .skip((page - 1) * size)
      .sort({ _id: 'desc' })
      .exec();

    const json = this.normalizeTopicPayload(
      await this.transformDocuments(ctx, {}, topic)
    );

    return json;
  }

  /**
   * 创建一条Topic
   */
  async create(
    ctx: TcContext<{
      groupId: string;
      panelId: string;
      content?: string;
      images?: string[];
      meta?: object;
    }>
  ) {
    const { groupId, panelId, content = '', images = [], meta } = ctx.params;
    const safeImages = this.normalizeImages(images);
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;

    // 鉴权
    const group = await call(ctx).getGroupInfo(groupId);
    const isMember = group.members.some(
      (member) => String(member.userId) === userId
    );
    if (!isMember) {
      throw new Error(t('不是该群组成员'));
    }

    const targetPanel = group.panels.find((p) => p.id === panelId);

    if (!targetPanel) {
      throw new Error(t('面板不存在'));
    }

    if (!content.trim() && safeImages.length === 0) {
      throw new Error(t('话题内容不能为空'));
    }

    const topic = await this.adapter.model.create({
      groupId,
      panelId,
      content,
      images: safeImages,
      meta,
      author: userId,
      comments: [],
      upvotes: [],
    });

    const json = this.normalizeTopicPayload(
      await this.transformDocuments(ctx, {}, topic)
    );

    this.roomcastNotify(ctx, panelId, 'create', json);

    return json;
  }

  /**
   * 回复话题
   */
  async createComment(
    ctx: TcContext<{
      groupId: string;
      panelId: string;
      topicId: string;
      content?: string;
      images?: string[];
      replyCommentId?: string;
    }>
  ) {
    const {
      groupId,
      panelId,
      topicId,
      content = '',
      images = [],
      replyCommentId,
    } = ctx.params;
    const safeImages = this.normalizeImages(images);
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;

    // 鉴权
    const group = await call(ctx).getGroupInfo(groupId);
    const isMember = group.members.some(
      (member) => String(member.userId) === userId
    );
    if (!isMember) {
      throw new Error(t('不是该群组成员'));
    }

    const targetPanel = group.panels.find((p) => p.id === panelId);

    if (!targetPanel) {
      throw new Error(t('面板不存在'));
    }

    if (!content.trim() && safeImages.length === 0) {
      throw new Error(t('评论内容不能为空'));
    }

    const targetTopic = await this.adapter.model.findOne({
      _id: topicId,
      groupId,
      panelId,
    });

    if (!targetTopic) {
      throw new Error(t('话题不存在'));
    }

    targetTopic.comments.push({
      content,
      images: safeImages,
      author: userId,
      replyCommentId,
      upvotes: [],
      authorLiked: false,
      pinned: false,
    } as any);
    await targetTopic.save();

    const json = this.normalizeTopicPayload(
      await this.transformDocuments(ctx, {}, targetTopic)
    );

    this.roomcastNotify(ctx, panelId, 'update', json);

    // 向所有参与者都添加收件箱消息
    const memberIds = _.uniq([
      targetTopic.author,
      ...targetTopic.comments.map((c) => c.author),
    ]);

    await Promise.all(
      memberIds.map((memberId) =>
        call(ctx).appendInbox(
          'plugin:com.msgbyte.topic.comment',
          json,
          String(memberId)
        )
      )
    );

    return json;
  }

  /**
   * 赞同话题
   */
  async toggleTopicUpvote(
    ctx: TcContext<{
      groupId: string;
      panelId: string;
      topicId: string;
    }>
  ) {
    const topic = await this.getMemberVisibleTopic(ctx);
    const userId = ctx.meta.userId;
    const upvotes = (topic.upvotes ?? []).map(String);
    const hasUpvoted = upvotes.includes(userId);

    topic.upvotes = hasUpvoted
      ? upvotes.filter((id) => id !== userId)
      : _.uniq([...upvotes, userId]);
    await topic.save();

    const json = this.normalizeTopicPayload(
      await this.transformDocuments(ctx, {}, topic)
    );
    this.roomcastNotify(ctx, ctx.params.panelId, 'update', json);

    return json;
  }

  /**
   * 赞同评论
   */
  async toggleCommentUpvote(
    ctx: TcContext<{
      groupId: string;
      panelId: string;
      topicId: string;
      commentId: string;
    }>
  ) {
    const topic = await this.getMemberVisibleTopic(ctx);
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;
    const comment = topic.comments.find((c) => c.id === ctx.params.commentId);

    if (!comment) {
      throw new Error(t('评论不存在'));
    }

    const upvotes = (comment.upvotes ?? []).map(String);
    const hasUpvoted = upvotes.includes(userId);
    comment.upvotes = hasUpvoted
      ? upvotes.filter((id) => id !== userId)
      : _.uniq([...upvotes, userId]);

    if (String(topic.author) === userId) {
      comment.authorLiked = !hasUpvoted;
    }

    await topic.save();

    const json = this.normalizeTopicPayload(
      await this.transformDocuments(ctx, {}, topic)
    );
    this.roomcastNotify(ctx, ctx.params.panelId, 'update', json);

    return json;
  }

  /**
   * 置顶/取消置顶评论
   */
  async toggleCommentPinned(
    ctx: TcContext<{
      groupId: string;
      panelId: string;
      topicId: string;
      commentId: string;
    }>
  ) {
    const topic = await this.getMemberVisibleTopic(ctx);
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;

    if (String(topic.author) !== userId) {
      throw new Error(t('仅话题作者可以置顶评论'));
    }

    const comment = topic.comments.find((c) => c.id === ctx.params.commentId);

    if (!comment) {
      throw new Error(t('评论不存在'));
    }

    comment.pinned = !comment.pinned;
    await topic.save();

    const json = this.normalizeTopicPayload(
      await this.transformDocuments(ctx, {}, topic)
    );
    this.roomcastNotify(ctx, ctx.params.panelId, 'update', json);

    return json;
  }

  /**
   * 删除话题
   */
  async delete(
    ctx: TcContext<{
      groupId: string;
      panelId: string;
      topicId: string;
    }>
  ) {
    const { groupId, panelId, topicId } = ctx.params;
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;

    // 鉴权
    const group = await call(ctx).getGroupInfo(groupId);
    const isMember = group.members.some(
      (member) => String(member.userId) === userId
    );
    if (!isMember) {
      throw new Error(t('不是该群组成员'));
    }

    if (String(group.owner) !== userId) {
      throw new Error(t('仅群组所有者有权限删除话题'));
    }

    const result = await this.adapter.model.deleteOne({
      _id: topicId,
      groupId,
      panelId,
    });

    this.roomcastNotify(ctx, panelId, 'delete', {
      groupId,
      panelId,
      topicId,
    });

    return result.deletedCount > 0;
  }

  private async getMemberVisibleTopic(
    ctx: TcContext<{
      groupId: string;
      panelId: string;
      topicId: string;
    }>
  ) {
    const { groupId, panelId, topicId } = ctx.params;
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;

    const group = await call(ctx).getGroupInfo(groupId);
    const isMember = group.members.some((member) => {
      return String(member.userId) === userId;
    });
    if (!isMember) {
      throw new Error(t('不是该群组成员'));
    }

    const targetPanel = group.panels.find((p) => p.id === panelId);
    if (!targetPanel) {
      throw new Error(t('面板不存在'));
    }

    const topic = await this.adapter.model.findOne({
      _id: topicId,
      groupId,
      panelId,
    });

    if (!topic) {
      throw new Error(t('话题不存在'));
    }

    return topic;
  }

  private normalizeImages(images: unknown): string[] {
    return this.normalizeStringArray(images).slice(0, 9);
  }

  private normalizeStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return _.uniq(
      _.flattenDeep(value)
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    );
  }

  private normalizeTopicPayload<T>(payload: T): T {
    const normalizeOne = (topic: any) => {
      if (!topic || typeof topic !== 'object') {
        return topic;
      }

      topic.images = this.normalizeImages(topic.images);
      topic.upvotes = this.normalizeStringArray(topic.upvotes);
      topic.comments = Array.isArray(topic.comments) ? topic.comments : [];

      topic.comments.forEach((comment) => {
        if (!comment || typeof comment !== 'object') {
          return;
        }

        comment.images = this.normalizeImages(comment.images);
        comment.upvotes = this.normalizeStringArray(comment.upvotes);
        comment.authorLiked = Boolean(comment.authorLiked);
        comment.pinned = Boolean(comment.pinned);
      });

      return topic;
    };

    if (Array.isArray(payload)) {
      payload.forEach(normalizeOne);
      return payload;
    }

    return normalizeOne(payload);
  }
}

export default GroupTopicService;
