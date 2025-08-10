/**
 * Inline Error Component
 * Displays error messages directly in the UI where they occur
 * Provides contextual error feedback for better user experience
 */

import React from 'react';

/**
 * Inline Error Component Props
 */
interface InlineErrorProps {
  /** Error message to display */
  message: string;
  /** Type of error for styling */
  type?: 'error' | 'warning' | 'info';
  /** Whether to show an icon */
  showIcon?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether the error is dismissible */
  dismissible?: boolean;
  /** Callback when error is dismissed */
  onDismiss?: () => void;
  /** Position of the error (relative to parent) */
  position?: 'top' | 'bottom' | 'inline';
  /** Size of the error message */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Inline Error Component
 * Displays contextual error messages directly in the UI
 */
export const InlineError: React.FC<InlineErrorProps> = ({
  message,
  type = 'error',
  showIcon = true,
  className = '',
  dismissible = false,
  onDismiss,
  position = 'inline',
  size = 'md'
}) => {
  // Don't render if no message
  if (!message) {
    return null;
  }

  // Get error styling based on type
  const getErrorStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  // Get icon based on type
  const getIcon = () => {
    if (!showIcon) return null;

    switch (type) {
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'md':
        return 'text-sm px-3 py-2';
      case 'lg':
        return 'text-base px-4 py-3';
      default:
        return 'text-sm px-3 py-2';
    }
  };

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'mb-2';
      case 'bottom':
        return 'mt-2';
      case 'inline':
        return 'my-1';
      default:
        return 'my-1';
    }
  };

  return (
    <div className={`${getPositionClasses()} ${className}`}>
      <div className={`border rounded-md ${getErrorStyles()} ${getSizeClasses()}`}>
        <div className="flex items-start">
          {getIcon() && (
            <div className="flex-shrink-0 mr-2 mt-0.5">
              {getIcon()}
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium">{message}</p>
          </div>
          {dismissible && onDismiss && (
            <div className="flex-shrink-0 ml-2">
              <button
                onClick={onDismiss}
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
                type="button"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
