import React from 'react';
import { Task } from '../types/task';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getStatusIcon = (status: Task['status']) => {
    const icons = {
      PENDING: <ClockIcon className="h-5 w-5 text-yellow-500" />,
      RUNNING: <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />,
      COMPLETED: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
      FAILED: <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
    };
    return icons[status];
  };

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      PENDING: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
      RUNNING: 'bg-blue-50 text-blue-700 ring-blue-600/20',
      COMPLETED: 'bg-green-50 text-green-700 ring-green-600/20',
      FAILED: 'bg-red-50 text-red-700 ring-red-600/20'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      LOW: 'text-gray-600 bg-gray-100',
      MEDIUM: 'text-yellow-600 bg-yellow-100',
      HIGH: 'text-red-600 bg-red-100'
    };
    return colors[priority];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium text-gray-900">{task.type}</h3>
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">ID: {task.id}</p>
        </div>
        <div className={`flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(task.status)}`}>
          <span className="flex items-center gap-1">
            {getStatusIcon(task.status)}
            {task.status}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <ClockIcon className="h-4 w-4 mr-1" />
          Created: {task.createdAt.toLocaleString()}
        </div>
        {task.completedAt && (
          <div className="flex items-center text-sm text-gray-500">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Completed: {task.completedAt.toLocaleString()}
          </div>
        )}
      </div>

      {task.error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 rounded-md p-3">
          <ExclamationCircleIcon className="h-4 w-4 inline mr-1" />
          {task.error}
        </div>
      )}
    </div>
  );
};

export default TaskCard;