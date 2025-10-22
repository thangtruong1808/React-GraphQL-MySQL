import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../../constants/routingConstants';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * Projects Call to Action Component
 * Displays call to action section for project exploration
 * Hides login button for authenticated users
 */
const ProjectsCallToAction: React.FC = () => {
  // Get authentication state to conditionally show login button
  const { isAuthenticated } = useAuth();

  // Don't render the CTA section for authenticated users
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="text-center rounded-2xl p-8 border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-gray-700 mb-6">
            Join our community and start managing your projects with TaskFlow today.
          </p>
          <Link
            to={ROUTE_PATHS.LOGIN}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get Started with TaskFlow
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectsCallToAction;
