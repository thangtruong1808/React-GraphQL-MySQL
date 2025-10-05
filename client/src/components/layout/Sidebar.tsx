import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { formatRoleForDisplay, isAdminRole } from '../../utils/roleFormatter';
import Logo from './Logo';

/**
 * Sidebar Component
 * Navigation sidebar for authenticated users
 * Replaces top navbar with a more app-like sidebar layout
 */

interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  description: string;
}

const Sidebar: React.FC = () => {
  const { user, performLogout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check if user has admin or project manager role
  const isAdminOrPM = isAdminRole(user?.role || '') ||
    (user?.role?.toLowerCase() === 'project manager') ||
    (user?.role?.toLowerCase() === 'project_manager_pm');

  // Navigation items for authenticated users based on database schema
  const navigationItems: SidebarItem[] = [
    {
      id: 'home',
      label: 'Home',
      path: ROUTE_PATHS.DASHBOARD,
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      description: 'Task flow overview and project statistics'
    },
    // Users management - only for Admin and Project Managers
    ...(isAdminOrPM ? [{
      id: 'users',
      label: 'Users',
      path: ROUTE_PATHS.DASHBOARD_USERS,
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      description: 'Manage users and team members'
    }] : []),
    {
      id: 'projects',
      label: 'Projects',
      path: ROUTE_PATHS.DASHBOARD_PROJECTS,
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      description: 'Manage and track your projects'
    },
    {
      id: 'tasks',
      label: 'Tasks',
      path: ROUTE_PATHS.DASHBOARD_TASKS,
      icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      description: 'Manage tasks and assignments'
    },
    {
      id: 'comments',
      label: 'Comments',
      path: ROUTE_PATHS.DASHBOARD_COMMENTS,
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      description: 'Manage comments and discussions'
    },
    {
      id: 'activity',
      label: 'Activity',
      path: ROUTE_PATHS.DASHBOARD_ACTIVITY,
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      description: 'View recent activity and logs'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      path: ROUTE_PATHS.DASHBOARD_NOTIFICATIONS,
      icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      description: 'Manage your notifications'
    },
    // Tags management - only for Admin and Project Managers
    ...(isAdminOrPM ? [{
      id: 'tags',
      label: 'Tags',
      path: ROUTE_PATHS.DASHBOARD_TAGS,
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      description: 'Manage task tags and categories'
    }] : [])
  ];

  // Check if navigation item is active
  const isActiveItem = (item: SidebarItem) => {
    if (item.path === ROUTE_PATHS.DASHBOARD) {
      return location.pathname === ROUTE_PATHS.DASHBOARD;
    }
    return location.pathname === item.path;
  };

  // Handle logout
  const handleLogout = async () => {
    await performLogout();
  };


  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative ${isCollapsed ? 'w-20' : 'w-72'
      }`}>
      {/* Toggle Button - Positioned on middle-right border */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-1/2 -right-3.5 transform -translate-y-1/2 w-8 h-8 bg-white border-2 border-gray-300 rounded-full shadow-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 z-20 flex items-center justify-center"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isCollapsed ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          )}
        </svg>
      </button>

      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        {/* Logo - Centered when collapsed, left-aligned when expanded */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
          <Logo collapsed={isCollapsed} />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`group flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-6 rounded-lg text-base font-medium transition-all duration-200 ${isActiveItem(item)
              ? 'bg-purple-50 text-purple-700 border-r-3 border-purple-600 shadow-sm'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            title={isCollapsed ? item.description : undefined}
          >
            <svg className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-6 h-6 mr-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-3 border-t border-gray-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-base">
                {getUserInitials()}
              </span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {user?.email}
              </p>
              <p className="text-sm text-purple-600 font-medium truncate">
                {user?.role ? formatRoleForDisplay(user.role) : ''}
              </p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={handleLogout}
            className="w-full mt-3 px-3 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
