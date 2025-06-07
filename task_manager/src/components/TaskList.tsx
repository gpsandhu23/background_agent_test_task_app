import React from 'react';
import { Task, TaskPriority } from '../types/Task';
import { TaskItem } from './TaskItem';
import { TaskView } from '../hooks/useTasks';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  currentView: TaskView;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onComplete,
  onDelete,
  onEdit,
  currentView
}) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found</p>
        <p className="empty-state-hint">
          {currentView === TaskView.TODAY && "Add a task to get started"}
          {currentView === TaskView.UPCOMING && "No upcoming tasks"}
          {currentView === TaskView.COMPLETED && "No completed tasks yet"}
          {currentView === TaskView.ALL && "Create your first task"}
        </p>
      </div>
    );
  }

  // Group tasks by priority for better organization
  const groupedTasks = tasks.reduce((groups, task) => {
    if (currentView === TaskView.COMPLETED) {
      // Don't group completed tasks
      groups.all.push(task);
    } else {
      groups[task.priority].push(task);
    }
    return groups;
  }, {
    [TaskPriority.HIGH]: [] as Task[],
    [TaskPriority.MEDIUM]: [] as Task[],
    [TaskPriority.LOW]: [] as Task[],
    all: [] as Task[]
  });

  return (
    <div className="task-list">
      {currentView === TaskView.COMPLETED ? (
        <div className="task-group">
          {groupedTasks.all.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : (
        <>
          {groupedTasks[TaskPriority.HIGH].length > 0 && (
            <div className="task-group">
              <h3 className="task-group-title high-priority">High Priority</h3>
              {groupedTasks[TaskPriority.HIGH].map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}
          
          {groupedTasks[TaskPriority.MEDIUM].length > 0 && (
            <div className="task-group">
              <h3 className="task-group-title medium-priority">Medium Priority</h3>
              {groupedTasks[TaskPriority.MEDIUM].map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}
          
          {groupedTasks[TaskPriority.LOW].length > 0 && (
            <div className="task-group">
              <h3 className="task-group-title low-priority">Low Priority</h3>
              {groupedTasks[TaskPriority.LOW].map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};