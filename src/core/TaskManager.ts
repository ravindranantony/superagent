import { Task, TaskStatus, TaskStep } from '../types/task';
import { TaskExecutor } from './TaskExecutor';
import { PriorityQueue } from '../utils/PriorityQueue';

export class TaskManager {
  private queue: PriorityQueue<Task>;
  private executor: TaskExecutor;
  private running: Map<string, Task>;

  constructor() {
    this.queue = new PriorityQueue<Task>((a, b) => 
      this.getPriorityValue(a.priority) - this.getPriorityValue(b.priority)
    );
    this.executor = new TaskExecutor();
    this.running = new Map();
  }

  private getPriorityValue(priority: Task['priority']): number {
    const values = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return values[priority];
  }

  async scheduleTask(task: Task): Promise<void> {
    this.queue.enqueue(task);
    this.processNextTask();
  }

  async processNextTask(): Promise<void> {
    if (this.running.size >= 5) return; // Max concurrent tasks

    const task = this.queue.dequeue();
    if (!task) return;

    this.running.set(task.id, task);
    
    try {
      const result = await this.executor.executeTask(task);
      this.updateTaskStatus(task.id, 'COMPLETED', result);
    } catch (error) {
      this.updateTaskStatus(task.id, 'FAILED', undefined, error.message);
    }

    this.running.delete(task.id);
    this.processNextTask();
  }

  private updateTaskStatus(
    taskId: string,
    status: TaskStatus,
    result?: Record<string, any>,
    error?: string
  ): void {
    const task = this.running.get(taskId);
    if (!task) return;

    task.status = status;
    task.result = result;
    task.error = error;
    task.completedAt = status === 'COMPLETED' ? new Date() : undefined;
  }

  getTaskStatus(taskId: string): TaskStatus | null {
    const task = this.running.get(taskId) || this.queue.find(t => t.id === taskId);
    return task ? task.status : null;
  }
}