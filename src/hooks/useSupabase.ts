import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { Task } from '../types/task';
import toast from 'react-hot-toast';

export function useSupabase() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    const subscription = supabase
      .channel('agent_tasks_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'agent_tasks' 
      }, handleTaskChange)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchTasks() {
    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data.map(mapDatabaseTaskToTask));
    } catch (error) {
      toast.error('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const { data, error } = await supabase
        .from('agent_tasks')
        .insert([{
          type: task.type,
          status: task.status,
          priority: task.priority,
          context: task.context,
          steps: task.steps
        }])
        .select()
        .single();

      if (error) throw error;
      toast.success('Task created successfully');
      return mapDatabaseTaskToTask(data);
    } catch (error) {
      toast.error('Failed to create task');
      console.error('Error creating task:', error);
      throw error;
    }
  }

  function handleTaskChange(payload: any) {
    if (payload.new) {
      setTasks(current => {
        const index = current.findIndex(t => t.id === payload.new.id);
        const updatedTask = mapDatabaseTaskToTask(payload.new);
        
        if (index >= 0) {
          const updated = [...current];
          updated[index] = updatedTask;
          return updated;
        }
        return [updatedTask, ...current];
      });
    }
  }

  function mapDatabaseTaskToTask(dbTask: any): Task {
    return {
      id: dbTask.id,
      type: dbTask.type,
      status: dbTask.status,
      priority: dbTask.priority,
      steps: dbTask.steps,
      context: dbTask.context,
      result: dbTask.result,
      error: dbTask.error,
      createdAt: new Date(dbTask.created_at),
      updatedAt: new Date(dbTask.updated_at),
      completedAt: dbTask.completed_at ? new Date(dbTask.completed_at) : undefined
    };
  }

  return {
    tasks,
    loading,
    createTask,
    refreshTasks: fetchTasks
  };
}