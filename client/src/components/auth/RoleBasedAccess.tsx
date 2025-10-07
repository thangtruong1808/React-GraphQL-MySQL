import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { hasFullAccess, hasDashboardAccess, canPerformCRUD } from '../../utils/rolePermissions';
import AccessDenied from './AccessDenied';

/**
 * Role-Based Access Control Higher-Order Component
 * Wraps components to provide role-based access control
 */

interface RoleBasedAccessProps {
  children: React.ReactNode;
  requireFullAccess?: boolean;
  requireDashboardAccess?: boolean;
  requireCRUD?: boolean;
  fallback?: React.ReactNode;
  feature?: string;
}

/**
 * RoleBasedAccess Component
 * Controls access to components based on user role
 * @param children - Component to render if access is granted
 * @param requireFullAccess - Require admin or project manager role
 * @param requireDashboardAccess - Require dashboard access (admin or project manager)
 * @param requireCRUD - Require CRUD permissions (admin or project manager)
 * @param fallback - Component to render if access is denied
 * @param feature - Feature name for access denied message
 */
export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  requireFullAccess = false,
  requireDashboardAccess = false,
  requireCRUD = false,
  fallback = null,
  feature = 'dashboard'
}) => {
  const { user } = useAuth();

  // If no user is authenticated, deny access
  if (!user) {
    return <>{fallback || <AccessDenied feature={feature} />}</>;
  }

  const userRole = user.role;

  // Check access requirements
  if (requireFullAccess && !hasFullAccess(userRole)) {
    return <>{fallback || <AccessDenied feature={feature} />}</>;
  }

  if (requireDashboardAccess && !hasDashboardAccess(userRole)) {
    return <>{fallback || <AccessDenied feature={feature} />}</>;
  }

  if (requireCRUD && !canPerformCRUD(userRole)) {
    return <>{fallback || <AccessDenied feature={feature} />}</>;
  }

  // Access granted
  return <>{children}</>;
};

/**
 * Higher-Order Component for Full Access (Admin/Project Manager)
 * Only admin and project manager roles can access wrapped components
 */
export const withFullAccess = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  return (props: P) => (
    <RoleBasedAccess requireFullAccess fallback={fallback}>
      <Component {...props} />
    </RoleBasedAccess>
  );
};

/**
 * Higher-Order Component for CRUD Access
 * Only admin and project manager roles can perform CRUD operations
 */
export const withCRUDAccess = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  return (props: P) => (
    <RoleBasedAccess requireCRUD fallback={fallback}>
      <Component {...props} />
    </RoleBasedAccess>
  );
};

/**
 * Higher-Order Component for Dashboard Access
 * Only admin and project manager roles can access dashboard components
 */
export const withDashboardAccess = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode,
  feature?: string
) => {
  return (props: P) => (
    <RoleBasedAccess requireDashboardAccess fallback={fallback} feature={feature}>
      <Component {...props} />
    </RoleBasedAccess>
  );
};

export default RoleBasedAccess;
