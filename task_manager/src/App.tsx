import React, { useState, useMemo } from 'react';
import './App.css';
import { useTasks, TaskView } from './hooks/useTasks';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { SearchBar } from './components/SearchBar';
import { ViewSwitcher } from './components/ViewSwitcher';
import { Task, TaskStatus } from './types/Task';

function App() {
  const {
    tasks,
    loading,
    currentView,
    searchQuery,
    setCurrentView,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    searchTasks,
    refreshTasks
  } = useTasks();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Calculate task counts from all tasks
  const taskCounts = useMemo(() => {
    const allTasks = tasks;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      today: allTasks.filter(t => 
        t.status === TaskStatus.TODO && 
        t.dueDate && 
        new Date(t.dueDate) < tomorrow
      ).length,
      upcoming: allTasks.filter(t => 
        t.status === TaskStatus.TODO && 
        t.dueDate && 
        new Date(t.dueDate) >= tomorrow
      ).length,
      completed: allTasks.filter(t => t.status === TaskStatus.COMPLETED).length,
      all: allTasks.filter(t => t.status === TaskStatus.TODO).length
    };
  }, [tasks]);

  const handleCreateTask = (task: Partial<Task>) => {
    if (task.title) {
      createTask(task.title, task);
      setShowTaskForm(false);
    }
  };

  const handleUpdateTask = (task: Partial<Task>) => {
    if (editingTask && task.title) {
      updateTask(editingTask.id, task);
      setEditingTask(null);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    if (editingTask?.id === taskId) {
      setEditingTask(null);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>TaskFlow</h1>
        <p className="app-tagline">Focus on what matters most</p>
      </header>

      <div className="app-controls">
        <SearchBar
          value={searchQuery}
          onChange={searchTasks}
          placeholder="Search tasks..."
        />
        <button
          className="add-task-btn"
          onClick={() => setShowTaskForm(true)}
          aria-label="Add new task"
        >
          +
        </button>
      </div>

      <ViewSwitcher
        currentView={currentView}
        onViewChange={setCurrentView}
        taskCounts={taskCounts}
      />

      <main className="app-main">
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={tasks}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            currentView={currentView}
          />
        )}
      </main>

      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default App;