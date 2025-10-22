import { withFilter } from 'graphql-subscriptions';
import { CommentLike, ProjectMember, Project } from '../../db';

/**
 * Comment Likes Subscription Resolvers
 * Handles real-time comment like events for collaborative interactions
 * Provides filtered subscriptions based on team membership
 */

/**
 * Comment Liked Subscription
 * Notifies team members when a comment is liked
 */
export const commentLiked = {
  subscribe: withFilter(
    (_, { projectId }, { pubsub }) => {
      return pubsub.asyncIterator(`COMMENT_LIKED_${projectId}`);
    },
    async (payload, variables, context) => {
      // Check if user is authenticated
      if (!context.user) {
        return false;
      }

      try {
        // Check if user is project owner
        const project = await Project.findByPk(parseInt(variables.projectId), {
          attributes: ['id', 'ownerId']
        });

        if (project && project.ownerId === context.user.id) {
          return true;
        }

        // Check if user is a project member (only team members can view likes)
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
    // Always return a valid CommentLikeEvent object to prevent null errors
    if (!payload) {
      return {
        commentId: '0',
        projectId: '0',
        userId: '0',
        action: 'LIKED',
        likesCount: 0,
        isLikedByUser: false,
        timestamp: new Date().toISOString()
      };
    }
    
    // Return the payload as CommentLikeEvent
    return payload;
  }
};

/**
 * Comment Unliked Subscription
 * Notifies team members when a comment is unliked
 */
export const commentUnliked = {
  subscribe: withFilter(
    (_, { projectId }, { pubsub }) => {
      return pubsub.asyncIterator(`COMMENT_UNLIKED_${projectId}`);
    },
    async (payload, variables, context) => {
      // Check if user is authenticated
      if (!context.user) {
        return false;
      }

      try {
        // Check if user is project owner
        const project = await Project.findByPk(parseInt(variables.projectId), {
          attributes: ['id', 'ownerId']
        });

        if (project && project.ownerId === context.user.id) {
          return true;
        }

        // Check if user is a project member (only team members can view likes)
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
    // Always return a valid CommentLikeEvent object to prevent null errors
    if (!payload) {
      return {
        commentId: '0',
        projectId: '0',
        userId: '0',
        action: 'UNLIKED',
        likesCount: 0,
        isLikedByUser: false,
        timestamp: new Date().toISOString()
      };
    }
    
    // Return the payload as CommentLikeEvent
    return payload;
  }
};

/**
 * Comment Likes Subscription Resolvers Export
 * Combines all comment likes subscription resolvers
 */
export const commentLikesSubscriptionResolvers = {
  Subscription: {
    commentLiked,
    commentUnliked
  }
};
