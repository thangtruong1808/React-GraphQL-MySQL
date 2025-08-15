import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * HomePage Skeleton Component
 * Shows loading skeleton while authentication is being initialized
 */
const HomePageSkeleton: React.FC = () => {
  return (
    <div className="min-h-full bg-gray-50">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="h-12 bg-gray-200 rounded-lg mb-6 animate-pulse max-w-2xl mx-auto"></div>
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse max-w-3xl mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Main Content Section Skeleton */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 1 Skeleton */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Card 2 Skeleton */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="h-8 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * HomePage Component
 * Landing page that welcomes users and provides navigation options
 * Shows different content based on authentication status
 */
const HomePage: React.FC = () => {
  const { isAuthenticated, user, isInitializing, isLoading } = useAuth();

  // Show skeleton while authentication is being initialized or loading
  // This prevents showing unauthenticated state during session restoration
  // Use both conditions to ensure skeleton shows during all loading states
  if (isInitializing || isLoading) {
    return <HomePageSkeleton />;
  }

  // If we're not loading but also not authenticated, show the unauthenticated content
  // This handles the case where authentication failed or user is truly not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-full bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  GraphQL Auth App
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                A secure authentication system built with React, GraphQL, and MySQL
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Get Started
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    Sign in to your account to access the application.
                  </p>
                </div>

                {/* Navigation buttons */}
                <div className="mb-8">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </Link>
                </div>

                {/* Features list */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 font-medium">Secure JWT Authentication</span>
                    </div>
                    <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 font-medium">Session Management</span>
                    </div>
                    <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 font-medium">Role-based Access Control</span>
                    </div>
                    <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 font-medium">Real-time Activity Tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated - show authenticated content
  return (
    <div className="min-h-full bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                GraphQL Auth App
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A secure authentication system built with React, GraphQL, and MySQL
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Welcome Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.firstName}!
                </h2>
                <p className="text-gray-600 text-lg">
                  You are successfully logged in to the system.
                </p>
              </div>

              {/* Success message */}
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Successfully Authenticated
                </div>
              </div>
            </div>

            {/* User Information Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">User Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-900">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Role:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800">
                    {user?.role}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 