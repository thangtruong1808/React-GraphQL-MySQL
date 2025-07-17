import React from 'react';

/**
 * Login Header Component
 * Displays the login page header with logo and welcome message
 */
const LoginHeader: React.FC = () => {
  return (
    <div className="text-center">
      {/* Logo/Icon */}
      <div className="mx-auto h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-6">
        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Welcome back
      </h2>
      <p className="text-gray-600 text-sm">
        Sign in to your account to continue
      </p>
    </div>
  );
};

export default LoginHeader; 