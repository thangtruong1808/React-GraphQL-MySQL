/**
 * Token Manager Module Index
 * Main entry point for all token management functionality
 * Provides both modular access and backward compatibility
 */

// Export the main TokenManager class
export { TokenManager } from './TokenManager';

// Export individual modules for advanced usage
export { MemoryStorage } from './memoryStorage';
export { TokenValidation } from './tokenValidation';
export { TokenStorage } from './tokenStorage';
export { ActivityManager } from './activityManager';
export { RefreshTokenManager } from './refreshTokenManager';
export { AuthValidation } from './authValidation';

// Export constants
export * from './constants';

// Export legacy wrapper functions for backward compatibility
export * from './legacyWrappers';

// Re-export legacy functions as default exports for backward compatibility
import * as LegacyWrappers from './legacyWrappers';
export default LegacyWrappers;
