import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // Handle search submission
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Check if there's a search query or any filters selected
    const hasQuery = searchQuery.trim().length > 0;
    const hasFilters = Object.values(projectFilters).some(Boolean);

    if (hasQuery || hasFilters) {
      // Build query parameters including project filters
      const params = new URLSearchParams();

      // Add search query if provided
      if (hasQuery) {
        params.set('q', searchQuery.trim());
      }

      // Add project status filters if any are selected
      const selectedFilters = Object.entries(projectFilters)
        .filter(([_, isSelected]) => isSelected)
        .map(([status, _]) => status.toUpperCase());

      if (selectedFilters.length > 0) {
        params.set('projectStatus', selectedFilters.join(','));
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
        <div className="p-4 border-b border-gray-200">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by member name, project, or task..."
                className={`w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${searchQuery ? 'pr-32' : 'pr-20'
                  }`}
              />
              {/* Search icon */}
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {/* Clear icon */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-20 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10 group"
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {/* Search button */}
              <button
                type="submit"
                disabled={!searchQuery.trim() && !Object.values(projectFilters).some(Boolean)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors z-10"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Project Status Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Filter by Project Status
            </h3>
            {Object.values(projectFilters).some(Boolean) && (
              <button
                onClick={handleClearProjectFilters}
                className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-3">
            {/* Planning Status */}
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={projectFilters.planning}
                onChange={() => handleProjectFilterChange('planning')}
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Planning</span>
              </div>
            </label>

            {/* In Progress Status */}
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={projectFilters.inProgress}
                onChange={() => handleProjectFilterChange('inProgress')}
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">In Progress</span>
              </div>
            </label>

            {/* Completed Status */}
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={projectFilters.completed}
                onChange={() => handleProjectFilterChange('completed')}
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Completed</span>
              </div>
            </label>
          </div>
        </div>

        {/* Search instructions */}
        {/* <div className="flex-1 overflow-y-auto p-4">
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search TaskFlow</h3>
            <p className="text-gray-500 mb-4">
              Enter your search terms above to find members, projects, and tasks across the platform.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Search for team members by name or email</p>
              <p>• Find projects by name or description</p>
              <p>• Locate tasks by title or content</p>
            </div>
          </div>
        </div> */}


      </div>
    </>
  );
};

export default SearchDrawer;