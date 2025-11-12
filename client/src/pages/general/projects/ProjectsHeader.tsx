import React from 'react';

/**
 * Description: Renders the public projects hero with themed typography and statistics.
 * Data created: None; consumes provided total project count.
 * Author: thangtruong
 */

interface ProjectsHeaderProps {
  totalProjects: number;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ totalProjects }) => {
  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-7xl mx-auto rounded-2xl shadow-lg p-8 border theme-border"
        style={{
          backgroundColor: 'var(--card-bg)',
          backgroundImage: 'var(--card-surface-overlay)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 28px 48px var(--shadow-color)'
        }}
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Explore Our{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, var(--accent-from), var(--accent-to))' }}
            >
              Projects
            </span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            Discover {totalProjects} innovative projects managed through TaskFlow. From cutting-edge technology solutions to business-critical applications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHeader;
