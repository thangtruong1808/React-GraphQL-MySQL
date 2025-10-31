import React from 'react';

/**
 * Footer Button Props Interface
 */
interface FooterButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Footer Button Component
 * Reusable button component with theme-aware hover effects
 * Provides consistent styling and interaction for footer resource buttons
 */
const FooterButton: React.FC<FooterButtonProps> = ({ onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`footer-resource-btn text-sm text-left transition-colors duration-300 ${className}`}
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
    </button>
  );
};

export default FooterButton;

