import { Op } from 'sequelize';
import { Project, User, Task, Comment, Notification, ProjectMember } from '../../db';
import { setActivityContext, clearActivityContext } from '../../db/utils/activityContext';

/**
 * Project Management Resolvers
 * Handles CRUD operations for project management in dashboard
 * Follows GraphQL best practices with proper error handling
 */

/**
 * Helper function to send notifications to project members
 * Sends notifications to all active project members
 */
const sendNotificationsToProjectMembers = async (projectId: number, message: string, excludeUserIds: number[] = []) => {
  try {
    // Get all project members
    const projectMembers = await ProjectMember.findAll({
      where: {
        projectId: projectId,
        isDeleted: false
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    // Send notifications to each member (excluding specified users)
    const notificationPromises = projectMembers
      .filter(member => !excludeUserIds.includes(member.userId))
      .map(member => 
        Notification.create({
          userId: member.userId,
          message: message
        })
      );

    await Promise.all(notificationPromises);
  } catch (error) {
    // Log error but don't fail the main operation
    // Error handling without console.log for production
  }
};

/**
 * Get paginated projects with search functionality
 * Supports searching by name and description
 */
export const getDashboardProjects = async (
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
    // Build search conditions
    const whereConditions: any = {
      isDeleted: false
    };

    // Add search functionality if search term provided
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereConditions[Op.or] = [
        { name: { [Op.like]: searchTerm } },
        { description: { [Op.like]: searchTerm } }
      ];
    }

    // Validate and map sortBy field to database column
    const allowedSortFields = ['id', 'name', 'status', 'createdAt', 'updatedAt'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    const { count, rows: projects } = await Project.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [[validSortBy, validSortOrder]],
      attributes: ['id', 'uuid', 'name', 'description', 'status', 'ownerId', 'isDeleted', 'version', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      raw: false // Ensure we get Sequelize model instances
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return {
      projects: projects.map(project => ({
        id: project.id.toString(),
        uuid: project.uuid,
        name: project.name,
        description: project.description,
        status: project.status,
        owner: project.owner ? {
          id: project.owner.id.toString(),
          firstName: project.owner.firstName,
          lastName: project.owner.lastName,
          email: project.owner.email
        } : null,
        isDeleted: project.isDeleted ?? false,
        version: project.version ?? 1,
        createdAt: project.createdAt?.toISOString(),
        updatedAt: project.updatedAt?.toISOString()
      })),
      paginationInfo: {
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        totalCount: count,
        currentPage,
        totalPages
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Create a new project
 * Requires authentication and proper input validation
 */
export const createProject = async (
  _: any,
  { input }: { input: { name: string; description: string; status: string; ownerId?: string } },
  context: any
) => {
  try {
    // Set activity context for logged-in user
    if (context.user) {
      setActivityContext({
        id: context.user.id,
        email: context.user.email,
        role: context.user.role
      });
    }

    // Create new project
    const project = await Project.create({
      name: input.name,
      description: input.description,
      status: input.status,
      ownerId: input.ownerId ? parseInt(input.ownerId) : null,
      isDeleted: false,
      version: 1
    });

    // Create notification for project creation - simplified to reduce notification noise
    try {
      const actorName = context.user ? `${context.user.firstName} ${context.user.lastName}` : 'System';
      const actorRole = context.user ? context.user.role : 'System';
      const ownerInfo = input.ownerId ? await User.findByPk(parseInt(input.ownerId)) : null;
      const ownerName = ownerInfo ? `${ownerInfo.firstName} ${ownerInfo.lastName}` : 'No owner assigned';
      
      // 1. Send notification to project owner if assigned and different from creator
      if (input.ownerId && parseInt(input.ownerId) !== context.user?.id) {
        await Notification.create({
          userId: parseInt(input.ownerId),
          message: `Project "${input.name}" has been created with status "${input.status}" and owner "${ownerName}"`
        });
      }

      // 2. Send notification to Admin users when project is created
      // Only notify admins who are actually members of the project
      if (context.user?.role === 'ADMIN') {
        // When admin creates project, notify other admin members (but not themselves)
        const otherAdminMembers = await ProjectMember.findAll({
          where: {
            projectId: project.id,
            userId: { [Op.ne]: context.user.id }, // Exclude the creator
            isDeleted: false
          },
          include: [
            {
              model: User,
              as: 'user',
              where: {
                role: 'ADMIN',
                isDeleted: false
              },
              attributes: ['id'],
              required: true
            }
          ]
        });

        for (const adminMember of otherAdminMembers) {
          await Notification.create({
            userId: adminMember.userId,
            message: `Project "${input.name}" has been created with status "${input.status}" and owner "${ownerName}" by ${actorName} (${actorRole})`
          });
        }
      }
      // Note: Non-admin project creators don't automatically notify admins
      // Admins will only receive notifications when they are added as project members

      // 3. Send notifications to project members (if any exist)
      await sendNotificationsToProjectMembers(
        project.id,
        `You have been added to the new project "${input.name}" with status "${input.status}" by ${actorName} (${actorRole})`,
        [context.user?.id, parseInt(input.ownerId)].filter(id => id) // Exclude creator and owner
      );
    } catch (notificationError) {
      // Log notification error but don't fail the project creation
      // Error handling without console.log for production
    }

    // Fetch the created project with owner information
    const createdProject = await Project.findByPk(project.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!createdProject) {
      throw new Error('Failed to retrieve created project');
    }

    return {
      id: createdProject.id.toString(),
      uuid: createdProject.uuid,
      name: createdProject.name,
      description: createdProject.description,
      status: createdProject.status,
      owner: createdProject.owner ? {
        id: createdProject.owner.id.toString(),
        firstName: createdProject.owner.firstName,
        lastName: createdProject.owner.lastName,
        email: createdProject.owner.email
      } : null,
      isDeleted: createdProject.isDeleted ?? false,
      version: createdProject.version ?? 1,
      createdAt: createdProject.createdAt?.toISOString(),
      updatedAt: createdProject.updatedAt?.toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Clear activity context after operation
    clearActivityContext();
  }
};

/**
 * Update an existing project
 * Requires authentication and proper input validation
 */
export const updateProject = async (
  _: any,
  { id, input }: { id: string; input: { name?: string; description?: string; status?: string; ownerId?: string } },
  context: any
) => {
  try {
    // Set activity context for logged-in user
    if (context.user) {
      setActivityContext({
        id: context.user.id,
        email: context.user.email,
        role: context.user.role
      });
    }

    const projectId = parseInt(id);
    
    // Find the project with owner information
    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.isDeleted) {
      throw new Error('Cannot update deleted project');
    }

    // Store original data for notification comparison
    const originalData = {
      name: project.name,
      description: project.description,
      status: project.status,
      ownerId: project.ownerId,
      ownerName: project.owner ? `${project.owner.firstName} ${project.owner.lastName}` : 'No owner assigned'
    };

    // Update project fields
    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.ownerId !== undefined) updateData.ownerId = input.ownerId ? parseInt(input.ownerId) : null;

    await project.update(updateData);

    // Create notification for project update
    try {
      const changes = [];
      if (input.name && input.name !== originalData.name) {
        changes.push(`name from "${originalData.name}" to "${input.name}"`);
      }
      if (input.description && input.description !== originalData.description) {
        changes.push(`description updated`);
      }
      if (input.status && input.status !== originalData.status) {
        changes.push(`status from "${originalData.status}" to "${input.status}"`);
      }
      if (input.ownerId !== undefined) {
        const newOwnerInfo = input.ownerId ? await User.findByPk(parseInt(input.ownerId)) : null;
        const newOwnerName = newOwnerInfo ? `${newOwnerInfo.firstName} ${newOwnerInfo.lastName}` : 'No owner assigned';
        if (newOwnerName !== originalData.ownerName) {
          changes.push(`owner from "${originalData.ownerName}" to "${newOwnerName}"`);
        }
      }

      if (changes.length > 0) {
        const actorName = context.user ? `${context.user.firstName} ${context.user.lastName}` : 'System';
        const actorRole = context.user ? context.user.role : 'System';
        
        // Only send ONE notification to project owner if exists and different from updater
        // Skip redundant notifications to Admins/PMs as they have full dashboard permissions
        if (project.ownerId && project.ownerId !== context.user?.id) {
          await Notification.create({
            userId: project.ownerId,
            message: `Project "${project.name}" has been updated: ${changes.join(', ')} by ${actorName} (${actorRole})`
          });
        }

        // Send notifications to project members
        await sendNotificationsToProjectMembers(
          project.id,
          `Project "${project.name}" has been updated: ${changes.join(', ')} by ${actorName} (${actorRole})`,
          [context.user?.id, project.ownerId].filter(id => id) // Exclude updater and owner
        );
      }
    } catch (notificationError) {
      // Log notification error but don't fail the project update
      // Error handling without console.log for production
    }

    // Fetch the updated project with owner information
    const updatedProject = await Project.findByPk(projectId, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!updatedProject) {
      throw new Error('Failed to retrieve updated project');
    }

    return {
      id: updatedProject.id.toString(),
      uuid: updatedProject.uuid,
      name: updatedProject.name,
      description: updatedProject.description,
      status: updatedProject.status,
      owner: updatedProject.owner ? {
        id: updatedProject.owner.id.toString(),
        firstName: updatedProject.owner.firstName,
        lastName: updatedProject.owner.lastName,
        email: updatedProject.owner.email
      } : null,
      isDeleted: updatedProject.isDeleted ?? false,
      version: updatedProject.version ?? 1,
      createdAt: updatedProject.createdAt?.toISOString(),
      updatedAt: updatedProject.updatedAt?.toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to update project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Clear activity context after operation
    clearActivityContext();
  }
};

/**
 * Delete a project (soft delete)
 * Requires authentication and proper authorization
 */
export const deleteProject = async (
  _: any,
  { id }: { id: string },
  context: any
) => {
  try {
    // Check if user has admin or project manager role
    if (!context.user || (context.user.role !== 'ADMIN' && context.user.role !== 'Project Manager')) {
      throw new Error('Only administrators and project managers can delete projects');
    }

    // Set activity context for logged-in user
    if (context.user) {
      setActivityContext({
        id: context.user.id,
        email: context.user.email,
        role: context.user.role
      });
    }

    const projectId = parseInt(id);
    
    // Find the project with owner information
    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.isDeleted) {
      throw new Error('Project is already deleted');
    }

    // Store project data for notification before deletion
    const projectData = {
      name: project.name,
      description: project.description,
      status: project.status,
      ownerName: project.owner ? `${project.owner.firstName} ${project.owner.lastName}` : 'No owner assigned'
    };

    // Soft delete project without triggering hooks
    await project.update({ isDeleted: true }, { hooks: false });
    
    // Create notification for project deletion
    try {
      const actorName = context.user ? `${context.user.firstName} ${context.user.lastName}` : 'System';
      const actorRole = context.user ? context.user.role : 'System';
      
      // Only send ONE notification to project owner if exists and different from deleter
      // Skip redundant notifications to Admins/PMs as they have full dashboard permissions
      if (project.ownerId && project.ownerId !== context.user?.id) {
        await Notification.create({
          userId: project.ownerId,
          message: `Project "${projectData.name}" with status "${projectData.status}" has been deleted by ${actorName} (${actorRole})`
        });
      }

      // Send notifications to project members
      await sendNotificationsToProjectMembers(
        project.id,
        `Project "${projectData.name}" with status "${projectData.status}" has been deleted by ${actorName} (${actorRole})`,
        [context.user?.id, project.ownerId].filter(id => id) // Exclude deleter and owner
      );
    } catch (notificationError) {
      // Log notification error but don't fail the project deletion
      // Error handling without console.log for production
    }
    
    // Manually trigger activity logging for deletion
    const { createActivityLog, generateActionDescription, extractEntityName } = await import('../../db/utils/activityLogger');
    await createActivityLog({
      type: 'PROJECT_DELETED',
      action: generateActionDescription('delete', 'project', extractEntityName(project, 'project')),
      targetUserId: project.ownerId || null,
      projectId: project.id,
      metadata: {
        name: project.name,
        description: project.description,
        status: project.status,
        ownerId: project.ownerId
      }
    });

    return true;
  } catch (error) {
    throw new Error(`Failed to delete project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Clear activity context after operation
    clearActivityContext();
  }
};

/**
 * Check project deletion impact
 * Returns deletion impact details for confirmation
 */
export const checkProjectDeletion = async (
  _: any,
  { projectId }: { projectId: string },
  context: any
) => {
  try {
    // Check if user has admin or project manager role
    if (!context.user || (context.user.role !== 'ADMIN' && context.user.role !== 'Project Manager')) {
      throw new Error('Only administrators and project managers can check project deletion impact');
    }

    const projectIdInt = parseInt(projectId);

    // Find project by ID
    const project = await Project.findByPk(projectIdInt);
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.isDeleted) {
      throw new Error('Project is already deleted');
    }

    // Count tasks in the project
    const tasksCount = await Task.count({
      where: { projectId: projectIdInt, isDeleted: false }
    });

    // Count comments on tasks in the project
    const commentsCount = await Comment.count({
      where: { 
        isDeleted: false 
      },
      include: [{
        model: Task,
        as: 'task',
        where: {
          projectId: projectIdInt,
          isDeleted: false
        },
        required: true
      }]
    });

    // Get unique assigned users from tasks in the project
    const assignedUsers = await Task.findAll({
      where: { 
        projectId: projectIdInt, 
        isDeleted: false,
        assignedTo: { [Op.ne]: null }
      },
      attributes: ['assignedTo'],
      include: [{
        model: User,
        as: 'assignedUser',
        attributes: ['id', 'firstName', 'lastName', 'email'],
        required: true
      }],
      group: ['assignedTo'],
      raw: false
    });

    const assignedUsersCount = assignedUsers.length;
    const assignedUsersList = assignedUsers.map(task => 
      `${task.assignedUser?.firstName} ${task.assignedUser?.lastName} (${task.assignedUser?.email})`
    ).join(', ');

    const message = `This will delete the project "${project.name}", ${tasksCount} tasks, ${commentsCount} comments, and affect ${assignedUsersCount} assigned users${assignedUsersList ? `: ${assignedUsersList}` : ''}. This action cannot be undone.`;

    return {
      projectName: project.name,
      tasksCount,
      commentsCount,
      assignedUsersCount,
      assignedUsersList,
      message
    };
  } catch (error) {
    throw new Error(`Failed to check project deletion impact: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Export resolvers object
export const projectManagementResolvers = {
  Query: {
    dashboardProjects: getDashboardProjects,
    checkProjectDeletion
  },
  Mutation: {
    createProject,
    updateProject,
    deleteProject
  }
};
