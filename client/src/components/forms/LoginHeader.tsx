import React from 'react';

/**
 * Login Header Component
 * Displays the login page header with logo and welcome message
 */
const LoginHeader: React.FC = () => {
  return (
    <div className="text-center">
      {/* Logo/Icon - Exact match with NavBar logo */}
      <div className="mx-auto w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white [data-theme='brand']:text-purple-900 mb-2">
        Welcome back
      </h2>
      <p className="text-gray-600 dark:text-gray-300 [data-theme='brand']:text-purple-700 text-sm mb-3">
        Sign in to your account to continue
      </p>
      <div className="bg-blue-50 dark:bg-blue-900/20 [data-theme='brand']:bg-purple-50 border border-blue-200 dark:border-blue-800 [data-theme='brand']:border-purple-200 rounded-lg p-3 mb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-gray-500 dark:text-gray-400 [data-theme='brand']:text-purple-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-600 dark:text-gray-300 [data-theme='brand']:text-purple-700">
              <span className="font-medium">Dashboard Access:</span> Only administrators and project managers can access the dashboard features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader; 