/**
 * Role Formatting Utility
 * Handles conversion between database role values and display-friendly formats
 * Supports both database values (e.g., "Project Manager") and GraphQL enum values (e.g., "PROJECT_MANAGER_PM")
 * Uses lowercase comparison for consistent role matching
 */

/**
 * Format role for display from database values to user-friendly format
 * @param role - Role value from database (already in user-friendly format)
 * @returns Display-friendly role name
 */
export const formatRoleForDisplay = (role: string): string => {
  // Database already stores roles in user-friendly format, so return as-is
  return role;
};

/**
 * Format role for filter display (used in search filters)
 * @param role - Role value from database or GraphQL enum
 * @returns Display-friendly role name for filters
 */
export const formatRoleForFilter = (role: string): string => {
  return formatRoleForDisplay(role);
};

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
 * Check if user can post comments (admin, project manager, or developer roles)
 * @param role - Role value from database
 * @returns Boolean indicating if user can post comments
 */
export const canPostComments = (role: string): boolean => {
  const roleLower = role.toLowerCase();
  
  const adminRoles = ['admin'];
  const managerRoles = ['project manager'];
  const developerRoles = [
    'software architect',
    'frontend developer',
    'backend developer',
    'full-stack developer',
    'devops engineer'
  ];
  
  return adminRoles.includes(roleLower) || 
         managerRoles.includes(roleLower) || 
         developerRoles.includes(roleLower);
};