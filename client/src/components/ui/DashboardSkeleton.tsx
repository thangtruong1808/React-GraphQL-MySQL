import React from 'react';
import SidebarSkeleton from './SidebarSkeleton';
import UsersPageSkeleton from './UsersPageSkeleton';

/**
 * Dashboard Skeleton Component
 * Shows unified skeleton loading state for dashboard pages
 * Combines sidebar and page content skeletons
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex h-screen dashboard-layout" style={{
      width: '100vw',
      margin: 0,
      padding: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      {/* Sidebar Skeleton */}
      <SidebarSkeleton />

      {/* Main Content Skeleton */}
      <main
        className="flex-1 overflow-auto dashboard-content"
        style={{
          width: '100%',
          margin: 0,
          padding: 0,
          height: '100vh'
        }}
      >
        <UsersPageSkeleton />
      </main>
    </div>
  );
};

export default DashboardSkeleton;
