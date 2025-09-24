/**
 * Role Formatter Utility
 * Formats GraphQL enum role values to user-friendly display strings
 */

/**
 * Maps GraphQL enum role values to user-friendly display strings
 */
const ROLE_DISPLAY_MAPPING: { [key: string]: string } = {
  'ADMIN': 'ADMIN',
  'PROJECT_MANAGER_PM': 'PROJECT MANAGER',
  'SOFTWARE_ARCHITECT': 'SOFTWARE ARCHITECT',
  'FRONTEND_DEVELOPER': 'FRONTEND DEVELOPER',
  'BACKEND_DEVELOPER': 'BACKEND DEVELOPER',
  'FULL_STACK_DEVELOPER': 'FULL-STACK DEVELOPER',
  'DEVOPS_ENGINEER': 'DEVOPS ENGINEER',
  'QA_ENGINEER': 'QA ENGINEER',
  'QC_ENGINEER': 'QC ENGINEER',
  'UX_UI_DESIGNER': 'UX/UI DESIGNER',
  'BUSINESS_ANALYST': 'BUSINESS ANALYST',
  'DATABASE_ADMINISTRATOR': 'DATABASE ADMINISTRATOR',
  'TECHNICAL_WRITER': 'TECHNICAL WRITER',
  'SUPPORT_ENGINEER': 'SUPPORT ENGINEER'
};

/**
 * Formats a GraphQL enum role value to a user-friendly display string
 * @param role - The GraphQL enum role value (e.g., "PROJECT_MANAGER_PM")
 * @returns Formatted role string (e.g., "PROJECT MANAGER")
 */
export const formatRoleForDisplay = (role: string): string => {
  if (!role) return 'Unknown';
  
  // Return mapped display value or fallback to formatted enum value
  return ROLE_DISPLAY_MAPPING[role] || role.replace(/_/g, ' ').toUpperCase();
};

/**
 * Formats a role for display in filter badges (shorter format)
 * @param role - The GraphQL enum role value
 * @returns Short formatted role string
 */
export const formatRoleForFilter = (role: string): string => {
  return formatRoleForDisplay(role);
};
