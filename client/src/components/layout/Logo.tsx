import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo Component
 * Displays the TaskFlow logo and app branding
 * Provides navigation to home page
 */
const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
      {/* App Logo */}
      <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-yellow-500 rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          TaskFlow
        </h1>
        <p className="text-xs text-gray-500 -mt-1">
          Project Management
        </p>
      </div>
    </Link>
  );
};

export default Logo; 