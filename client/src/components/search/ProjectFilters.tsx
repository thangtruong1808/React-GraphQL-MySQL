import React from 'react';

/** Description: Project status checkbox group inside search drawer; Data created: None, relies on parent state callbacks; Author: thangtruong */
interface ProjectFiltersProps {
  projectFilters: {
    planning: boolean;
    inProgress: boolean;
    completed: boolean;
  };
  onProjectFilterChange: (status: keyof ProjectFiltersProps['projectFilters']) => void;
  onClearProjectFilters: () => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  projectFilters,
  onProjectFilterChange,
  onClearProjectFilters
}) => {
  const hasSelectedFilters = Object.values(projectFilters).some(Boolean);

  return (
    <div className="p-4 border-b theme-border" style={{ backgroundColor: 'var(--card-bg)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Filter by Project Status</h3>
        {hasSelectedFilters && (
          <button
            onClick={onClearProjectFilters}
            className="text-xs font-medium transition-colors"
            style={{ color: 'var(--accent-from)' }}
            onMouseEnter={(event) => {
              event.currentTarget.style.color = 'var(--accent-to)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color = 'var(--accent-from)';
            }}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={projectFilters.planning}
            onChange={() => onProjectFilterChange('planning')}
            className="w-4 h-4 rounded theme-border"
            style={{
              accentColor: 'var(--project-status-planning-text)',
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--card-bg)'
            }}
          />
          <div className="flex items-center space-x-2 flex-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--project-status-planning-text)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span
              className="text-sm transition-colors group-hover:text-[var(--text-primary)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              Planning
            </span>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={projectFilters.inProgress}
            onChange={() => onProjectFilterChange('inProgress')}
            className="w-4 h-4 rounded theme-border"
            style={{
              accentColor: 'var(--project-status-in-progress-text)',
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--card-bg)'
            }}
          />
          <div className="flex items-center space-x-2 flex-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--project-status-in-progress-text)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span
              className="text-sm transition-colors group-hover:text-[var(--text-primary)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              In Progress
            </span>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={projectFilters.completed}
            onChange={() => onProjectFilterChange('completed')}
            className="w-4 h-4 rounded theme-border"
            style={{
              accentColor: 'var(--project-status-completed-text)',
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--card-bg)'
            }}
          />
          <div className="flex items-center space-x-2 flex-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--project-status-completed-text)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span
              className="text-sm transition-colors group-hover:text-[var(--text-primary)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              Completed
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ProjectFilters;
