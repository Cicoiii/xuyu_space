import moment from 'moment';
import { Types } from 'mongoose';
import type {
  MessageDocument,
  MessageModel,
} from '../../../models/chat/message';
import {
  TcService,
  TcDbService,
  GroupBaseInfo,
  TcContext,
  DataNotFoundError,
  NoPermissionError,
  call,
  PERMISSION,
  NotFoundError,
  SYSTEM_USERID,
} from 'tailchat-server-sdk';
import type { Group } from '../../../models/group/group';
import { isValidStr } from '../../../lib/utils';
import _ from 'lodash';

interface MessageService
  extends TcService,
    TcDbService<MessageDocument, MessageModel> {}
class MessageService extends TcService {
  get serviceName(): string {
    return 'chat.message';
  }

  onInit(): void {
    this.registerLocalDb(require('../../../models/chat/message').default);

    this.registerAction('fetchConverseMessage', this.fetchConverseMessage, {
      params: {
        converseId: 'string',
        startId: { type: 'string', optional: true },
      },
    });
    this.registerAction('fetchNearbyMessage', this.fetchNearbyMessage, {
      params: {
        groupId: { type: 'string', optional: true },
        converseId: 'string',
        messageId: 'string',
        num: { type: 'number', optional: true },
      },
    });
    this.registerAction('sendMessage', this.sendMessage, {
      params: {
        converseId: 'string',
        groupId: [{ type: 'string', optional: true }],
        content: 'string',
        plain: { type: 'string', optional: true },
        meta: { type: 'any', optional: true },
      },
    });
    this.registerAction('recallMessage', this.recallMessage, {
      params: {
        messageId: 'string',
      },
    });
    this.registerAction('getMessage', this.getMessage, {
      params: {
        messageId: 'string',
      },
    });
    this.registerAction('deleteMessage', this.deleteMessage, {
      params: {
        messageId: 'string',
      },
    });
    this.registerAction('clearConverseMessages', this.clearConverseMessages, {
      params: {
        converseId: 'string',
        type: { type: 'string', default: 'local' },
      },
    });
    this.registerAction('searchMessage', this.searchMessage, {
      params: {
        groupId: { type: 'string', optional: true },
        converseId: 'string',
        text: 'string',
      },
    });
    this.registerAction(
      'fetchConverseLastMessages',
      this.fetchConverseLastMessages,
      {
        params: {
          converseIds: 'array',
        },
      }
    );
    this.registerAction('addReaction', this.addReaction, {
      params: {
        messageId: 'string',
        emoji: 'string',
      },
    });
    this.registerAction('removeReaction', this.removeReaction, {
      params: {
        messageId: 'string',
        emoji: 'string',
      },
    });
  }

  /**
   * 获取会话消息
   */
  async fetchConverseMessage(
    ctx: TcContext<{
      converseId: string;
      startId?: string;
    }>
  ) {
    const { converseId, startId } = ctx.params;
    const docs = await this.adapter.model.fetchConverseMessage(
      converseId,
      startId ?? null
    );

    return this.transformDocuments(ctx, {}, docs);
  }

  /**
   * 获取一条消息附近的消息
   * 以会话为准
   *
   * 额外需要converseId是为了防止暴力查找
   */
  async fetchNearbyMessage(
    ctx: TcContext<{
      groupId?: string;
      converseId: string;
      messageId: string;
      num?: number;
    }>
  ) {
    const { groupId, converseId, messageId, num = 5 } = ctx.params;
    const { t } = ctx.meta;

    // 鉴权是否能获取到会话内容
    await this.checkConversePermission(ctx, converseId, groupId);

    const message = await this.adapter.model
      .findOne({
        _id: new Types.ObjectId(messageId),
        converseId: new Types.ObjectId(converseId),
      })
      .limit(1)
      .exec();

    if (!message) {
      throw new DataNotFoundError(t('没有找到消息'));
    }

    const [prev, next] = await Promise.all([
      this.adapter.model
        .find({
          _id: {
            $lt: new Types.ObjectId(messageId),
          },
          converseId: new Types.ObjectId(converseId),
        })
        .sort({ _id: -1 })
        .limit(num)
        .exec()
        .then((arr) => arr.reverse()),
      this.adapter.model
        .find({
          _id: {
            $gt: new Types.ObjectId(messageId),
          },
          converseId: new Types.ObjectId(converseId),
        })
        .sort({ _id: 1 })
        .limit(num)
        .exec(),
    ]);

    console.log({ prev, next });

    return this.transformDocuments(ctx, {}, [...prev, message, ...next]);
  }

