import { withFilter } from 'graphql-subscriptions';
import { Comment, ProjectMember } from '../../db';

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

      // Check if user is a member of the project
      try {
        const isMember = await ProjectMember.findOne({
          where: {
            projectId: parseInt(variables.projectId),
            userId: context.user.id,
            isDeleted: false
          }
        });

        // Allow if user is admin, project manager, or project member
        const userRole = context.user.role?.toLowerCase();
        const isAdminOrManager = userRole === 'admin' || userRole === 'project manager';
        
        return isAdminOrManager || !!isMember;
      } catch (error) {
        // Error handling without console.log for production
        return false;
      }
    }
  ),
  resolve: (payload) => payload
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

      // Check if user is a member of the project
      try {
        const isMember = await ProjectMember.findOne({
          where: {
            projectId: parseInt(variables.projectId),
            userId: context.user.id,
            isDeleted: false
          }
        });

        // Allow if user is admin, project manager, or project member
        const userRole = context.user.role?.toLowerCase();
        const isAdminOrManager = userRole === 'admin' || userRole === 'project manager';
        
        return isAdminOrManager || !!isMember;
      } catch (error) {
        // Error handling without console.log for production
        return false;
      }
    }
  ),
  resolve: (payload) => payload
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

      // Check if user is a member of the project
      try {
        const isMember = await ProjectMember.findOne({
          where: {
            projectId: parseInt(variables.projectId),
            userId: context.user.id,
            isDeleted: false
          }
        });

        // Allow if user is admin, project manager, or project member
        const userRole = context.user.role?.toLowerCase();
        const isAdminOrManager = userRole === 'admin' || userRole === 'project manager';
        
        return isAdminOrManager || !!isMember;
      } catch (error) {
        // Error handling without console.log for production
        return false;
      }
    }
  ),
  resolve: (payload) => payload
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
