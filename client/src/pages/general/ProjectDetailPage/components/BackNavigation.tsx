import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../../../constants/routingConstants';

/**
 * Back Navigation Component
 * Displays navigation link back to projects page
 */
export const BackNavigation: React.FC = () => {
  return (
    <div className="mb-6">
      <Link to={ROUTE_PATHS.PROJECTS} className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Projects
      </Link>
    </div>
  );
};

