/**
 * Notification Constants
 * Configuration for notification component positioning and styling
 * 
 * USED BY: Notification component
 * PURPOSE: Centralize notification configuration
 */

export const NOTIFICATION_CONFIG = {
  // Auto-hide duration (in milliseconds)
  DEFAULT_DURATION: 10000,
  
  // Positioning - top center of screen
  POSITION: {
    CONTAINER: 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
    MAX_WIDTH: 'max-w-md w-full mx-4',
    SHADOW: 'shadow-2xl',
    BORDER_RADIUS: 'rounded-lg',
    PADDING: 'p-4'
  },
  
  // Animation
  ANIMATION: {
    ENTER: 'animate-in fade-in-0 zoom-in-95 duration-200',
    EXIT: 'animate-out fade-out-0 zoom-out-95 duration-200'
  },
  
  // Icon sizes
  ICON_SIZE: 'w-5 h-5',
  CLOSE_ICON_SIZE: 'w-4 h-4',
  
  // Spacing
  SPACING: {
    ICON_MARGIN: 'ml-3',
    CLOSE_MARGIN: 'ml-4',
    TEXT_MARGIN: 'mt-1'
  },
  
  // Colors for different notification types
  COLORS: {
    SUCCESS: {
      BACKGROUND: 'bg-green-50',
      BORDER: 'border-green-200',
      TEXT: 'text-green-800',
      ICON: 'text-green-400'
    },
    ERROR: {
      BACKGROUND: 'bg-red-50',
      BORDER: 'border-red-200',
      TEXT: 'text-red-800',
      ICON: 'text-red-400'
    },
    INFO: {
      BACKGROUND: 'bg-blue-50',
      BORDER: 'border-blue-200',
      TEXT: 'text-blue-800',
      ICON: 'text-blue-400'
    },
    DEFAULT: {
      BACKGROUND: 'bg-gray-50',
      BORDER: 'border-gray-200',
      TEXT: 'text-gray-800',
      ICON: 'text-gray-400'
    }
  },
  
  // Close button styling
  CLOSE_BUTTON: {
    BASE: 'inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600',
    TRANSITION: 'transition-colors duration-200'
  }
} as const;

/**
 * Notification type definitions
 */
export type NotificationType = 'success' | 'error' | 'info';
