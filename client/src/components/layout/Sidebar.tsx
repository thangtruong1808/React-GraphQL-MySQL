import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE_PATHS } from '../../constants/routingConstants';
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

  // Navigation items for authenticated users
  const navigationItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: ROUTE_PATHS.HOME,
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
      description: 'Project overview and statistics'
    },
    {
      id: 'projects',
      label: 'Projects',
      path: ROUTE_PATHS.PROJECTS,
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      description: 'Browse and manage projects'
    },
    {
      id: 'team',
      label: 'Team',
      path: ROUTE_PATHS.TEAM,
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      description: 'View team members and roles'
    },
    {
      id: 'search',
      label: 'Search',
      path: ROUTE_PATHS.SEARCH,
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
      description: 'Search projects, tasks, and members'
    }
  ];

  // Check if navigation item is active
  const isActiveItem = (item: SidebarItem) => {
    if (item.path === ROUTE_PATHS.HOME) {
      return location.pathname === '/' || location.pathname === ROUTE_PATHS.HOME;
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
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'
      }`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Logo />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActiveItem(item)
                ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-600'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            title={isCollapsed ? item.description : undefined}
          >
            <svg className={`flex-shrink-0 ${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {getUserInitials()}
              </span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={handleLogout}
            className="w-full mt-3 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
