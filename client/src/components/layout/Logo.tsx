import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo Component Props
 */
interface LogoProps {
  collapsed?: boolean;
}

/**
 * Logo Component
 * Displays the TaskFlow logo and app branding with modern styling
 * Provides navigation to home page with consistent typography
 * Supports collapsed state for sidebar toggle functionality
 */
const Logo: React.FC<LogoProps> = ({ collapsed = false }) => {
  return (
    <Link
      to="/"
      className="flex items-center space-x-3 flex-shrink-0 group transition-all duration-300 hover:scale-105"
      title="TaskFlow - Project Management Platform"
    >
      {/* App Logo - Modern gradient with GraphQL theme */}
      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
        </svg>
      </div>

      {/* Brand Text - Only show when not collapsed */}
      {!collapsed && (
        <div className="flex flex-col">
          <h1 className="text-base font-medium text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
            TaskFlow
          </h1>
          <p className="text-sm text-gray-500 group-hover:text-purple-500 transition-colors duration-300">
            Project Management
          </p>
        </div>
      )}
    </Link>
  );
};

export default Logo; 