import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Op } from 'sequelize';
import { ActivityLog, User, Project, Task } from '../../db';

/**
 * Activity Management Resolvers
 * Handles CRUD operations for activity logs in the dashboard
 */

/**
 * Get dashboard activities with pagination, search, and sorting
 * Supports filtering by user, type, and search terms
 */
export const getDashboardActivities = async (
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
    // Check authentication - return empty result if not authenticated
    // This prevents Access Denied flash during auth initialization
    if (!context.user) {
      return {
        activities: [],
        paginationInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          totalCount: 0,
          currentPage: 1,
          totalPages: 0
        }
      };
    }

    const { limit = 10, offset = 0, search, sortBy = 'id', sortOrder = 'ASC' } = args;

    // Validate pagination parameters
    const validLimit = Math.min(Math.max(limit, 1), 100);
    const validOffset = Math.max(offset, 0);

    // Build where clause for search
    const whereClause: any = {
      // Only include activity logs with valid type fields
      type: {
        [Op.in]: ['USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'PROJECT_CREATED', 'PROJECT_UPDATED', 'PROJECT_DELETED', 'TASK_CREATED', 'TASK_UPDATED', 'TASK_DELETED']
      }
    };

    // Add search functionality
    if (search && search.trim()) {
      whereClause[Op.and] = [
        whereClause,
        {
          [Op.or]: [
            { action: { [Op.like]: `%${search.trim()}%` } },
            { type: { [Op.like]: `%${search.trim()}%` } },
          ]
        }
      ];
    }

    // Validate and set sort parameters
    const allowedSortFields = ['id', 'createdAt', 'updatedAt', 'action', 'type'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count for pagination info
    const totalCount = await ActivityLog.count({
      where: whereClause,
    });

    // Fetch activities with pagination
    const activities = await ActivityLog.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
          required: true,
        },
        {
          model: User,
          as: 'targetUser',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
          required: false,
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'uuid', 'name'],
          required: false,
        },
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'uuid', 'title', 'projectId'],
          required: false,
          include: [
            {
              model: Project,
              as: 'project',
              attributes: ['id', 'uuid', 'name'],
              required: false,
            },
          ],
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

    // Transform activities for GraphQL response
    const transformedActivities = activities.map((activity: any) => ({
      id: activity.id.toString(),
      uuid: activity.uuid,
      user: activity.user,
      targetUser: activity.targetUser || null,
      project: activity.project || null,
      task: activity.task || null,
      action: activity.action,
      type: activity.type,
      metadata: activity.metadata,
      createdAt: activity.createdAt.toISOString(),
      updatedAt: activity.updatedAt.toISOString(),
    }));

    return {
      activities: transformedActivities,
      paginationInfo,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch activities: ${error.message}`);
  }
};

/**
 * Create a new activity log
 * Validates input and creates activity with proper relationships
 */
export const createActivity = async (
  parent: any,
  args: { input: any },
  context: any
) => {
  try {
    // Check authentication
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to create activities');
    }

    const { input } = args;

    // Validate required fields
    if (!input.action || !input.type) {
      throw new UserInputError('Action and type are required');
    }

    // Validate activity type
    const validTypes = [
      'USER_CREATED',
      'USER_UPDATED',
      'USER_DELETED',
      'PROJECT_CREATED',
      'PROJECT_UPDATED',
      'PROJECT_DELETED',
      'TASK_CREATED',
      'TASK_UPDATED',
      'TASK_DELETED',
    ];

    if (!validTypes.includes(input.type)) {
      throw new UserInputError('Invalid activity type');
    }

    // Create activity log
    const activity = await ActivityLog.create({
      userId: context.user.id,
      targetUserId: input.targetUserId || null,
      projectId: input.projectId || null,
      taskId: input.taskId || null,
      action: input.action,
      type: input.type,
      metadata: input.metadata || null,
    });

    // Fetch the created activity with relationships
    const createdActivity = await ActivityLog.findByPk(activity.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
        },
        {
          model: User,
          as: 'targetUser',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'uuid', 'name'],
        },
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'uuid', 'title', 'projectId'],
          include: [
            {
              model: Project,
              as: 'project',
              attributes: ['id', 'uuid', 'name'],
            },
          ],
        },
      ],
    });

    return {
      id: createdActivity!.id.toString(),
      uuid: createdActivity!.uuid,
      user: createdActivity!.user,
      targetUser: createdActivity!.targetUser || null,
      project: createdActivity!.project || null,
      task: createdActivity!.task || null,
      action: createdActivity!.action,
      type: createdActivity!.type,
      metadata: createdActivity!.metadata,
      createdAt: createdActivity!.createdAt.toISOString(),
      updatedAt: createdActivity!.updatedAt.toISOString(),
    };
  } catch (error: any) {
    throw new Error(`Failed to create activity: ${error.message}`);
  }
};

/**
 * Update an existing activity log
 * Validates input and updates activity with proper relationships
 */
export const updateActivity = async (
  parent: any,
  args: { id: string; input: any },
  context: any
) => {
  try {
    // Check authentication
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to update activities');
    }

    const { id, input } = args;

    // Find the activity
    const activity = await ActivityLog.findByPk(id);
    if (!activity) {
      throw new UserInputError('Activity not found');
    }

    // Validate activity type if provided
    if (input.type) {
      const validTypes = [
        'USER_CREATED',
        'USER_UPDATED',
        'USER_DELETED',
        'PROJECT_CREATED',
        'PROJECT_UPDATED',
        'PROJECT_DELETED',
        'TASK_CREATED',
        'TASK_UPDATED',
        'TASK_DELETED',
      ];

      if (!validTypes.includes(input.type)) {
        throw new UserInputError('Invalid activity type');
      }
    }

    // Update the activity
    await activity.update({
      action: input.action || activity.action,
      type: input.type || activity.type,
      metadata: input.metadata !== undefined ? input.metadata : activity.metadata,
    });

    // Fetch the updated activity with relationships
    const updatedActivity = await ActivityLog.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
        },
        {
          model: User,
          as: 'targetUser',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'uuid', 'name'],
        },
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'uuid', 'title', 'projectId'],
          include: [
            {
              model: Project,
              as: 'project',
              attributes: ['id', 'uuid', 'name'],
            },
          ],
        },
      ],
    });

    return {
      id: updatedActivity!.id.toString(),
      uuid: updatedActivity!.uuid,
      user: updatedActivity!.user,
      targetUser: updatedActivity!.targetUser || null,
      project: updatedActivity!.project || null,
      task: updatedActivity!.task || null,
      action: updatedActivity!.action,
      type: updatedActivity!.type,
      metadata: updatedActivity!.metadata,
      createdAt: updatedActivity!.createdAt.toISOString(),
      updatedAt: updatedActivity!.updatedAt.toISOString(),
    };
  } catch (error: any) {
    throw new Error(`Failed to update activity: ${error.message}`);
  }
};

/**
 * Delete an activity log
 * Validates permissions and removes the activity
 */
export const deleteActivity = async (
  parent: any,
  args: { id: string },
  context: any
) => {
  try {
    // Check authentication
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to delete activities');
    }

    const { id } = args;

    // Find the activity
    const activity = await ActivityLog.findByPk(id);
    if (!activity) {
      throw new UserInputError('Activity not found');
    }

    // Delete the activity
    await activity.destroy();

    return true;
  } catch (error: any) {
    throw new Error(`Failed to delete activity: ${error.message}`);
  }
};


// Export resolvers
export const activityManagementResolvers = {
  Query: {
    dashboardActivities: getDashboardActivities,
  },
  Mutation: {
    createActivity,
    updateActivity,
    deleteActivity,
  },
};
