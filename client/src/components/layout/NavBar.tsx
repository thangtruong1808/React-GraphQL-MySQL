// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { getNavItemsForUser, getMobileNavItems } from '../../constants/navigation';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { NAVBAR_UI } from '../../constants/navbar';
import Logo from './Logo';
import MobileMenuButton from './MobileMenuButton';
import MobileMenu from './MobileMenu';
import UserDropdown from './UserDropdown';
import NavIcon from '../ui/NavIcon';
import { SearchDrawer } from '../search';
import { NotificationDrawer } from '../notifications';
import { useQuery } from '@apollo/client';
import { GET_USER_UNREAD_NOTIFICATIONS_QUERY } from '../../services/graphql/notificationQueries';

/**
 * Navigation Bar Component
 * Main navigation component that adapts based on authentication status * 
 * CALLED BY: App.tsx for all users
 * SCENARIOS: Both authenticated and unauthenticated user navigation
 */
const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Consume context from AuthContext.tsx to get user, isAuthenticated, performLogout, and logoutLoading
  const { user, isAuthenticated, performLogout, logoutLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Get navigation items based on user authentication status
  const navItems = getNavItemsForUser(user); // Desktop navigation items
  const mobileNavItems = getMobileNavItems(user); // Mobile navigation items

  // Role-based filtering: hide Dashboard for non-admin/PM users, but keep notifications for all authenticated users
  const { hasDashboardAccess } = useRolePermissions();
  const filteredNavItems = hasDashboardAccess ? navItems : navItems.filter(i => i.id !== 'dashboard');
  const filteredMobileNavItems = hasDashboardAccess ? mobileNavItems : mobileNavItems.filter((i: any) => i.id !== 'dashboard');

  // Fetch unread notification count for authenticated users
  const { data: notificationData, error: notificationError } = useQuery(GET_USER_UNREAD_NOTIFICATIONS_QUERY, {
    variables: { limit: 100 },
    skip: !isAuthenticated,
    pollInterval: 30000, // Poll every 30 seconds for real-time updates
    errorPolicy: 'ignore'
  });


  // Calculate unread count from user's notifications
  const unreadCount = notificationData?.dashboardNotifications?.notifications?.filter(
    (notification: any) => !notification.isRead
  ).length || 0;

  /**
   * Check if a navigation item is currently active
   * Compares current pathname with item path, handling special cases
   */
  const isNavItemActive = (item: any) => {
    // Special handling for search item (button, not link)
    if (item.id === 'search') {
      return location.pathname === '/search';
    }

    // For home route, check if we're on root path
    if (item.path === ROUTE_PATHS.HOME) {
      return location.pathname === '/' || location.pathname === ROUTE_PATHS.HOME;
    }

    // For other routes, check exact match
    return location.pathname === item.path;
  };

  /**
   * Handle click outside to close dropdowns
   * Closes mobile menu and user dropdown when clicking outside
   */
  const handleClickOutside = (event: MouseEvent) => {
    // Close mobile menu if clicking outside both menu and button
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) &&
      mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target as Node)) {
      setIsMobileMenuOpen(false);
    }

    // Close user dropdown if clicking outside
    if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
      setIsUserDropdownOpen(false);
    }
  };

  /**
   * Handle user logout
   * Performs logout with toast notification and redirects to login page
   */
  const handleLogout = async () => {
    try {
      await performLogout({ showToast: true, fromModal: false, immediate: false });
      navigate(ROUTE_PATHS.LOGIN, { replace: true });
    } catch (error) {
      // Logout error handled silently
    }
  };

  /**
   * Toggle mobile menu visibility
   * Opens/closes mobile navigation menu
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserDropdownOpen(false); // Close user dropdown when opening mobile menu
  };

  /**
   * Toggle user dropdown visibility
   * Opens/closes user profile dropdown
   */
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsMobileMenuOpen(false); // Close mobile menu when opening user dropdown
  };

  /**
   * Close mobile menu
   * Closes mobile navigation menu
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  /**
   * Handle search drawer toggle
   * Opens/closes search drawer
   */
  const handleSearchToggle = () => {
    setIsSearchDrawerOpen(!isSearchDrawerOpen);
    setIsUserDropdownOpen(false); // Close user dropdown when opening search
    setIsMobileMenuOpen(false); // Close mobile menu when opening search
  };

  /**
   * Handle search drawer close
   * Closes search drawer
   */
  const handleSearchClose = () => {
    setIsSearchDrawerOpen(false);
  };

  /**
   * Handle notification drawer toggle
   * Opens/closes notification drawer
   */
  const handleNotificationToggle = () => {
    setIsNotificationDrawerOpen(!isNotificationDrawerOpen);
    setIsUserDropdownOpen(false); // Close user dropdown when opening notifications
    setIsMobileMenuOpen(false); // Close mobile menu when opening notifications
  };

  /**
   * Handle notification drawer close
   * Closes notification drawer
   */
  const handleNotificationClose = () => {
    setIsNotificationDrawerOpen(false);
  };

  /**
   * Get user initials for avatar
   * Returns user's first and last name initials
   */
  const getUserInitials = () => {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  // Reset dropdown and mobile menu states when authentication changes
  useEffect(() => {
    if (NAVBAR_UI.CLOSE_DROPDOWNS_ON_AUTH_CHANGE) {
      // Close user dropdown when authentication state changes
      // This ensures dropdowns are reset on login/logout
      setIsUserDropdownOpen(false);
    }

    if (NAVBAR_UI.CLOSE_MOBILE_MENU_ON_AUTH_CHANGE) {
      // Close mobile menu when authentication state changes
      // This ensures mobile menu is reset on login/logout
      setIsMobileMenuOpen(false);
    }
  }, [isAuthenticated, user?.id]); // Reset when auth state or user changes

  // Add click outside listener
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-gray-100 border-b border-gray-200 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Section: Logo and Brand */}
          <div className="flex items-center flex-shrink-0">
            <Logo />
          </div>

          {/* Center Section: Primary Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-3 lg:space-x-6 xl:space-x-8">
              {filteredNavItems.map((item) => {
                const isActive = isNavItemActive(item);
                return item.id === 'search' ? (
                  <button
                    key={item.id}
                    onClick={handleSearchToggle}
                    className={`group relative px-8 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 hover:bg-purple-50 hover:shadow-md transform hover:-translate-y-0.5 ${isActive
                      ? 'text-purple-600 bg-purple-50 shadow-md'
                      : 'text-gray-700 hover:text-purple-600'
                      }`}
                    title={item.description}
                  >
                    {/* Navigation icon and text */}
                    <div className="flex flex-col items-center space-y-1">
                      <NavIcon icon={item.icon || 'default'} className="w-4 h-4" />
                      <span className="text-xs lg:text-sm">{item.label}</span>
                    </div>

                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {item.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </button>
                ) : item.id === 'notifications' ? (
                  <button
                    key={item.id}
                    onClick={handleNotificationToggle}
                    className={`group relative px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 hover:bg-purple-50 hover:shadow-md transform hover:-translate-y-0.5 ${isActive
                      ? 'text-purple-600 bg-purple-50 shadow-md'
                      : 'text-gray-700 hover:text-purple-600'
                      }`}
                    title={item.description}
                  >
                    {/* Navigation icon and text */}
                    <div className="flex flex-col items-center space-y-1">
                      <div className="relative flex items-center">
                        {/* Dynamic notification icon based on unread status */}
                        {unreadCount > 0 ? (
                          // Bell icon with subtle lean for unread notifications
                          <div className="transform rotate-12 transition-transform duration-300 hover:rotate-0">
                            <NavIcon icon={item.icon || 'default'} className="w-4 h-4 text-purple-600" />
                          </div>
                        ) : (
                          // Normal bell icon for no unread notifications
                          <NavIcon icon={item.icon || 'default'} className="w-4 h-4" />
                        )}
                        {/* Always show notification count */}
                        <div className="ml-1 flex items-center">
                          <span className={`text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center font-medium shadow-sm ${unreadCount > 0
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                            }`}>
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs lg:text-sm">{item.label}</span>
                    </div>

                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {item.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </button>
                ) : (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`group relative px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 hover:bg-purple-50 hover:shadow-md transform hover:-translate-y-0.5 ${isActive
                      ? 'text-purple-600 bg-purple-50 shadow-md'
                      : 'text-gray-700 hover:text-purple-600'
                      }`}
                    title={item.description}
                  >
                    {/* Navigation icon and text */}
                    <div className="flex flex-col items-center space-y-1">
                      <NavIcon icon={item.icon || 'default'} className="w-4 h-4" />
                      <span className="text-xs lg:text-sm">{item.label}</span>
                    </div>

                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {item.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Section: User Actions */}
          <div className="flex items-center space-x-4">
            {/* User dropdown - only show for authenticated users on desktop (hidden on mobile) */}
            {isAuthenticated && (
              <div className="relative hidden md:block" ref={userDropdownRef}>
                <UserDropdown
                  user={user}
                  isDropdownOpen={isUserDropdownOpen}
                  onToggleDropdown={toggleUserDropdown}
                  onLogout={handleLogout}
                  logoutLoading={logoutLoading}
                  getUserInitials={getUserInitials}
                />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center" ref={mobileMenuButtonRef}>
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onToggle={toggleMobileMenu}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu - only render when open */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef}>
          <MobileMenu
            isOpen={isMobileMenuOpen}
            user={user}
            isAuthenticated={isAuthenticated}
            onClose={closeMobileMenu}
            onLogout={handleLogout}
            logoutLoading={logoutLoading}
            getUserInitials={getUserInitials}
            navItems={filteredMobileNavItems}
            onSearchToggle={handleSearchToggle}
          />
        </div>
      )}

      {/* Search drawer */}
      <SearchDrawer
        isOpen={isSearchDrawerOpen}
        onClose={handleSearchClose}
      />

      {/* Notification drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={handleNotificationClose}
      />
    </nav>
  );
};

export default NavBar; 