  /**
   * 发送普通消息
   */
  async sendMessage(
    ctx: TcContext<{
      converseId: string;
      groupId?: string;
      content: string;
      plain?: string;
      meta?: object;
    }>
  ) {
    const { converseId, groupId, content, plain, meta } = ctx.params;
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;
    const isGroupMessage = isValidStr(groupId);

    /**
     * 鉴权
     */
    await this.checkConversePermission(ctx, converseId, groupId); // 鉴权是否能获取到会话内容
    if (isGroupMessage) {
      // 是群组消息, 鉴权是否禁言
      const groupInfo = await call(ctx).getGroupInfo(groupId);
      const member = groupInfo.members.find((m) => String(m.userId) === userId);
      if (member) {
        // 因为有机器人，所以如果没有在成员列表中找到不报错
        if (new Date(member.muteUntil).valueOf() > new Date().valueOf()) {
          throw new Error(t('您因为被禁言无法发送消息'));
        }
      }
    }

    const message = await this.adapter.insert({
      converseId: new Types.ObjectId(converseId),
      groupId:
        typeof groupId === 'string' ? new Types.ObjectId(groupId) : undefined,
      author: new Types.ObjectId(userId),
      content,
      meta,
    });

    const json = await this.transformDocuments(ctx, {}, message);

    if (isGroupMessage) {
      this.roomcastNotify(ctx, converseId, 'add', json);
    } else {
      // 如果是私信的话需要基于用户去推送
      // 因为用户可能不订阅消息(删除了dmlist)
      const converseInfo = await call(ctx).getConverseInfo(converseId);
      if (converseInfo) {
        const converseMemberIds = converseInfo.members.map((m) => String(m));

        call(ctx)
          .isUserOnline(converseMemberIds)
          .then((onlineList) => {
            _.zip(converseMemberIds, onlineList).forEach(
              ([memberId, isOnline]) => {
                if (isOnline) {
                  // 用户在线，则直接推送，通过客户端来创建会话
                  this.unicastNotify(ctx, memberId, 'add', json);
                } else {
                  // 用户离线，确保追加到会话中
                  ctx.call(
                    'user.dmlist.addConverse',
                    { converseId },
                    {
                      meta: {
                        userId: memberId,
                      },
                    }
                  );
                }
              }
            );
          });
      }
    }

    ctx.emit('chat.message.updateMessage', {
      type: 'add',
      groupId: groupId ? String(groupId) : undefined,
      converseId: String(converseId),
      messageId: String(message._id),
      author: userId,
      content,
      plain,
      meta: meta ?? {},
    });

    return json;
  }

  /**
   * 撤回消息
   */
  async recallMessage(ctx: TcContext<{ messageId: string }>) {
    const { messageId } = ctx.params;
    const { t, userId } = ctx.meta;

    const message = await this.adapter.model.findById(messageId);
    if (!message) {
      throw new DataNotFoundError(t('该消息未找到'));
    }

    if (message.hasRecall === true) {
      throw new Error(t('该消息已被撤回'));
    }

    // 消息撤回限时
    if (
      moment().valueOf() - moment(message.createdAt).valueOf() >
      15 * 60 * 1000
    ) {
      throw new Error(t('无法撤回 {{minutes}} 分钟前的消息', { minutes: 15 }));
    }

    let allowToRecall = false;

    //#region 撤回权限检查
    const groupId = message.groupId;
    if (groupId) {
      // 是一条群组信息
      const group: GroupBaseInfo = await ctx.call('group.getGroupBasicInfo', {
        groupId: String(groupId),
      });
      if (String(group.owner) === userId) {
        allowToRecall = true; // 是管理员 允许修改
      }
    }

    if (String(message.author) === String(userId)) {
      // 撤回者是消息所有者
      allowToRecall = true;
    }

    if (allowToRecall === false) {
      throw new NoPermissionError(t('撤回失败, 没有权限'));
    }
    //#endregion

    const converseId = String(message.converseId);
    message.hasRecall = true;
    await message.save();

    const json = await this.transformDocuments(ctx, {}, message);

    this.roomcastNotify(ctx, converseId, 'update', json);
    ctx.emit('chat.message.updateMessage', {
      type: 'recall',
      groupId: groupId ? String(groupId) : undefined,
      converseId: String(converseId),
      messageId: String(message._id),
      meta: message.meta ?? {},
    });

    return json;
  }

  /**
   * 获取消息
   */
  async getMessage(ctx: TcContext<{ messageId: string }>) {
    const { messageId } = ctx.params;
    const { t, userId } = ctx.meta;
    const message = await this.adapter.model.findById(messageId);
    if (!message) {
      throw new DataNotFoundError(t('该消息未找到'));
    }
    const converseId = String(message.converseId);
    const groupId = message.groupId;
    // 鉴权
    if (!groupId) {
      // 私人会话
      const converseInfo = await call(ctx).getConverseInfo(converseId);
      if (!converseInfo.members.map((m) => String(m)).includes(userId)) {
        throw new NoPermissionError(t('没有当前会话权限'));
      }
    } else {
      // 群组会话
      const groupInfo = await call(ctx).getGroupInfo(String(groupId));
      if (!groupInfo.members.map((m) => m.userId).includes(userId)) {
        throw new NoPermissionError(t('没有当前会话权限'));
      }
    }
    return message;
  }

