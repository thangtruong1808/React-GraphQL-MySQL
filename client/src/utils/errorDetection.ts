/**
 * Error Detection Utilities
 * Provides functions to detect and categorize different types of errors
 */

/**
 * Check if an error is a database connection limit error
 * @param error - The error object or message
 * @returns boolean indicating if it's a connection limit error
 */
export const isDatabaseConnectionLimitError = (error: any): boolean => {
  if (!error) return false;
  
  const errorMessage = typeof error === 'string' ? error : error.message || '';
  
  return errorMessage.includes('max_connections_per_hour') ||
         errorMessage.includes('Too many connections') ||
         errorMessage.includes('Connection limit exceeded') ||
         errorMessage.includes('ER_TOO_MANY_USER_CONNECTIONS');
};

/**
 * Check if an error is a database connection error
 * @param error - The error object or message
 * @returns boolean indicating if it's a database connection error
 */
export const isDatabaseConnectionError = (error: any): boolean => {
  if (!error) return false;
  
  const errorMessage = typeof error === 'string' ? error : error.message || '';
  
  return errorMessage.includes('ECONNREFUSED') ||
         errorMessage.includes('Connection refused') ||
         errorMessage.includes('Database connection failed') ||
         errorMessage.includes('Unable to connect to database') ||
         isDatabaseConnectionLimitError(error);
};

/**
 * Get user-friendly error message for database errors
 * @param error - The error object or message
 * @returns string with user-friendly error message
 */
export const getDatabaseErrorMessage = (error: any): string => {
  if (isDatabaseConnectionLimitError(error)) {
    return 'Database connection limit exceeded. Please try again in a few minutes.';
  }
  
  if (isDatabaseConnectionError(error)) {
    return 'Unable to connect to the database. Please try again later.';
  }
  
  return 'An unexpected database error occurred. Please try again.';
};
