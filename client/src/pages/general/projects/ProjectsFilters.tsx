import React from 'react';

/**
 * Projects Filters Component
 * Displays status-based filter buttons showing project counts
 */

interface ProjectCounts {
  total: number;
  planning: number;
  inProgress: number;
  completed: number;
}

interface ProjectsFiltersProps {
  filter: 'ALL' | 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED';
  setFilter: (filter: 'ALL' | 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED') => void;
  projectCounts: ProjectCounts;
}

/**
 * Filter component for projects page displaying status-based filtering buttons
 * Shows database-wide statistics for all projects
 */
const ProjectsFilters: React.FC<ProjectsFiltersProps> = ({ filter, setFilter, projectCounts }) => {
  const filterOptions = [
    {
      key: 'ALL' as const,
      label: 'All Projects',
      count: projectCounts.total,
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
    },
    {
      key: 'PLANNING' as const,
      label: 'Planning',
      count: projectCounts.planning,
      icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
    },
    {
      key: 'IN_PROGRESS' as const,
      label: 'In Progress',
      count: projectCounts.inProgress,
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    {
      key: 'COMPLETED' as const,
      label: 'Completed',
      count: projectCounts.completed,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
  ];

  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="flex flex-wrap gap-4 justify-center">
          {filterOptions.map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-500 ${filter === filterOption.key
                  ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-gray-200 hover:border-purple-500 transition-all duration-500 transform hover:scale-105 hover:shadow-lg'
                }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={filterOption.icon} />
              </svg>
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsFilters;
