import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../../constants/routingConstants';
import { FOOTER_CONTENT } from '../../../constants/footer';

/**
 * Footer Account Section Props Interface
 */
interface FooterAccountSectionProps {
  isAuthenticated: boolean;
  user: {
    firstName: string;
    lastName: string;
    role: string;
  } | null;
}

/**
 * Footer Account Section Component
 * Displays user account information or sign-in link
 * Shows authenticated user profile or guest access options
 */
const FooterAccountSection: React.FC<FooterAccountSectionProps> = ({ isAuthenticated, user }) => {
  /**
   * Get user initials for avatar display
   * Returns user's first and last name initials
   */
  const getUserInitials = () => {
    if (!user) return '';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  /**
   * Get user role display name
   * Returns formatted role name from database or default
   */
  const getUserRoleDisplay = () => {
    if (!user || !user.role) return 'Guest';
    return user.role; // Display actual role from database, not enum value
  };

  return (
    <div>
      {/* Section Header */}
      <h4 className="text-lg font-semibold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
        Account
      </h4>

      {/* Authenticated User View */}
      {isAuthenticated && user ? (
        <div className="space-y-3 text-center">
          {/* User Avatar and Info */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center theme-accent-gradient">
              <span className="text-white text-sm font-medium">
                {getUserInitials()}
              </span>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {getUserRoleDisplay()}
              </p>
            </div>
          </div>

          {/* Dashboard Link */}
          <Link
            to="/dashboard"
            className="text-sm text-left transition-colors duration-300"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--footer-resource-hover-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {FOOTER_CONTENT.USER_CONTEXT.DASHBOARD_LINK}
          </Link>
        </div>
      ) : (
        /* Guest User View */
        <div className="space-y-3 text-center">
          {/* Sign In Link */}
          <Link
            to={ROUTE_PATHS.LOGIN}
            className="text-sm text-left transition-colors duration-300"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--footer-resource-hover-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {FOOTER_CONTENT.USER_CONTEXT.SIGN_IN_LINK}
          </Link>

          {/* Guest Message */}
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {FOOTER_CONTENT.USER_CONTEXT.GUEST_MESSAGE}
          </p>
        </div>
      )}
    </div>
  );
};

export default FooterAccountSection;
