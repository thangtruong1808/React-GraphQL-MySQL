import React from 'react';

/**
 * Activity Empty State Component
 * Displays message when no activities are found
 */
const ActivityEmptyState: React.FC = () => {
  return (
    <tr>
      <td colSpan={10} className="px-6 py-12 text-center theme-table-text-secondary">
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 theme-table-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg font-medium theme-table-text-primary mb-1">No activities found</p>
          <p className="theme-table-text-secondary">Try adjusting your search criteria or create a new activity.</p>
        </div>
      </td>
    </tr>
  );
};

export default ActivityEmptyState;