  /**
   * 删除消息（逻辑删除）
   * 支持私聊和群组，根据权限判断
   */
  async deleteMessage(ctx: TcContext<{ messageId: string }>) {
    const { messageId } = ctx.params;
    const { t, userId } = ctx.meta;

    const message = await this.adapter.model.findById(messageId);
    if (!message) {
      throw new DataNotFoundError(t('该消息未找到'));
    }

    if (message.isDeleted) {
      throw new Error(t('该消息已被删除'));
    }

    const converseId = String(message.converseId);
    const groupId = message.groupId;

    // 权限校验
    let allowToDelete = false;

    if (!groupId) {
      // 私聊场景
      const converseInfo = await call(ctx).getConverseInfo(converseId);
      const memberIds = converseInfo.members.map((m) => String(m));

      if (!memberIds.includes(userId)) {
        throw new NoPermissionError(t('没有当前会话权限'));
      }

      // 私聊中：作者可以删除自己的消息
      if (String(message.author) === userId) {
        allowToDelete = true;
      }
    } else {
      // 群组场景
      const groupInfo = await call(ctx).getGroupInfo(String(groupId));

      // 群主可以删除任何消息
      if (String(groupInfo.owner) === userId) {
        allowToDelete = true;
      } else {
        // 检查是否有删除权限
        const [hasPermission] = await call(ctx).checkUserPermissions(
          String(groupId),
          userId,
          [PERMISSION.core.deleteMessage]
        );

        if (hasPermission) {
          allowToDelete = true;
        } else if (String(message.author) === userId) {
          // 作者可以删除自己的消息
          allowToDelete = true;
        }
      }
    }

    if (!allowToDelete) {
      throw new NoPermissionError(t('没有删除权限'));
    }

    // 执行逻辑删除
    message.isDeleted = true;
    message.deletedBy = new Types.ObjectId(userId);
    message.deletedAt = new Date();
    await message.save();

    const json = await this.transformDocuments(ctx, {}, message);

    // Socket.io 广播删除事件
    if (groupId) {
      this.roomcastNotify(ctx, converseId, 'delete', {
        converseId,
        messageId,
        deletedBy: userId,
        deletedAt: message.deletedAt,
      });
    } else {
      // 私聊：通知所有会话成员
      const converseInfo = await call(ctx).getConverseInfo(converseId);
      converseInfo.members.forEach((memberId) => {
        this.unicastNotify(ctx, String(memberId), 'delete', {
          converseId,
          messageId,
          deletedBy: userId,
          deletedAt: message.deletedAt,
        });
      });
    }

    ctx.emit('chat.message.updateMessage', {
      type: 'delete',
      groupId: groupId ? String(groupId) : undefined,
      converseId,
      messageId,
      meta: message.meta ?? {},
    });

    return { success: true, messageId };
  }

  /**
   * 清空会话消息
   * @param type 'local' | 'global' - 仅本地清空（不影响他人）或全局清空
   */
  async clearConverseMessages(
    ctx: TcContext<{
      converseId: string;
      type: 'local' | 'global';
    }>
  ) {
    const { converseId, type } = ctx.params;
    const { t, userId } = ctx.meta;

    // 鉴权
    await this.checkConversePermission(ctx, converseId);

    if (type === 'local') {
      // 仅本地清空：通知当前用户客户端
      this.unicastNotify(ctx, userId, 'clearLocal', { converseId });

      return { success: true, type: 'local', converseId };
    }

    // 全局清空：需要更高权限
    const messages = await this.adapter.model.find({ converseId }).limit(1);
    const groupId = messages[0]?.groupId;

    if (groupId) {
      // 群组需要管理员权限
      const [hasPermission] = await call(ctx).checkUserPermissions(
        String(groupId),
        userId,
        [PERMISSION.core.deleteMessage]
      );

      if (!hasPermission) {
        throw new NoPermissionError(t('需要管理员权限才能清空群组消息'));
      }
    }

    // 批量逻辑删除
    await this.adapter.model.updateMany(
      { converseId, isDeleted: false },
      {
        $set: {
          isDeleted: true,
          deletedBy: new Types.ObjectId(userId),
          deletedAt: new Date(),
        },
      }
    );

    // 广播清空事件
    if (groupId) {
      this.roomcastNotify(ctx, converseId, 'clear', {
        converseId,
        clearedBy: userId,
        clearedAt: new Date(),
      });
    } else {
      const converseInfo = await call(ctx).getConverseInfo(converseId);
      converseInfo.members.forEach((memberId) => {
        this.unicastNotify(ctx, String(memberId), 'clear', {
          converseId,
          clearedBy: userId,
          clearedAt: new Date(),
        });
      });
    }

    return { success: true, type: 'global', converseId };
  }

