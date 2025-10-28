// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { FOOTER_UI, FOOTER_LINKS, FOOTER_CONTENT, FOOTER_STYLES } from '../../constants/footer';
import Logo from './Logo';
import DocumentationModal from './footer/DocumentationModal';
import HelpCenterModal from './footer/HelpCenterModal';
import ApiReferenceModal from './footer/ApiReferenceModal';
import SystemStatusModal from './footer/SystemStatusModal';

/**
 * Footer Component
 * Professional and modern footer with company information, navigation links, and user context
 * 
 * CALLED BY: App.tsx for layout integration
 * SCENARIOS: All application scenarios - displays on all pages
 */
const Footer: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Modal state management
  const [isDocumentationModalOpen, setIsDocumentationModalOpen] = useState(false);
  const [isHelpCenterModalOpen, setIsHelpCenterModalOpen] = useState(false);
  const [isApiReferenceModalOpen, setIsApiReferenceModalOpen] = useState(false);
  const [isSystemStatusModalOpen, setIsSystemStatusModalOpen] = useState(false);

  /**
   * Get current year for copyright
   * Returns current year for dynamic copyright display
   */
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  /**
   * Get user role display name
   * Returns formatted role name from database or default
   */
  const getUserRoleDisplay = () => {
    if (!user || !user.role) return 'Guest';
    return user.role; // Display actual role from database, not enum value
  };

  /**
   * Get user initials for avatar display
   * Returns user's first and last name initials
   */
  const getUserInitials = () => {
    if (!user) return '';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  /**
   * Handle footer link click
   * Provides smooth scroll behavior for internal links
   */
  const handleFooterLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Add smooth scroll behavior for better UX
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href')?.replace('#', '');
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: FOOTER_UI.SMOOTH_SCROLL_BEHAVIOR as ScrollBehavior });
      }
    }
  };

  /**
   * Handle external link click
   * Opens external links in new tab with security attributes
   */
  const handleExternalLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  /**
   * Handle documentation modal open
   * Opens documentation modal with comprehensive information
   */
  const handleDocumentationClick = () => {
    setIsDocumentationModalOpen(true);
  };

  /**
   * Handle help center modal open
   * Opens help center modal with support resources
   */
  const handleHelpCenterClick = () => {
    setIsHelpCenterModalOpen(true);
  };

  /**
   * Handle API reference modal open
   * Opens API reference modal with integration guides
   */
  const handleApiReferenceClick = () => {
    setIsApiReferenceModalOpen(true);
  };

  /**
   * Handle system status modal open
   * Opens system status modal with real-time information
   */
  const handleSystemStatusClick = () => {
    setIsSystemStatusModalOpen(true);
  };

  return (
    <footer className={`theme-footer-bg ${FOOTER_STYLES.COLORS.TEXT_PRIMARY} border-t ${FOOTER_STYLES.COLORS.BORDER}`}>
      {/* Main Footer Content */}
      <div className={`${FOOTER_STYLES.LAYOUT.CONTAINER} py-12`}>
        <div className={FOOTER_STYLES.LAYOUT.GRID}>

          {/* Company Information Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <Logo collapsed={false} />
            </div>
            <p className={`${FOOTER_STYLES.COLORS.TEXT_SECONDARY} text-sm leading-relaxed mb-4`}>
              {FOOTER_CONTENT.COMPANY.DESCRIPTION}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleExternalLinkClick(FOOTER_LINKS.SOCIAL.GITHUB)}
                className={`${FOOTER_STYLES.COLORS.TEXT_MUTED} ${FOOTER_STYLES.COLORS.ACCENT_HOVER} ${FOOTER_STYLES.INTERACTIVE.TRANSITION}`}
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </button>
              <button
                onClick={() => handleExternalLinkClick(FOOTER_LINKS.SOCIAL.LINKEDIN)}
                className={`${FOOTER_STYLES.COLORS.TEXT_MUTED} ${FOOTER_STYLES.COLORS.ACCENT_HOVER} ${FOOTER_STYLES.INTERACTIVE.TRANSITION}`}
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
              <button
                onClick={() => handleExternalLinkClick(FOOTER_LINKS.SOCIAL.FACEBOOK)}
                className={`${FOOTER_STYLES.COLORS.TEXT_MUTED} ${FOOTER_STYLES.COLORS.ACCENT_HOVER} ${FOOTER_STYLES.INTERACTIVE.TRANSITION}`}
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className={`text-lg font-semibold ${FOOTER_STYLES.COLORS.TEXT_PRIMARY} mb-4`}>Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to={ROUTE_PATHS.HOME}
                  className={`${FOOTER_STYLES.COLORS.TEXT_SECONDARY} ${FOOTER_STYLES.COLORS.ACCENT_HOVER} ${FOOTER_STYLES.INTERACTIVE.TRANSITION} text-sm`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTE_PATHS.PROJECTS}
                  className={`${FOOTER_STYLES.COLORS.TEXT_SECONDARY} ${FOOTER_STYLES.COLORS.ACCENT_HOVER} ${FOOTER_STYLES.INTERACTIVE.TRANSITION} text-sm`}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTE_PATHS.TEAM}
                  className={`${FOOTER_STYLES.COLORS.TEXT_SECONDARY} ${FOOTER_STYLES.COLORS.ACCENT_HOVER} ${FOOTER_STYLES.INTERACTIVE.TRANSITION} text-sm`}
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTE_PATHS.ABOUT}
                  className={`${FOOTER_STYLES.COLORS.TEXT_SECONDARY} ${FOOTER_STYLES.COLORS.ACCENT_HOVER} ${FOOTER_STYLES.INTERACTIVE.TRANSITION} text-sm`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTE_PATHS.SEARCH}
                  className={`${FOOTER_STYLES.COLORS.TEXT_SECONDARY} ${FOOTER_STYLES.COLORS.ACCENT_HOVER} ${FOOTER_STYLES.INTERACTIVE.TRANSITION} text-sm`}
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h4 className={`text-lg font-semibold ${FOOTER_STYLES.COLORS.TEXT_PRIMARY} mb-4`}>Resources</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={handleDocumentationClick}
                  className={`${FOOTER_STYLES.COLORS.TEXT_SECONDARY} ${FOOTER_STYLES.COLORS.ACCENT_HOVER} ${FOOTER_STYLES.INTERACTIVE.TRANSITION} text-sm text-left`}
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  onClick={handleHelpCenterClick}
                  className={`${FOOTER_STYLES.COLORS.TEXT_SECONDARY} ${FOOTER_STYLES.COLORS.ACCENT_HOVER} ${FOOTER_STYLES.INTERACTIVE.TRANSITION} text-sm text-left`}
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={handleApiReferenceClick}
                  className={`${FOOTER_STYLES.COLORS.TEXT_SECONDARY} ${FOOTER_STYLES.COLORS.ACCENT_HOVER} ${FOOTER_STYLES.INTERACTIVE.TRANSITION} text-sm text-left`}
                >
                  API Reference
                </button>
              </li>
              <li>
                <button
                  onClick={handleSystemStatusClick}
                  className={`${FOOTER_STYLES.COLORS.TEXT_SECONDARY} ${FOOTER_STYLES.COLORS.ACCENT_HOVER} ${FOOTER_STYLES.INTERACTIVE.TRANSITION} text-sm text-left`}
                >
                  System Status
                </button>
              </li>
            </ul>
          </div>

          {/* User Context Section */}
          <div>
            <h4 className={`text-lg font-semibold ${FOOTER_STYLES.COLORS.TEXT_PRIMARY} mb-4 text-center`}>Account</h4>
            {isAuthenticated && user ? (
              <div className="space-y-3 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getUserInitials()}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className={`${FOOTER_STYLES.COLORS.TEXT_SECONDARY} text-sm font-medium`}>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className={`${FOOTER_STYLES.COLORS.TEXT_MUTED} text-xs`}>
                      {getUserRoleDisplay()}
                    </p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className={`${FOOTER_STYLES.COLORS.TEXT_SECONDARY} ${FOOTER_STYLES.COLORS.ACCENT_HOVER} ${FOOTER_STYLES.INTERACTIVE.TRANSITION} text-sm block text-center`}
                >
                  {FOOTER_CONTENT.USER_CONTEXT.DASHBOARD_LINK}
                </Link>
              </div>
            ) : (
              <div className="space-y-3 text-center">
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  className={`${FOOTER_STYLES.COLORS.TEXT_SECONDARY} ${FOOTER_STYLES.COLORS.ACCENT_HOVER} ${FOOTER_STYLES.INTERACTIVE.TRANSITION} text-sm block`}
                >
                  {FOOTER_CONTENT.USER_CONTEXT.SIGN_IN_LINK}
                </Link>
                <p className={`${FOOTER_STYLES.COLORS.TEXT_MUTED} text-xs`}>
                  {FOOTER_CONTENT.USER_CONTEXT.GUEST_MESSAGE}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className={`border-t ${FOOTER_STYLES.COLORS.BORDER} theme-footer-bg`}>
        <div className={`${FOOTER_STYLES.LAYOUT.CONTAINER} py-6`}>
          <div className="flex justify-center items-center">
            <div className="flex items-center space-x-4">
              <span className={`${FOOTER_STYLES.COLORS.TEXT_DISABLED} text-xs`}>
                {FOOTER_CONTENT.SYSTEM_STATUS.TECHNOLOGIES}
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className={`${FOOTER_STYLES.COLORS.TEXT_DISABLED} text-xs`}>
                  {FOOTER_CONTENT.SYSTEM_STATUS.OPERATIONAL}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Modals */}
      <DocumentationModal
        isOpen={isDocumentationModalOpen}
        onClose={() => setIsDocumentationModalOpen(false)}
      />
      <HelpCenterModal
        isOpen={isHelpCenterModalOpen}
        onClose={() => setIsHelpCenterModalOpen(false)}
      />
      <ApiReferenceModal
        isOpen={isApiReferenceModalOpen}
        onClose={() => setIsApiReferenceModalOpen(false)}
      />
      <SystemStatusModal
        isOpen={isSystemStatusModalOpen}
        onClose={() => setIsSystemStatusModalOpen(false)}
      />
    </footer>
  );
};

export default Footer;
