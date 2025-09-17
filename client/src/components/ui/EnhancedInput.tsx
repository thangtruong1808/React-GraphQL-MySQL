/**
 * Enhanced Input Component
 * Input component with built-in error display and validation feedback
 * Provides immediate visual feedback for form validation errors
 */

import React, { forwardRef } from 'react';
import { FieldError } from './FieldError';

/**
 * Enhanced Input Component Props
 */
interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label for the input field */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Helper text to display below the input */
  helperText?: string;
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;
  /** Whether to show the error icon */
  showErrorIcon?: boolean;
  /** Additional CSS classes for the container */
  containerClassName?: string;
  /** Additional CSS classes for the label */
  labelClassName?: string;
  /** Additional CSS classes for the input */
  inputClassName?: string;
  /** Whether to show the error message */
  showError?: boolean;
}

/**
 * Enhanced Input Component
 * Provides comprehensive input field with error handling and validation feedback
 */
export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(({
  label,
  error,
  required = false,
  helperText,
  leftIcon,
  rightIcon,
  showErrorIcon = true,
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  showError = true,
  className,
  id,
  ...inputProps
}, ref) => {
  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  // Get input styling based on error state
  const getInputStyles = () => {
    const baseStyles = 'block w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200';

    if (hasError) {
      return `${baseStyles} border-red-300 focus:ring-red-500 focus:border-red-500 pr-10`;
    }

    return `${baseStyles} border-gray-300 focus:ring-purple-500 focus:border-purple-500`;
  };

  // Get container styling
  const getContainerStyles = () => {
    return `space-y-1 ${containerClassName}`;
  };

  return (
    <div className={getContainerStyles()}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          className={`
            ${getInputStyles()}
            ${leftIcon ? 'pl-10' : 'pl-3'}
            ${rightIcon || hasError ? 'pr-10' : 'pr-3'}
            py-3
            ${inputClassName}
            ${className || ''}
          `}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          {...inputProps}
        />

        {/* Right Icon or Error Icon */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {hasError && showErrorIcon ? (
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ) : rightIcon ? (
            rightIcon
          ) : null}
        </div>
      </div>

      {/* Helper Text */}
      {helperText && !hasError && (
        <p className="text-sm text-gray-500">
          {helperText}
        </p>
      )}

      {/* Error Message */}
      {showError && hasError && (
        <FieldError
          message={error}
          fieldName={inputId}
          showIcon={false}
        />
      )}
    </div>
  );
});

EnhancedInput.displayName = 'EnhancedInput';
