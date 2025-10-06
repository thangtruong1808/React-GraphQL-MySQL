import { Op } from 'sequelize';
import { Project, User } from '../../db';

/**
 * Project Management Resolvers
 * Handles CRUD operations for project management in dashboard
 * Follows GraphQL best practices with proper error handling
 */

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
  { input }: { input: { name: string; description: string; status: string; ownerId?: string } }
) => {
  try {
    // Create new project
    const project = await Project.create({
      name: input.name,
      description: input.description,
      status: input.status,
      ownerId: input.ownerId ? parseInt(input.ownerId) : null,
      isDeleted: false,
      version: 1
    });

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
  }
};

/**
 * Update an existing project
 * Requires authentication and proper input validation
 */
export const updateProject = async (
  _: any,
  { id, input }: { id: string; input: { name?: string; description?: string; status?: string; ownerId?: string } }
) => {
  try {
    const projectId = parseInt(id);
    
    // Find the project
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.isDeleted) {
      throw new Error('Cannot update deleted project');
    }

    // Update project fields
    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.ownerId !== undefined) updateData.ownerId = input.ownerId ? parseInt(input.ownerId) : null;

    await project.update(updateData);

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
  }
};

/**
 * Delete a project (soft delete)
 * Requires authentication and proper authorization
 */
export const deleteProject = async (
  _: any,
  { id }: { id: string }
) => {
  try {
    const projectId = parseInt(id);
    
    // Find the project
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.isDeleted) {
      throw new Error('Project is already deleted');
    }

    // Soft delete the project
    await project.update({ isDeleted: true });

    return true;
  } catch (error) {
    throw new Error(`Failed to delete project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Export resolvers object
export const projectManagementResolvers = {
  Query: {
    dashboardProjects: getDashboardProjects
  },
  Mutation: {
    createProject,
    updateProject,
    deleteProject
  }
};
