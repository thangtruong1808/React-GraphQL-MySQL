import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from './jwt';
import User from '../db/models/user';

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
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      // No token provided, continue without authentication
      next();
      return;
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      // Invalid token, continue without authentication
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

    // Add user to request object
    req.user = user;
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
