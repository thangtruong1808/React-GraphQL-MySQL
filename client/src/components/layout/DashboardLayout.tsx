import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { SidebarSkeleton } from '../ui';

/**
 * Dashboard Layout Component
 * Layout wrapper for authenticated users with sidebar navigation
 * Provides consistent sidebar + main content layout
 */

interface DashboardLayoutProps {
  children: React.ReactNode;
  showSidebarSkeleton?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, showSidebarSkeleton = true }) => {
  const { user, isInitializing } = useAuth();

  // Add authenticated class to body for edge-to-edge CSS
  useEffect(() => {
    document.body.classList.add('authenticated');
    document.getElementById('root')?.classList.add('authenticated');

    return () => {
      document.body.classList.remove('authenticated');
      document.getElementById('root')?.classList.remove('authenticated');
    };
  }, []);

  // Show sidebar skeleton if user data is not loaded yet and showSidebarSkeleton is true
  const shouldShowSidebarSkeleton = showSidebarSkeleton && (isInitializing || !user);

  return (
    <div
      className="flex h-screen dashboard-layout"
      style={{
        width: '100vw',
        margin: 0,
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {/* Sidebar or Sidebar Skeleton */}
      {shouldShowSidebarSkeleton ? <SidebarSkeleton /> : <Sidebar />}

      {/* Main Content Area - True Edge-to-Edge */}
      <main
        className="flex-1 overflow-auto dashboard-content"
        style={{
          width: '100%',
          margin: 0,
          padding: 0,
          height: '100vh'
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
