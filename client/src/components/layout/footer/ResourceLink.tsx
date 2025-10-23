// @ts-nocheck
import React, { useState } from 'react';

/**
 * Resource Link Component Props
 */
interface ResourceLinkProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  isExternal?: boolean;
}

/**
 * Resource Link Component
 * Individual resource link with hover effects and detailed information
 * 
 * CALLED BY: Footer component for each resource item
 * SCENARIOS: User interaction with footer resource links
 */
const ResourceLink: React.FC<ResourceLinkProps> = ({
  title,
  description,
  icon,
  href,
  onClick,
  isExternal = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Handle link click
   * Executes click handler or navigates to URL
   */
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      if (isExternal) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = href;
      }
    }
  };

  /**
   * Handle mouse enter
   * Sets hover state for visual feedback
   */
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  /**
   * Handle mouse leave
   * Resets hover state
   */
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        group relative w-full p-4 rounded-lg border border-gray-200 
        bg-white hover:bg-purple-50 hover:border-purple-200 
        transition-all duration-300 text-left
        ${isHovered ? 'shadow-md transform -translate-y-1' : 'shadow-sm'}
      `}
      aria-label={`Learn more about ${title}`}
    >
      {/* Icon and Title */}
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <div className="text-white text-sm">
            {icon}
          </div>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
          {title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
        {description}
      </p>

      {/* Hover Arrow */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

export default ResourceLink;
