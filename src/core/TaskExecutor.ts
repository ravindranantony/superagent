import { Task, TaskStep } from '../types/task';
import { WebAutomation } from '../services/WebAutomation';
import { APIConnector } from '../services/APIConnector';
import { CredentialManager } from '../services/CredentialManager';

export class TaskExecutor {
  private webAutomation: WebAutomation;
  private apiConnector: APIConnector;
  private credentialManager: CredentialManager;

  constructor() {
    this.webAutomation = new WebAutomation();
    this.apiConnector = new APIConnector();
    this.credentialManager = new CredentialManager();
  }

  async executeTask(task: Task): Promise<Record<string, any>> {
    const { steps, context } = task;
    const results: Record<string, any> = {};

    for (const step of steps) {
      try {
        const stepResult = await this.executeStep(step, context);
        results[step.id] = stepResult;
      } catch (error: any) {
        throw new Error(`Failed to execute step ${step.id}: ${error?.message || 'Unknown error'}`);
      }
    }

    return results;
  }

  // Rest of the code remains the same
}