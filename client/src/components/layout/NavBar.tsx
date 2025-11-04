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
import { useQuery } from '@apollo/client';
import { GET_USER_UNREAD_NOTIFICATIONS_QUERY } from '../../services/graphql/notificationQueries';
import { TokenManager, isActivityBasedTokenExpired, isTokenExpired, getTokens } from '../../utils/tokenManager';
import { AUTH_CONFIG } from '../../constants/auth';
import NavbarDesktopNavigation from './navbar/NavbarDesktopNavigation';
import NavbarUserActions from './navbar/NavbarUserActions';

/**
 * Navigation Bar Component
 * Main navigation component that adapts based on authentication status * 
 * CALLED BY: App.tsx for all users
 * SCENARIOS: Both authenticated and unauthenticated user navigation
 */
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

  // Get session expiry modal state to pause queries during expiry
  const { showSessionExpiryModal } = useAuth();

  // Track loading state for notification badge - show "..." while waiting
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);

  // Store last known unread count to maintain badge consistency when query is skipped
  const [lastKnownUnreadCount, setLastKnownUnreadCount] = useState(0);

  // Track when it's safe to query notifications (after server authentication confirmed)
  const [canQueryNotifications, setCanQueryNotifications] = useState(false);

  /**
   * Wait for all authentication conditions to be ready before allowing notification query
   * Simple async approach: wait for login to complete, tokens to be stored, AuthContext to update,
   * and apollo-client's authLink to be ready to collect tokens
   * Show loading badge ("...") during wait
   * This avoids race conditions by ensuring apollo-client can add Authorization header before query executes
   */
  useEffect(() => {
    const waitForAllAuthReady = async () => {
      // Step 1: Wait for login to complete and AuthContext to update with user
      // Skip if not authenticated, still initializing, or login is in progress
      if (!isAuthenticated || isInitializing || loginLoading || !user) {
        setCanQueryNotifications(false);
        setIsNotificationLoading(false);
        return;
      }

      // Login completed - show loading badge while waiting for server
      setIsNotificationLoading(true);

      // Step 2: Wait for tokens to be stored after login
      // Retry up to 10 times with 100ms delay to check if tokens are available
      let tokensReady = false;
      for (let i = 0; i < 10; i++) {
        const tokens = getTokens();

        if (tokens.accessToken) {
          // Verify token is not expired
          const isExpired = AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED
            ? isActivityBasedTokenExpired()
            : isTokenExpired(tokens.accessToken);

          if (!isExpired) {
            tokensReady = true;
            break;
          }
        }

        // Wait 100ms before next check
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (!tokensReady) {
        setCanQueryNotifications(false);
        return;
      }

      // Step 3: Wait for apollo-client's authLink (setContext) to be ready to collect tokens
      // apollo-client's setContext calls collectAuthData() on every request
      // We need to wait a bit for apollo-client's context to refresh after tokens are stored
      // This ensures collectAuthData() can access the new tokens when query executes
      await new Promise(resolve => setTimeout(resolve, 200));

      // Step 4: Final verification - tokens are still valid and apollo-client can access them
      const finalTokens = getTokens();
      const finalIsExpired = finalTokens.accessToken
        ? (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED
          ? isActivityBasedTokenExpired()
          : isTokenExpired(finalTokens.accessToken))
        : true;

      if (finalTokens.accessToken && !finalIsExpired) {
        // All conditions ready: login complete, AuthContext updated, tokens stored, apollo-client ready
        // apollo-client's authLink (setContext) will now collect tokens and add Authorization header
        setCanQueryNotifications(true);
      } else {
        // Tokens expired or not available, keep waiting
        setCanQueryNotifications(false);
      }
    };

    waitForAllAuthReady();
  }, [isAuthenticated, isInitializing, loginLoading, user]);

  /**
   * Monitor token expiry to skip notifications when tokens are expired
   * Prevents querying when tokens are expired or close to expiring
   * Only runs when canQueryNotifications is true (all auth conditions are ready)
   */
  const [shouldSkipNotifications, setShouldSkipNotifications] = useState(false);

  useEffect(() => {
    // Only check if user is authenticated and can query
    if (!isAuthenticated || isInitializing || loginLoading || !canQueryNotifications) {
      setShouldSkipNotifications(true);
      return;
    }

    // When canQueryNotifications becomes true, immediately set shouldSkipNotifications to false
    // We already verified tokens are valid in waitForAllAuthReady before setting canQueryNotifications
    // This allows query to execute immediately while token expiry check runs in background
    setShouldSkipNotifications(false);

    // Verify tokens are still valid and update shouldSkipNotifications if needed
    // This runs in background to monitor token expiry
    const checkTokenExpiry = async () => {
      try {
        // Skip notifications when session expiry modal is showing
        if (showSessionExpiryModal) {
          setShouldSkipNotifications(true);
          return;
        }

        // Check if tokens exist
        const tokens = getTokens();
        if (!tokens.accessToken) {
          setShouldSkipNotifications(true);
          return;
        }

        // Check if token is expired or close to expiring (within 10 seconds threshold)
        let isExpired = false;
        if (AUTH_CONFIG.ACTIVITY_BASED_TOKEN_ENABLED) {
          isExpired = isActivityBasedTokenExpired();
          if (!isExpired) {
            const expiry = TokenManager.getActivityBasedTokenExpiry();
            if (expiry) {
              const timeRemaining = expiry - Date.now();
              isExpired = timeRemaining <= 10000; // 10 seconds threshold
            }
          }
        } else {
          isExpired = isTokenExpired(tokens.accessToken);
          if (!isExpired) {
            const expiry = TokenManager.getTokenExpiration(tokens.accessToken);
            if (expiry) {
              const timeRemaining = expiry - Date.now();
              isExpired = timeRemaining <= 10000; // 10 seconds threshold
            }
          }
        }

        // Set shouldSkipNotifications based on token expiry status
        // If tokens are valid, set to false to allow query
        setShouldSkipNotifications(isExpired || showSessionExpiryModal);
      } catch (error) {
        // On error, skip to prevent unwanted queries
        setShouldSkipNotifications(true);
      }
    };

    // Check token expiry immediately when canQueryNotifications becomes true
    // This verifies tokens are still valid (should already be valid from waitForAllAuthReady)
    checkTokenExpiry();

    // Check every 5 seconds to update state as token approaches expiry
    const interval = setInterval(checkTokenExpiry, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, isInitializing, loginLoading, canQueryNotifications, showSessionExpiryModal]);

  // Fetch unread notification count for authenticated users
  // Query only after server authentication is confirmed (canQueryNotifications is true)
  // Skip query during initialization, login, or when tokens are expired
  // Errors are suppressed in error link
  const shouldSkip = isInitializing || loginLoading || !isAuthenticated || !user || showSessionExpiryModal || shouldSkipNotifications || !canQueryNotifications;

  console.log('[NavBar] Query skip state:', {
    shouldSkip,
    isInitializing,
    loginLoading,
    isAuthenticated,
    hasUser: !!user,
    showSessionExpiryModal,
    shouldSkipNotifications,
    canQueryNotifications
  });

  const { data: notificationData, loading: notificationQueryLoading, error: notificationError } = useQuery(GET_USER_UNREAD_NOTIFICATIONS_QUERY, {
    variables: { limit: 100 },
    skip: shouldSkip,
    errorPolicy: 'all' // Use 'all' to prevent errors from being thrown, errors are suppressed in error link
  });

  console.log('[NavBar] Query result:', {
    hasData: !!notificationData,
    loading: notificationQueryLoading,
    hasError: !!notificationError,
    error: notificationError,
    data: notificationData,
    notifications: notificationData?.dashboardNotifications?.notifications,
    notificationsCount: notificationData?.dashboardNotifications?.notifications?.length,
    unreadCount: notificationData?.dashboardNotifications?.notifications?.filter((n: any) => !n.isRead)?.length
  });

  // Update loading state based on query status
  // Show loading badge while waiting for server auth or while query is loading
  useEffect(() => {
    if (shouldSkip) {
      setIsNotificationLoading(false);
    } else if (notificationQueryLoading) {
      setIsNotificationLoading(true); // Show loading badge while querying
    } else if (notificationData) {
      setIsNotificationLoading(false); // Hide loading badge when data is received
    }
  }, [shouldSkip, notificationQueryLoading, notificationData]);

  // Reset last known count when user logs out or becomes unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLastKnownUnreadCount(0);
    }
  }, [isAuthenticated]);

  // Calculate unread count from user's notifications and update last known count
  useEffect(() => {
    if (notificationData?.dashboardNotifications?.notifications) {
      // Update last known count only when we have fresh data
      const currentUnreadCount = notificationData.dashboardNotifications.notifications.filter(
        (notification: any) => !notification.isRead
      ).length;
      setLastKnownUnreadCount(currentUnreadCount);
    }
  }, [notificationData]);

  // Calculate unread count - show loading state if query is loading or waiting for server auth
  // Show actual count when data is loaded, otherwise show last known count
  const unreadCount = isNotificationLoading
    ? null // null indicates loading state for badge
    : (notificationData?.dashboardNotifications?.notifications?.filter(
      (notification: any) => !notification.isRead
    ).length ?? lastKnownUnreadCount);

  console.log('[NavBar] Unread count calculation:', {
    isNotificationLoading,
    hasNotificationData: !!notificationData,
    notifications: notificationData?.dashboardNotifications?.notifications,
    calculatedUnreadCount: notificationData?.dashboardNotifications?.notifications?.filter((n: any) => !n.isRead)?.length,
    lastKnownUnreadCount,
    finalUnreadCount: unreadCount
  });

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
    <nav className="fixed top-0 left-0 right-0 w-full theme-navbar-bg border-b theme-border z-50">
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