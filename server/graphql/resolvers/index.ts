import { authResolvers } from './auth';
import { publicStatsResolvers } from './publicStats';
import { searchMembers, searchProjects, searchTasks } from './searchResolvers';

/**
 * GraphQL Resolvers Index
 * Includes authentication, public statistics, and error logging resolvers
 */

export const resolvers = {
  // JSON Scalar Resolver for flexible data structures
  // JSON: {
  //   __serialize(value: any) {
  //     return value;
  //   },
  //   __parseValue(value: any) {
  //     return value;
  //   },
  //   __parseLiteral(ast: any) {
  //     return ast.value;
  //   },
  // },
  Query: {
    ...authResolvers.Query,
    ...publicStatsResolvers.Query,
    searchMembers,
    searchProjects,
    searchTasks,
  },
  Mutation: {
    ...authResolvers.Mutation,
  },
};
