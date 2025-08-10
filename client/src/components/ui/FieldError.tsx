/**
 * Field Error Component
 * Displays field-specific error messages directly under form inputs
 * Provides immediate feedback for form validation errors
 */

import React from 'react';

/**
 * Field Error Component Props
 */
interface FieldErrorProps {
  /** Error message to display */
  message: string;
  /** Field name for accessibility */
  fieldName?: string;
  /** Whether to show an icon */
  showIcon?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether the error is animated */
  animated?: boolean;
  /** Size of the error message */
  size?: 'sm' | 'md';
}

/**
 * Field Error Component
 * Displays field-specific error messages with proper styling
 */
export const FieldError: React.FC<FieldErrorProps> = ({
  message,
  fieldName,
  showIcon = true,
  className = '',
  animated = true,
  size = 'md'
}) => {
  // Don't render if no message
  if (!message) {
    return null;
  }

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs mt-1';
      case 'md':
        return 'text-sm mt-1';
      default:
        return 'text-sm mt-1';
    }
  };

  // Get animation classes
  const getAnimationClasses = () => {
    return animated ? 'animate-pulse' : '';
  };

  return (
    <div
      className={`flex items-start ${getSizeClasses()} ${getAnimationClasses()} ${className}`}
      role="alert"
      aria-live="polite"
      aria-describedby={fieldName ? `${fieldName}-error` : undefined}
    >
      {showIcon && (
        <svg
          className="w-4 h-4 text-red-500 mr-1 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )}
      <span
        id={fieldName ? `${fieldName}-error` : undefined}
        className="text-red-600 font-medium"
      >
        {message}
      </span>
    </div>
  );
};
