import { Op } from 'sequelize';
import { Task, Project, User, ProjectMember } from '../../db';
import { sendNotificationsToProjectMembers, notifyUserIfNeeded } from '../utils/notificationHelpers';
import { setActivityContext, clearActivityContext } from '../../db/utils/activityContext';

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
      isDeleted: false
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
      attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'dueDate', 'projectId', 'assignedTo', 'isDeleted', 'version', 'createdAt', 'updatedAt'],
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
export const createTask = async (_: any, { input }: { input: any }, context: any) => {
  try {
    // Set activity context for logged-in user
    if (context.user) {
      setActivityContext({
        id: context.user.id,
        email: context.user.email,
        role: context.user.role
      });
    }

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
      dueDate: dueDate || null,
      projectId: parseInt(projectId),
      assignedTo: assignedUserId ? parseInt(assignedUserId) : null,
      isDeleted: false,
      version: 1
    });

    // If task is assigned to a user, add them as a project member
    if (assignedUserId) {
      try {
        // Check if user is already a project member
        const existingMember = await ProjectMember.findOne({
          where: {
            projectId: parseInt(projectId),
            userId: parseInt(assignedUserId),
            isDeleted: false
          }
        });

        // If not a member, add them as a project member with EDITOR role
        if (!existingMember) {
          await ProjectMember.create({
            projectId: parseInt(projectId),
            userId: parseInt(assignedUserId),
            role: 'EDITOR',
            isDeleted: false
          });
        }
      } catch (error) {
        // Swallow errors to avoid failing task creation
      }
    }

    // Create notifications similar to project creation flow
    try {
      const actorName = context.user ? `${context.user.firstName} ${context.user.lastName}` : 'System';
      const actorRole = context.user ? context.user.role : 'System';

      // 1. Notify assigned user (if any and not the actor)
      await notifyUserIfNeeded(
        assignedUserId ? parseInt(assignedUserId) : null,
        `Task "${title}" has been created in project ID ${parseInt(projectId)} with status "${status}" and priority "${priority}" by ${actorName} (${actorRole})`,
        [context.user?.id || -1]
      );

      // 2. Notify project members (exclude actor and assigned user)
      await sendNotificationsToProjectMembers(
        parseInt(projectId),
        `Task "${title}" has been created with status "${status}" and priority "${priority}" by ${actorName} (${actorRole})`,
        [context.user?.id, assignedUserId ? parseInt(assignedUserId) : undefined].filter(Boolean) as number[]
      );
    } catch (notificationError) {
      // Swallow errors to avoid failing task creation
    }

    // Return the created task directly to avoid triggering additional hooks
    return task;
  } catch (error) {
    throw new Error('Failed to create task');
  } finally {
    // Clear activity context after operation
    clearActivityContext();
  }
};

/**
 * Update an existing task
 * Handles partial updates and validates relationships
 */
