import { getProjectStatusColor } from '../../../../constants/projectManagement';
import { formatRoleForDisplay } from '../../../../utils/roleFormatter';

/**
 * Custom hook for project detail utility functions
 * Provides formatting and styling utilities
 */
export const useProjectDetailUtils = () => {
  /**
   * Format member role for display
   */
  const formatMemberRoleForDisplay = (memberRole: string) => {
    switch (memberRole) {
      case 'OWNER':
        return 'Owner';
      case 'EDITOR':
        return 'Editor';
      case 'VIEWER':
        return 'Viewer';
      case 'ASSIGNEE':
        return 'Assignee';
      default:
        return 'Member';
    }
  };

  /**
   * Get status color for projects using theme variables
   */
  const getStatusColor = (status: string) => {
    return getProjectStatusColor(status);
  };

  /**
   * Get task status color with better UX - DONE should be clearly successful
   */
  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'bg-green-100 text-green-800 border border-green-200'; // Success/completion
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border border-blue-200'; // Active work
      case 'TODO':
        return 'bg-gray-100 text-gray-800 border border-gray-200'; // Not started
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  /**
   * Get priority color for tasks with better urgency communication
   */
  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border border-red-200'; // Urgent - red
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'; // Normal - yellow
      case 'LOW':
        return 'bg-gray-100 text-gray-600 border border-gray-200'; // Low urgency - muted
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  /**
   * Format date for display - handles both timestamp and date strings
   */
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';

      // Handle timestamp strings (numbers) by converting to number first
      const timestamp =
        typeof dateString === 'string' && /^\d+$/.test(dateString) ? parseInt(dateString) : dateString;

      const date = new Date(timestamp);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'N/A';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  /**
   * Format due date for display - shows only date without time
   */
  const formatDueDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';

      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'N/A';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  return {
    formatMemberRoleForDisplay,
    getStatusColor,
    getTaskStatusColor,
    getTaskPriorityColor,
    formatDate,
    formatDueDate,
    formatRoleForDisplay,
  };
};

