import { authResolvers } from './auth';
import { publicStatsResolvers } from './publicStats';
import { teamResolvers } from './teamResolvers';
import { projectsResolvers } from './projectsResolvers';
import { commentsResolvers } from './commentsResolvers';
import { searchMembers, searchProjects, searchTasks } from './searchResolvers';
import { userManagementResolvers } from './userManagement';
import { projectManagementResolvers } from './projectManagement';
import { taskManagementResolvers } from './taskManagement';
import { commentManagementResolvers } from './commentManagement';
import { Task, User, Project, Comment } from '../../db';

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
    ...userManagementResolvers.Query,
    ...projectManagementResolvers.Query,
    ...taskManagementResolvers.Query,
    ...commentManagementResolvers.Query,
    searchMembers,
    searchProjects,
    searchTasks,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...userManagementResolvers.Mutation,
    ...projectManagementResolvers.Mutation,
    ...taskManagementResolvers.Mutation,
    ...commentManagementResolvers.Mutation,
  },
  // Type resolvers for nested relationships
  User: {
    // Convert numeric ID to string for GraphQL
    id: (parent: any) => parent.id ? parent.id.toString() : null,
    
    // Ensure isDeleted is always a boolean
    isDeleted: (parent: any) => parent.isDeleted ?? false,
    
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
  },
  // Task type resolvers
  Task: {
    // Convert numeric ID to string for GraphQL
    id: (parent: any) => parent.id ? parent.id.toString() : null,
    
    // Ensure isDeleted is always a boolean
    isDeleted: (parent: any) => parent.is_deleted ?? false,
    
    // Map database status values to GraphQL enum values
    status: (parent: any) => {
      const statusMapping: { [key: string]: string } = {
        'TODO': 'TODO',
        'IN_PROGRESS': 'IN_PROGRESS',
        'DONE': 'DONE'
      };
      return statusMapping[parent.status] || parent.status;
    },
    
    // Map database priority values to GraphQL enum values
    priority: (parent: any) => {
      const priorityMapping: { [key: string]: string } = {
        'LOW': 'LOW',
        'MEDIUM': 'MEDIUM',
        'HIGH': 'HIGH'
      };
      return priorityMapping[parent.priority] || parent.priority;
    },
    
    // Map database date fields to GraphQL camelCase fields
    dueDate: (parent: any) => parent.due_date ? new Date(parent.due_date).toISOString() : null,
    createdAt: (parent: any) => parent.created_at ? new Date(parent.created_at).toISOString() : null,
    updatedAt: (parent: any) => parent.updated_at ? new Date(parent.updated_at).toISOString() : null,
    
    // Resolver for project field on Task type
    project: async (parent: any) => {
      try {
        return await Project.findByPk(parent.project_id, {
          attributes: ['id', 'uuid', 'name', 'description', 'status', 'ownerId', 'isDeleted', 'version', 'createdAt', 'updatedAt']
        });
      } catch (error) {
        return null;
      }
    },
    
    // Resolver for assignedUser field on Task type
    assignedUser: async (parent: any) => {
      try {
        if (!parent.assigned_to) return null;
        return await User.findByPk(parent.assigned_to, {
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role', 'isDeleted', 'version', 'createdAt', 'updatedAt']
        });
      } catch (error) {
        return null;
      }
    }
  },
  // Comment type resolvers
  Comment: {
    // Convert numeric ID to string for GraphQL
    id: (parent: any) => parent.id ? parent.id.toString() : null,
    
    // Ensure isDeleted is always a boolean
    isDeleted: (parent: any) => parent.isDeleted ?? false,
    
    // Map database date fields to GraphQL camelCase fields
    createdAt: (parent: any) => parent.createdAt ? new Date(parent.createdAt).toISOString() : null,
    updatedAt: (parent: any) => parent.updatedAt ? new Date(parent.updatedAt).toISOString() : null,
    
    // Resolver for author field on Comment type
    author: async (parent: any) => {
      try {
        // Use the correct database field name (user_id is snake_case in database)
        const userId = parent.user_id || parent.userId;
        if (!userId) {
          throw new Error('User ID not found for comment');
        }
        
        const user = await User.findByPk(userId, {
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role', 'isDeleted', 'version', 'createdAt', 'updatedAt']
        });
        
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }
        
        return user;
      } catch (error) {
        // Log the error for debugging but throw it to prevent null return
        console.error('Error fetching comment author:', error);
        throw new Error(`Failed to fetch comment author: ${error.message}`);
      }
    },
    
    // Resolver for task field on Comment type
    task: async (parent: any) => {
      try {
        // Use the correct database field name (task_id is snake_case in database)
        const taskId = parent.task_id || parent.taskId;
        if (!taskId) {
          throw new Error('Task ID not found for comment');
        }
        
        const task = await Task.findByPk(taskId, {
          attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'dueDate', 'projectId', 'assignedTo', 'isDeleted', 'version', 'createdAt', 'updatedAt'],
          include: [
            {
              model: Project,
              as: 'project',
              attributes: ['id', 'uuid', 'name', 'description', 'status', 'ownerId', 'isDeleted', 'version', 'createdAt', 'updatedAt']
            }
          ]
        });
        
        if (!task) {
          throw new Error(`Task with ID ${taskId} not found`);
        }
        
        return task;
      } catch (error) {
        // Log the error for debugging but throw it to prevent null return
        console.error('Error fetching comment task:', error);
        throw new Error(`Failed to fetch comment task: ${error.message}`);
      }
    }
  }
};
