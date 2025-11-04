/**
 * Error Context
 * Provides global error handling and display functionality
 * Shows errors directly in the UI instead of just logging them
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InlineError } from '../components/ui';

/**
 * Error Entry Interface
 */
interface ErrorEntry {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  source: string;
  timestamp: Date;
  dismissible?: boolean;
  autoDismiss?: boolean;
  duration?: number;
}

/**
 * Error Context Interface
 */
interface ErrorContextType {
  // State
  errors: ErrorEntry[];

  // Actions
  showError: (message: string, source?: string, options?: Partial<ErrorEntry>) => void;
  showWarning: (message: string, source?: string, options?: Partial<ErrorEntry>) => void;
  showInfo: (message: string, source?: string, options?: Partial<ErrorEntry>) => void;
  dismissError: (id: string) => void;
  clearAllErrors: () => void;
  clearErrorsBySource: (source: string) => void;
}

/**
 * Error Context Creation
 */
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

/**
 * Custom hook to use error context
 */
export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

/**
 * Error Provider Props
 */
interface ErrorProviderProps {
  children: ReactNode;
}

/**
 * Error Provider Component
 * Manages global error state and provides error display functionality
 */
export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<ErrorEntry[]>([]);

  /**
   * Add a new error to the list
   */
  const addError = (entry: Omit<ErrorEntry, 'id' | 'timestamp'>) => {
    const newError: ErrorEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    setErrors(prev => [...prev, newError]);

    // Auto-dismiss if configured
    if (newError.autoDismiss && newError.duration) {
      setTimeout(() => {
        dismissError(newError.id);
      }, newError.duration);
    }
  };

  /**
   * Show an error message
   */
  const showError = (message: string, source = 'Application', options: Partial<ErrorEntry> = {}) => {
    addError({
      message,
      type: 'error',
      source,
      dismissible: true,
      autoDismiss: true,
      duration: 7000,
      ...options,
    });
  };

  /**
   * Show a warning message
   */
  const showWarning = (message: string, source = 'Application', options: Partial<ErrorEntry> = {}) => {
    addError({
      message,
      type: 'warning',
      source,
      dismissible: true,
      autoDismiss: true,
      duration: 7000,
      ...options,
    });
  };

  /**
   * Show an info message
   */
  const showInfo = (message: string, source = 'Application', options: Partial<ErrorEntry> = {}) => {
    addError({
      message,
      type: 'info',
      source,
      dismissible: true,
      autoDismiss: true,
      duration: 7000,
      ...options,
    });
  };

  /**
   * Dismiss a specific error
   */
  const dismissError = (id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  };

  /**
   * Clear all errors
   */
  const clearAllErrors = () => {
    setErrors([]);
  };

  /**
   * Clear errors by source
   */
  const clearErrorsBySource = (source: string) => {
    setErrors(prev => prev.filter(error => error.source !== source));
  };

  const contextValue: ErrorContextType = {
    errors,
    showError,
    showWarning,
    showInfo,
    dismissError,
    clearAllErrors,
    clearErrorsBySource,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}

      {/* Global Error Display */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {errors.map((error) => (
          <InlineError
            key={error.id}
            message={error.message}
            type={error.type}
            dismissible={error.dismissible}
            onDismiss={() => dismissError(error.id)}
            size="md"
          />
        ))}
      </div>
    </ErrorContext.Provider>
  );
};
