import React from 'react';

/**
 * Description: Offers themed status filter buttons with count badges for the public projects page.
 * Data created: None; acts on provided counts/state setter.
 * Author: thangtruong
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
      <div
        className="max-w-7xl mx-auto rounded-2xl shadow-lg p-8 border theme-border"
        style={{
          backgroundColor: 'var(--card-bg)',
          backgroundImage: 'var(--card-surface-overlay)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 24px 48px var(--shadow-color)'
        }}
      >
        <div className="flex flex-wrap gap-4 justify-center">
          {filterOptions.map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className="flex items-center px-6 py-3 rounded-lg text-sm font-medium border theme-border transition-all duration-300 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={
                filter === filterOption.key
                  ? {
                      backgroundImage: 'linear-gradient(120deg, var(--accent-from), var(--accent-to))',
                      color: 'var(--button-primary-text)',
                      boxShadow: '0 18px 36px rgba(124, 58, 237, 0.22)',
                      borderColor: 'var(--accent-ring)'
                    }
                  : {
                      backgroundColor: 'var(--card-bg)',
                      backgroundImage: 'var(--card-surface-overlay)',
                      color: 'var(--text-secondary)',
                      borderColor: 'var(--border-color)',
                      boxShadow: '0 16px 32px var(--shadow-color)'
                    }
              }
              onMouseEnter={(event) => {
                if (filter !== filterOption.key) {
                  event.currentTarget.style.backgroundColor = 'var(--card-hover-bg)';
                }
              }}
              onMouseLeave={(event) => {
                if (filter !== filterOption.key) {
                  event.currentTarget.style.backgroundColor = 'var(--card-bg)';
                }
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: filter === filterOption.key ? 'var(--button-primary-text)' : 'var(--text-secondary)' }}>
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
