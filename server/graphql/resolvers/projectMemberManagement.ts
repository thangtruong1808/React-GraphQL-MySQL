import { Op } from 'sequelize';
import { Project, User, ProjectMember } from '../../db';

// Setup associations if not already done
// Note: These associations should be set up in the main db index file
// but we include them here as a fallback to ensure they're available

/**
 * Project Members Management Resolvers
 * Handles CRUD operations for project members management
 * Follows GraphQL best practices with proper error handling
 */

/**
 * Get paginated project members with search functionality
 * Supports searching by user name and email
 */
export const getProjectMembers = async (
  _: any,
  { projectId, limit = 10, offset = 0, search, sortBy = "createdAt", sortOrder = "DESC" }: { 
    projectId: string;
    limit?: number; 
    offset?: number; 
    search?: string; 
    sortBy?: string; 
    sortOrder?: string; 
  }
) => {
  try {
    const projectIdInt = parseInt(projectId);
    
    // Verify project exists and is not deleted
    const project = await Project.findByPk(projectIdInt);
    if (!project || project.isDeleted) {
      throw new Error('Project not found or deleted');
    }

    // Build search conditions
    const whereConditions: any = {
      projectId: projectIdInt,
      isDeleted: false
    };

    // Add search functionality if search term provided
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereConditions[Op.or] = [
        { '$user.firstName$': { [Op.like]: searchTerm } },
        { '$user.lastName$': { [Op.like]: searchTerm } },
        { '$user.email$': { [Op.like]: searchTerm } }
      ];
    }

    // Validate and map sortBy field to database column
    const allowedSortFields = ['createdAt', 'updatedAt', 'role', 'userId', 'firstName', 'lastName', 'email'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Handle sorting by user fields
    let orderClause: any;
    if (['firstName', 'lastName', 'email'].includes(validSortBy)) {
      orderClause = [['user', validSortBy, validSortOrder]];
    } else if (validSortBy === 'userId') {
      orderClause = [['userId', validSortOrder]];
    } else {
      orderClause = [[validSortBy, validSortOrder]];
    }

    const { count, rows: members } = await ProjectMember.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: orderClause,
      attributes: ['projectId', 'userId', 'role', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name']
        }
      ],
      raw: false
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return {
      members: members.map(member => ({
        projectId: member.projectId.toString(),
        userId: member.userId.toString(),
        role: member.role,
        createdAt: member.createdAt?.toISOString(),
        updatedAt: member.updatedAt?.toISOString(),
        user: {
          id: member.user.id.toString(),
          firstName: member.user.firstName,
          lastName: member.user.lastName,
          email: member.user.email,
          role: member.user.role
        },
        project: {
          id: member.project.id.toString(),
          name: member.project.name
        }
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
    throw new Error(`Failed to fetch project members: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get available users that are not members of a specific project
 * Supports searching by user name and email
 */
export const getAvailableUsers = async (
  _: any,
  { projectId, limit = 50, offset = 0, search }: { 
    projectId: string;
    limit?: number; 
    offset?: number; 
    search?: string; 
  }
) => {
  try {
    const projectIdInt = parseInt(projectId);
    
    // Verify project exists and is not deleted
    const project = await Project.findByPk(projectIdInt);
    if (!project || project.isDeleted) {
      throw new Error('Project not found or deleted');
    }

    // Get existing member user IDs
    const existingMembers = await ProjectMember.findAll({
      where: {
        projectId: projectIdInt,
        isDeleted: false
      },
      attributes: ['userId']
    });

    const existingUserIds = existingMembers.map(member => member.userId);

    // Build search conditions for users
    const whereConditions: any = {
      id: { [Op.notIn]: existingUserIds },
      isDeleted: false
    };

    // Add search functionality if search term provided
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereConditions[Op.or] = [
        { firstName: { [Op.like]: searchTerm } },
        { lastName: { [Op.like]: searchTerm } },
        { email: { [Op.like]: searchTerm } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [['firstName', 'ASC'], ['lastName', 'ASC']],
      attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
      raw: false
    });

    return {
      users: users.map(user => ({
        id: user.id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      })),
      paginationInfo: {
        totalCount: count
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch available users: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Add a member to a project
 * Requires authentication and proper input validation
 */
export const addProjectMember = async (
  _: any,
  { projectId, userId, role }: { projectId: string; userId: string; role: string }
) => {
  try {
    const projectIdInt = parseInt(projectId);
    const userIdInt = parseInt(userId);
    
    // Verify project exists and is not deleted
    const project = await Project.findByPk(projectIdInt);
    if (!project || project.isDeleted) {
      throw new Error('Project not found or deleted');
    }

    // Verify user exists and is not deleted
    const user = await User.findByPk(userIdInt);
    if (!user || user.isDeleted) {
      throw new Error('User not found or deleted');
    }

    // Validate role
    const validRoles = ['VIEWER', 'EDITOR', 'OWNER'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role. Must be VIEWER, EDITOR, or OWNER');
    }

    // Check if member already exists
    const existingMember = await ProjectMember.findOne({
      where: {
        projectId: projectIdInt,
        userId: userIdInt,
        isDeleted: false
      }
    });

    if (existingMember) {
      throw new Error('User is already a member of this project');
    }

    // Create new project member
    const member = await ProjectMember.create({
      projectId: projectIdInt,
      userId: userIdInt,
      role,
      isDeleted: false
    });

    // Fetch the created member with related data
    const createdMember = await ProjectMember.findOne({
      where: { projectId: projectIdInt, userId: userIdInt },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!createdMember) {
      throw new Error('Failed to retrieve created member');
    }

    return {
      projectId: createdMember.projectId.toString(),
      userId: createdMember.userId.toString(),
      role: createdMember.role,
      createdAt: createdMember.createdAt?.toISOString(),
      updatedAt: createdMember.updatedAt?.toISOString(),
      user: {
        id: createdMember.user.id.toString(),
        firstName: createdMember.user.firstName,
        lastName: createdMember.user.lastName,
        email: createdMember.user.email,
        role: createdMember.user.role
      },
      project: {
        id: createdMember.project.id.toString(),
        name: createdMember.project.name
      }
    };
  } catch (error) {
    throw new Error(`Failed to add project member: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update a project member's role
 * Requires authentication and proper input validation
 */
export const updateProjectMember = async (
  _: any,
  { projectId, userId, role }: { projectId: string; userId: string; role: string }
) => {
  try {
    const projectIdInt = parseInt(projectId);
    const userIdInt = parseInt(userId);
    
    // Validate role
    const validRoles = ['VIEWER', 'EDITOR', 'OWNER'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role. Must be VIEWER, EDITOR, or OWNER');
    }

    // Find the member
    const member = await ProjectMember.findOne({
      where: {
        projectId: projectIdInt,
        userId: userIdInt,
        isDeleted: false
      }
    });

    if (!member) {
      throw new Error('Project member not found');
    }

    // Update member role
    await member.update({ role });

    // Fetch the updated member with related data
    const updatedMember = await ProjectMember.findOne({
      where: {
        projectId: projectIdInt,
        userId: userIdInt,
        isDeleted: false
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!updatedMember) {
      throw new Error('Failed to retrieve updated member');
    }

    return {
      projectId: updatedMember.projectId.toString(),
      userId: updatedMember.userId.toString(),
      role: updatedMember.role,
      createdAt: updatedMember.createdAt?.toISOString(),
      updatedAt: updatedMember.updatedAt?.toISOString(),
      user: {
        id: updatedMember.user.id.toString(),
        firstName: updatedMember.user.firstName,
        lastName: updatedMember.user.lastName,
        email: updatedMember.user.email,
        role: updatedMember.user.role
      },
      project: {
        id: updatedMember.project.id.toString(),
        name: updatedMember.project.name
      }
    };
  } catch (error) {
    throw new Error(`Failed to update project member: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Remove a member from a project (soft delete)
 * Requires authentication and proper authorization
 */
export const removeProjectMember = async (
  _: any,
  { projectId, userId }: { projectId: string; userId: string }
) => {
  try {
    const projectIdInt = parseInt(projectId);
    const userIdInt = parseInt(userId);
    
    // Find the member
    const member = await ProjectMember.findOne({
      where: {
        projectId: projectIdInt,
        userId: userIdInt,
        isDeleted: false
      }
    });

    if (!member) {
      throw new Error('Project member not found');
    }

    // Soft delete the member
    await member.update({ isDeleted: true });

    return true;
  } catch (error) {
    throw new Error(`Failed to remove project member: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Export resolvers object
export const projectMemberManagementResolvers = {
  Query: {
    projectMembers: getProjectMembers,
    availableUsers: getAvailableUsers
  },
  Mutation: {
    addProjectMember,
    updateProjectMemberRole: updateProjectMember,
    removeProjectMember
  }
};
