import { TOKEN_VALIDATION, TOKEN_ERROR_MESSAGES } from './constants';

/**
 * Token Validation Module
 * Handles validation of JWT and hex token formats
 * Provides secure token validation before storage and usage
 */

/**
 * Token Validation Class
 * Manages token format validation and decoding operations
 */
export class TokenValidation {
  /**
   * Validate JWT token format
   * @param token - Token to validate
   * @returns Boolean indicating if token is valid JWT format
   * 
   * CALLED BY: TokenStorage operations before storing tokens
   * SCENARIOS: All scenarios - validates JWT structure before use
   */
  static isValidJWTFormat(token: string): boolean {
    try {
      if (!token || typeof token !== 'string') return false;
      
      // JWT format: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== TOKEN_VALIDATION.JWT_PARTS_COUNT) return false;
      
      // Check if parts are base64 encoded
      const [header, payload] = parts;
      try {
        JSON.parse(atob(header));
        JSON.parse(atob(payload));
        return true;
      } catch {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate hex token format
   * @param token - Token to validate
   * @returns Boolean indicating if token is valid hex format
   * 
   * CALLED BY: TokenStorage operations before storing refresh tokens
   * SCENARIOS: All scenarios - validates refresh token format
   */
  static isValidHexFormat(token: string): boolean {
    try {
      if (!token || typeof token !== 'string') return false;
      
      // Check if string is valid hex using regex
      return TOKEN_VALIDATION.HEX_REGEX.test(token);
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate token length
   * @param token - Token to validate
   * @returns Boolean indicating if token length is valid
   * 
   * CALLED BY: Token validation operations
   * SCENARIOS: All scenarios - validates token length constraints
   */
  static isValidTokenLength(token: string): boolean {
    try {
      if (!token || typeof token !== 'string') return false;
      
      const length = token.length;
      return length >= TOKEN_VALIDATION.MIN_TOKEN_LENGTH && 
             length <= TOKEN_VALIDATION.MAX_TOKEN_LENGTH;
    } catch (error) {
      return false;
    }
  }

  /**
   * Decode JWT token without verification
   * @param token - JWT token to decode
   * @returns Decoded payload or null if invalid
   * 
   * CALLED BY: Token expiry calculation and validation
   * SCENARIOS: All scenarios - extracts data from JWT payload
   */
  static decodeToken(token: string): any {
    try {
      if (!this.isValidJWTFormat(token)) {
        return null;
      }
      
      const parts = token.split('.');
      const payload = parts[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('❌ Error decoding token:', error);
      return null;
    }
  }

  /**
   * Get token expiration timestamp from JWT
   * @param token - JWT token to decode
   * @returns Expiration timestamp or null if invalid
   * 
   * CALLED BY: TokenStorage operations when storing tokens
   * SCENARIOS: All scenarios - extracts expiry from JWT payload
   */
  static getTokenExpiration(token: string): number | null {
    try {
      if (!token) return null;
      
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return null;
      
      // Convert to milliseconds
      return decoded.exp * 1000;
    } catch (error) {
      console.error('❌ Error getting token expiration:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   * @param token - JWT token to check
   * @returns Boolean indicating if token is expired
   * 
   * CALLED BY: Authentication validation operations
   * SCENARIOS: All scenarios - validates token expiry
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp <= now;
    } catch (error) {
      return true; // Assume expired on error
    }
  }

  /**
   * Validate user data structure
   * @param userData - User data object to validate
   * @returns Boolean indicating if user data is valid
   * 
   * CALLED BY: TokenStorage operations when storing user data
   * SCENARIOS: All scenarios - validates user data structure
   */
  static isValidUserData(userData: any): boolean {
    try {
      if (!userData || typeof userData !== 'object') return false;
      
      // Basic validation of user object structure
      return !!(userData.id && typeof userData.id === 'string');
    } catch (error) {
      return false;
    }
  }

  /**
   * Get validation error message
   * @param validationType - Type of validation that failed
   * @returns Error message for the validation failure
   * 
   * CALLED BY: Token operations when validation fails
   * SCENARIOS: All scenarios - provides user-friendly error messages
   */
  static getValidationErrorMessage(validationType: string): string {
    switch (validationType) {
      case 'jwt_format':
        return TOKEN_ERROR_MESSAGES.INVALID_JWT_FORMAT;
      case 'hex_format':
        return TOKEN_ERROR_MESSAGES.INVALID_HEX_FORMAT;
      case 'token_length':
        return TOKEN_ERROR_MESSAGES.INVALID_TOKEN_LENGTH;
      case 'user_data':
        return 'Invalid user data format';
      default:
        return TOKEN_ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }
}
