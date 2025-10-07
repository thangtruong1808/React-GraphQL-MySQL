/**
 * Role-Based Access Control Utilities
 * Defines permissions for different user roles in the TaskFlow platform
 * Handles both database role values and GraphQL enum values
 */

/**
 * Check if user has admin role (handles both database and GraphQL enum values)
 * @param role - Role value from database or GraphQL enum
 * @returns Boolean indicating if user is admin
 */
export const isAdminRole = (role: string): boolean => {
  const roleLower = role.toLowerCase();
  return roleLower === 'admin';
};

/**
 * Check if user has project manager role (handles both database and GraphQL enum values)
 * @param role - Role value from database or GraphQL enum
 * @returns Boolean indicating if user is project manager
 */
export const isProjectManagerRole = (role: string): boolean => {
  const roleLower = role.toLowerCase();
  return roleLower === 'project manager' || roleLower === 'project_manager_pm';
};

/**
 * Check if user has full access (admin or project manager)
 * Full access users can see all sidebar menu items and perform CRUD operations
 * @param role - Role value from database or GraphQL enum
 * @returns Boolean indicating if user has full access
 */
export const hasFullAccess = (role: string): boolean => {
  return isAdminRole(role) || isProjectManagerRole(role);
};

/**
 * Check if user has dashboard access
 * Only admin and project manager roles can access dashboard pages
 * @param role - Role value from database or GraphQL enum
 * @returns Boolean indicating if user can access dashboard
 */
export const hasDashboardAccess = (role: string): boolean => {
  return hasFullAccess(role);
};

/**
 * Check if user can perform CRUD operations
 * Only admin and project manager roles can perform CRUD operations
 * @param role - Role value from database or GraphQL enum
 * @returns Boolean indicating if user can perform CRUD operations
 */
export const canPerformCRUD = (role: string): boolean => {
  return hasFullAccess(role);
};

/**
 * Check if user can create new items
 * @param role - Role value from database or GraphQL enum
 * @returns Boolean indicating if user can create items
 */
export const canCreate = (role: string): boolean => {
  return canPerformCRUD(role);
};

/**
 * Check if user can edit existing items
 * @param role - Role value from database or GraphQL enum
 * @returns Boolean indicating if user can edit items
 */
export const canEdit = (role: string): boolean => {
  return canPerformCRUD(role);
};

/**
 * Check if user can delete items
 * @param role - Role value from database or GraphQL enum
 * @returns Boolean indicating if user can delete items
 */
export const canDelete = (role: string): boolean => {
  return canPerformCRUD(role);
};

/**
 * Check if user can view all sidebar menu items
 * Only admin and project manager roles can view sidebar menu items
 * @param role - Role value from database or GraphQL enum
 * @returns Boolean indicating if user can view all menu items
 */
export const canViewAllMenuItems = (role: string): boolean => {
  return hasDashboardAccess(role);
};

/**
 * Get user permission level
 * @param role - Role value from database or GraphQL enum
 * @returns Permission level: 'full' | 'no-access'
 */
export const getUserPermissionLevel = (role: string): 'full' | 'no-access' => {
  return hasFullAccess(role) ? 'full' : 'no-access';
};

/**
 * Check if user can access a specific feature
 * @param role - Role value from database or GraphQL enum
 * @param feature - Feature name to check access for
 * @returns Boolean indicating if user can access the feature
 */
export const canAccessFeature = (role: string, feature: string): boolean => {
  // Only admin and project manager can access dashboard features
  return hasDashboardAccess(role);
};

/**
 * Check if user can perform CRUD on a specific feature
 * @param role - Role value from database or GraphQL enum
 * @param feature - Feature name to check CRUD access for
 * @returns Boolean indicating if user can perform CRUD on the feature
 */
export const canPerformCRUDOnFeature = (role: string, feature: string): boolean => {
  return canPerformCRUD(role);
};
