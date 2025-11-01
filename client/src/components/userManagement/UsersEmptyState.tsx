import React from 'react';

/**
 * Users Empty State Component
 * Displays message when no users are found
 */
const UsersEmptyState: React.FC = () => {
  return (
    <tr>
      <td colSpan={8} className="px-6 py-12 text-center">
        <div>
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>No users found</h3>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria.</p>
        </div>
      </td>
    </tr>
  );
};

export default UsersEmptyState;

