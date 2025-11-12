import React, { CSSProperties } from 'react';

/**
 * Description: Renders the mobile navigation toggle button with theme-aware hover transitions.
 * Data created: None; hover styles handled inline without persisted state.
 * Author: thangtruong
 */
interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onToggle }) => {
  const baseStyle: CSSProperties = {
    color: isOpen ? 'var(--accent-from)' : 'var(--navbar-text, var(--text-primary))',
    backgroundColor: isOpen ? 'var(--tab-active-bg)' : 'transparent',
    borderColor: isOpen ? 'var(--tab-active-border)' : 'var(--border-color)',
    boxShadow: isOpen ? '0 16px 32px var(--shadow-color)' : '0 12px 24px rgba(0,0,0,0)',
    transform: isOpen ? 'translateY(-2px)' : 'translateY(0)',
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.color = 'var(--accent-from)';
    event.currentTarget.style.backgroundColor = 'var(--tab-inactive-hover-bg)';
    event.currentTarget.style.borderColor = 'var(--tab-active-border)';
    event.currentTarget.style.boxShadow = '0 16px 32px var(--shadow-color)';
    event.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.color = baseStyle.color as string;
    event.currentTarget.style.backgroundColor = baseStyle.backgroundColor as string;
    event.currentTarget.style.borderColor = baseStyle.borderColor as string;
    event.currentTarget.style.boxShadow = baseStyle.boxShadow as string;
    event.currentTarget.style.transform = baseStyle.transform as string;
  };

  return (
    <div className="md:hidden">
      <button
        onClick={onToggle}
        className="p-3 rounded-xl border transition-all duration-300 ease-in-out"
        style={baseStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Toggle mobile menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
    </div>
  );
};

export default MobileMenuButton; 