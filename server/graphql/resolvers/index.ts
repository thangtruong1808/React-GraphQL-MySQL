import { authResolvers } from './auth';

/**
 * GraphQL Resolvers Index
 * Combines all resolvers for the application
 * Focused on login functionality
 */

// Merge all resolvers
export const resolvers = {
  Query: {
    ...authResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
  },
};
