import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import SidebarToggleButton from './sidebar/SidebarToggleButton';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarNavItems from './sidebar/SidebarNavItems';
import SidebarUserProfile from './sidebar/SidebarUserProfile';
import SidebarThemeSwitcher from './sidebar/SidebarThemeSwitcher';
import SidebarLogoutButton from './sidebar/SidebarLogoutButton';
import { SIDEBAR_NAVIGATION_ITEMS } from './sidebar/sidebarConstants';

/**
 * Sidebar Component
 * Navigation sidebar for authenticated users
 * Replaces top navbar with a more app-like sidebar layout
 */
const Sidebar: React.FC = () => {
  const { user, performLogout } = useAuth();
  const { canViewAllMenuItems } = useRolePermissions();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [theme, setTheme] = useState<string>(() => (
    typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'brand') : 'brand'
  ));

  // Handle logout
  const handleLogout = async () => {
    // Show transition state while logging out
    setLogoutLoading(true);
    try {
      await performLogout();
    } finally {
      setLogoutLoading(false);
    }
  };

  // Apply and persist theme
  React.useEffect(() => {
    // Apply to both <html> and <body> for maximum coverage
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    try {
      localStorage.setItem('theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  /**
   * Handle theme change
   * Updates theme state and applies to document
   */
  const handleThemeChange = (newTheme: string) => {
    // Update state and apply immediately for instant feedback
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);

    // Force style recalculation
    const dashboardLayout = document.querySelector('.dashboard-layout') as HTMLElement;
    const dashboardContent = document.querySelector('.dashboard-content') as HTMLElement;

    if (dashboardLayout) {
      dashboardLayout.style.backgroundColor = '';
      dashboardLayout.style.backgroundImage = '';
    }
    if (dashboardContent) {
      dashboardContent.style.backgroundColor = '';
      dashboardContent.style.backgroundImage = '';
    }

    try {
      localStorage.setItem('theme', newTheme);
    } catch {
      // ignore storage errors
    }
  };


  // Don't render sidebar if user doesn't have dashboard access
  if (!canViewAllMenuItems) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 [data-theme='brand']:bg-purple-50 border-r border-gray-200 dark:border-gray-700 [data-theme='brand']:border-purple-200 flex flex-col transition-all duration-300 relative ${isCollapsed ? 'w-20' : 'w-72'
      }`}>
      {/* Toggle Button - Positioned on middle-right border */}
      <SidebarToggleButton
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Sidebar Header */}
      <SidebarHeader isCollapsed={isCollapsed} />

      {/* Navigation Items */}
      <SidebarNavItems
        items={SIDEBAR_NAVIGATION_ITEMS}
        isCollapsed={isCollapsed}
      />

      {/* User Profile Section */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 [data-theme='brand']:border-purple-200">
        <SidebarUserProfile user={user} isCollapsed={isCollapsed} />

        {/* Theme Switcher and Logout - Only show when expanded */}
        {!isCollapsed && (
          <>
            <SidebarThemeSwitcher
              theme={theme}
              onThemeChange={handleThemeChange}
            />
            <SidebarLogoutButton
              onLogout={handleLogout}
              logoutLoading={logoutLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
