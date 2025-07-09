import { Request } from 'express';
import { User } from '../db/index';
import { verifyAccessToken, extractTokenFromHeader } from '../auth/jwt';

/**
 * GraphQL Context Interface
 * Defines the context object passed to all GraphQL resolvers
 */
export interface GraphQLContext {
  user?: User;
  isAuthenticated: boolean;
  req?: Request; // Include request object for token access
}

/**
 * Create GraphQL Context
 * Extracts user from JWT token and creates context object
 */
export const createContext = async ({ req }: { req: Request }): Promise<GraphQLContext> => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return {
        user: undefined,
        isAuthenticated: false,
        req,
      };
    }

    // Verify access token
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return {
        user: undefined,
        isAuthenticated: false,
        req,
      };
    }

    // Find user in database
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return {
        user: undefined,
        isAuthenticated: false,
        req,
      };
    }

    return {
      user,
      isAuthenticated: true,
      req,
    };
  } catch (error) {
    console.error('Context creation error:', error);
    return {
      user: undefined,
      isAuthenticated: false,
      req,
    };
  }
};