export const updateTask = async (_: any, { id, input }: { id: string; input: any }, context: any) => {
  try {
    // Set activity context for logged-in user
    if (context.user) {
      setActivityContext({
        id: context.user.id,
        email: context.user.email,
        role: context.user.role
      });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.isDeleted) {
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
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (projectId !== undefined) updateData.projectId = parseInt(projectId);
    if (assignedUserId !== undefined) updateData.assignedTo = assignedUserId ? parseInt(assignedUserId) : null;

    // Increment version for optimistic concurrency
    updateData.version = task.version + 1;

    // Store the original assigned user for comparison
    const originalAssignedUserId = task.assignedTo;
    
    await task.update(updateData);

    // Handle project member updates when task assignment changes
    if (assignedUserId !== undefined) {
      try {
        // Use the updated projectId if provided, otherwise use the existing one
        const targetProjectId = projectId ? parseInt(projectId) : task.projectId;
        const newAssignedUserId = assignedUserId ? parseInt(assignedUserId) : null;
        
        // Only process if the assignment actually changed
        if (originalAssignedUserId !== newAssignedUserId) {
          
          // If there's a new assigned user, ensure they're a project member
          if (newAssignedUserId) {
            // Check if user is already a project member for this project
            const existingMember = await ProjectMember.findOne({
              where: {
                projectId: targetProjectId,
                userId: newAssignedUserId,
                isDeleted: false
              }
            });

            // Only create new project member record if they're not already a member
            if (!existingMember) {
              await ProjectMember.create({
                projectId: targetProjectId,
                userId: newAssignedUserId,
                role: 'EDITOR',
                isDeleted: false
              });
            }
          }
        }
      } catch (error) {
        // Swallow errors to avoid failing task update
      }
    }

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

    // Create notifications similar to project update flow
    try {
      const actorName = context.user ? `${context.user.firstName} ${context.user.lastName}` : 'System';
      const actorRole = context.user ? context.user.role : 'System';

      const changes: string[] = [];
      if (input.title && input.title !== task.title) changes.push(`title from "${task.title}" to "${input.title}"`);
      if (input.description && input.description !== task.description) changes.push('description updated');
      if (input.status && input.status !== task.status) changes.push(`status from "${task.status}" to "${input.status}"`);
      if (input.priority && input.priority !== task.priority) changes.push(`priority from "${task.priority}" to "${input.priority}"`);
      if (input.dueDate !== undefined && input.dueDate !== task.dueDate) changes.push('due date updated');
      if (input.projectId !== undefined && parseInt(input.projectId) !== task.projectId) changes.push(`project changed`);
      if (input.assignedUserId !== undefined && (task.assignedTo || null) !== (input.assignedUserId ? parseInt(input.assignedUserId) : null)) changes.push('assignee changed');

      if (changes.length > 0 && updatedTask) {
        const projectIdForNotify = updatedTask.projectId;
        const assignedToForNotify = updatedTask.assignedTo || null;

        // Notify assignee if different from actor
        await notifyUserIfNeeded(
          assignedToForNotify,
          `Task "${updatedTask.title}" has been updated: ${changes.join(', ')} by ${actorName} (${actorRole})`,
          [context.user?.id || -1]
        );

        // Fan out to project members, excluding actor and assignee
        await sendNotificationsToProjectMembers(
          projectIdForNotify,
          `Task "${updatedTask.title}" has been updated: ${changes.join(', ')} by ${actorName} (${actorRole})`,
          [context.user?.id, assignedToForNotify || undefined].filter(Boolean) as number[]
        );
      }
    } catch (notificationError) {
      // Swallow errors to avoid failing task update
    }

    return updatedTask;
  } catch (error) {
    throw new Error('Failed to update task');
  } finally {
    // Clear activity context after operation
    clearActivityContext();
  }
};

/**
 * Delete a task (soft delete)
 * Sets isDeleted flag instead of hard deletion
 */
export const deleteTask = async (_: any, { id }: { id: string }, context: any) => {
  try {
    // Set activity context for logged-in user
    if (context.user) {
      setActivityContext({
        id: context.user.id,
        email: context.user.email,
        role: context.user.role
      });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.isDeleted) {
      throw new Error('Task already deleted');
    }

    // Soft delete without triggering hooks
    await task.update({ isDeleted: true }, { hooks: false });
    
    // Create notifications similar to project deletion flow
    try {
      const actorName = context.user ? `${context.user.firstName} ${context.user.lastName}` : 'System';
      const actorRole = context.user ? context.user.role : 'System';

      // Notify assignee if exists and not the actor
      await notifyUserIfNeeded(
        task.assignedTo || null,
        `Task "${task.title}" has been deleted by ${actorName} (${actorRole})`,
        [context.user?.id || -1]
      );

      // Fan out to project members, excluding actor and assignee
      await sendNotificationsToProjectMembers(
        task.projectId,
        `Task "${task.title}" has been deleted by ${actorName} (${actorRole})`,
        [context.user?.id, task.assignedTo || undefined].filter(Boolean) as number[]
      );
    } catch (notificationError) {
      // Swallow errors to avoid failing task deletion
    }

    // Manually trigger activity logging for deletion
    const { createActivityLog, generateActionDescription, extractEntityName } = await import('../../db/utils/activityLogger');
    await createActivityLog({
      type: 'TASK_DELETED',
      action: generateActionDescription('delete', 'task', extractEntityName(task, 'task')),
      targetUserId: task.assignedTo || null,
      projectId: task.projectId,
      taskId: task.id,
      metadata: {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        assignedTo: task.assignedTo
      }
    });

    return true;
  } catch (error) {
    throw new Error('Failed to delete task');
  } finally {
    // Clear activity context after operation
    clearActivityContext();
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
