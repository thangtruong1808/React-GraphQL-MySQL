import { NextFunction, Request, Response } from 'express';
import { User } from '../db/index';
import { verifyAccessToken, extractTokenFromHeader } from './jwt';

/**
 * Authentication Middleware
 * Handles JWT token verification and user context for GraphQL
 */

// Extended request interface with user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

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
      return; // stops execution, prevents further response
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
