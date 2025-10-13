import { useCallback } from 'react';

/**
 * Team Hooks and Utilities
 * Custom hooks for team functionality and state management
 */

/**
 * Hook to handle team member role color mapping for GraphQL enum values
 * Returns function to get role-based color classes
 */
export const useRoleColor = () => {
  return useCallback((role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'PROJECT_MANAGER_PM': return 'bg-blue-100 text-blue-800';
      case 'SOFTWARE_ARCHITECT': return 'bg-purple-100 text-purple-800';
      case 'FRONTEND_DEVELOPER': return 'bg-green-100 text-green-800';
      case 'BACKEND_DEVELOPER': return 'bg-green-100 text-green-800';
      case 'FULL_STACK_DEVELOPER': return 'bg-green-100 text-green-800';
      case 'DevOps Engineer': return 'bg-yellow-100 text-yellow-800';
      case 'QA Engineer': return 'bg-indigo-100 text-indigo-800';
      case 'QC Engineer': return 'bg-indigo-100 text-indigo-800';
      case 'UX_UI_DESIGNER': return 'bg-pink-100 text-pink-800';
      case 'BUSINESS_ANALYST': return 'bg-cyan-100 text-cyan-800';
      case 'DATABASE_ADMINISTRATOR': return 'bg-orange-100 text-orange-800';
      case 'TECHNICAL_WRITER': return 'bg-teal-100 text-teal-800';
      case 'SUPPORT_ENGINEER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);
};

/**
 * Hook to safely format join dates
 * Handles date parsing with error fallback to 'N/A'
 */
export const useFormatJoinDate = () => {
  return useCallback((joinDate: string): string => {
    try {
      // Handle YYYY-MM-DD format from database
      const date = new Date(joinDate);
      if (isNaN(date.getTime())) {
        // Fallback for invalid dates
        return 'N/A';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  }, []);
};