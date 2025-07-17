import { authResolvers } from './auth';

/**
 * GraphQL Resolvers Index
 * Only authentication resolvers are included for the minimal login feature
 */

export const resolvers = {
  Query: {
    ...authResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
  },
};
