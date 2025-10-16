/**
 * Activity Context Manager
 * Manages the current logged-in user context for activity logging
 * This allows Sequelize hooks to access the logged-in user performing actions
 */

let currentUser: { id: number; email: string; role: string } | null = null;

/**
 * Set the current logged-in user context
 * @param user - The logged-in user performing the action
 */
export const setActivityContext = (user: { id: number; email: string; role: string } | null) => {
  currentUser = user;
};

/**
 * Get the current logged-in user context
 * @returns The current logged-in user or null
 */
export const getActivityContext = (): { id: number; email: string; role: string } | null => {
  return currentUser;
};

/**
 * Clear the current user context
 * Should be called after each request to prevent context leakage
 */
export const clearActivityContext = () => {
  currentUser = null;
};

/**
 * Execute a function with a specific user context
 * @param user - The user context to use
 * @param fn - The function to execute
 * @returns The result of the function
 */
export const withActivityContext = async <T>(
  user: { id: number; email: string; role: string } | null,
  fn: () => Promise<T>
): Promise<T> => {
  const previousUser = currentUser;
  setActivityContext(user);
  try {
    return await fn();
  } finally {
    setActivityContext(previousUser);
  }
};
