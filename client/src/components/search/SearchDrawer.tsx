import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from './SearchInput';
import ProjectFilters from './ProjectFilters';
import TaskFilters from './TaskFilters';

/**
 * Search Drawer Component
 * Left-side sliding drawer for search input with clear functionality
 * Follows React best practices with component separation and state management
 */

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SearchDrawer Component
 * Renders a sliding drawer with search input that navigates to results page
 */
const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose }) => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for project status filters
  const [projectFilters, setProjectFilters] = useState({
    planning: false,
    inProgress: false,
    completed: false
  });
  // State for task status filters
  const [taskFilters, setTaskFilters] = useState({
    todo: false,
    inProgress: false,
    completed: false
  });
  const navigate = useNavigate();

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle clear search input
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Handle project status filter change
  const handleProjectFilterChange = (status: keyof typeof projectFilters) => {
    setProjectFilters(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  // Handle clear all project filters
  const handleClearProjectFilters = () => {
    setProjectFilters({
      planning: false,
      inProgress: false,
      completed: false
    });
  };

  // Handle task status filter change
  const handleTaskFilterChange = (status: keyof typeof taskFilters) => {
    setTaskFilters(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  // Handle clear all task filters
  const handleClearTaskFilters = () => {
    setTaskFilters({
      todo: false,
      inProgress: false,
      completed: false
    });
  };

  // Handle search submission
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Check if there's a search query or any filters selected
    const hasQuery = searchQuery.trim().length > 0;
    const hasProjectFilters = Object.values(projectFilters).some(Boolean);
    const hasTaskFilters = Object.values(taskFilters).some(Boolean);

    if (hasQuery || hasProjectFilters || hasTaskFilters) {
      // Build query parameters including project and task filters
      const params = new URLSearchParams();

      // Add search query if provided
      if (hasQuery) {
        params.set('q', searchQuery.trim());
      }

      // Add project status filters if any are selected
      const selectedProjectFilters = Object.entries(projectFilters)
        .filter(([_, isSelected]) => isSelected)
        .map(([status, _]) => status.toUpperCase());

      if (selectedProjectFilters.length > 0) {
        params.set('projectStatus', selectedProjectFilters.join(','));
      }

      // Add task status filters if any are selected
      const selectedTaskFilters = Object.entries(taskFilters)
        .filter(([_, isSelected]) => isSelected)
        .map(([status, _]) => status.toUpperCase());

      if (selectedTaskFilters.length > 0) {
        params.set('taskStatus', selectedTaskFilters.join(','));
      }

      // Navigate to search results page with query parameters
      navigate(`/search?${params.toString()}`);
      handleClose();
    }
  };

  // Handle drawer close
  const handleClose = () => {
    setSearchQuery('');
    setProjectFilters({
      planning: false,
      inProgress: false,
      completed: false
    });
    setTaskFilters({
      todo: false,
      inProgress: false,
      completed: false
    });
    onClose();
  };

  // Handle escape key press
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

  // Prevent body scroll when drawer is open
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

      {/* Search drawer */}
      <div
        className={`fixed left-0 top-0 h-full w-[28rem] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Search</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close search drawer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search input */}
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          onSubmit={handleSearchSubmit}
          hasFilters={Object.values(projectFilters).some(Boolean) || Object.values(taskFilters).some(Boolean)}
        />

        {/* Project Status Filters */}
        <ProjectFilters
          projectFilters={projectFilters}
          onProjectFilterChange={handleProjectFilterChange}
          onClearProjectFilters={handleClearProjectFilters}
        />

        {/* Task Status Filters */}
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