import { authResolvers } from './auth';
import { userResolvers } from './user';

/**
 * GraphQL Resolvers Index
 * Combines all resolvers for the application
 * Focused on login functionality
 */

// Merge all resolvers
export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
  },
};
