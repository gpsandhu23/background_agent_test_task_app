import React, { useState, useRef, TouchEvent } from 'react';
import { Task, TaskPriority, TaskStatus, RecurrenceType } from '../types/Task';
import { format } from 'date-fns';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onComplete,
  onDelete,
  onEdit
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const startXRef = useRef(0);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    
    // Only allow swiping for non-completed tasks
    if (task.status !== TaskStatus.COMPLETED) {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    const threshold = 100;
    
    if (swipeOffset > threshold) {
      // Swipe right - complete
      handleComplete();
    } else if (swipeOffset < -threshold) {
      // Swipe left - delete
      setIsDeleting(true);
      setTimeout(() => {
        onDelete(task.id);
      }, 300);
    }
    
    setSwipeOffset(0);
  };

  const handleComplete = () => {
    if (task.status !== TaskStatus.COMPLETED) {
      onComplete(task.id);
    }
  };

  const handleClick = () => {
    if (Math.abs(swipeOffset) < 5) {
      onEdit(task);
    }
  };

  const getPriorityClass = () => {
    switch (task.priority) {
      case TaskPriority.HIGH:
        return 'priority-high';
      case TaskPriority.MEDIUM:
        return 'priority-medium';
      case TaskPriority.LOW:
        return 'priority-low';
      default:
        return '';
    }
  };

  const getRecurrenceIcon = () => {
    switch (task.recurrence) {
      case RecurrenceType.DAILY:
        return '🔁 Daily';
      case RecurrenceType.WEEKLY:
        return '🔁 Weekly';
      case RecurrenceType.MONTHLY:
        return '🔁 Monthly';
      default:
        return null;
    }
  };

  const isOverdue = task.dueDate && 
    task.status !== TaskStatus.COMPLETED && 
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div
      ref={itemRef}
      className={`task-item ${task.status === TaskStatus.COMPLETED ? 'completed' : ''} ${isDeleting ? 'deleting' : ''} ${isOverdue ? 'overdue' : ''}`}
      style={{ transform: `translateX(${swipeOffset}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <div className="task-swipe-background">
        <div className="swipe-complete">✓</div>
        <div className="swipe-delete">✕</div>
      </div>
      
      <div className="task-content">
        <button
          className={`task-checkbox ${getPriorityClass()}`}
          onClick={(e) => {
            e.stopPropagation();
            handleComplete();
          }}
          aria-label={task.status === TaskStatus.COMPLETED ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.status === TaskStatus.COMPLETED && '✓'}
        </button>
        
        <div className="task-details">
          <h4 className="task-title">{task.title}</h4>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          <div className="task-meta">
            {task.dueDate && (
              <span className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
                {format(new Date(task.dueDate), 'MMM d')}
              </span>
            )}
            {getRecurrenceIcon() && (
              <span className="task-recurrence">{getRecurrenceIcon()}</span>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="task-tags">
                {task.tags.map(tag => (
                  <span key={tag} className="task-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <button
          className="task-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>
    </div>
  );
};