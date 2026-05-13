export type TaskPriority = 'high' | 'medium' | 'low';

export interface TaskItemType {
  _id: string;
  creator: string;
  assignee?: string[];
  title: string;
  desc?: string;
  priority?: TaskPriority;
  deadline?: string;
  tags?: string[];
  done: boolean;
  expiredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
