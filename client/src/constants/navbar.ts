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
