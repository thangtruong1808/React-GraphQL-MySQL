import { authResolvers } from './auth';

/**
 * GraphQL Resolvers Index
 * Includes authentication and error logging resolvers
 */

export const resolvers = {
  // JSON Scalar Resolver for flexible data structures
  JSON: {
    __serialize(value: any) {
      return value;
    },
    __parseValue(value: any) {
      return value;
    },
    __parseLiteral(ast: any) {
      return ast.value;
    },
  },
  Query: {
    ...authResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
  },
};
