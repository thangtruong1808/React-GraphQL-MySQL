/**
 * Authentication Operations - Refactored Module
 * This file now re-exports the refactored authentication operations modules
 * for backward compatibility with existing code
 *
 * The original 497-line file has been refactored into smaller, more maintainable modules:
 * - constants.ts: Authentication operations constants and configuration
 * - loginOperation.ts: User login operations and credential validation
 * - refreshOperation.ts: Token refresh and renewal operations
 * - logoutOperation.ts: User logout and session cleanup operations
 * - helpers.ts: Common utility functions and helpers
 * - index.ts: Main entry point and exports
 *
 * All functionality remains the same, but now follows React/GraphQL coding conventions
 * with each module having a maximum of 250-300 lines of code.
 */

// Re-export all functionality from the refactored modules
export * from './operations/index'; 