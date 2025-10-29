import React from 'react';
import { LoginForm, LoginHeader, LoginFooter, LoginCredentials } from '../../components/forms';

/**
 * Login Page Component
 * Main login page that combines all login-related components
 * Skeleton loading is handled by PublicRoute for better UX
 * Provides a clean and organized layout for user authentication
 */
const LoginPage: React.FC = () => {

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden login-page">
        {/* Enhanced background container for better theme integration */}
        <div className="absolute inset-0 login-container opacity-60"></div>

        {/* Login Form Container - Fixed width with enhanced positioning */}
        <div className="max-w-lg w-full relative z-10">
          {/* Card Container - Theme-aware design with direct theme classes */}
          <div className="rounded-2xl p-8 bg-white dark:bg-gray-800 [data-theme='brand']:bg-purple-50 border border-gray-200 dark:border-gray-700 [data-theme='brand']:border-purple-200 shadow-xl">
            {/* Login Header */}
            <LoginHeader />

            {/* Login Form */}
            <LoginForm />

            {/* Login Footer */}
            <LoginFooter />
          </div>
        </div>

        {/* Login Credentials - Independent container with wider width */}
        <LoginCredentials />
      </div>
    </>
  );
};

export default LoginPage; 