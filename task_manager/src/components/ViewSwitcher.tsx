import React from 'react';
import { TaskView } from '../hooks/useTasks';
import './ViewSwitcher.css';

interface ViewSwitcherProps {
  currentView: TaskView;
  onViewChange: (view: TaskView) => void;
  taskCounts: {
    today: number;
    upcoming: number;
    completed: number;
    all: number;
  };
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  currentView,
  onViewChange,
  taskCounts
}) => {
  const views = [
    { id: TaskView.TODAY, label: 'Today', count: taskCounts.today, icon: '📅' },
    { id: TaskView.UPCOMING, label: 'Upcoming', count: taskCounts.upcoming, icon: '🔮' },
    { id: TaskView.COMPLETED, label: 'Completed', count: taskCounts.completed, icon: '✅' },
    { id: TaskView.ALL, label: 'All Tasks', count: taskCounts.all, icon: '📋' },
  ];

  return (
    <div className="view-switcher">
      {views.map(view => (
        <button
          key={view.id}
          className={`view-tab ${currentView === view.id ? 'active' : ''}`}
          onClick={() => onViewChange(view.id)}
          aria-label={`Show ${view.label} tasks`}
          aria-current={currentView === view.id ? 'page' : undefined}
        >
          <span className="view-icon">{view.icon}</span>
          <span className="view-label">{view.label}</span>
          {view.count > 0 && (
            <span className="view-count">{view.count}</span>
          )}
        </button>
      ))}
    </div>
  );
};