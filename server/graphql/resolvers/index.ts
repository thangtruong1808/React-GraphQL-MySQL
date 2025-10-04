import { authResolvers } from './auth';
import { publicStatsResolvers } from './publicStats';
import { teamResolvers } from './teamResolvers';
import { projectsResolvers } from './projectsResolvers';
import { commentsResolvers } from './commentsResolvers';
import { searchMembers, searchProjects, searchTasks } from './searchResolvers';
import { Task, User, Project } from '../../db';

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
    ...projectsResolvers.Query,
    searchMembers,
    searchProjects,
    searchTasks,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  // Type resolvers for nested relationships
  User: {
    // Convert numeric ID to string for GraphQL
    id: (parent: any) => parent.id ? parent.id.toString() : null,
    
    // Map database role values to GraphQL enum values
    role: (parent: any) => {
      const roleMapping: { [key: string]: string } = {
        'ADMIN': 'ADMIN',
        'Project Manager': 'PROJECT_MANAGER_PM',
        'Software Architect': 'SOFTWARE_ARCHITECT',
        'Frontend Developer': 'FRONTEND_DEVELOPER',
        'Backend Developer': 'BACKEND_DEVELOPER',
        'Full-Stack Developer': 'FULL_STACK_DEVELOPER',
        'DevOps Engineer': 'DEVOPS_ENGINEER',
        'QA Engineer': 'QA_ENGINEER',
        'QC Engineer': 'QC_ENGINEER',
        'UX/UI Designer': 'UX_UI_DESIGNER',
        'Business Analyst': 'BUSINESS_ANALYST',
        'Database Administrator': 'DATABASE_ADMINISTRATOR',
        'Technical Writer': 'TECHNICAL_WRITER',
        'Support Engineer': 'SUPPORT_ENGINEER',
        // Also handle GraphQL enum values directly (for cases where resolver already mapped them)
        'PROJECT_MANAGER_PM': 'PROJECT_MANAGER_PM',
        'SOFTWARE_ARCHITECT': 'SOFTWARE_ARCHITECT',
        'FRONTEND_DEVELOPER': 'FRONTEND_DEVELOPER',
        'BACKEND_DEVELOPER': 'BACKEND_DEVELOPER',
        'FULL_STACK_DEVELOPER': 'FULL_STACK_DEVELOPER',
        'DEVOPS_ENGINEER': 'DEVOPS_ENGINEER',
        'QA_ENGINEER': 'QA_ENGINEER',
        'QC_ENGINEER': 'QC_ENGINEER',
        'UX_UI_DESIGNER': 'UX_UI_DESIGNER',
        'BUSINESS_ANALYST': 'BUSINESS_ANALYST',
        'DATABASE_ADMINISTRATOR': 'DATABASE_ADMINISTRATOR',
        'TECHNICAL_WRITER': 'TECHNICAL_WRITER',
        'SUPPORT_ENGINEER': 'SUPPORT_ENGINEER'
      };
      return roleMapping[parent.role] || 'FRONTEND_DEVELOPER'; // Default fallback
    },
    
    // Resolver for ownedProjects field on User type
    ownedProjects: async (parent: any) => {
      try {
        return await Project.findAll({
          where: {
            owner_id: parent.id,
            isDeleted: false
          },
          attributes: ['id', 'uuid', 'name', 'description', 'status', 'isDeleted'],
          include: [
            {
              model: Task,
              as: 'tasks',
              attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'isDeleted'],
              required: false,
              where: { isDeleted: false },
              include: [
                {
                  model: User,
                  as: 'assignedUser',
                  attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
                  required: false
                }
              ]
            }
          ]
        });
      } catch (error) {
        return [];
      }
    },
    
    // Resolver for assignedTasks field on User type
    assignedTasks: async (parent: any) => {
      try {
        return await Task.findAll({
          where: {
            assigned_to: parent.id,
            isDeleted: false
          },
          attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'isDeleted'],
          include: [
            {
              model: Project,
              as: 'project',
              attributes: ['id', 'uuid', 'name', 'description', 'status', 'isDeleted'],
              required: false,
              where: { isDeleted: false }
            }
          ]
        });
      } catch (error) {
        return [];
      }
    }
  },
  Project: {
    // Resolver for tasks field on Project type
    tasks: async (parent: any) => {
      try {
        return await Task.findAll({
          where: {
            projectId: parent.id,
            isDeleted: false
          },
          attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'dueDate', 'isDeleted', 'version', 'createdAt', 'updatedAt'],
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
        return [];
      }
    },

        // Resolver for comments field on Project type
        comments: async (parent: any, args: any, context: any) => {
          try {
            const { getProjectComments } = await import('./commentsResolvers');
            return await getProjectComments(parseInt(parent.id), context);
          } catch (error) {
            return [];
          }
        }
  }
};