  /**
   * 搜索消息
   */
  async searchMessage(
    ctx: TcContext<{ groupId?: string; converseId: string; text: string }>
  ) {
    const { groupId, converseId, text } = ctx.params;
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;

    if (groupId) {
      const groupInfo = await call(ctx).getGroupInfo(groupId);
      if (!groupInfo.members.map((m) => m.userId).includes(userId)) {
        throw new Error(t('不是群组成员无法搜索消息'));
      }
    }

    const messages = this.adapter.model
      .find({
        groupId: groupId ?? null,
        converseId,
        content: {
          $regex: text,
        },
        author: {
          $not: {
            $eq: SYSTEM_USERID,
          },
        },
      })
      .sort({ _id: -1 })
      .limit(10)
      .maxTimeMS(5 * 1000); // 超过5s的查询直接放弃

    return messages;
  }

  /**
   * 基于会话id获取会话最后一条消息的id
   */
  async fetchConverseLastMessages(ctx: TcContext<{ converseIds: string[] }>) {
    const { converseIds } = ctx.params;

    // 这里使用了多个请求，但是通过limit=1会将查询范围降低到最低
    // 这种方式会比用聚合操作实际上更加节省资源
    const list = await Promise.all(
      converseIds.map((id) => {
        return this.adapter.model
          .findOne(
            {
              converseId: new Types.ObjectId(id),
            },
            {
              _id: 1,
              converseId: 1,
            }
          )
          .sort({
            _id: -1,
          })
          .limit(1)
          .exec();
      })
    );

    return list.map((item) =>
      item
        ? {
            converseId: String(item.converseId),
            lastMessageId: String(item._id),
          }
        : null
    );
  }

  async addReaction(
    ctx: TcContext<{
      messageId: string;
      emoji: string;
    }>
  ) {
    const { messageId, emoji } = ctx.params;
    const userId = ctx.meta.userId;

    const message = await this.adapter.model.findById(messageId);

    const appendReaction = {
      name: emoji,
      author: new Types.ObjectId(userId),
    };

    await this.adapter.model.updateOne(
      {
        _id: messageId,
      },
      {
        $push: {
          reactions: {
            ...appendReaction,
          },
        },
      }
    );

    const converseId = String(message.converseId);
    this.roomcastNotify(ctx, converseId, 'addReaction', {
      converseId,
      messageId,
      reaction: {
        ...appendReaction,
      },
    });

    return true;
  }

  async removeReaction(
    ctx: TcContext<{
      messageId: string;
      emoji: string;
    }>
  ) {
    const { messageId, emoji } = ctx.params;
    const userId = ctx.meta.userId;

    const message = await this.adapter.model.findById(messageId);

    const removedReaction = {
      name: emoji,
      author: new Types.ObjectId(userId),
    };

    await this.adapter.model.updateOne(
      {
        _id: messageId,
      },
      {
        $pull: {
          reactions: {
            ...removedReaction,
          },
        },
      }
    );

    const converseId = String(message.converseId);
    this.roomcastNotify(ctx, converseId, 'removeReaction', {
      converseId,
      messageId,
      reaction: {
        ...removedReaction,
      },
    });

    return true;
  }

  /**
   * 校验会话权限，如果没有抛出异常则视为正常
   */
  private async checkConversePermission(
    ctx: TcContext,
    converseId: string,
    groupId?: string
  ) {
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;
    if (userId === SYSTEM_USERID) {
      return;
    }

    const userInfo = await call(ctx).getUserInfo(userId); // TODO: 可以通过在默认的meta信息中追加用户类型来减少一次请求来优化
    if (userInfo.type === 'pluginBot') {
      // 如果是插件机器人则拥有所有权限(开放平台机器人需要添加到群组才有会话权限)
      return;
    }

    // 鉴权是否能获取到会话内容
    if (groupId) {
      // 是群组
      const group = await call(ctx).getGroupInfo(groupId);
      if (group.members.findIndex((m) => String(m.userId) === userId) === -1) {
        // 不存在该用户
        throw new NoPermissionError(t('没有当前会话权限'));
      }
    } else {
      // 是普通会话
      const converse = await ctx.call<
        any,
        {
          converseId: string;
        }
      >('chat.converse.findConverseInfo', {
        converseId,
      });

      if (!converse) {
        throw new NotFoundError(t('没有找到会话信息'));
      }
      const memebers = converse.members ?? [];
      if (memebers.findIndex((member) => String(member) === userId) === -1) {
        throw new NoPermissionError(t('没有当前会话权限'));
      }
    }
  }
}

export default MessageService;
