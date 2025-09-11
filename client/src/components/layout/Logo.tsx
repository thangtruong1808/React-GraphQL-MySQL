import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo Component
 * Displays the TaskFlow logo and app branding with modern styling
 * Provides navigation to home page with consistent typography
 */
const Logo: React.FC = () => {
  return (
    <Link
      to="/"
      className="flex items-center space-x-3 flex-shrink-0 group transition-all duration-300 hover:scale-105"
      title="TaskFlow - Project Management Platform"
    >
      {/* App Logo - Modern gradient with purple theme */}
      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      </div>

      {/* Brand Text - Consistent with navigation typography */}
      <div className="flex flex-col">
        <h1 className="text-base font-medium text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
          TaskFlow
        </h1>
        <p className="text-sm text-gray-500 group-hover:text-purple-500 transition-colors duration-300">
          Project Management
        </p>
      </div>
    </Link>
  );
};

export default Logo; 