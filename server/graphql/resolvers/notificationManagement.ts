import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Op } from 'sequelize';
import { Notification, User, Project, ProjectMember } from '../../db';

/**
 * Build notification filter for Project Manager role
 * Project managers can see notifications from users in their projects
 */
const buildProjectManagerNotificationFilter = async (userId: number) => {
  try {
    // Get all projects where the user is a member (as Project Manager)
    const userProjects = await ProjectMember.findAll({
      where: {
        userId: userId,
        isDeleted: false
      },
      include: [{
        model: Project,
        as: 'project',
        where: { isDeleted: false },
        required: true
      }]
    });

    // Get all user IDs from these projects
    const projectIds = userProjects.map(pm => pm.projectId);
    
    if (projectIds.length === 0) {
      // If no projects, return empty filter (no notifications)
      return { id: { [Op.in]: [] } };
    }

    // Get all members of these projects
    const projectMembers = await ProjectMember.findAll({
      where: {
        projectId: { [Op.in]: projectIds },
        isDeleted: false
      }
    });

    const userIds = [...new Set(projectMembers.map(pm => pm.userId))];

    return {
      userId: { [Op.in]: userIds }
    };
  } catch (error) {
    console.error('Error building project manager notification filter:', error);
    // Fallback to user's own notifications
    return { userId };
  }
};

/**
 * Notification Management Resolvers
 * Handles CRUD operations for notifications in the dashboard
 */

/**
 * Get dashboard notifications with pagination, search, and sorting
 * Supports filtering by user and search terms
 */
export const getDashboardNotifications = async (
  parent: any,
  args: {
    limit?: number;
    offset?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  },
  context: any
) => {
  try {
    // Check authentication
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to view notifications');
    }

    const { limit = 10, offset = 0, search, sortBy = 'id', sortOrder = 'ASC' } = args;

    // Validate pagination parameters
    const validLimit = Math.min(Math.max(limit, 1), 100);
    const validOffset = Math.max(offset, 0);

    const userRole = context.user.role;
    const userId = context.user.id;

    // Build where clause based on user role
    let whereClause: any = {};

    if (userRole === 'ADMIN') {
      // Admin users can see ALL notifications from ALL users
      // No additional filtering needed - whereClause remains empty
    } else if (userRole === 'Project Manager') {
      // Project managers can see notifications related to their projects
      whereClause = await buildProjectManagerNotificationFilter(userId);
    } else {
      // Regular users can only see their own notifications
      whereClause.userId = userId;
    }

    // Add search functionality
    if (search && search.trim()) {
      if (userRole === 'ADMIN') {
        // Admins can search all notifications
        whereClause.message = { [Op.like]: `%${search.trim()}%` };
      } else if (userRole === 'Project Manager') {
        // Project managers can search within their project notifications
        if (whereClause.userId && whereClause.userId[Op.in]) {
          whereClause[Op.and] = [
            { userId: whereClause.userId },
            { message: { [Op.like]: `%${search.trim()}%` } }
          ];
          delete whereClause.userId;
        } else {
          whereClause.message = { [Op.like]: `%${search.trim()}%` };
        }
      } else {
        // Regular users can only search their own notifications
        whereClause[Op.and] = [
          { userId: userId },
          { message: { [Op.like]: `%${search.trim()}%` } }
        ];
        delete whereClause.userId;
      }
    }

    // Validate and set sort parameters
    const allowedSortFields = ['id', 'createdAt', 'updatedAt', 'isRead'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count for pagination info
    const totalCount = await Notification.count({
      where: whereClause,
    });

    // Fetch notifications with pagination
    const notifications = await Notification.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
          required: true,
        },
      ],
      order: [[validSortBy, validSortOrder]],
      limit: validLimit,
      offset: validOffset,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / validLimit);
    const currentPage = Math.floor(validOffset / validLimit) + 1;

    const paginationInfo = {
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      totalCount,
      currentPage,
      totalPages,
    };

    // Transform notifications for GraphQL response
    const transformedNotifications = notifications.map((notification: any) => ({
      id: notification.id.toString(),
      uuid: notification.uuid,
      user: notification.user,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
      updatedAt: notification.updatedAt.toISOString(),
    }));


    return {
      notifications: transformedNotifications,
      paginationInfo,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }
};

/**
 * Create a new notification
 * Validates input and creates notification with proper relationships
 */
