import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { getNavItemsForUser } from '../../constants/navigation';
import { NAVBAR_UI } from '../../constants/navbar';
import Logo from './Logo';
import UserDropdown from './UserDropdown';
import MobileMenuButton from './MobileMenuButton';
import MobileMenu from './MobileMenu';

/**
 * Navigation Bar Component
 * Main navigation component that adapts based on authentication status
 * 
 * CALLED BY: App.tsx for all users
 * SCENARIOS: Both authenticated and unauthenticated user navigation
 */
const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, logoutLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Get navigation items based on user authentication status
  const navItems = getNavItemsForUser(user);

  /**
   * Handle click outside to close dropdowns
   * Closes mobile menu and user dropdown when clicking outside
   */
  const handleClickOutside = (event: MouseEvent) => {
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
      setIsMobileMenuOpen(false);
    }
    if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
      setIsUserDropdownOpen(false);
    }
  };

  /**
   * Handle user logout
   * Performs logout and redirects to login page
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTE_PATHS.LOGIN, { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
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
    <nav className="bg-white shadow-lg border-b border-gray-200 backdrop-blur-sm bg-opacity-95 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation links - show based on navigation items */}
            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="text-gray-700 hover:text-emerald-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-emerald-50 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* User dropdown - only show for authenticated users */}
            {isAuthenticated && (
              <div className="relative" ref={userDropdownRef}>
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
          <div className="md:hidden flex items-center">
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onToggle={toggleMobileMenu}
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div ref={mobileMenuRef}>
        <MobileMenu
          isOpen={isMobileMenuOpen}
          user={user}
          isAuthenticated={isAuthenticated}
          onClose={closeMobileMenu}
          onLogout={handleLogout}
          logoutLoading={logoutLoading}
          getUserInitials={getUserInitials}
          navItems={navItems}
        />
      </div>
    </nav>
  );
};

export default NavBar; 