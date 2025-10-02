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
      <div className="min-h-screen  flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

        {/* Login Form Container - Fixed width */}
        <div className="max-w-lg w-full space-y-8 relative z-10">
          {/* Card Container - Enhanced styling to match PublicCallToAction */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200 p-8">
            {/* Login Header */}
            <LoginHeader />

            {/* Login Form */}
            <LoginForm />
          </div>

          {/* Login Footer */}
          <LoginFooter />
        </div>

        {/* Login Credentials - Independent container with wider width */}
        <LoginCredentials />
      </div>
    </>
  );
};

export default LoginPage; 