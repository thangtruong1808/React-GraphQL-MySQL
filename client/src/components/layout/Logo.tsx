import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  collapsed?: boolean;
}

/**
 * Description: Renders the TaskFlow brand link with theme-aware colors and hover transitions.
 * Data created: Hover color effects managed via element refs (no persistent state).
 * Author: thangtruong
 */
const Logo: React.FC<LogoProps> = ({ collapsed = false }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  const handleMouseEnter = () => {
    if (headingRef.current) {
      headingRef.current.style.color = 'var(--accent-from)';
    }
    if (taglineRef.current) {
      taglineRef.current.style.color = 'var(--accent-to)';
    }
  };

  const handleMouseLeave = () => {
    if (headingRef.current) {
      headingRef.current.style.color = 'var(--navbar-text)';
    }
    if (taglineRef.current) {
      taglineRef.current.style.color = 'var(--navbar-text-secondary)';
    }
  };

  return (
    <Link
      to="/"
      className="flex items-center space-x-3 flex-shrink-0 group transition-transform duration-300 hover:scale-105"
      title="TaskFlow - Project Management Platform"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* App Logo - Theme-based gradient */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300"
        style={{
          backgroundImage: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
          boxShadow: '0 18px 36px var(--shadow-color)'
        }}
      >
        <svg
          className="w-6 h-6"
          style={{ color: 'var(--button-primary-text)' }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
        </svg>
      </div>

      {/* Brand Text - Only show when not collapsed */}
      {!collapsed && (
        <div className="flex flex-col">
          <h1
            ref={headingRef}
            className="text-base font-medium transition-colors duration-300"
            style={{ color: 'var(--navbar-text)' }}
          >
            TaskFlow
          </h1>
          <p
            ref={taglineRef}
            className="text-sm transition-colors duration-300"
            style={{ color: 'var(--navbar-text-secondary)' }}
          >
            Project Management
          </p>
        </div>
      )}
    </Link>
  );
};

export default Logo;