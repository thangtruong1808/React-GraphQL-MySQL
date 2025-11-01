import React from 'react';

/**
 * Projects Empty State Component
 * Displays empty state when no projects are found
 */
const ProjectsEmptyState: React.FC = () => {
  return (
    <tr>
      <td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>No projects found</p>
          <p style={{ color: 'var(--text-secondary)' }}>Get started by creating a new project.</p>
        </div>
      </td>
    </tr>
  );
};

export default ProjectsEmptyState;

