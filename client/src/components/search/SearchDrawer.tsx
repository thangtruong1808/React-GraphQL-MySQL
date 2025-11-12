import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from './SearchInput';
import ProjectFilters from './ProjectFilters';
import TaskFilters from './TaskFilters';
import RoleFilters from './RoleFilters';

const INITIAL_PROJECT_FILTERS = { planning: false, inProgress: false, completed: false };
const INITIAL_TASK_FILTERS = { todo: false, inProgress: false, completed: false };

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Description: Sliding search drawer with theme-aware styling and filter orchestration; Data created: Drawer-local query and filter state via useState hooks; Author: thangtruong */
const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilters, setProjectFilters] = useState(INITIAL_PROJECT_FILTERS);
  const [taskFilters, setTaskFilters] = useState(INITIAL_TASK_FILTERS);
  const [roleFilters, setRoleFilters] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();
  const hasProjectFilters = Object.values(projectFilters).some(Boolean);
  const hasTaskFilters = Object.values(taskFilters).some(Boolean);
  const hasRoleFilters = Object.values(roleFilters).some(Boolean);
  const hasAnyFilters = hasProjectFilters || hasTaskFilters || hasRoleFilters;

  // Event: update search query from text input.
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Event: clear search value from the input.
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Event: toggle a project status filter.
  const handleProjectFilterChange = (status: keyof typeof projectFilters) => {
    setProjectFilters(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  // Event: reset all project status filters.
  const handleClearProjectFilters = () => {
    setProjectFilters({ ...INITIAL_PROJECT_FILTERS });
  };

  // Event: toggle a task status filter.
  const handleTaskFilterChange = (status: keyof typeof taskFilters) => {
    setTaskFilters(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  // Event: reset all task status filters.
  const handleClearTaskFilters = () => {
    setTaskFilters({ ...INITIAL_TASK_FILTERS });
  };

  // Event: toggle a role filter selection.
  const handleRoleFilterChange = (role: string) => {
    setRoleFilters(prev => ({
      ...prev,
      [role]: !prev[role]
    }));
  };

  // Event: clear every role filter selection.
  const handleClearRoleFilters = () => {
    setRoleFilters({});
  };

  // Event: submit search form to navigate to results.
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const hasQuery = searchQuery.trim().length > 0;

    if (hasQuery || hasProjectFilters || hasTaskFilters || hasRoleFilters) {
      const params = new URLSearchParams();

      if (hasQuery) {
        params.set('q', searchQuery.trim());
      }

      const selectedProjectFilters = Object.entries(projectFilters)
        .filter(([_, isSelected]) => isSelected)
        .map(([status, _]) => {
          switch (status) {
            case 'planning':
              return 'PLANNING';
            case 'inProgress':
              return 'IN_PROGRESS';
            case 'completed':
              return 'COMPLETED';
            default:
              return status.toUpperCase();
          }
        });

      if (selectedProjectFilters.length > 0) {
        params.set('projectStatus', selectedProjectFilters.join(','));
      }

      const selectedTaskFilters = Object.entries(taskFilters)
        .filter(([_, isSelected]) => isSelected)
        .map(([status, _]) => {
          switch (status) {
            case 'todo':
              return 'TODO';
            case 'inProgress':
              return 'IN_PROGRESS';
            case 'completed':
              return 'DONE';
            default:
              return status.toUpperCase();
          }
        });

      if (selectedTaskFilters.length > 0) {
        params.set('taskStatus', selectedTaskFilters.join(','));
      }

      const selectedRoleFilters = Object.entries(roleFilters)
        .filter(([_, isSelected]) => isSelected)
        .map(([role, _]) => role);

      if (selectedRoleFilters.length > 0) {
        params.set('roleFilter', selectedRoleFilters.join(','));
      }

      navigate(`/search?${params.toString()}`);
      handleClose();
    }
  };

  // Event: close the drawer and reset all filters.
  const handleClose = () => {
    setSearchQuery('');
    setProjectFilters({ ...INITIAL_PROJECT_FILTERS });
    setTaskFilters({ ...INITIAL_TASK_FILTERS });
    setRoleFilters({});
    onClose();
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={handleClose}
        />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-[28rem] transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-primary)',
          borderRight: '1px solid var(--border-color)',
          boxShadow: '0 32px 64px var(--shadow-color)'
        }}
      >
        <div className="flex items-center justify-between p-4 border-b theme-border" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Search</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg transition-colors"
            aria-label="Close search drawer"
            style={{ backgroundColor: 'transparent', color: 'var(--text-secondary)' }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor = 'var(--tab-inactive-hover-bg)';
              event.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor = 'transparent';
              event.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'inherit' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          onSubmit={handleSearchSubmit}
          hasFilters={hasAnyFilters}
        />

        <RoleFilters
          roleFilters={roleFilters}
          onRoleFilterChange={handleRoleFilterChange}
          onClearRoleFilters={handleClearRoleFilters}
        />

        <ProjectFilters
          projectFilters={projectFilters}
          onProjectFilterChange={handleProjectFilterChange}
          onClearProjectFilters={handleClearProjectFilters}
        />

        <TaskFilters
          taskFilters={taskFilters}
          onTaskFilterChange={handleTaskFilterChange}
          onClearTaskFilters={handleClearTaskFilters}
        />

      </div>
    </>
  );
};

export default SearchDrawer;