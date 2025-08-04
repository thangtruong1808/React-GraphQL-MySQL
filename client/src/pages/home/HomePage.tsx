import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * HomePage Component
 * Landing page that welcomes users and provides navigation options
 * Shows different content based on authentication status
 */
const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-emerald-800 mb-4">
            Welcome to GraphQL Auth App
          </h1>
          <p className="text-xl text-emerald-600 max-w-2xl mx-auto">
            A secure authentication system built with React, GraphQL, and MySQL
          </p>
        </div>

        {/* Content based on authentication status */}
        {isAuthenticated ? (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-semibold">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome back, {user?.firstName}!
              </h2>
              <p className="text-gray-600">
                You are successfully logged in to the system.
              </p>
            </div>

            {/* User info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="text-sm text-gray-600 mb-2">User Information:</div>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Email:</span> {user?.email}</div>
                <div><span className="font-medium">Role:</span> {user?.role}</div>
                <div><span className="font-medium">Status:</span> Active</div>
              </div>
            </div>

            {/* Success message */}
            <div className="text-center">
              <p className="text-emerald-600 font-medium">
                ✅ You are successfully authenticated!
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Get Started
              </h2>
              <p className="text-gray-600 mb-6">
                Sign in to your account or create a new one to access the application.
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="space-y-4">
              <Link
                to="/login"
                className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>

            {/* Features list */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Features
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-center">
                  <span className="text-emerald-600 mr-2">✓</span>
                  Secure JWT Authentication
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-600 mr-2">✓</span>
                  Session Management
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-600 mr-2">✓</span>
                  Role-based Access Control
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-600 mr-2">✓</span>
                  GraphQL API
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 