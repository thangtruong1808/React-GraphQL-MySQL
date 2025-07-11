import { Request, Response } from 'express';
import User from '../db/models/user';

export interface GraphQLContext {
  req: Request;
  res: Response;
  user?: typeof User.prototype;
  isAuthenticated?: boolean;
}

export function createContext({ req, res }: { req: Request; res: Response }): GraphQLContext {
  // Attach user to context if available (handled by auth middleware)
  const user = (req as any).user;
  
  // Debug: Log context creation
  console.log('🔍 GRAPHQL CONTEXT - Creating context:', {
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    userRole: user?.role,
    isAuthenticated: !!user
  });
  
  return {
    req,
    res,
    user: user || undefined,
    isAuthenticated: !!user,
  };
}
