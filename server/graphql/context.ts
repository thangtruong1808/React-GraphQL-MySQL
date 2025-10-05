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
  
  
  return {
    req,
    res,
    user: user || undefined,
    isAuthenticated: !!user,  //"If user exists, isAuthenticated is true; otherwise, it's false."
  };
}
