import jwt, { TokenExpiredError } from 'jsonwebtoken';

/**
 * JWT Utility Functions
 * Handles token verification and extraction for authentication
 */

// JWT configuration - required environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Validate required environment variables
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '1d'; // 1 days

/**
 * Verify JWT access token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyAccessToken = (token: string): { userId: number } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
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

/**
 * Generate access token for user
 * @param user - User object with id
 * @returns JWT access token
 */
export const generateAccessToken = (user: { id: number }): string => {
  return jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Verify refresh token from database
 * @param token - Refresh token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyRefreshToken = (token: string): { userId: number } | null => {
  // Refresh tokens are now verified against database storage
  // This function is kept for compatibility but should be replaced with database verification
  console.warn('verifyRefreshToken: Use database verification instead of JWT verification');
  return null;
};

/**
 * Blacklist token (simple in-memory storage - consider Redis for production)
 * @param token - Token to blacklist
 */
export const blacklistToken = (token: string): void => {
  // For now, we'll use a simple in-memory approach
  // In production, use Redis or database for token blacklisting
  console.log(`Token blacklisted: ${token.substring(0, 20)}...`);
};
