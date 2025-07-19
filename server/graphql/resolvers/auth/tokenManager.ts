import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG, ERROR_MESSAGES, JWT_CONFIG } from '../../../constants';

// JWT configuration - required environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Validate required environment variables
if (!JWT_SECRET) {
  throw new Error(ERROR_MESSAGES.JWT_SECRET_MISSING);
}

/**
 * Token Management Module
 * Handles JWT access token and refresh token operations
 * 
 * SCENARIOS:
 * - Token Generation: Creates secure JWT and refresh tokens
 * - Token Validation: Verifies token integrity and format
 * - Token Hashing: Secures refresh tokens for database storage
 * - Token Verification: Validates stored tokens against client tokens
 */

/**
 * Generate JWT access token with enhanced security
 * @param userId - User ID to encode in token
 * @returns JWT access token
 * 
 * CALLED BY: login(), refreshToken()
 * SCENARIOS: All scenarios - creates JWT tokens for client authentication
 * FEATURES: User ID, token type, issued timestamp, expiry, issuer, audience
 */
export const generateAccessToken = (userId: number): string => {
  return jwt.sign(
    { 
      userId,
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
    }, 
    JWT_SECRET, 
    { 
      expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE,
    }
  );
};

/**
 * Generate refresh token (random string, not JWT) with enhanced security
 * @param userId - User ID for the token
 * @returns Random refresh token string
 * 
 * CALLED BY: login(), refreshToken()
 * SCENARIOS: All scenarios - creates cryptographically secure random tokens
 * FEATURES: 64 bytes (128 characters), hex format, cryptographically secure
 */
export const generateRefreshToken = (userId: number): string => {
  // Generate a cryptographically secure random token
  return require('crypto').randomBytes(AUTH_CONFIG.REFRESH_TOKEN_BYTES).toString('hex');
};

/**
 * Hash refresh token for storage with enhanced security
 * @param token - Raw refresh token
 * @returns Hashed token
 * 
 * CALLED BY: login(), refreshToken()
 * SCENARIOS: All scenarios - secures refresh tokens before DB storage
 * FEATURES: Bcrypt hashing, salt rounds, one-way encryption
 */
export const hashRefreshToken = async (token: string): Promise<string> => {
  return bcrypt.hash(token, AUTH_CONFIG.BCRYPT_ROUNDS);
};

/**
 * Verify refresh token hash with enhanced security
 * @param token - Raw refresh token
 * @param hash - Stored hash
 * @returns Boolean indicating if token matches hash
 * 
 * CALLED BY: refreshToken(), logout()
 * SCENARIOS: Token validation - compares client token with stored hash
 * FEATURES: Bcrypt comparison, timing attack protection
 */
export const verifyRefreshTokenHash = async (token: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(token, hash);
}; 