import React from 'react';
import { TaskFlowOverview } from '../../components/dashboard';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import AccessDenied from '../../components/auth/AccessDenied';

/**
 * TaskFlow Overview Page Component
 * Wraps TaskFlowOverview component with DashboardLayout for authenticated users
 * Accessible via /dashboard route for authenticated users only
 */
const TaskFlowOverviewPage: React.FC = () => {
  const { hasDashboardAccess } = useRolePermissions();

  // Restrict /dashboard to Admin and Project Manager only
  if (!hasDashboardAccess) {
    return <AccessDenied feature="Dashboard Overview" />;
  }

  return (
    <DashboardLayout>
      <TaskFlowOverview />
    </DashboardLayout>
  );
};

export default TaskFlowOverviewPage;
