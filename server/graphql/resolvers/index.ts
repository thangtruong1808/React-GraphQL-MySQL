import { authResolvers } from './auth';
import { userResolvers } from './user';

/**
 * GraphQL Resolvers Index
 * Combines all resolvers for the application
 * Includes authentication and user management functionality
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
