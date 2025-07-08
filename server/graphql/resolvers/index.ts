import { userResolvers } from './user';

/**
 * GraphQL Resolvers
 * Combines all resolver functions
 */
export const resolvers = {
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};
