import { TOKEN_STORAGE } from './constants';

/**
 * Memory Storage Module
 * Handles secure memory-only storage for tokens and user data
 * Provides XSS protection by avoiding localStorage/sessionStorage
 */

// Memory-only storage variables (XSS protection)
let memoryAccessToken: string | null = null;
let memoryUserData: any | null = null;
let memoryTokenExpiry: number | null = null;
let memoryRefreshTokenExpiry: number | null = null;
let memoryLastActivity: number | null = null;
let memoryActivityBasedExpiry: number | null = null;

/**
 * Memory Storage Class
 * Manages secure memory-based storage operations
 */
export class MemoryStorage {
  /**
   * Store access token in memory
   * @param token - JWT access token to store
   */
  static setAccessToken(token: string | null): void {
    memoryAccessToken = token;
  }

  /**
   * Get access token from memory
   * @returns Access token or null if not stored
   */
  static getAccessToken(): string | null {
    return memoryAccessToken;
  }

  /**
   * Store user data in memory
   * @param userData - User data object to store
   */
  static setUserData(userData: any | null): void {
    memoryUserData = userData;
  }

  /**
   * Get user data from memory
   * @returns User data or null if not stored
   */
  static getUserData(): any | null {
    return memoryUserData;
  }

  /**
   * Store token expiry timestamp in memory
   * @param expiry - Expiry timestamp in milliseconds
   */
  static setTokenExpiry(expiry: number | null): void {
    memoryTokenExpiry = expiry;
  }

  /**
   * Get token expiry timestamp from memory
   * @returns Expiry timestamp or null if not stored
   */
  static getTokenExpiry(): number | null {
    return memoryTokenExpiry;
  }

  /**
   * Store refresh token expiry timestamp in memory
   * @param expiry - Expiry timestamp in milliseconds
   */
  static setRefreshTokenExpiry(expiry: number | null): void {
    memoryRefreshTokenExpiry = expiry;
  }

  /**
   * Get refresh token expiry timestamp from memory
   * @returns Expiry timestamp or null if not stored
   */
  static getRefreshTokenExpiry(): number | null {
    return memoryRefreshTokenExpiry;
  }

  /**
   * Store last activity timestamp in memory
   * @param timestamp - Activity timestamp in milliseconds
   */
  static setLastActivity(timestamp: number | null): void {
    memoryLastActivity = timestamp;
  }

  /**
   * Get last activity timestamp from memory
   * @returns Activity timestamp or null if not stored
   */
  static getLastActivity(): number | null {
    return memoryLastActivity;
  }

  /**
   * Store activity-based expiry timestamp in memory
   * @param expiry - Expiry timestamp in milliseconds
   */
  static setActivityBasedExpiry(expiry: number | null): void {
    memoryActivityBasedExpiry = expiry;
  }

  /**
   * Get activity-based expiry timestamp from memory
   * @returns Expiry timestamp or null if not stored
   */
  static getActivityBasedExpiry(): number | null {
    return memoryActivityBasedExpiry;
  }

  /**
   * Clear all memory storage data
   * Used for secure cleanup during logout or errors
   */
  static clearAll(): void {
    memoryAccessToken = null;
    memoryUserData = null;
    memoryTokenExpiry = null;
    memoryRefreshTokenExpiry = null;
    memoryLastActivity = null;
    memoryActivityBasedExpiry = null;
  }

  /**
   * Check if any data is stored in memory
   * @returns Boolean indicating if any data exists
   */
  static hasData(): boolean {
    return !!(memoryAccessToken || memoryUserData || memoryTokenExpiry || 
              memoryRefreshTokenExpiry || memoryLastActivity || memoryActivityBasedExpiry);
  }

  /**
   * Get memory storage status for debugging
   * @returns Object with storage status information
   */
  static getStorageStatus(): {
    hasAccessToken: boolean;
    hasUserData: boolean;
    hasTokenExpiry: boolean;
    hasRefreshTokenExpiry: boolean;
    hasLastActivity: boolean;
    hasActivityBasedExpiry: boolean;
  } {
    return {
      hasAccessToken: !!memoryAccessToken,
      hasUserData: !!memoryUserData,
      hasTokenExpiry: !!memoryTokenExpiry,
      hasRefreshTokenExpiry: !!memoryRefreshTokenExpiry,
      hasLastActivity: !!memoryLastActivity,
      hasActivityBasedExpiry: !!memoryActivityBasedExpiry,
    };
  }
}
