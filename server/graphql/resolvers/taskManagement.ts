import { Op } from 'sequelize';
import { Task, Project, User } from '../../db';

/**
 * Task Management Resolvers
 * Handles CRUD operations for tasks with pagination, search, and sorting
 * Follows GraphQL best practices with proper error handling
 */

/**
 * Get paginated tasks for dashboard management
 * Supports search, sorting, and pagination
 */
export const getDashboardTasks = async (
  _: any,
  { limit = 10, offset = 0, search, sortBy = "createdAt", sortOrder = "DESC" }: { 
    limit?: number; 
    offset?: number; 
    search?: string; 
    sortBy?: string; 
    sortOrder?: string; 
  }
) => {
  try {
    const whereConditions: any = {
      is_deleted: false
    };

    // Add search conditions if search query provided
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereConditions[Op.or] = [
        { title: { [Op.like]: searchTerm } },
        { description: { [Op.like]: searchTerm } }
      ];
    }

    // Validate and set sort parameters
    const allowedSortFields = ['id', 'title', 'status', 'priority', 'dueDate', 'createdAt', 'updatedAt'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Fetch tasks with pagination and sorting
    const { count, rows: tasks } = await Task.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [[validSortBy, validSortOrder]],
      include: [
        { 
          model: Project, 
          as: 'project', 
          attributes: ['id', 'name', 'description', 'status'] 
        },
        { 
          model: User, 
          as: 'assignedUser', 
          attributes: ['id', 'firstName', 'lastName', 'email'] 
        }
      ],
      attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'due_date', 'project_id', 'assigned_to', 'is_deleted', 'version', 'created_at', 'updated_at'],
      raw: false
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    const paginationInfo = {
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      totalCount: count,
      currentPage,
      totalPages
    };

    return {
      tasks,
      paginationInfo
    };
  } catch (error) {
    throw new Error('Failed to fetch tasks');
  }
};

/**
 * Create a new task
 * Validates input and creates task with proper relationships
 */
export const createTask = async (_: any, { input }: { input: any }) => {
  try {
    const { title, description, status, priority, dueDate, projectId, assignedUserId } = input;

    // Validate required fields
    if (!title || !description || !status || !priority || !projectId) {
      throw new Error('Missing required fields: title, description, status, priority, projectId');
    }

    // Verify project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Verify assigned user exists if provided
    if (assignedUserId) {
      const assignedUser = await User.findByPk(assignedUserId);
      if (!assignedUser) {
        throw new Error('Assigned user not found');
      }
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      due_date: dueDate || null,
      project_id: projectId,
      assigned_to: assignedUserId || null,
      is_deleted: false,
      version: 1
    });

    // Fetch created task with relationships
    const createdTask = await Task.findByPk(task.id, {
      include: [
        { 
          model: Project, 
          as: 'project', 
          attributes: ['id', 'name', 'description', 'status'] 
        },
        { 
          model: User, 
          as: 'assignedUser', 
          attributes: ['id', 'firstName', 'lastName', 'email'] 
        }
      ]
    });

    return createdTask;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
};

/**
 * Update an existing task
 * Handles partial updates and validates relationships
 */
export const updateTask = async (_: any, { id, input }: { id: string; input: any }) => {
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.is_deleted) {
      throw new Error('Cannot update deleted task');
    }

    const { title, description, status, priority, dueDate, projectId, assignedUserId } = input;

    // Validate project if provided
    if (projectId) {
      const project = await Project.findByPk(projectId);
      if (!project) {
        throw new Error('Project not found');
      }
    }

    // Validate assigned user if provided
    if (assignedUserId) {
      const assignedUser = await User.findByPk(assignedUserId);
      if (!assignedUser) {
        throw new Error('Assigned user not found');
      }
    }

    // Update task fields
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.due_date = dueDate;
    if (projectId !== undefined) updateData.project_id = projectId;
    if (assignedUserId !== undefined) updateData.assigned_to = assignedUserId;

    // Increment version for optimistic concurrency
    updateData.version = task.version + 1;

    await task.update(updateData);

    // Fetch updated task with relationships
    const updatedTask = await Task.findByPk(id, {
      include: [
        { 
          model: Project, 
          as: 'project', 
          attributes: ['id', 'name', 'description', 'status'] 
        },
        { 
          model: User, 
          as: 'assignedUser', 
          attributes: ['id', 'firstName', 'lastName', 'email'] 
        }
      ]
    });

    return updatedTask;
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
};

/**
 * Delete a task (soft delete)
 * Sets isDeleted flag instead of hard deletion
 */
export const deleteTask = async (_: any, { id }: { id: string }) => {
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.is_deleted) {
      throw new Error('Task already deleted');
    }

    // Soft delete by setting is_deleted flag
    await task.update({
      is_deleted: true,
      version: task.version + 1
    });

    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
};

/**
 * Task Management Resolvers Export
 * Combines all task management resolvers
 */
export const taskManagementResolvers = {
  Query: {
    dashboardTasks: getDashboardTasks
  },
  Mutation: {
    createTask,
    updateTask,
    deleteTask
  },
  Task: {
    project: (parent: any) => Project.findByPk(parent.projectId),
    assignedUser: (parent: any) => parent.assignedUserId ? User.findByPk(parent.assignedUserId) : null
  }
};
