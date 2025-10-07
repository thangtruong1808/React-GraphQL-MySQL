import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Op } from 'sequelize';
import { Tag } from '../../db';

/**
 * Tags Management Resolvers
 * Handles CRUD operations for tags in the dashboard
 */

/**
 * Get dashboard tags with pagination, search, and sorting
 * Supports filtering by name, description, type, and category
 */
export const getDashboardTags = async (
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
      throw new AuthenticationError('You must be logged in to view tags');
    }

    const { limit = 10, offset = 0, search, sortBy = 'id', sortOrder = 'ASC' } = args;

    // Validate pagination parameters
    const validLimit = Math.min(Math.max(limit, 1), 100);
    const validOffset = Math.max(offset, 0);

    // Build where clause for search
    const whereClause: any = {};

    // Add search functionality
    if (search && search.trim()) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search.trim()}%` } },
        { description: { [Op.like]: `%${search.trim()}%` } },
        { title: { [Op.like]: `%${search.trim()}%` } },
        { type: { [Op.like]: `%${search.trim()}%` } },
        { category: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    // Validate and set sort parameters
    const allowedSortFields = ['id', 'name', 'description', 'type', 'category', 'createdAt', 'updatedAt'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count for pagination info
    const totalCount = await Tag.count({
      where: whereClause,
    });

    // Fetch tags with pagination
    const tags = await Tag.findAll({
      where: whereClause,
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

    // Transform tags for GraphQL response
    const transformedTags = tags.map((tag: any) => ({
      id: tag.id.toString(),
      name: tag.name,
      description: tag.description,
      title: tag.title || null,
      type: tag.type || null,
      category: tag.category || null,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
    }));

    return {
      tags: transformedTags,
      paginationInfo,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }
};

/**
 * Create a new tag
 * Validates input and creates tag with proper constraints
 */
export const createTag = async (
  parent: any,
  args: { input: any },
  context: any
) => {
  try {
    // Check authentication
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to create tags');
    }

    const { input } = args;

    // Validate required fields
    if (!input.name || !input.description) {
      throw new UserInputError('Name and description are required');
    }

    // Validate name length
    if (input.name.length < 1 || input.name.length > 50) {
      throw new UserInputError('Name must be between 1 and 50 characters');
    }

    // Validate description length
    if (input.description.length < 1 || input.description.length > 500) {
      throw new UserInputError('Description must be between 1 and 500 characters');
    }

    // Validate title length if provided
    if (input.title && input.title.length > 255) {
      throw new UserInputError('Title must be no more than 255 characters');
    }

    // Create tag
    const tag = await Tag.create({
      name: input.name.trim(),
      description: input.description.trim(),
      title: input.title?.trim() || null,
      type: input.type?.trim() || null,
      category: input.category?.trim() || null,
    });

    return {
      id: tag.id.toString(),
      name: tag.name,
      description: tag.description,
      title: tag.title || null,
      type: tag.type || null,
      category: tag.category || null,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
    };
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new UserInputError('A tag with this name already exists');
    }
    throw new Error(`Failed to create tag: ${error.message}`);
  }
};

/**
 * Update an existing tag
 * Validates input and updates tag with proper constraints
 */
export const updateTag = async (
  parent: any,
  args: { id: string; input: any },
  context: any
) => {
  try {
    // Check authentication
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to update tags');
    }

    const { id, input } = args;

    // Find the tag
    const tag = await Tag.findByPk(id);
    if (!tag) {
      throw new UserInputError('Tag not found');
    }

    // Validate name length if provided
    if (input.name && (input.name.length < 1 || input.name.length > 50)) {
      throw new UserInputError('Name must be between 1 and 50 characters');
    }

    // Validate description length if provided
    if (input.description && (input.description.length < 1 || input.description.length > 500)) {
      throw new UserInputError('Description must be between 1 and 500 characters');
    }

    // Validate title length if provided
    if (input.title && input.title.length > 255) {
      throw new UserInputError('Title must be no more than 255 characters');
    }

    // Update the tag
    await tag.update({
      name: input.name?.trim() || tag.name,
      description: input.description?.trim() || tag.description,
      title: input.title?.trim() || tag.title,
      type: input.type?.trim() || tag.type,
      category: input.category?.trim() || tag.category,
    });

    return {
      id: tag.id.toString(),
      name: tag.name,
      description: tag.description,
      title: tag.title || null,
      type: tag.type || null,
      category: tag.category || null,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
    };
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new UserInputError('A tag with this name already exists');
    }
    throw new Error(`Failed to update tag: ${error.message}`);
  }
};

/**
 * Delete a tag
 * Validates permissions and removes the tag
 */
export const deleteTag = async (
  parent: any,
  args: { id: string },
  context: any
) => {
  try {
    // Check authentication
    if (!context.user) {
      throw new AuthenticationError('You must be logged in to delete tags');
    }

    const { id } = args;

    // Find the tag
    const tag = await Tag.findByPk(id);
    if (!tag) {
      throw new UserInputError('Tag not found');
    }

    // Delete the tag
    await tag.destroy();

    return true;
  } catch (error: any) {
    throw new Error(`Failed to delete tag: ${error.message}`);
  }
};

// Export resolvers
export const tagsManagementResolvers = {
  Query: {
    dashboardTags: getDashboardTags,
  },
  Mutation: {
    createTag,
    updateTag,
    deleteTag,
  },
};
