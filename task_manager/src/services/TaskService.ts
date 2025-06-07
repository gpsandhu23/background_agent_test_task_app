import { Task, TaskPriority, TaskStatus, RecurrenceType } from '../types/Task';
import { addDays, addWeeks, addMonths, startOfDay } from 'date-fns';

const STORAGE_KEY = 'taskflow_tasks';
const COMPLETED_RETENTION_DAYS = 30;

export class TaskService {
  private static instance: TaskService;

  private constructor() {}

  static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  // Get all tasks from local storage
  getAllTasks(): Task[] {
    const tasksJson = localStorage.getItem(STORAGE_KEY);
    if (!tasksJson) return [];
    
    const tasks = JSON.parse(tasksJson);
    // Convert date strings back to Date objects
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      completedAt: task.completedAt ? new Date(task.completedAt) : null
    }));
  }

  // Save tasks to local storage
  private saveTasks(tasks: Task[]): void {
    // Clean up old completed tasks
    const cleanedTasks = this.cleanupOldCompletedTasks(tasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedTasks));
  }

  // Clean up completed tasks older than retention period
  private cleanupOldCompletedTasks(tasks: Task[]): Task[] {
    const cutoffDate = addDays(new Date(), -COMPLETED_RETENTION_DAYS);
    return tasks.filter(task => 
      task.status !== TaskStatus.COMPLETED || 
      (task.completedAt && task.completedAt > cutoffDate)
    );
  }

  // Create a new task
  createTask(title: string, options?: Partial<Task>): Task {
    const newTask: Task = {
      id: this.generateId(),
      title,
      description: options?.description || '',
      priority: options?.priority || TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: options?.dueDate || null,
      createdAt: new Date(),
      completedAt: null,
      recurrence: options?.recurrence || RecurrenceType.NONE,
      tags: options?.tags || []
    };

    const tasks = this.getAllTasks();
    tasks.push(newTask);
    this.saveTasks(tasks);
    
    return newTask;
  }

  // Update an existing task
  updateTask(id: string, updates: Partial<Task>): Task | null {
    const tasks = this.getAllTasks();
    const index = tasks.findIndex(task => task.id === id);
    
    if (index === -1) return null;
    
    tasks[index] = { ...tasks[index], ...updates };
    this.saveTasks(tasks);
    
    return tasks[index];
  }

  // Complete a task
  completeTask(id: string): Task | null {
    const tasks = this.getAllTasks();
    const task = tasks.find(t => t.id === id);
    
    if (!task) return null;
    
    // Handle recurring tasks
    if (task.recurrence !== RecurrenceType.NONE) {
      this.createRecurringTask(task);
    }
    
    return this.updateTask(id, {
      status: TaskStatus.COMPLETED,
      completedAt: new Date()
    });
  }

  // Create next instance of recurring task
  private createRecurringTask(originalTask: Task): void {
    let nextDueDate = originalTask.dueDate ? new Date(originalTask.dueDate) : new Date();
    
    switch (originalTask.recurrence) {
      case RecurrenceType.DAILY:
        nextDueDate = addDays(nextDueDate, 1);
        break;
      case RecurrenceType.WEEKLY:
        nextDueDate = addWeeks(nextDueDate, 1);
        break;
      case RecurrenceType.MONTHLY:
        nextDueDate = addMonths(nextDueDate, 1);
        break;
    }
    
    this.createTask(originalTask.title, {
      ...originalTask,
      dueDate: startOfDay(nextDueDate),
      status: TaskStatus.TODO,
      completedAt: null
    });
  }

  // Delete a task
  deleteTask(id: string): boolean {
    const tasks = this.getAllTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === tasks.length) return false;
    
    this.saveTasks(filteredTasks);
    return true;
  }

  // Search tasks
  searchTasks(query: string): Task[] {
    const tasks = this.getAllTasks();
    const lowercaseQuery = query.toLowerCase();
    
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description?.toLowerCase().includes(lowercaseQuery) ||
      task.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get tasks for today
  getTodayTasks(): Task[] {
    const tasks = this.getAllTasks();
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    
    return tasks.filter(task =>
      task.status === TaskStatus.TODO &&
      task.dueDate &&
      task.dueDate >= today &&
      task.dueDate < tomorrow
    );
  }

  // Get upcoming tasks
  getUpcomingTasks(): Task[] {
    const tasks = this.getAllTasks();
    const tomorrow = addDays(startOfDay(new Date()), 1);
    
    return tasks.filter(task =>
      task.status === TaskStatus.TODO &&
      task.dueDate &&
      task.dueDate >= tomorrow
    );
  }

  // Get overdue tasks
  getOverdueTasks(): Task[] {
    const tasks = this.getAllTasks();
    const today = startOfDay(new Date());
    
    return tasks.filter(task =>
      task.status === TaskStatus.TODO &&
      task.dueDate &&
      task.dueDate < today
    );
  }

  // Generate unique ID
  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}