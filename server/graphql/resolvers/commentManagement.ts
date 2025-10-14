import { Comment, User, Task, Project, CommentLike } from '../../db';
import { AuthenticationError } from 'apollo-server-express';
import { Op } from 'sequelize';

/**
 * Comment Management Resolvers
 * Handles CRUD operations for comments in the dashboard
 * Provides pagination, search, and sorting functionality
 */

/**
 * Get dashboard comments with pagination, search, and sorting
 * Returns all non-deleted comments with author and task information
 */
export const getDashboardComments = async (
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
      throw new AuthenticationError('You must be logged in to view comments');
    }

    const { limit = 10, offset = 0, search, sortBy = 'id', sortOrder = 'ASC' } = args;

    // Validate pagination parameters
    const validLimit = Math.min(Math.max(limit, 1), 100);
    const validOffset = Math.max(offset, 0);

    // Build where clause for search
    const whereClause: any = {
      isDeleted: false,
    };

    // Add search functionality
    if (search && search.trim()) {
      whereClause[Op.or] = [
        { content: { [Op.like]: `%${search.trim()}%` } },
        { '$user.firstName$': { [Op.like]: `%${search.trim()}%` } },
        { '$user.lastName$': { [Op.like]: `%${search.trim()}%` } },
        { '$user.email$': { [Op.like]: `%${search.trim()}%` } },
        { '$task.title$': { [Op.like]: `%${search.trim()}%` } },
        { '$task.project.name$': { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    // Validate and set sort parameters
    const allowedSortFields = ['id', 'createdAt', 'updatedAt', 'content'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count for pagination info
    const totalCount = await Comment.count({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: [],
          required: true,
        },
        {
          model: Task,
          as: 'task',
          attributes: [],
          required: true,
          include: [
            {
              model: Project,
              as: 'project',
              attributes: [],
              required: true,
            },
          ],
        },
      ],
    });

    // Fetch comments with pagination
    const comments = await Comment.findAll({
      where: whereClause,
      attributes: ['id', 'uuid', 'content', 'userId', 'taskId', 'isDeleted', 'version', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
          required: true,
        },
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'uuid', 'title', 'projectId'],
          required: true,
          include: [
            {
              model: Project,
              as: 'project',
              attributes: ['id', 'uuid', 'name'],
              required: true,
            },
          ],
        },
      ],
      order: [[validSortBy, validSortOrder]],
      limit: validLimit,
      offset: validOffset,
    });

    // Get likes count for each comment
    const commentsWithLikes = await Promise.all(
      comments.map(async (comment: any) => {
        const likesCount = await CommentLike.count({
          where: { commentId: comment.id },
        });

        return {
          id: comment.id.toString(),
          uuid: comment.uuid,
          content: comment.content,
          // Include raw database fields for Comment type resolvers
          user_id: comment.userId || comment.user_id,
          task_id: comment.taskId || comment.task_id,
          // Include populated objects for direct access
          author: comment.user,
          task: comment.task,
          isDeleted: comment.isDeleted,
          version: comment.version,
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString(),
          likesCount: likesCount,
          isLikedByUser: false, // Will be set by client if needed
        };
      })
    );

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / validLimit);
    const currentPage = Math.floor(validOffset / validLimit) + 1;

    return {
      comments: commentsWithLikes,
      paginationInfo: {
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        totalCount: totalCount,
        currentPage: currentPage,
        totalPages: totalPages,
      },
    };
  } catch (error) {
    throw error;
  }
};


/**
 * Update an existing comment
 * Requires authentication and validates permissions
 */
export const updateComment = async (
  parent: any,
  args: { id: string; input: { content?: string } },
  context: any
) => {
  try {
    // Check authentication
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to update comments');
    }

    const { id, input } = args;

    // Validate input
    if (!input.content || input.content.trim().length === 0) {
      throw new Error('Comment content is required');
    }

    // Find the comment
    const comment = await Comment.findByPk(parseInt(id), {
      where: { isDeleted: false },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          required: true,
        },
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'uuid', 'title', 'projectId'],
          required: true,
          include: [
            {
              model: Project,
              as: 'project',
              attributes: ['id', 'uuid', 'name'],
              required: true,
            },
          ],
        },
      ],
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    // Check if user can update this comment (author or admin/project manager)
    const userRole = context.user.role?.toLowerCase();
    const canUpdate = userRole === 'admin' || 
                     userRole === 'project manager' || 
                     comment.userId === context.user.id;
    if (!canUpdate) {
      throw new AuthenticationError('You can only update your own comments');
    }

    // Update the comment
    await comment.update({
      content: input.content.trim(),
      version: comment.version + 1,
    });

    // Get likes count
    const likesCount = await CommentLike.count({
      where: { commentId: comment.id },
    });

    return {
      id: comment.id.toString(),
      uuid: comment.uuid,
      content: comment.content,
      // Include raw database fields for Comment type resolvers
      user_id: comment.userId || comment.user_id,
      task_id: comment.taskId || comment.task_id,
      // Include populated objects for direct access
      author: comment.user,
      task: comment.task,
      isDeleted: comment.isDeleted,
      version: comment.version,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      likesCount: likesCount,
      isLikedByUser: false,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a comment (soft delete)
 * Requires authentication and validates permissions
 */
export const deleteComment = async (
  parent: any,
  args: { id: string },
  context: any
) => {
  try {
    // Check authentication
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to delete comments');
    }

    const { id } = args;

    // Find the comment
    const comment = await Comment.findByPk(parseInt(id), {
      where: { isDeleted: false },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    // Check if user can delete this comment (author or admin/project manager)
    const userRole = context.user.role?.toLowerCase();
    const canDelete = userRole === 'admin' || 
                     userRole === 'project manager' || 
                     comment.userId === context.user.id;
    if (!canDelete) {
      throw new AuthenticationError('You can only delete your own comments');
    }

    // Soft delete the comment
    await comment.update({
      isDeleted: true,
      version: comment.version + 1,
    });

    return true;
  } catch (error) {
    throw error;
  }
};

export const commentManagementResolvers = {
  Query: {
    dashboardComments: getDashboardComments,
  },
  Mutation: {
    updateComment: updateComment,
    deleteComment: deleteComment,
  },
};
