import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { getNavItemsForUser, getMobileNavItems } from '../../constants/navigation';
import { NAVBAR_UI } from '../../constants/navbar';
import Logo from './Logo';
import MobileMenuButton from './MobileMenuButton';
import MobileMenu from './MobileMenu';
import UserDropdown from './UserDropdown';
import NavIcon from '../ui/NavIcon';

/**
 * Navigation Bar Component
 * Main navigation component that adapts based on authentication status * 
 * CALLED BY: App.tsx for all users
 * SCENARIOS: Both authenticated and unauthenticated user navigation
 */
const NavBar: React.FC = () => {
  const navigate = useNavigate();
  // Consume context from AuthContext.tsx to get user, isAuthenticated, performLogout, and logoutLoading
  const { user, isAuthenticated, performLogout, logoutLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Get navigation items based on user authentication status
  const navItems = getNavItemsForUser(user); // Desktop navigation items
  const mobileNavItems = getMobileNavItems(user); // Mobile navigation items

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
    <nav className="bg-white  border-b border-gray-200 sticky top-0 z-50 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo and Brand */}
          <div className="flex items-center flex-shrink-0">
            <Logo />
          </div>

          {/* Center Section: Primary Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="group relative text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg text-base font-medium transition-all duration-300 hover:bg-purple-50 hover:shadow-md transform hover:-translate-y-0.5"
                  title={item.description}
                >
                  {/* Navigation icon and text */}
                  <div className="flex items-center space-x-2">
                    <NavIcon icon={item.icon || 'default'} className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {/* Hover tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {item.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </Link>
              ))}
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
            navItems={mobileNavItems}
          />
        </div>
      )}
    </nav>
  );
};

export default NavBar; 