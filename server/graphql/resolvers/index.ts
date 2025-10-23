import { authResolvers } from './auth';
import { publicStatsResolvers } from './publicStats';
import { teamResolvers } from './teamResolvers';
import { projectsResolvers } from './projectsResolvers';
import { commentsResolvers } from './commentsResolvers';
import { commentSubscriptionResolvers } from './commentSubscriptions';
import { commentLikesSubscriptionResolvers } from './commentLikesSubscriptions';
import { searchMembers, searchProjects, searchTasks } from './searchResolvers';
import { userManagementResolvers } from './userManagement';
import { projectManagementResolvers } from './projectManagement';
import { projectMemberManagementResolvers } from './projectMemberManagement';
import { taskManagementResolvers } from './taskManagement';
import { commentManagementResolvers } from './commentManagement';
import { activityManagementResolvers } from './activityManagement';
import { notificationManagementResolvers } from './notificationManagement';
import { tagsManagementResolvers } from './tagsManagement';
import { Task, User, Project, Comment, ActivityLog, Notification, Tag, CommentLike } from '../../db';

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
    ...projectMemberManagementResolvers.Query,
    ...taskManagementResolvers.Query,
    ...commentManagementResolvers.Query,
    ...activityManagementResolvers.Query,
    ...notificationManagementResolvers.Query,
    ...tagsManagementResolvers.Query,
    searchMembers,
    searchProjects,
    searchTasks,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...userManagementResolvers.Mutation,
    ...projectManagementResolvers.Mutation,
    ...projectMemberManagementResolvers.Mutation,
    ...taskManagementResolvers.Mutation,
    ...commentManagementResolvers.Mutation,
    ...activityManagementResolvers.Mutation,
    ...notificationManagementResolvers.Mutation,
    ...tagsManagementResolvers.Mutation,
  },
  Subscription: {
    ...commentSubscriptionResolvers.Subscription,
    ...commentLikesSubscriptionResolvers.Subscription,
  },
  // Type resolvers for nested relationships
  User: {
    // Convert numeric ID to string for GraphQL
    id: (parent: any) => parent.id ? parent.id.toString() : null,
    
    // Ensure isDeleted is always a boolean
    isDeleted: (parent: any) => parent.isDeleted ?? false,
    
    // Return database role values directly (no mapping needed since we use String instead of enum)
    role: (parent: any) => parent.role,
    
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
    dueDate: (parent: any) => parent.dueDate ? new Date(parent.dueDate).toISOString() : null,
    createdAt: (parent: any) => parent.createdAt ? new Date(parent.createdAt).toISOString() : null,
    updatedAt: (parent: any) => parent.updatedAt ? new Date(parent.updatedAt).toISOString() : null,
    
    // Resolver for project field on Task type
    project: async (parent: any) => {
      try {
        // If project is already included (from Sequelize include), return it directly
        if (parent.project) {
          return parent.project;
        }
        
        // Otherwise, fetch the project using the foreign key
        const projectId = parent.project_id || parent.projectId;
        if (!projectId) {
          throw new Error('Project ID not found for task');
        }
        
        const project = await Project.findByPk(projectId, {
          attributes: ['id', 'uuid', 'name', 'description', 'status', 'ownerId', 'isDeleted', 'version', 'createdAt', 'updatedAt']
        });
        
        if (!project) {
          throw new Error(`Project with ID ${projectId} not found`);
        }
        
        return project;
      } catch (error) {
        // Throw error to prevent null return for non-nullable field
        throw new Error(`Failed to fetch task project: ${error.message}`);
      }
    },
    
    // Resolver for assignedUser field on Task type
    assignedUser: async (parent: any) => {
      try {
        // If assignedUser is already included (from Sequelize include), return it directly
        if (parent.assignedUser) {
          return parent.assignedUser;
        }
        
        // If no assigned user, return null (this field is nullable)
        if (!parent.assigned_to) return null;
        
        // Otherwise, fetch the user using the foreign key
        return await User.findByPk(parent.assigned_to, {
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role', 'isDeleted', 'version', 'createdAt', 'updatedAt']
        });
      } catch (error) {
        return null;
      }
    },
    
    // Resolver for tags field on Task type
    tags: async (parent: any) => {
      try {
        // If tags are already included (from Sequelize include), return them directly
        if (parent.tags) {
          return parent.tags;
        }
        
        // Otherwise, fetch tags using the many-to-many relationship
        const taskId = parent.id;
        if (!taskId) {
          return [];
        }
        
        const { Tag, TaskTag } = await import('../../db');
        const taskTags = await TaskTag.findAll({
          where: { taskId: parseInt(taskId) },
          include: [
            {
              model: Tag,
              as: 'tag',
              attributes: ['id', 'name', 'description', 'title', 'type', 'category', 'createdAt', 'updatedAt']
            }
          ]
        });
        
        return taskTags.map((taskTag: any) => taskTag.tag);
      } catch (error) {
        return [];
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
        // If author is already populated (from subscription payload), return it directly
        if (parent.author) {
          return parent.author;
        }
        
        // Otherwise, fetch from database using user_id
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
        // Throw error to prevent null return for non-nullable field
        throw new Error(`Failed to fetch comment author: ${error.message}`);
      }
    },
    
    // Resolver for likers field on Comment type
    likers: async (parent: any) => {
      try {
        // If likers are already populated (from subscription payload), return them directly
        if (parent.likers) {
          return parent.likers;
        }
        
        // Otherwise, fetch from database
        const commentId = parent.id;
        if (!commentId) {
          return [];
        }
        
        const likers = await CommentLike.findAll({
          where: { commentId: parseInt(commentId) },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role', 'isDeleted', 'version', 'createdAt', 'updatedAt'],
              required: true
            }
          ],
          order: [['createdAt', 'DESC']]
        });
        
        return likers.map((like: any) => ({
          id: like.user.id.toString(),
          uuid: like.user.uuid,
          firstName: like.user.firstName,
          lastName: like.user.lastName,
          email: like.user.email,
          role: like.user.role,
          isDeleted: like.user.isDeleted,
          version: like.user.version,
          createdAt: like.user.createdAt,
          updatedAt: like.user.updatedAt
        }));
      } catch (error) {
        // Return empty array on error to prevent null return
        return [];
      }
    },
    
    // Resolver for task field on Comment type
    task: async (parent: any) => {
      try {
        // If task is already populated (from subscription payload), return it directly
        if (parent.task) {
          return parent.task;
        }
        
        // Otherwise, fetch from database using task_id
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
        // Throw error to prevent null return for non-nullable field
        throw new Error(`Failed to fetch comment task: ${error.message}`);
      }
    }
  },
  // Activity type resolvers
  Activity: {
    // Convert numeric ID to string for GraphQL
    id: (parent: any) => parent.id ? parent.id.toString() : null,
    
    // Map database date fields to GraphQL camelCase fields
    createdAt: (parent: any) => parent.createdAt ? new Date(parent.createdAt).toISOString() : null,
    updatedAt: (parent: any) => parent.updatedAt ? new Date(parent.updatedAt).toISOString() : null,
    
    // Resolver for user field on Activity type
    user: async (parent: any) => {
      try {
        // If user is already included (from Sequelize include), return it directly
        if (parent.user) {
          return parent.user;
        }
        
        const userId = parent.user_id || parent.userId;
        if (!userId) {
          throw new Error('User ID not found for activity');
        }
        
        const user = await User.findByPk(userId, {
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role', 'isDeleted', 'version', 'createdAt', 'updatedAt']
        });
        
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }
        
        return user;
      } catch (error) {
        throw new Error(`Failed to fetch activity user: ${error.message}`);
      }
    },
    
    // Resolver for targetUser field on Activity type
    targetUser: async (parent: any) => {
      try {
        // If targetUser is already included (from Sequelize include), return it directly
        if (parent.targetUser) {
          return parent.targetUser;
        }
        
        const targetUserId = parent.target_user_id || parent.targetUserId;
        if (!targetUserId) {
          return null;
        }
        
        const user = await User.findByPk(targetUserId, {
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role', 'isDeleted', 'version', 'createdAt', 'updatedAt']
        });
        
        return user;
      } catch (error) {
        return null;
      }
    },
    
    // Resolver for project field on Activity type
    project: async (parent: any) => {
      try {
        // If project is already included (from Sequelize include), return it directly
        if (parent.project) {
          return parent.project;
        }
        
        const projectId = parent.project_id || parent.projectId;
        if (!projectId) {
          return null;
        }
        
        const project = await Project.findByPk(projectId, {
          attributes: ['id', 'uuid', 'name', 'description', 'status', 'ownerId', 'isDeleted', 'version', 'createdAt', 'updatedAt']
        });
        
        return project;
      } catch (error) {
        return null;
      }
    },
    
    // Resolver for task field on Activity type
    task: async (parent: any) => {
      try {
        // If task is already included (from Sequelize include), return it directly
        if (parent.task) {
          return parent.task;
        }
        
        const taskId = parent.task_id || parent.taskId;
        if (!taskId) {
          return null;
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
        
        return task;
      } catch (error) {
        return null;
      }
    }
  },
  // Notification type resolvers
  Notification: {
    // Convert numeric ID to string for GraphQL
    id: (parent: any) => parent.id ? parent.id.toString() : null,
    
    // Map database date fields to GraphQL camelCase fields
    createdAt: (parent: any) => parent.createdAt ? new Date(parent.createdAt).toISOString() : null,
    updatedAt: (parent: any) => parent.updatedAt ? new Date(parent.updatedAt).toISOString() : null,
    
    // Resolver for user field on Notification type
    user: async (parent: any) => {
      try {
        // If user is already included (from Sequelize include), return it directly
        if (parent.user) {
          return parent.user;
        }
        
        const userId = parent.user_id || parent.userId;
        if (!userId) {
          throw new Error('User ID not found for notification');
        }
        
        const user = await User.findByPk(userId, {
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role', 'isDeleted', 'version', 'createdAt', 'updatedAt']
        });
        
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }
        
        return user;
      } catch (error) {
        throw new Error(`Failed to fetch notification user: ${error.message}`);
      }
    }
  },
  // ProjectMember type resolvers
  ProjectMember: {
    // Convert numeric IDs to strings for GraphQL
    projectId: (parent: any) => parent.projectId ? parent.projectId.toString() : null,
    userId: (parent: any) => parent.userId ? parent.userId.toString() : null,
    
    // Map database date fields to GraphQL camelCase fields
    createdAt: (parent: any) => parent.createdAt ? new Date(parent.createdAt).toISOString() : null,
    updatedAt: (parent: any) => parent.updatedAt ? new Date(parent.updatedAt).toISOString() : null,
    
    // Resolver for user field on ProjectMember type
    user: async (parent: any) => {
      try {
        // If user is already included (from Sequelize include), return it directly
        if (parent.user) {
          return parent.user;
        }
        
        const userId = parent.userId;
        if (!userId) {
          throw new Error('User ID not found for project member');
        }
        
        const user = await User.findByPk(userId, {
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role', 'isDeleted', 'version', 'createdAt', 'updatedAt']
        });
        
        if (!user) {
          throw new Error(`User with ID ${userId} not found`);
        }
        
        return user;
      } catch (error) {
        throw new Error(`Failed to fetch project member user: ${error.message}`);
      }
    },
    
    // Resolver for project field on ProjectMember type
    project: async (parent: any) => {
      try {
        // If project is already included (from Sequelize include), return it directly
        if (parent.project) {
          return parent.project;
        }
        
        const projectId = parent.projectId;
        if (!projectId) {
          throw new Error('Project ID not found for project member');
        }
        
        const project = await Project.findByPk(projectId, {
          attributes: ['id', 'uuid', 'name', 'description', 'status', 'ownerId', 'isDeleted', 'version', 'createdAt', 'updatedAt']
        });
        
        if (!project) {
          throw new Error(`Project with ID ${projectId} not found`);
        }
        
        return project;
      } catch (error) {
        throw new Error(`Failed to fetch project member project: ${error.message}`);
      }
    }
  },
  // Tag type resolvers
  Tag: {
    // Convert numeric ID to string for GraphQL
    id: (parent: any) => parent.id ? parent.id.toString() : null,
    
    // Map database date fields to GraphQL camelCase fields
    createdAt: (parent: any) => parent.createdAt ? new Date(parent.createdAt).toISOString() : null,
    updatedAt: (parent: any) => parent.updatedAt ? new Date(parent.updatedAt).toISOString() : null,
  }
};
