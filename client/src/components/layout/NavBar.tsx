// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { getNavItemsForUser, getMobileNavItems } from '../../constants/navigation';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { NAVBAR_UI } from '../../constants/navbar';
import Logo from './Logo';
import MobileMenuButton from './MobileMenuButton';
import MobileMenu from './MobileMenu';
import { SearchDrawer } from '../search';
import { NotificationDrawer } from '../notifications';
import { useNotificationCount } from '../../hooks/useNotificationCount';
import NavbarDesktopNavigation from './navbar/NavbarDesktopNavigation';
import NavbarUserActions from './navbar/NavbarUserActions';

/** Description: Main navigation container that adapts to authentication state and theme variables; Data created: Local UI state for drawers, dropdowns, and menu visibility; Author: thangtruong */
const NavBar: React.FC = () => {
  const navigate = useNavigate();
  // Consume context from AuthContext.tsx to get user, isAuthenticated, isInitializing, loginLoading, performLogout, and logoutLoading
  const { user, isAuthenticated, isInitializing, loginLoading, performLogout, logoutLoading } = useAuth();
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

  // Get unread notification count using custom hook
  // Hook handles all authentication checks and query logic
  const unreadCount = useNotificationCount();

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
    <nav
      className="fixed top-0 left-0 right-0 w-full border-b theme-border z-50 theme-navbar-bg theme-navbar-text"
      style={{
        backgroundColor: 'var(--navbar-bg)',
        backgroundImage: 'var(--navbar-gradient)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        color: 'var(--navbar-text)',
        boxShadow: '0 16px 32px var(--shadow-color)'
      }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Section: Logo and Brand */}
          <div className="flex items-center flex-shrink-0">
            <Logo />
          </div>

          {/* Center Section: Primary Navigation */}
          <NavbarDesktopNavigation
            navItems={filteredNavItems}
            unreadCount={unreadCount}
            onSearchToggle={handleSearchToggle}
            onNotificationToggle={handleNotificationToggle}
          />

          {/* Right Section: User Actions */}
          <NavbarUserActions
            isAuthenticated={isAuthenticated}
            user={user}
            isUserDropdownOpen={isUserDropdownOpen}
            userDropdownRef={userDropdownRef}
            onToggleUserDropdown={toggleUserDropdown}
            onLogout={handleLogout}
            logoutLoading={logoutLoading}
            getUserInitials={getUserInitials}
          />

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
            unreadCount={unreadCount}
            onNotificationToggle={handleNotificationToggle}
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