import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES, JWT_CONFIG } from '../constants';

/**
 * JWT Utility Functions
 * Handles token verification and extraction for authentication middleware
 * Note: Token generation is handled by tokenManager.ts
 */

// JWT configuration - required environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Validate required environment variables
if (!JWT_SECRET) {
  throw new Error(ERROR_MESSAGES.JWT_SECRET_MISSING);
}

// Removed unused generateAccessToken function - use tokenManager.ts instead

/**
 * Verify JWT access token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyAccessToken = (token: string): { userId: number } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE
    }) as { userId: number };
    return decoded;
  } catch (error) {
    // Handle token expiration
    if (error instanceof jwt.TokenExpiredError) {
      // Token expired - this is expected behavior, don't log as error
      return null;
    }
    return null;
  }
};

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null if not found
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};
