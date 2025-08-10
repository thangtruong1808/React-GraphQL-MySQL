import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, VALIDATION_CONFIG } from '../../constants';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { useAuth } from '../../contexts/AuthContext';
import { useAppActivityTracker } from '../../hooks/custom/useAppActivityTracker';
import { LoginInput } from '../../types/graphql';
import { EnhancedInput, InlineError } from '../ui';

/**
 * Login Form Component
 * Handles user authentication with email and password
 * Optimized for performance: only validates and submits - no DB connection on load
 */
const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginLoading } = useAuth();
  const { trackFormSubmission } = useAppActivityTracker();

  // Get redirect path from location state (where user was trying to go)
  const from = (location.state as any)?.from?.pathname || ROUTE_PATHS.HOME;

  // Form state - only essential fields for login
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });

  // UI state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Error and success state for user feedback
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  /**
   * Handle form input changes
   * Updates form state and clears errors for better UX
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing - immediate feedback
    if (error) {
      setError('');
    }
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
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
   * Simple UI enhancement for better UX
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Validate form data before submission
   * Client-side validation to prevent unnecessary server requests
   * @returns True if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newFieldErrors: typeof fieldErrors = {};
    let hasErrors = false;

    // Check for required fields first
    if (!formData.email.trim()) {
      newFieldErrors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
      hasErrors = true;
    } else if (!VALIDATION_CONFIG.EMAIL_REGEX.test(formData.email)) {
      newFieldErrors.email = ERROR_MESSAGES.EMAIL_INVALID;
      hasErrors = true;
    }

    if (!formData.password.trim()) {
      newFieldErrors.password = ERROR_MESSAGES.PASSWORD_REQUIRED;
      hasErrors = true;
    } else if (formData.password.length < VALIDATION_CONFIG.PASSWORD_MIN_LENGTH) {
      newFieldErrors.password = `Password must be at least ${VALIDATION_CONFIG.PASSWORD_MIN_LENGTH} characters long`;
      hasErrors = true;
    }

    setFieldErrors(newFieldErrors);
    return !hasErrors;
  };

  /**
   * Handle form submission
   * Only executes when valid credentials are provided
   * Triggers authentication flow: LoginForm → AuthContext → GraphQL → Server → DB
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages for clean state
    setError('');
    setSuccess('');
    setFieldErrors({});

    // Client-side validation - prevents unnecessary server requests
    if (!validateForm()) {
      return; // Stop here if validation fails - no DB connection needed
    }

    try {
      // Track form submission activity
      trackFormSubmission();

      // Attempt login with validated credentials
      // This triggers the full authentication flow
      const result = await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (result?.success) {
        setSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS);
        // Redirect to intended page or home page after successful login
        navigate(from, { replace: true });
      } else {
        setError(result?.error || ERROR_MESSAGES.LOGIN_FAILED);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {/* Email Input */}
      <EnhancedInput
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        label="Email address"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
        disabled={loginLoading}
        error={fieldErrors.email}
        leftIcon={
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        }
        rightIcon={
          formData.email ? (
            <button
              type="button"
              onClick={() => clearInput('email')}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : undefined
        }
      />

      {/* Password Input */}
      <EnhancedInput
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        required
        label="Password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleInputChange}
        disabled={loginLoading}
        error={fieldErrors.password}
        leftIcon={
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
        rightIcon={
          <div className="flex items-center">
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
        }
      />

      {/* Error and Success Messages */}
      <InlineError
        message={error}
        type="error"
        position="top"
        dismissible={true}
        onDismiss={() => setError('')}
      />
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
  );
};

export default LoginForm; 