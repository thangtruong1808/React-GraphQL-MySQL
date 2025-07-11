import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from './jwt';
import { User, RefreshToken } from '../db/index';
import { Op } from 'sequelize';
import { isAccessTokenBlacklisted, isUserForceLoggedOut, isTokenIssuedBeforeForceLogout } from './tokenBlacklist';

/**
 * Authentication Middleware
 * Handles JWT token verification and user context for GraphQL
 */

// Extended request interface with user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

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
 * Authentication middleware for Express
 * Verifies JWT token and adds user to request object
 */
export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Debug: Log request details
    console.log('🔍 AUTH MIDDLEWARE - Request path:', req.path);
    console.log('🔍 AUTH MIDDLEWARE - Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
    console.log('🔍 AUTH MIDDLEWARE - All headers:', Object.keys(req.headers));
    
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      console.log('🔍 AUTH MIDDLEWARE - No token found in Authorization header');
      // No token provided, continue without authentication
      next();
      return;
    }

    // Verify token
    console.log('🔍 AUTH MIDDLEWARE - Token extracted, length:', token.length);
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      console.log('🔍 AUTH MIDDLEWARE - Token verification failed');
      // Invalid token, continue without authentication
      next();
      return;
    }
    console.log('🔍 AUTH MIDDLEWARE - Token verified, userId:', decoded.userId);

    // Check if token is blacklisted
    const isBlacklisted = await isAccessTokenBlacklisted(token);
    if (isBlacklisted) {
      console.log('🔐 Access token is blacklisted - user force logged out');
      // Token is blacklisted, continue without authentication
      next();
      return;
    }

    // Find user in database
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      // User not found, continue without authentication
      next();
      return;
    }

    // Enhanced force logout check - check if this specific token was issued before force logout
    const wasTokenIssuedBeforeForceLogout = await isTokenIssuedBeforeForceLogout(user.id, token);
    if (wasTokenIssuedBeforeForceLogout) {
      console.log(`🔐 User ${user.id} has been force logged out - token was issued before force logout`);
      // Token was issued before force logout, continue without authentication
      next();
      return;
    }

    // Check if user has active refresh tokens (additional security check)
    const activeTokenCount = await RefreshToken.count({
      where: {
        userId: user.id,
        isRevoked: false,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    // If user has no active refresh tokens, they have been force logged out
    if (activeTokenCount === 0) {
      console.log(`🔐 User ${user.id} has been force logged out - no active refresh tokens found`);
      // Continue without authentication (don't set user)
      next();
      return;
    }

    // Add user to request object
    req.user = user;
    console.log('🔍 AUTH MIDDLEWARE - User authenticated successfully:', {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role
    });
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    // Continue without authentication on error
    next();
  }
};

/**
 * Create GraphQL context with user information
 * @param req - Express request object
 * @returns GraphQL context object
 */
export const createContext = (req: AuthenticatedRequest) => {
  return {
    user: req.user,
    isAuthenticated: !!req.user,
  };
};
