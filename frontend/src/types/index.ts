export type ID = string;

export type User = {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type AuthSession = {
  user: User;
  token: string;
  expiresAt: number;
};

export type ProjectRole = 'owner' | 'member';

export type ProjectMember = {
  userId: ID;
  role: ProjectRole;
};

export type Project = {
  id: ID;
  name: string;
  description?: string;
  ownerId: ID;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
};

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type Task = {
  id: ID;
  projectId: ID;
  title: string;
  description?: string;
  assigneeId?: ID;
  dueDate?: string; // ISO
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
};

export type Thread = {
  id: ID;
  projectId: ID;
  title: string;
  authorId: ID;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
};

export type Reply = {
  id: ID;
  threadId: ID;
  authorId: ID;
  body: string;
  createdAt: string;
};

export type NotificationType = 'task_assigned' | 'task_status_changed' | 'thread_new' | 'reply_new';

export type Notification = {
  id: ID;
  userId: ID;
  type: NotificationType;
  payload: Record<string, unknown>;
  createdAt: string;
  read: boolean;
};
