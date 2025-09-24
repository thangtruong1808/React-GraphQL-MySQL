/**
 * Role Colors Utility
 * Provides consistent color schemes for user roles across all components
 * Ensures each role has a unique, distinguishable color
 */

export interface RoleColorScheme {
  bg: string;
  text: string;
  border: string;
  dot: string;
}

/**
 * Get role-specific color scheme based on exact role name
 * Each role gets a unique color for better visual distinction
 */
export const getRoleColorScheme = (role: string): RoleColorScheme => {
  // Normalize role name for consistent matching
  const normalizedRole = role.toLowerCase().trim();
  
  // Debug logging to see what roles are being processed (remove in production)
  // console.log('Processing role:', role, '-> normalized:', normalizedRole);

  // Handle both database string values and GraphQL enum values
  switch (normalizedRole) {
    // Database string values
    case 'admin':
    case 'project manager':
    case 'software architect':
    case 'frontend developer':
    case 'backend developer':
    case 'full-stack developer':
    case 'devops engineer':
    case 'qa engineer':
    case 'qc engineer':
    case 'ux/ui designer':
    case 'business analyst':
    case 'database administrator':
    case 'technical writer':
    case 'support engineer':
      // These will be handled by the GraphQL enum cases below
      break;
    
    // GraphQL enum values
    case 'admin':
      return {
        bg: 'bg-gradient-to-r from-red-100 to-red-200',
        text: 'text-red-800',
        border: 'border-red-300',
        dot: 'bg-red-500'
      };
    
    case 'project_manager_pm':
      return {
        bg: 'bg-gradient-to-r from-purple-100 to-purple-200',
        text: 'text-purple-800',
        border: 'border-purple-300',
        dot: 'bg-purple-500'
      };
    
    case 'software_architect':
      return {
        bg: 'bg-gradient-to-r from-indigo-100 to-indigo-200',
        text: 'text-indigo-800',
        border: 'border-indigo-300',
        dot: 'bg-indigo-500'
      };
    
    case 'frontend_developer':
      return {
        bg: 'bg-gradient-to-r from-blue-100 to-blue-200',
        text: 'text-blue-800',
        border: 'border-blue-300',
        dot: 'bg-blue-500'
      };
    
    case 'backend_developer':
      return {
        bg: 'bg-gradient-to-r from-cyan-100 to-cyan-200',
        text: 'text-cyan-800',
        border: 'border-cyan-300',
        dot: 'bg-cyan-500'
      };
    
    case 'full_stack_developer':
      return {
        bg: 'bg-gradient-to-r from-teal-100 to-teal-200',
        text: 'text-teal-800',
        border: 'border-teal-300',
        dot: 'bg-teal-500'
      };
    
    case 'devops_engineer':
      return {
        bg: 'bg-gradient-to-r from-orange-100 to-orange-200',
        text: 'text-orange-800',
        border: 'border-orange-300',
        dot: 'bg-orange-500'
      };
    
    case 'qa_engineer':
      return {
        bg: 'bg-gradient-to-r from-yellow-100 to-yellow-200',
        text: 'text-yellow-800',
        border: 'border-yellow-300',
        dot: 'bg-yellow-500'
      };
    
    case 'qc_engineer':
      return {
        bg: 'bg-gradient-to-r from-amber-100 to-amber-200',
        text: 'text-amber-800',
        border: 'border-amber-300',
        dot: 'bg-amber-500'
      };
    
    case 'ux_ui_designer':
      return {
        bg: 'bg-gradient-to-r from-pink-100 to-pink-200',
        text: 'text-pink-800',
        border: 'border-pink-300',
        dot: 'bg-pink-500'
      };
    
    case 'business_analyst':
      return {
        bg: 'bg-gradient-to-r from-green-100 to-green-200',
        text: 'text-green-800',
        border: 'border-green-300',
        dot: 'bg-green-500'
      };
    
    case 'database_administrator':
      return {
        bg: 'bg-gradient-to-r from-emerald-100 to-emerald-200',
        text: 'text-emerald-800',
        border: 'border-emerald-300',
        dot: 'bg-emerald-500'
      };
    
    case 'technical_writer':
      return {
        bg: 'bg-gradient-to-r from-lime-100 to-lime-200',
        text: 'text-lime-800',
        border: 'border-lime-300',
        dot: 'bg-lime-500'
      };
    
    case 'support_engineer':
      return {
        bg: 'bg-gradient-to-r from-slate-100 to-slate-200',
        text: 'text-slate-800',
        border: 'border-slate-300',
        dot: 'bg-slate-500'
      };
    
    // Default fallback for unknown roles
    default:
      // console.log('Unknown role, using default color:', role);
      return {
        bg: 'bg-gradient-to-r from-gray-100 to-gray-200',
        text: 'text-gray-800',
        border: 'border-gray-300',
        dot: 'bg-gray-500'
      };
  }
  
  // This should never be reached, but just in case
  // console.log('Unexpected role processing:', role);
  return {
    bg: 'bg-gradient-to-r from-gray-100 to-gray-200',
    text: 'text-gray-800',
    border: 'border-gray-300',
    dot: 'bg-gray-500'
  };
};
