import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/graphql/useAuth';
import Button from '../ui/Button';

/**
 * Header Component
 * Global navigation header with authentication-aware content
 * Displays logo, navigation links, and user menu
 */
const Header: React.FC = () => {
  const { currentUser, isAuthenticated, handleLogout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Application logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">GraphQL App</h1>
              </div>
            </Link>
          </div>

          {/* Main navigation menu - hidden on mobile */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/projects"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Projects
                </Link>
                <Link
                  to="/tasks"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Tasks
                </Link>
              </>
            )}
          </nav>

          {/* User authentication menu - shows different content based on auth status */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              // Authenticated user menu with welcome message and logout
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  Welcome, {currentUser?.username || 'User'}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              // Guest user menu with login and register buttons
              <div className="flex items-center space-x-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 