import { Request, Response } from 'express';
import User from '../db/models/user';

export interface GraphQLContext {
  req: Request;
  res: Response;
  user?: typeof User.prototype;
}

export function createContext({ req, res }: { req: Request; res: Response }): GraphQLContext {
  // Attach user to context if available (handled by auth middleware)
  return {
    req,
    res,
    user: (req as any).user || undefined,
  };
}
