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
let memoryContinueToWorkTransition: boolean = false;
let memoryTokenCreationTime: number | null = null; // NEW: Track token creation time for dynamic buffer
let memoryLogoutTransition: boolean = false; // NEW: Track logout transition state
let memorySessionExpiryModalShowing: boolean = false; // NEW: Track session expiry modal state
let memoryRefreshOperationInProgress: boolean = false; // NEW: Track refresh operation state

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
   * Store refresh token expiry timestamp in memory (async)
   * @param expiry - Expiry timestamp in milliseconds
   */
  static async setRefreshTokenExpiry(expiry: number | null): Promise<void> {
    memoryRefreshTokenExpiry = expiry;
  }

  /**
   * Get refresh token expiry timestamp from memory (async)
   * @returns Expiry timestamp or null if not stored
   */
  static async getRefreshTokenExpiry(): Promise<number | null> {
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
   * Store continue to work transition state in memory
   * @param state - Boolean indicating if transition is active
   */
  static setContinueToWorkTransition(state: boolean): void {
    memoryContinueToWorkTransition = state;
  }

  /**
   * Get continue to work transition state from memory
   * @returns Boolean indicating if transition is active
   */
  static getContinueToWorkTransition(): boolean {
    return memoryContinueToWorkTransition;
  }

  /**
   * Store token creation timestamp in memory
   * Used for calculating dynamic buffer time based on session duration
   * @param timestamp - Token creation timestamp in milliseconds
   */
  static setTokenCreationTime(timestamp: number | null): void {
    memoryTokenCreationTime = timestamp;
  }

  /**
   * Get token creation timestamp from memory
   * @returns Token creation timestamp or null if not stored
   */
  static getTokenCreationTime(): number | null {
    return memoryTokenCreationTime;
  }

  /**
   * Calculate dynamic buffer time based on token creation time
   * Buffer = Current time - Token creation time
   * @returns Buffer time in milliseconds or null if creation time not available
   */
  static calculateDynamicBuffer(): number | null {
    if (!memoryTokenCreationTime) {
      return null;
    }
    const currentTime = Date.now();
    const bufferTime = currentTime - memoryTokenCreationTime;
    const result = Math.max(bufferTime, 0); // Ensure non-negative buffer
    
    return result;
  }

  /**
   * Store logout transition state in memory
   * Used for tracking when user clicks logout from modal
   * @param state - Boolean indicating if logout transition is active
   */
  static setLogoutTransition(state: boolean): void {
    memoryLogoutTransition = state;
  }

  /**
   * Get logout transition state from memory
   * @returns Boolean indicating if logout transition is active
   */
  static getLogoutTransition(): boolean {
    return memoryLogoutTransition;
  }

  /**
   * Store session expiry modal showing state in memory
   * @param state - Boolean indicating if modal is showing
   */
  static setSessionExpiryModalShowing(state: boolean): void {
    memorySessionExpiryModalShowing = state;
  }

  /**
   * Get session expiry modal showing state from memory
   * @returns Boolean indicating if modal is showing
   */
  static getSessionExpiryModalShowing(): boolean {
    return memorySessionExpiryModalShowing;
  }

  // NEW: Refresh operation state management
  static setRefreshOperationInProgress(isInProgress: boolean): void {
    memoryRefreshOperationInProgress = isInProgress;
  }
  static getRefreshOperationInProgress(): boolean {
    return memoryRefreshOperationInProgress;
  }

  /**
   * Clear all memory storage data
   * Used for secure cleanup during logout or errors
   * NOTE: Token creation time is preserved for dynamic buffer calculation
   */
  static clearAll(): void {
    // Clear all memory storage
    memoryAccessToken = null;
    memoryUserData = null;
    memoryTokenExpiry = null;
    memoryRefreshTokenExpiry = null;

    memoryLastActivity = null;
    memoryActivityBasedExpiry = null;
    memoryContinueToWorkTransition = false; // NEW: Clear continue to work transition state
    memoryTokenCreationTime = null;
    memoryLogoutTransition = false; // NEW: Clear logout transition state
    memorySessionExpiryModalShowing = false; // NEW: Clear session expiry modal state
    memoryRefreshOperationInProgress = false; // NEW: Clear refresh operation state
  }

  /**
   * Clear token creation time specifically
   * Used when a complete logout is performed and new tokens will be created
   */
  static clearTokenCreationTime(): void {
    memoryTokenCreationTime = null;
  }

  /**
   * Check if any data is stored in memory
   * @returns Boolean indicating if any data exists
   */
  static hasData(): boolean {
    return !!(
      memoryAccessToken ||
      memoryUserData ||
      memoryTokenExpiry ||
      memoryRefreshTokenExpiry ||
      memoryLastActivity ||
      memoryActivityBasedExpiry ||
      memoryContinueToWorkTransition ||
      memoryTokenCreationTime ||
      memoryLogoutTransition ||
      memorySessionExpiryModalShowing ||
      memoryRefreshOperationInProgress
    );
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
    hasContinueToWorkTransition: boolean;
    hasTokenCreationTime: boolean; // NEW
    hasLogoutTransition: boolean; // NEW
    hasSessionExpiryModalShowing: boolean; // NEW
    hasRefreshOperationInProgress: boolean; // NEW
  } {
    return {
      hasAccessToken: !!memoryAccessToken,
      hasUserData: !!memoryUserData,
      hasTokenExpiry: !!memoryTokenExpiry,
      hasRefreshTokenExpiry: !!memoryRefreshTokenExpiry,

      hasLastActivity: !!memoryLastActivity,
      hasActivityBasedExpiry: !!memoryActivityBasedExpiry,
      hasContinueToWorkTransition: !!memoryContinueToWorkTransition,
      hasTokenCreationTime: !!memoryTokenCreationTime, // NEW
      hasLogoutTransition: !!memoryLogoutTransition, // NEW
      hasSessionExpiryModalShowing: !!memorySessionExpiryModalShowing, // NEW
      hasRefreshOperationInProgress: !!memoryRefreshOperationInProgress, // NEW
    };
  }
}
