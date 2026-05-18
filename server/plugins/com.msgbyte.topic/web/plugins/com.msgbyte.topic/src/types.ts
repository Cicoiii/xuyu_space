export interface GroupTopicComment {
  author: string;
  authorLiked?: boolean;
  content: string;
  id: string;
  images?: string[];
  pinned?: boolean;
  replyCommentId?: string;
  upvotes?: string[];
}

export interface GroupTopic {
  _id: string;
  author: string;
  comments: GroupTopicComment[];
  content: string;
  createdAt: string;
  groupId: string;
  images?: string[];
  meta?: object;
  panelId: string;
  updatedAt: string;
  upvotes?: string[];
}
