import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFormValidation } from '../../utils/validation';
import { emailValidation, passwordValidation, usernameValidation, nameValidation } from '../../utils/validation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, ROUTES } from '../../constants';

/**
 * Register Page Component
 * Handles user registration with form validation and modern Australian-themed styling
 */
const RegisterPage: React.FC = () => {
  const { register, registerLoading } = useAuth();

  const { data, errors, handleChange, handleBlur, isValid } = useFormValidation(
    {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    {
      email: emailValidation,
      username: usernameValidation,
      password: passwordValidation,
      confirmPassword: {
        required: true,
        custom: (value) => {
          if (value !== data.password) {
            return ERROR_MESSAGES.PASSWORD_MISMATCH;
          }
          return true;
        },
      },
      firstName: nameValidation,
      lastName: nameValidation,
    }
  );

  const [error, setError] = useState<string>('');

  /**
   * Handle form submission
   * Validates form and attempts registration
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      const { confirmPassword, username, ...registerData } = data;
      const result = await register(registerData);

      if (result?.success) {
        // Registration successful, user will be automatically logged in
        window.location.href = ROUTES.DASHBOARD;
      } else {
        setError(result?.error || ERROR_MESSAGES.REGISTRATION_FAILED);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-8">
          {/* Header */}
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="mx-auto h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-6">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Join us today
            </h2>
            <p className="text-gray-600 text-sm">
              Create your account to get started
            </p>
          </div>

          {/* Registration Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
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

              <Input
                label="Username"
                type="text"
                value={data.username}
                onChange={(e) => handleChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
                error={errors.username?.[0]}
                placeholder="Choose a username"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  value={data.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  error={errors.firstName?.[0]}
                  placeholder="First name"
                />

                <Input
                  label="Last Name"
                  type="text"
                  value={data.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  error={errors.lastName?.[0]}
                  placeholder="Last name"
                />
              </div>

              <Input
                label="Password"
                type="password"
                value={data.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                error={errors.password?.[0]}
                placeholder="Create a password"
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                value={data.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                error={errors.confirmPassword?.[0]}
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={registerLoading}
                disabled={!isValid || registerLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 border-0 shadow-sm transition-colors duration-200"
              >
                Create Account
              </Button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 