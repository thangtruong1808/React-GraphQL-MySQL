import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TaskFlowOverview } from '../../components/dashboard';
import { PublicDashboard } from '../../components/shared';
import DashboardLayout from '../../components/layout/DashboardLayout';

/**
 * HomePage Component
 * Shows appropriate content based on authentication state
 * AuthProvider ensures this component only renders after authentication is initialized
 */
const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Reset scroll position to top when component mounts for better UX
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // AuthProvider handles gating - we only render here after initialization is complete
  if (!user || !isAuthenticated) {
    // We're sure user is not logged in - show public dashboard with insights
    return <PublicDashboard />;
  }

  // User is authenticated and ready - show TaskFlow dashboard with sidebar layout
  return (
    <DashboardLayout>
      <TaskFlowOverview />
    </DashboardLayout>
  );
};

export default HomePage; 