export const createNotification = async (
  parent: any,
  args: { input: any },
  context: any
) => {
  try {
    // Check authentication
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to create notifications');
    }

    const { input } = args;

    // Validate required fields
    if (!input.message || !input.userId) {
      throw new UserInputError('Message and user ID are required');
    }

    // Validate message length
    if (input.message.length < 1 || input.message.length > 1000) {
      throw new UserInputError('Message must be between 1 and 1000 characters');
    }

    // Create notification
    const notification = await Notification.create({
      userId: input.userId,
      message: input.message,
      isRead: false,
    });

    // Fetch the created notification with relationships
    const createdNotification = await Notification.findByPk(notification.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
        },
      ],
    });

    return {
      id: createdNotification!.id.toString(),
      user: createdNotification!.user,
      message: createdNotification!.message,
      isRead: createdNotification!.isRead,
      createdAt: createdNotification!.createdAt.toISOString(),
      updatedAt: createdNotification!.updatedAt.toISOString(),
    };
  } catch (error: any) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

/**
 * Update an existing notification
 * Validates input and updates notification with proper relationships
 */
export const updateNotification = async (
  parent: any,
  args: { id: string; input: any },
  context: any
) => {
  try {
    // Check authentication
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to update notifications');
    }

    const { id, input } = args;

    // Find the notification
    const notification = await Notification.findByPk(id);
    if (!notification) {
      throw new UserInputError('Notification not found');
    }

    // Validate message length if provided
    if (input.message && (input.message.length < 1 || input.message.length > 1000)) {
      throw new UserInputError('Message must be between 1 and 1000 characters');
    }

    // Update the notification
    await notification.update({
      message: input.message || notification.message,
      isRead: input.isRead !== undefined ? input.isRead : notification.isRead,
    });

    // Fetch the updated notification with relationships
    const updatedNotification = await Notification.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
        },
      ],
    });

    return {
      id: updatedNotification!.id.toString(),
      user: updatedNotification!.user,
      message: updatedNotification!.message,
      isRead: updatedNotification!.isRead,
      createdAt: updatedNotification!.createdAt.toISOString(),
      updatedAt: updatedNotification!.updatedAt.toISOString(),
    };
  } catch (error: any) {
    throw new Error(`Failed to update notification: ${error.message}`);
  }
};

/**
 * Delete a notification
 * Validates permissions and removes the notification
 */
export const deleteNotification = async (
  parent: any,
  args: { id: string },
  context: any
) => {
  try {
    // Check authentication
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to delete notifications');
    }

    const { id } = args;

    // Find the notification
    const notification = await Notification.findByPk(id);
    if (!notification) {
      throw new UserInputError('Notification not found');
    }

    // Delete the notification
    await notification.destroy();

    return true;
  } catch (error: any) {
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
};

/**
 * Mark notification as read
 * Updates the isRead status to true
 */
export const markNotificationRead = async (
  parent: any,
  args: { id: string },
  context: any
) => {
  try {
    // Check authentication
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to mark notifications as read');
    }

    const { id } = args;

    // Find the notification
    const notification = await Notification.findByPk(id);
    if (!notification) {
      throw new UserInputError('Notification not found');
    }

    // Update the notification
    await notification.update({ isRead: true });

    // Fetch the updated notification with relationships
    const updatedNotification = await Notification.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
        },
      ],
    });

    return {
      id: updatedNotification!.id.toString(),
      user: updatedNotification!.user,
      message: updatedNotification!.message,
      isRead: updatedNotification!.isRead,
      createdAt: updatedNotification!.createdAt.toISOString(),
      updatedAt: updatedNotification!.updatedAt.toISOString(),
    };
  } catch (error: any) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
};

/**
 * Mark notification as unread
 * Updates the isRead status to false
 */
export const markNotificationUnread = async (
  parent: any,
  args: { id: string },
  context: any
) => {
  try {
    // Check authentication
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to mark notifications as unread');
    }

    const { id } = args;

    // Find the notification
    const notification = await Notification.findByPk(id);
    if (!notification) {
      throw new UserInputError('Notification not found');
    }

    // Update the notification
    await notification.update({ isRead: false });

    // Fetch the updated notification with relationships
    const updatedNotification = await Notification.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
        },
      ],
    });

    return {
      id: updatedNotification!.id.toString(),
      user: updatedNotification!.user,
      message: updatedNotification!.message,
      isRead: updatedNotification!.isRead,
      createdAt: updatedNotification!.createdAt.toISOString(),
      updatedAt: updatedNotification!.updatedAt.toISOString(),
    };
  } catch (error: any) {
    throw new Error(`Failed to mark notification as unread: ${error.message}`);
  }
};

// Export resolvers
export const notificationManagementResolvers = {
  Query: {
    dashboardNotifications: getDashboardNotifications,
  },
  Mutation: {
    createNotification,
    updateNotification,
    deleteNotification,
    markNotificationRead,
    markNotificationUnread,
  },
};
