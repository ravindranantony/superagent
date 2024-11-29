import React, { useState } from 'react';
import { Task, TaskPriority } from '../types/task';
import { PlusIcon } from '@heroicons/react/24/solid';

interface TaskCreatorProps {
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
}

const TaskCreator: React.FC<TaskCreatorProps> = ({ onCreateTask }) => {
  const [type, setType] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    
    setSubmitting(true);
    try {
      await onCreateTask({
        type,
        status: 'PENDING',
        priority,
        steps: [],
        context: {
          userId: 'user-1',
          parameters: {}
        }
      });
      setType('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Task Type
          </label>
          <input
            type="text"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            placeholder="Enter task type..."
            disabled={submitting}
            required
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            disabled={submitting}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full flex justify-center items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white shadow-sm ${
            submitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
          }`}
        >
          <PlusIcon className="h-5 w-5" />
          {submitting ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskCreator;