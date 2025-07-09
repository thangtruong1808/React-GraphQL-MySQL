import React from 'react';

/**
 * Mobile Menu Button Component
 * Displays hamburger menu button for mobile navigation
 * Handles mobile menu toggle functionality
 */
interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isOpen, onToggle }) => {
  return (
    <div className="lg:hidden">
      <button
        onClick={onToggle}
        className="text-gray-500 hover:text-yellow-600 p-2 rounded-lg border border-gray-300 hover:border-yellow-400 transition-all duration-300 ease-in-out hover:bg-yellow-50 hover:shadow-md transform hover:scale-105"
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