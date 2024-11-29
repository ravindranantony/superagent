import React from 'react';
import { Toaster } from 'react-hot-toast';
import TaskList from './TaskList';
import TaskCreator from './TaskCreator';
import LoadingSpinner from './LoadingSpinner';
import { useSupabase } from '../hooks/useSupabase';

const TaskManager: React.FC = () => {
  const { tasks, loading, createTask } = useSupabase();

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TaskCreator onCreateTask={createTask} />
        </div>
        
        <div className="lg:col-span-2">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Tasks</h2>
              <TaskList tasks={tasks} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;