import { authResolvers } from './auth';
import { userResolvers } from './user';
import { adminResolvers } from './admin';

/**
 * GraphQL Resolvers Index
 * Combines all resolvers for the application
 * Includes authentication, user management, and admin functionality
 */

// Merge all resolvers
export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...userResolvers.Query,
    ...adminResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
    ...adminResolvers.Mutation,
  },
};
