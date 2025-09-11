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
    <div className="md:hidden">
      <button
        onClick={onToggle}
        className="text-gray-600 hover:text-purple-600 p-3 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 ease-in-out hover:bg-purple-50 hover:shadow-lg transform hover:scale-105 hover:-translate-y-0.5"
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