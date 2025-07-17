import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES, JWT_CONFIG } from '../constants';

/**
 * JWT Utility Functions
 * Handles token generation, verification, and refresh token management
 */

// JWT configuration - required environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Validate required environment variables
if (!JWT_SECRET) {
  throw new Error(ERROR_MESSAGES.JWT_SECRET_MISSING);
}

/**
 * Generate access token for user
 * @param user - User object with id
 * @returns JWT access token
 */
export const generateAccessToken = (user: { id: number }): string => {
  return jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { 
      expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE
    }
  );
};

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
    // Only log non-expiration errors to reduce noise
    if (error instanceof jwt.TokenExpiredError) {
      // Token expired - this is expected behavior, don't log as error
      return null;
    }
    console.error('Token verification error:', error);
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
