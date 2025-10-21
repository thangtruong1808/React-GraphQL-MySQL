import { withFilter } from 'graphql-subscriptions';
import { Comment, ProjectMember, Project } from '../../db';

/**
 * Comment Subscription Resolvers
 * Handles real-time comment events for collaborative discussions
 * Provides filtered subscriptions based on project membership
 */

/**
 * Comment Added Subscription
 * Notifies project members when a new comment is added
 */
export const commentAdded = {
  subscribe: withFilter(
    (_, { projectId }, { pubsub }) => {
      return pubsub.asyncIterator(`COMMENT_ADDED_${projectId}`);
    },
    async (payload, variables, context) => {
      // Check if user is authenticated
      if (!context.user) {
        return false;
      }

      try {
        // Check if user is admin or project manager (can see all comments)
        const userRole = context.user.role?.toLowerCase();
        const isAdminOrManager = userRole === 'admin' || userRole === 'project manager';
        
        if (isAdminOrManager) {
          return true;
        }

        // Check if user is project owner
        const project = await Project.findByPk(parseInt(variables.projectId), {
          attributes: ['id', 'ownerId']
        });

        if (project && project.ownerId === context.user.id) {
          return true;
        }

        // Check if user is a project member
        const isMember = await ProjectMember.findOne({
          where: {
            projectId: parseInt(variables.projectId),
            userId: context.user.id,
            isDeleted: false
          }
        });

        return !!isMember;
      } catch (error) {
        // Error handling without console.log for production
        return false;
      }
    }
  ),
  resolve: (payload) => {
    // Always return a valid Comment object to prevent null errors
    if (!payload) {
      // Return a minimal valid Comment object to prevent null errors
      return {
        id: '0',
        uuid: '00000000-0000-0000-0000-000000000000',
        content: '',
        author: {
          id: '0',
          uuid: '00000000-0000-0000-0000-000000000000',
          firstName: '',
          lastName: '',
          email: '',
          role: ''
        },
        task: {
          id: '0',
          uuid: '00000000-0000-0000-0000-000000000000',
          title: '',
          project: {
            id: '0',
            uuid: '00000000-0000-0000-0000-000000000000',
            name: ''
          }
        },
        isDeleted: false,
        version: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likesCount: 0,
        isLikedByUser: false
      };
    }
    
    // Return the payload as Comment
    return payload;
  }
};

/**
 * Comment Updated Subscription
 * Notifies project members when a comment is updated
 */
export const commentUpdated = {
  subscribe: withFilter(
    (_, { projectId }, { pubsub }) => {
      return pubsub.asyncIterator(`COMMENT_UPDATED_${projectId}`);
    },
    async (payload, variables, context) => {
      // Check if user is authenticated
      if (!context.user) {
        return false;
      }

      try {
        // Check if user is admin or project manager (can see all comments)
        const userRole = context.user.role?.toLowerCase();
        const isAdminOrManager = userRole === 'admin' || userRole === 'project manager';
        
        if (isAdminOrManager) {
          return true;
        }

        // Check if user is project owner
        const project = await Project.findByPk(parseInt(variables.projectId), {
          attributes: ['id', 'ownerId']
        });

        if (project && project.ownerId === context.user.id) {
          return true;
        }

        // Check if user is a project member
        const isMember = await ProjectMember.findOne({
          where: {
            projectId: parseInt(variables.projectId),
            userId: context.user.id,
            isDeleted: false
          }
        });

        return !!isMember;
      } catch (error) {
        // Error handling without console.log for production
        return false;
      }
    }
  ),
  resolve: (payload) => {
    // Always return a valid Comment object to prevent null errors
    if (!payload) {
      // Return a minimal valid Comment object to prevent null errors
      return {
        id: '0',
        uuid: '00000000-0000-0000-0000-000000000000',
        content: '',
        author: {
          id: '0',
          uuid: '00000000-0000-0000-0000-000000000000',
          firstName: '',
          lastName: '',
          email: '',
          role: ''
        },
        task: {
          id: '0',
          uuid: '00000000-0000-0000-0000-000000000000',
          title: '',
          project: {
            id: '0',
            uuid: '00000000-0000-0000-0000-000000000000',
            name: ''
          }
        },
        isDeleted: false,
        version: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likesCount: 0,
        isLikedByUser: false
      };
    }
    
    // Return the payload as Comment
    return payload;
  }
};

/**
 * Comment Deleted Subscription
 * Notifies project members when a comment is deleted
 */
export const commentDeleted = {
  subscribe: withFilter(
    (_, { projectId }, { pubsub }) => {
      return pubsub.asyncIterator(`COMMENT_DELETED_${projectId}`);
    },
    async (payload, variables, context) => {
      // Check if user is authenticated
      if (!context.user) {
        return false;
      }

      try {
        // Check if user is admin or project manager (can see all comments)
        const userRole = context.user.role?.toLowerCase();
        const isAdminOrManager = userRole === 'admin' || userRole === 'project manager';
        
        if (isAdminOrManager) {
          return true;
        }

        // Check if user is project owner
        const project = await Project.findByPk(parseInt(variables.projectId), {
          attributes: ['id', 'ownerId']
        });

        if (project && project.ownerId === context.user.id) {
          return true;
        }

        // Check if user is a project member
        const isMember = await ProjectMember.findOne({
          where: {
            projectId: parseInt(variables.projectId),
            userId: context.user.id,
            isDeleted: false
          }
        });

        return !!isMember;
      } catch (error) {
        // Error handling without console.log for production
        return false;
      }
    }
  ),
  resolve: (payload) => {
    // Always return a valid CommentDeletedEvent object to prevent null errors
    if (!payload) {
      return {
        commentId: '0',
        projectId: '0',
        deletedAt: new Date().toISOString()
      };
    }
    
    // Return the payload as CommentDeletedEvent
    return {
      commentId: payload.commentId,
      projectId: payload.projectId,
      deletedAt: payload.deletedAt
    };
  }
};

/**
 * Comment Subscription Resolvers Export
 * Combines all comment subscription resolvers
 */
export const commentSubscriptionResolvers = {
  Subscription: {
    commentAdded,
    commentUpdated,
    commentDeleted
  }
};