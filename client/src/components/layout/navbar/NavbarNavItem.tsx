import React, { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavIcon from '../../ui/NavIcon';
import NavbarNotificationBadge from './NavbarNotificationBadge';

/**
 * Navbar Nav Item Props Interface
 */
interface NavbarNavItemProps {
  item: {
    id: string;
    label: string;
    path?: string;
    icon?: string;
    description: string;
  };
  isActive: boolean;
  unreadCount?: number | null;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
}

/**
 * Description: Renders individual navigation items with theme-aware hover and notification states.
 * Data created: None; hover styles computed inline without storing component state.
 * Author: thangtruong
 */
const NavbarNavItem: React.FC<NavbarNavItemProps> = ({
  item,
  isActive,
  unreadCount,
  onSearchClick,
  onNotificationClick
}) => {
  // Handle default value for unreadCount - preserve null for loading state, default to 0 for other items
  const count = unreadCount !== undefined ? unreadCount : (item.id === 'notifications' ? null : 0);
  const location = useLocation();
  const baseClassName = `group relative px-2 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 transform hover:-translate-y-0.5 theme-navbar-text`;
  const itemStyle: CSSProperties = isActive
    ? {
        backgroundColor: 'var(--tab-active-bg)',
        color: 'var(--tab-active-text, var(--navbar-text))',
        border: `1px solid var(--tab-active-border)`,
        boxShadow: '0 14px 28px var(--shadow-color)'
      }
    : {
        backgroundColor: 'transparent',
        color: 'var(--navbar-text, var(--text-primary))',
        border: '1px solid transparent'
      };
  const hoverClassName = isActive ? '' : 'theme-tab-inactive-hover-bg';
  const tooltipStyle: CSSProperties = {
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-primary)',
    border: `1px solid var(--border-color)`,
    boxShadow: '0 12px 24px var(--shadow-color)'
  };
  const handleMouseEnter = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (!isActive) {
      event.currentTarget.style.color = 'var(--accent-from)';
      event.currentTarget.style.backgroundColor = 'var(--tab-inactive-hover-bg)';
      event.currentTarget.style.borderColor = 'var(--tab-active-border)';
      event.currentTarget.style.boxShadow = '0 16px 32px var(--shadow-color)';
      event.currentTarget.style.transform = 'translateY(-2px)';
    }
  };
  const handleMouseLeave = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (!isActive) {
      event.currentTarget.style.color = 'var(--navbar-text, var(--text-primary))';
      event.currentTarget.style.backgroundColor = 'transparent';
      event.currentTarget.style.borderColor = 'transparent';
      event.currentTarget.style.boxShadow = 'none';
      event.currentTarget.style.transform = 'translateY(0)';
    }
  };

  // Search button
  if (item.id === 'search') {
    return (
      <button
        onClick={onSearchClick}
        className={`${baseClassName} ${hoverClassName} px-8 lg:px-3`}
        style={itemStyle}
        title={item.description}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Navigation icon and text */}
        <div className="flex flex-col items-center space-y-1">
          <NavIcon icon={item.icon || 'default'} className="w-4 h-4" />
          <span className="text-xs lg:text-sm">{item.label}</span>
        </div>

        {/* Hover tooltip */}
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
          style={tooltipStyle}
        >
          {item.description}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
            style={{ borderTopColor: 'var(--card-bg)' }}
          ></div>
        </div>
      </button>
    );
  }

  // Notifications button
  if (item.id === 'notifications') {
    return (
      <button
        onClick={onNotificationClick}
        className={`${baseClassName} ${hoverClassName}`}
        style={itemStyle}
        title={item.description}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Navigation icon and text */}
        <div className="flex flex-col items-center space-y-1">
          <div className="flex items-center justify-center">
            {/* Dynamic notification icon based on unread status */}
            {count !== null && count > 0 ? (
              // Bell icon with subtle lean for unread notifications
              <div className="transform rotate-12 transition-transform duration-300 hover:rotate-0">
                <span style={{ color: 'var(--accent-from)' }}>
                  <NavIcon icon={item.icon || 'default'} className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
              </div>
            ) : (
              // Normal bell icon for no unread notifications or loading state
              <NavIcon icon={item.icon || 'default'} className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            {/* Notification badge - positioned next to icon */}
            <NavbarNotificationBadge unreadCount={count} />
          </div>
          <span className="text-xs lg:text-sm">{item.label}</span>
        </div>

        {/* Hover tooltip */}
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
          style={tooltipStyle}
        >
          {item.description}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
            style={{ borderTopColor: 'var(--card-bg)' }}
          ></div>
        </div>
      </button>
    );
  }

  // Regular navigation link
  return (
    <Link
      to={item.path || '#'}
      className={`${baseClassName} ${hoverClassName}`}
      style={itemStyle}
      title={item.description}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Navigation icon and text */}
      <div className="flex flex-col items-center space-y-1">
        <NavIcon icon={item.icon || 'default'} className="w-4 h-4" />
        <span className="text-xs lg:text-sm">{item.label}</span>
      </div>

      {/* Hover tooltip */}
      <div
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
        style={tooltipStyle}
      >
        {item.description}
        <div
          className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
          style={{ borderTopColor: 'var(--card-bg)' }}
        ></div>
      </div>
    </Link>
  );
};

export default NavbarNavItem;

