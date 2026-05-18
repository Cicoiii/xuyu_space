import { db } from 'tailchat-server-sdk';
const { getModelForClass, prop, TimeStamps, modelOptions } = db;
import type { Types } from 'mongoose';
import { nanoid } from 'nanoid';

class GroupTopicComment extends TimeStamps {
  @prop({
    default: () => nanoid(8),
  })
  id: string;

  @prop()
  content: string;

  @prop({
    type: () => String,
    default: [],
  })
  images: string[];

  @prop()
  author: string;

  /**
   * 回复他人评论的id
   */
  @prop()
  replyCommentId?: string;

  @prop({
    type: () => String,
    default: [],
  })
  upvotes: string[];

  /**
   * 话题作者是否赞过该评论
   */
  @prop({
    default: false,
  })
  authorLiked: boolean;

  /**
   * 是否置顶评论
   */
  @prop({
    default: false,
  })
  pinned: boolean;
}

@modelOptions({
  options: {
    customName: 'p_topic',
  },
})
export class GroupTopic extends TimeStamps implements db.Base {
  _id: Types.ObjectId;
  id: string;

  @prop()
  content: string;

  @prop({
    type: () => String,
    default: [],
  })
  images: string[];

  @prop()
  author: string;

  @prop()
  groupId: string;

  /**
   * 会话面板id
   */
  @prop()
  panelId: string;

  @prop({
    type: () => GroupTopicComment,
    default: [],
  })
  comments: GroupTopicComment[];

  @prop({
    type: () => String,
    default: [],
  })
  upvotes: string[];

  /**
   * 话题的其他数据
   */
  @prop()
  meta?: object;
}

export type GroupTopicDocument = db.DocumentType<GroupTopic>;

const model = getModelForClass(GroupTopic);

export type GroupTopicModel = typeof model;

export default model;
