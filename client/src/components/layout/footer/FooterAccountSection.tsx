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
 * Description: Displays user account information or sign-in link with improved layout and spacing
 * Date: 2024-12-19
 * Author: thangtruong
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
    return user.role;
  };

  return (
    <div>
      {/* Section Header */}
      <h4 className="text-lg font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
        Account
      </h4>

      {/* Authenticated User View */}
      {isAuthenticated && user ? (
        <div className="space-y-4">
          {/* User Avatar and Info */}
          <div className="flex flex-col items-start space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center theme-accent-gradient shadow-md">
                <span className="text-white text-base font-semibold">
                  {getUserInitials()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {getUserRoleDisplay()}
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Link */}
          <Link
            to="/dashboard"
            className="text-sm transition-all duration-300 py-1.5 block rounded-md px-2 -ml-2 hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-block"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--footer-resource-hover-bg, rgba(0,0,0,0.05))';
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
        <div className="space-y-3">
          {/* Sign In Link */}
          <Link
            to={ROUTE_PATHS.LOGIN}
            className="text-sm transition-all duration-300 py-2 px-4 block rounded-md hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-block"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--footer-resource-hover-bg, rgba(0,0,0,0.05))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {FOOTER_CONTENT.USER_CONTEXT.SIGN_IN_LINK}
          </Link>

          {/* Guest Message */}
          <p className="text-xs leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
            {FOOTER_CONTENT.USER_CONTEXT.GUEST_MESSAGE}
          </p>
        </div>
      )}
    </div>
  );
};

export default FooterAccountSection;
