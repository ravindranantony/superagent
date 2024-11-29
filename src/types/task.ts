export type TaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface TaskStep {
  id: string;
  type: string;
  status: TaskStatus;
  data: Record<string, any>;
}

export interface TaskContext {
  userId: string;
  credentials?: Record<string, any>;
  parameters: Record<string, any>;
}

export interface Task {
  id: string;
  type: string;
  status: TaskStatus;
  priority: TaskPriority;
  steps: TaskStep[];
  context: TaskContext;
  result?: Record<string, any>;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}