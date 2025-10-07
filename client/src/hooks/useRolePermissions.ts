import { useAuth } from '../contexts/AuthContext';
import {
  hasFullAccess,
  hasDashboardAccess,
  canPerformCRUD,
  canCreate,
  canEdit,
  canDelete,
  canViewAllMenuItems,
  canAccessFeature,
  canPerformCRUDOnFeature,
  getUserPermissionLevel
} from '../utils/rolePermissions';

/**
 * Custom hook for role-based permissions
 * Provides easy access to permission checks based on current user's role
 */
export const useRolePermissions = () => {
  const { user } = useAuth();

  // If no user is authenticated, return false for all permissions
  if (!user) {
    return {
      hasFullAccess: false,
      hasDashboardAccess: false,
      canPerformCRUD: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canViewAllMenuItems: false,
      getUserPermissionLevel: () => 'no-access' as const,
      canAccessFeature: () => false,
      canPerformCRUDOnFeature: () => false,
      userRole: null,
      isAdmin: false,
      isProjectManager: false
    };
  }

  const userRole = user.role;

  return {
    /**
     * Check if user has full access (admin or project manager)
     */
    hasFullAccess: hasFullAccess(userRole),
    
    /**
     * Check if user has dashboard access
     */
    hasDashboardAccess: hasDashboardAccess(userRole),
    
    /**
     * Check if user can perform CRUD operations
     */
    canPerformCRUD: canPerformCRUD(userRole),
    
    /**
     * Check if user can create items
     */
    canCreate: canCreate(userRole),
    
    /**
     * Check if user can edit items
     */
    canEdit: canEdit(userRole),
    
    /**
     * Check if user can delete items
     */
    canDelete: canDelete(userRole),
    
    /**
     * Check if user can view all menu items
     */
    canViewAllMenuItems: canViewAllMenuItems(userRole),
    
    /**
     * Get user's permission level
     */
    getUserPermissionLevel: () => getUserPermissionLevel(userRole),
    
    /**
     * Check if user can access a specific feature
     */
    canAccessFeature: (feature: string) => canAccessFeature(userRole, feature),
    
    /**
     * Check if user can perform CRUD on a specific feature
     */
    canPerformCRUDOnFeature: (feature: string) => canPerformCRUDOnFeature(userRole, feature),
    
    /**
     * Current user's role
     */
    userRole,
    
    /**
     * Check if user is admin
     */
    isAdmin: userRole.toLowerCase() === 'admin',
    
    /**
     * Check if user is project manager
     */
    isProjectManager: userRole.toLowerCase() === 'project manager' || userRole.toLowerCase() === 'project_manager_pm'
  };
};
