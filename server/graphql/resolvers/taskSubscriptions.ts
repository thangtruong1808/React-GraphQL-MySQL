import { withFilter } from 'graphql-subscriptions';
import { Task, ProjectMember, Project, User, Tag } from '../../db';

/**
 * Task Subscription Resolvers
 * Handles real-time task events for collaborative task management
 * Provides filtered subscriptions based on team membership
 */

/**
 * Task Added Subscription
 * Notifies team members when a new task is added
 */
export const taskAdded = {
  subscribe: withFilter(
    (_, { projectId }, { pubsub }) => {
      return pubsub.asyncIterator(`TASK_ADDED_${projectId}`);
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

        // Check if user is a project member (only team members can view tasks)
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
    // Always return a valid Task object to prevent null errors
    return payload.taskAdded || payload;
  }
};

/**
 * Task Updated Subscription
 * Notifies team members when a task is updated
 */
export const taskUpdated = {
  subscribe: withFilter(
    (_, { projectId }, { pubsub }) => {
      return pubsub.asyncIterator(`TASK_UPDATED_${projectId}`);
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
    // Always return a valid Task object to prevent null errors
    return payload.taskUpdated || payload;
  }
};

/**
 * Task Deleted Subscription
 * Notifies team members when a task is deleted
 */
export const taskDeleted = {
  subscribe: withFilter(
    (_, { projectId }, { pubsub }) => {
      return pubsub.asyncIterator(`TASK_DELETED_${projectId}`);
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
    // Always return a valid TaskDeletedEvent object to prevent null errors
    return payload.taskDeleted || payload;
  }
};

/**
 * Task Subscription Resolvers Export
 * Combines all task subscription resolvers
 */
export const taskSubscriptionResolvers = {
  Subscription: {
    taskAdded,
    taskUpdated,
    taskDeleted
  }
};
