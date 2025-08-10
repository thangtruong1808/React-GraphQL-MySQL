/**
 * Form Error Summary Component
 * Displays a summary of all form errors in one place
 * Provides an overview of validation issues for better user experience
 */

import React from 'react';

/**
 * Form Error Summary Component Props
 */
interface FormErrorSummaryProps {
  /** Array of error messages */
  errors: string[];
  /** Title for the error summary */
  title?: string;
  /** Whether to show an icon */
  showIcon?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether the summary is dismissible */
  dismissible?: boolean;
  /** Callback when summary is dismissed */
  onDismiss?: () => void;
  /** Maximum number of errors to display */
  maxErrors?: number;
}

/**
 * Form Error Summary Component
 * Displays a comprehensive summary of form validation errors
 */
export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({
  errors,
  title = 'Please fix the following errors:',
  showIcon = true,
  className = '',
  dismissible = false,
  onDismiss,
  maxErrors = 5
}) => {
  // Don't render if no errors
  if (!errors || errors.length === 0) {
    return null;
  }

  // Limit the number of errors displayed
  const displayErrors = errors.slice(0, maxErrors);
  const hasMoreErrors = errors.length > maxErrors;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0 mr-3 mt-0.5">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            {title}
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {displayErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                {error}
              </li>
            ))}
            {hasMoreErrors && (
              <li className="text-sm text-red-600 font-medium">
                ...and {errors.length - maxErrors} more error{errors.length - maxErrors !== 1 ? 's' : ''}
              </li>
            )}
          </ul>
        </div>
        {dismissible && onDismiss && (
          <div className="flex-shrink-0 ml-3">
            <button
              onClick={onDismiss}
              className="inline-flex text-red-400 hover:text-red-600 focus:outline-none focus:text-red-600 transition-colors duration-200"
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
  );
};
