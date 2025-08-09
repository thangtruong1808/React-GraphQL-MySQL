/**
 * NavBar Constants
 * Centralized configuration for navbar behavior and styling
 */

/**
 * NavBar UI Configuration
 * Controls UI behavior and appearance
 */
export const NAVBAR_UI = {
  // Dropdown behavior
  CLOSE_DROPDOWNS_ON_AUTH_CHANGE: true, // Close all dropdowns when authentication state changes
  CLOSE_MOBILE_MENU_ON_AUTH_CHANGE: true, // Close mobile menu when authentication state changes
  
  // Interaction behavior
  AUTO_CLOSE_ON_OUTSIDE_CLICK: true, // Close dropdowns when clicking outside
  CLOSE_OTHER_DROPDOWNS_ON_OPEN: true, // Close other dropdowns when opening one
} as const;

/**
 * NavBar Messages
 * Text content for navbar components
 */
export const NAVBAR_MESSAGES = {
  // User dropdown
  SIGN_OUT: 'Sign Out',
  SIGNING_OUT: 'Signing out...',
  LOGGING_OUT: 'Logging out...',
  
  // Mobile menu
  LOGIN: 'Login',
  
  // Accessibility
  TOGGLE_USER_MENU: 'Toggle user menu',
  TOGGLE_MOBILE_MENU: 'Toggle mobile menu',
  USER_AVATAR: 'User avatar',
} as const;

/**
 * NavBar Layout Classes
 * Tailwind CSS classes for layout and positioning
 */
export const NAVBAR_LAYOUT = {
  // Container
  NAV_CONTAINER: 'bg-white shadow-sm border-b border-gray-200',
  NAV_INNER: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  NAV_FLEX: 'flex justify-between h-16',
  
  // Desktop navigation
  DESKTOP_NAV: 'hidden md:flex items-center space-x-8',
  NAV_LINKS: 'flex items-center space-x-6',
  
  // Mobile navigation
  MOBILE_BUTTON: 'md:hidden flex items-center',
  MOBILE_MENU: 'lg:hidden bg-white border-t border-gray-100 shadow-sm',
  
  // Dropdown positioning
  DROPDOWN_RELATIVE: 'relative',
  DROPDOWN_ABSOLUTE: 'absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border border-gray-200',
} as const;

/**
 * NavBar Colors
 * Color schemes for different states and elements
 */
export const NAVBAR_COLORS = {
  // Links
  LINK_DEFAULT: 'text-gray-700 hover:text-emerald-600',
  LINK_ACTIVE: 'text-emerald-700 bg-emerald-50',
  LINK_HOVER: 'hover:text-emerald-700 hover:bg-emerald-50',
  
  // User avatar
  AVATAR_GRADIENT: 'bg-gradient-to-br from-green-500 to-yellow-500',
  AVATAR_TEXT: 'text-white',
  
  // Buttons
  USER_BUTTON_HOVER: 'hover:bg-gray-100',
  LOGOUT_BUTTON: 'text-red-600 hover:bg-red-50',
  LOGOUT_BUTTON_DISABLED: 'disabled:opacity-50',
  
  // States
  LOADING_SPINNER: 'border-red-600',
} as const;
