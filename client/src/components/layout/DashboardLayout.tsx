import React, { useEffect } from 'react';
import Sidebar from './Sidebar';

/**
 * Dashboard Layout Component
 * Layout wrapper for authenticated users with sidebar navigation
 * Provides consistent sidebar + main content layout
 */

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // Add authenticated class to body for edge-to-edge CSS
  useEffect(() => {
    document.body.classList.add('authenticated');
    document.getElementById('root')?.classList.add('authenticated');

    return () => {
      document.body.classList.remove('authenticated');
      document.getElementById('root')?.classList.remove('authenticated');
    };
  }, []);

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
      {/* Sidebar */}
      <Sidebar />

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
