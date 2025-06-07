import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, TaskPriority, TaskStatus, RecurrenceType } from '../types/Task';
import { TaskService } from '../services/TaskService';

export enum TaskView {
  TODAY = 'today',
  UPCOMING = 'upcoming',
  COMPLETED = 'completed',
  ALL = 'all'
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<TaskView>(TaskView.TODAY);
  const [searchQuery, setSearchQuery] = useState('');

  const taskService = useMemo(() => TaskService.getInstance(), []);

  // Sort tasks by priority and due date
  const sortTasks = useCallback((a: Task, b: Task): number => {
    // First sort by priority
    const priorityOrder = {
      [TaskPriority.HIGH]: 0,
      [TaskPriority.MEDIUM]: 1,
      [TaskPriority.LOW]: 2
    };
    
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by due date (earlier dates first)
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // Finally by creation date
    return b.createdAt.getTime() - a.createdAt.getTime();
  }, []);

  const loadTasks = useCallback(() => {
    setLoading(true);
    try {
      let loadedTasks: Task[] = [];
      
      switch (currentView) {
        case TaskView.TODAY:
          const overdueTasks = taskService.getOverdueTasks();
          const todayTasks = taskService.getTodayTasks();
          loadedTasks = [...overdueTasks, ...todayTasks].sort(sortTasks);
          break;
        case TaskView.UPCOMING:
          loadedTasks = taskService.getUpcomingTasks().sort(sortTasks);
          break;
        case TaskView.COMPLETED:
          loadedTasks = taskService.getAllTasks()
            .filter(task => task.status === TaskStatus.COMPLETED)
            .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0));
          break;
        case TaskView.ALL:
          loadedTasks = taskService.getAllTasks()
            .filter(task => task.status === TaskStatus.TODO)
            .sort(sortTasks);
          break;
      }
      
      setTasks(loadedTasks);
    } finally {
      setLoading(false);
    }
  }, [currentView, taskService, sortTasks]);

  // Load tasks on mount and view change
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Create a new task
  const createTask = useCallback((
    title: string,
    options?: Partial<Task>
  ) => {
    const newTask = taskService.createTask(title, options);
    loadTasks();
    return newTask;
  }, [taskService, loadTasks]);

  // Update a task
  const updateTask = useCallback((
    id: string,
    updates: Partial<Task>
  ) => {
    const updatedTask = taskService.updateTask(id, updates);
    if (updatedTask) {
      loadTasks();
    }
    return updatedTask;
  }, [taskService, loadTasks]);

  // Complete a task
  const completeTask = useCallback((id: string) => {
    const completedTask = taskService.completeTask(id);
    if (completedTask) {
      loadTasks();
    }
    return completedTask;
  }, [taskService, loadTasks]);

  // Delete a task
  const deleteTask = useCallback((id: string) => {
    const success = taskService.deleteTask(id);
    if (success) {
      loadTasks();
    }
    return success;
  }, [taskService, loadTasks]);

  // Search tasks
  const searchTasks = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query) {
      loadTasks();
      return;
    }
    
    const results = taskService.searchTasks(query);
    setTasks(results.sort(sortTasks));
  }, [taskService, loadTasks, sortTasks]);

  // Get filtered tasks based on search
  const filteredTasks = searchQuery
    ? tasks
    : tasks;

  return {
    tasks: filteredTasks,
    loading,
    currentView,
    searchQuery,
    setCurrentView,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    searchTasks,
    refreshTasks: loadTasks
  };
};