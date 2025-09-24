import { authResolvers } from './auth';
import { publicStatsResolvers } from './publicStats';
import { teamResolvers } from './teamResolvers';
import { searchMembers, searchProjects, searchTasks } from './searchResolvers';
import { Task, User } from '../../db';

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
    ...teamResolvers.Query,
    searchMembers,
    searchProjects,
    searchTasks,
  },
  Mutation: {
    ...authResolvers.Mutation,
  },
  // Type resolvers for nested relationships
  Project: {
    // Resolver for tasks field on Project type
    tasks: async (parent: any) => {
      try {
        return await Task.findAll({
          where: {
            projectId: parent.id,
            isDeleted: false
          },
          attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'isDeleted', 'version', 'createdAt', 'updatedAt'],
          include: [
            {
              model: User,
              as: 'assignedUser',
              attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
              required: false
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching tasks for project:', error);
        return [];
      }
    }
  }
};
