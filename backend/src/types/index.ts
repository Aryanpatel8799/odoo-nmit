export type ID = string;

export interface User {
  _id: ID;
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  isActive: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: Omit<User, 'password'>;
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export type ProjectRole = 'owner' | 'member';

export interface ProjectMember {
  userId: ID;
  role: ProjectRole;
  joinedAt: Date;
}

export interface Project {
  _id: ID;
  name: string;
  description?: string;
  ownerId: ID;
  members: ProjectMember[];
  tags?: string[];
  deadline?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  _id: ID;
  projectId: ID;
  title: string;
  description?: string;
  assigneeId?: ID;
  dueDate?: Date;
  status: TaskStatus;
  tags?: string[];
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Thread {
  _id: ID;
  projectId: ID;
  title: string;
  authorId: ID;
  createdAt: Date;
  updatedAt: Date;
  replyCount: number;
  lastReplyAt?: Date;
  tags?: string[];
}

export interface Reply {
  _id: ID;
  threadId: ID;
  authorId: ID;
  body: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationType = 'task_assigned' | 'task_status_changed' | 'thread_new' | 'reply_new' | 'project_invite';

export interface Notification {
  _id: ID;
  userId: ID;
  type: NotificationType;
  title: string;
  message: string;
  payload: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filter?: Record<string, any>;
}

export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}
