import React from 'react';

/**
 * No Search Criteria Component
 * Displays empty state when no search criteria is provided
 * Follows React best practices with proper TypeScript interfaces
 */

/**
 * NoSearchCriteria Component
 * Renders empty state with search icon and helpful message
 */
const NoSearchCriteria: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        {/* Search icon */}
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Empty state message */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">No search criteria provided</h3>
        <p className="text-gray-500">
          Please enter a search term or select project/task status filters to find results.
        </p>
      </div>
    </div>
  );
};

export default NoSearchCriteria;
