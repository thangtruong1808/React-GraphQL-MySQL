import React from 'react';
import { Link } from 'react-router-dom';
import { InlineError } from '../../../../components/ui';
import { ROUTE_PATHS } from '../../../../constants/routingConstants';

/**
 * Project Detail Error Props
 */
export interface ProjectDetailErrorProps {
  error: Error;
}

/**
 * Project Detail Error Component
 * Displays error state for project detail page
 */
export const ProjectDetailError: React.FC<ProjectDetailErrorProps> = ({ error }) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <InlineError message={error.message} />
          <div className="mt-6">
            <Link
              to={ROUTE_PATHS.PROJECTS}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              ← Back to Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

