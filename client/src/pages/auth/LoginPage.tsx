import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/graphql/useAuth';
import { useFormValidation } from '../../utils/validation';
import { emailValidation, passwordValidation } from '../../utils/validation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

/**
 * Login Page Component
 * Handles user authentication with form validation
 * Provides navigation to registration page
 */
const LoginPage: React.FC = () => {
  const { handleLogin, loginLoading, loginError } = useAuth();

  const { data, errors, handleChange, handleBlur, isValid } = useFormValidation(
    {
      email: '',
      password: '',
    },
    {
      email: emailValidation,
      password: passwordValidation,
    }
  );

  // Handle form submission with validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      await handleLogin(data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Tailwind CSS test - positioned below header with high z-index */}
      <div className="fixed top-20 left-4 bg-red-500 text-white p-2 rounded z-50">
        Tailwind Test
      </div>
      <div className="max-w-md w-full space-y-8">
        {/* Page header with title and registration link */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Login form with validation and error handling */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Display authentication errors */}
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {loginError.message}
            </div>
          )}

          {/* Form fields container */}
          <div className="space-y-4">
            {/* Email input field */}
            <Input
              label="Email Address"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={errors.email?.[0]}
              placeholder="Enter your email"
              required
            />

            {/* Password input field */}
            <Input
              label="Password"
              type="password"
              value={data.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              error={errors.password?.[0]}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit button container */}
          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loginLoading}
              disabled={!isValid || loginLoading}
              className="w-full"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 