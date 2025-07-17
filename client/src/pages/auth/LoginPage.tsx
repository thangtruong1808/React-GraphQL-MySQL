import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginInput } from '../../types/graphql';
import { VALIDATION_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES, ROUTES } from '../../constants';

/**
 * Login Page Component
 * Handles user authentication with email and password
 * Provides form validation and error handling with modern Australian-themed styling
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginLoading } = useAuth();

  // Form state
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });

  // UI state for password visibility and input clearing
  const [showPassword, setShowPassword] = useState(false);

  // Error and success state
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  /**
   * Handle form input changes
   * Updates form state and clears errors
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  /**
   * Clear specific input field
   * @param fieldName - Name of the field to clear
   */
  const clearInput = (fieldName: 'email' | 'password') => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: '',
    }));
  };

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Validate form data before submission
   * @returns True if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError(ERROR_MESSAGES.EMAIL_REQUIRED);
      return false;
    }

    if (!formData.password.trim()) {
      setError(ERROR_MESSAGES.PASSWORD_REQUIRED);
      return false;
    }

    // Email validation using centralized regex
    if (!VALIDATION_CONFIG.EMAIL_REGEX.test(formData.email)) {
      setError(ERROR_MESSAGES.EMAIL_INVALID);
      return false;
    }

    // Password length validation using centralized config
    if (formData.password.length < VALIDATION_CONFIG.PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${VALIDATION_CONFIG.PASSWORD_MIN_LENGTH} characters long`);
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   * Validates form and attempts login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔐 LOGIN PAGE - Form submission started');
    console.log('🔐 LOGIN PAGE - Form data:', {
      email: formData.email,
      passwordLength: formData.password.length,
    });

    // Clear previous messages
    setError('');
    setSuccess('');

    // Validate form
    if (!validateForm()) {
      console.log('❌ LOGIN PAGE - Form validation failed');
      return;
    }

    console.log('✅ LOGIN PAGE - Form validation passed');

    try {
      console.log('🔐 LOGIN PAGE - Calling login function...');

      // Attempt login
      const result = await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log('🔐 LOGIN PAGE - Login result received:', {
        success: result?.success,
        hasUser: !!result?.user,
        error: result?.error,
      });

      if (result?.success) {
        console.log('✅ LOGIN PAGE - Login successful, user data:', result.user);
        setSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS);
        // Redirect to dashboard immediately after successful login
        console.log('🔐 LOGIN PAGE - Navigating to dashboard...');
        navigate(ROUTES.DASHBOARD);
      } else {
        console.log('❌ LOGIN PAGE - Login failed:', result?.error);
        setError(result?.error || ERROR_MESSAGES.LOGIN_FAILED);
      }
    } catch (err) {
      console.error('❌ LOGIN PAGE - Login error:', err);
      setError(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Full Page Authentication Background Icon */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {/* Background Title */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
          <h1 className="text-3xl font-bold text-neutral-700 ">
            SECURE AUTHENTICATION
          </h1>
          <div className="flex items-center justify-center space-x-2 mt-2">
            {/* Authentication Icon */}
            <svg className="h-36 w-36 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-lg border border-emerald-400 p-8">
          {/* Header */}
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="mx-auto h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-6">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loginLoading}
                />
                {/* Clear email button */}
                {formData.email && (
                  <button
                    type="button"
                    onClick={() => clearInput('email')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loginLoading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {/* Clear password button */}
                  {formData.password && (
                    <button
                      type="button"
                      onClick={() => clearInput('password')}
                      className="text-gray-400 hover:text-gray-600 mr-2"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {/* Toggle password visibility button */}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loginLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>


          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Protected by secure authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 