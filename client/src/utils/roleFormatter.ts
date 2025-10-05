/**
 * Role Formatting Utility
 * Handles conversion between database role values and display-friendly formats
 * Supports both database values (e.g., "Project Manager") and GraphQL enum values (e.g., "PROJECT_MANAGER_PM")
 * Uses lowercase comparison for consistent role matching
 */

/**
 * Format role for display from database or GraphQL enum values to user-friendly format
 * @param role - Role value from database or GraphQL enum
 * @returns Display-friendly role name
 */
export const formatRoleForDisplay = (role: string): string => {
  const roleLower = role.toLowerCase();
  
  // Handle database values (from users table)
  switch (roleLower) {
    case 'admin': return 'Admin';
    case 'project manager': return 'Project Manager';
    case 'software architect': return 'Software Architect';
    case 'frontend developer': return 'Frontend Developer';
    case 'backend developer': return 'Backend Developer';
    case 'full-stack developer': return 'Full-Stack Developer';
    case 'devops engineer': return 'DevOps Engineer';
    case 'qa engineer': return 'QA Engineer';
    case 'qc engineer': return 'QC Engineer';
    case 'ux/ui designer': return 'UX/UI Designer';
    case 'business analyst': return 'Business Analyst';
    case 'database administrator': return 'Database Administrator';
    case 'technical writer': return 'Technical Writer';
    case 'support engineer': return 'Support Engineer';
  }

  // Handle GraphQL enum values
  switch (roleLower) {
    case 'admin': return 'Admin';
    case 'project_manager_pm': return 'Project Manager';
    case 'software_architect': return 'Software Architect';
    case 'frontend_developer': return 'Frontend Developer';
    case 'backend_developer': return 'Backend Developer';
    case 'full_stack_developer': return 'Full-Stack Developer';
    case 'devops_engineer': return 'DevOps Engineer';
    case 'qa_engineer': return 'QA Engineer';
    case 'qc_engineer': return 'QC Engineer';
    case 'ux_ui_designer': return 'UX/UI Designer';
    case 'business_analyst': return 'Business Analyst';
    case 'database_administrator': return 'Database Administrator';
    case 'technical_writer': return 'Technical Writer';
    case 'support_engineer': return 'Support Engineer';
    default: return role; // Return original if no mapping found
  }
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
 * @param role - Role value from database or GraphQL enum
 * @returns Boolean indicating if user can post comments
 */
export const canPostComments = (role: string): boolean => {
  const roleLower = role.toLowerCase();
  
  const adminRoles = ['admin'];
  const managerRoles = ['project manager', 'project_manager_pm'];
  const developerRoles = [
    'software architect', 'software_architect',
    'frontend developer', 'frontend_developer',
    'backend developer', 'backend_developer',
    'full-stack developer', 'full_stack_developer',
    'devops engineer', 'devops_engineer'
  ];
  
  return adminRoles.includes(roleLower) || 
         managerRoles.includes(roleLower) || 
         developerRoles.includes(roleLower);
};