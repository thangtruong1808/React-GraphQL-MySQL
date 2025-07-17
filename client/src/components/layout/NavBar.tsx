import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getNavItemsForUser, getMobileNavItems } from '../../constants/navigation';
import Logo from './Logo';
import UserDropdown from './UserDropdown';
import MobileMenu from './MobileMenu';
import MobileMenuButton from './MobileMenuButton';
import NavIcon from '../ui/NavIcon';

/**
 * NavBar Component
 * Main navigation bar with responsive design and role-based access
 * Orchestrates logo, navigation, user menu, and mobile menu
 */
const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, logoutLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLDivElement>(null);

  // Get navigation items based on user role
  const navItems = getNavItemsForUser(user);

  /**
   * Check if navigation item is currently active
   * @param itemPath - Navigation item path
   * @returns True if item is active
   */
  const isActiveItem = (itemPath: string): boolean => {
    if (itemPath === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(itemPath);
  };

  /**
   * Close dropdown and mobile menu when clicking outside
   * Excludes mobile menu button to prevent conflicts with X button
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Toggle user dropdown menu
   */
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  /**
   * Get user initials for avatar
   */
  const getUserInitials = () => {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  /**
   * Toggle mobile menu
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * Close mobile menu when navigating
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Main NavBar Row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation Links - Single Row (1440px and above) */}
          <div className="hidden 2xl:flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = isActiveItem(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`group flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out whitespace-nowrap ${isActive
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                    }`}
                  title={item.description}
                >
                  <NavIcon
                    icon={item.icon || 'default'}
                    className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-emerald-700' : 'text-gray-500 group-hover:text-emerald-600'
                      }`}
                  />
                  <span className={`text-sm transition-all duration-200 ${isActive ? 'font-medium' : 'font-normal'
                    }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            {isAuthenticated ? (
              <div ref={dropdownRef}>
                <UserDropdown
                  user={user}
                  isDropdownOpen={isDropdownOpen}
                  logoutLoading={logoutLoading}
                  onToggleDropdown={toggleDropdown}
                  onLogout={handleLogout}
                  getUserInitials={getUserInitials}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-emerald-700 hover:text-emerald-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-emerald-50 border border-emerald-500 hover:border-emerald-300"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Visible below 1024px */}
          <div className="lg:hidden" ref={mobileMenuButtonRef}>
            <MobileMenuButton isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />
          </div>
        </div>

        {/* Second Row Navigation - Two Rows (815px to 1440) */}
        <div className="hidden lg:flex 2xl:hidden border-t border-emerald-100">
          <div className="flex items-center justify-center space-x-4 py-2 w-full">
            {navItems.map((item) => {
              const isActive = isActiveItem(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`group flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out whitespace-nowrap ${isActive
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                    }`}
                  title={item.description}
                >
                  <NavIcon
                    icon={item.icon || 'default'}
                    className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-emerald-700' : 'text-gray-500 group-hover:text-emerald-600'
                      }`}
                  />
                  <span className={`text-sm transition-all duration-200 ${isActive ? 'font-medium' : 'font-normal'
                    }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div ref={mobileMenuRef}>
        <MobileMenu
          isOpen={isMobileMenuOpen}
          user={user}
          isAuthenticated={isAuthenticated}
          logoutLoading={logoutLoading}
          onClose={closeMobileMenu}
          onLogout={handleLogout}
          getUserInitials={getUserInitials}
          navItems={navItems}
        />
      </div>
    </nav>
  );
};

export default NavBar; 