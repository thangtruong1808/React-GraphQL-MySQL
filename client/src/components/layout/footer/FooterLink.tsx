import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer Link Props Interface
 */
interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Footer Link Component
 * Reusable link component with theme-aware hover effects
 * Provides consistent styling and interaction across footer links
 */
const FooterLink: React.FC<FooterLinkProps> = ({ to, children, className = '' }) => {
  return (
    <Link
      to={to}
      className={`text-sm text-left transition-colors duration-300 ${className}`}
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
      {children}
    </Link>
  );
};

export default FooterLink;

