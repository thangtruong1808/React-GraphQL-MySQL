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
 * Description: Reusable link component with enhanced hover effects and improved accessibility
 * Date: 2024-12-19
 * Author: thangtruong
 */
const FooterLink: React.FC<FooterLinkProps> = ({ to, children, className = '' }) => {
  return (
    <Link
      to={to}
      className={`text-sm text-left transition-all duration-300 py-1.5 block rounded-md px-2 -ml-2 hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
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
      {children}
    </Link>
  );
};

export default FooterLink;

