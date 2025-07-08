import jwt from 'jsonwebtoken';
import { User } from '../db/models/user';

/**
 * JWT Utilities
 * Handles token generation, verification, and refresh token management with token rotation
 */

// JWT payload interfaces
interface AccessTokenPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access';
  iat?: number;
  exp?: number;
}

interface RefreshTokenPayload {
  userId: string;
  tokenId: string; // Unique identifier for token rotation
  type: 'refresh';
  iat?: number;
  exp?: number;
}

// In-memory token blacklist (in production, use Redis or database)
const blacklistedTokens = new Set<string>();

/**
 * Generate access token for user
 * @param user - User object with id, email, and role
 * @returns JWT access token
 */
export const generateAccessToken = (user: User): string => {
  const payload: AccessTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'access',
  };

  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m', // Short-lived access token
  });
};

/**
 * Generate refresh token for user with unique token ID
 * @param user - User object with id
 * @returns JWT refresh token
 */
export const generateRefreshToken = (user: User): string => {
  const tokenId = `${user.id}-${Date.now()}-${Math.random()}`;
  const payload: RefreshTokenPayload = {
    userId: user.id,
    tokenId,
    type: 'refresh',
  };

  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key';
  return jwt.sign(payload, refreshSecret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // Long-lived refresh token
  });
};

/**
 * Verify access token
 * @param token - JWT access token
 * @returns Decoded token payload or null if invalid
 */
export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  try {
    // Check if token is blacklisted
    if (blacklistedTokens.has(token)) {
      return null;
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = jwt.verify(token, secret) as AccessTokenPayload;
    
    // Verify token type
    if (decoded.type !== 'access') {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Access token verification failed:', error);
    return null;
  }
};

/**
 * Verify refresh token
 * @param token - JWT refresh token
 * @returns Decoded token payload or null if invalid
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    // Check if token is blacklisted
    if (blacklistedTokens.has(token)) {
      return null;
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key';
    const decoded = jwt.verify(token, refreshSecret) as RefreshTokenPayload;
    
    // Verify token type
    if (decoded.type !== 'refresh') {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
};

/**
 * Generate both access and refresh tokens
 * @param user - User object
 * @returns Object containing access and refresh tokens
 */
export const generateTokens = (user: User) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

/**
 * Blacklist a token (for logout)
 * @param token - Token to blacklist
 */
export const blacklistToken = (token: string): void => {
  blacklistedTokens.add(token);
  
  // Clean up old blacklisted tokens periodically (in production, use Redis TTL)
  if (blacklistedTokens.size > 1000) {
    // Simple cleanup - in production, implement proper cleanup
    const tokensArray = Array.from(blacklistedTokens);
    blacklistedTokens.clear();
    tokensArray.slice(-500).forEach(t => blacklistedTokens.add(t));
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
