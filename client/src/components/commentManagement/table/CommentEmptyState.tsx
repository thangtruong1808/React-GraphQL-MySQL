import React from 'react';

/**
 * Comment Empty State Component
 * Displays message when no comments are found
 */
const CommentEmptyState: React.FC = () => {
  return (
    <tr>
      <td colSpan={9} className="px-6 py-12 text-center" style={{ color: 'var(--text-secondary)' }}>
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-lg font-medium mb-1" style={{ color: 'var(--text-primary)' }}>No comments found</p>
          <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search criteria or create a new comment.</p>
        </div>
      </td>
    </tr>
  );
};

export default CommentEmptyState;

