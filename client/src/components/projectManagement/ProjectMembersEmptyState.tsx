import React from 'react';

/**
 * Project Members Empty State Component
 * Displays empty state when no members are found
 */
const ProjectMembersEmptyState: React.FC = () => {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-12 text-center" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <p className="text-lg font-medium mb-1" style={{ color: 'var(--text-primary)' }}>No members found</p>
          <p style={{ color: 'var(--text-secondary)' }}>Add members to this project to get started.</p>
        </div>
      </td>
    </tr>
  );
};

export default ProjectMembersEmptyState;

