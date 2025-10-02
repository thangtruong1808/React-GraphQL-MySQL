import React from 'react';
import { TaskFlowOverview } from '../../components/dashboard';
import DashboardLayout from '../../components/layout/DashboardLayout';

/**
 * TaskFlow Overview Page Component
 * Wraps TaskFlowOverview component with DashboardLayout for authenticated users
 * Accessible via /dashboard route for authenticated users only
 */
const TaskFlowOverviewPage: React.FC = () => {
  return (
    <DashboardLayout>
      <TaskFlowOverview />
    </DashboardLayout>
  );
};

export default TaskFlowOverviewPage;
