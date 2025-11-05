import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../../../constants/routingConstants';

/**
 * Project Detail NotFound Component
 * Displays not found state for project detail page
 */
export const ProjectDetailNotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-gray-500 mb-6">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
            <p className="text-gray-600">The project you're looking for doesn't exist or has been removed.</p>
          </div>
          <Link
            to={ROUTE_PATHS.PROJECTS}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

