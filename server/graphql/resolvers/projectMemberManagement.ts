import { Op, QueryTypes } from 'sequelize';
import { Project, User, ProjectMember, Task, sequelize } from '../../db';

// Setup associations if not already done
// Note: These associations should be set up in the main db index file
// but we include them here as a fallback to ensure they're available

/**
 * Utility function to ensure task assignees are project members with EDITOR role
 * This prevents users from showing as "Task Assignee" instead of proper project members
 */
const ensureTaskAssigneesAreProjectMembers = async (projectId: number) => {
  try {
    // Find all users assigned to tasks in this project who are not project members
    const taskAssignees = await sequelize.query(`
      SELECT DISTINCT u.id as userId
      FROM projects p
      JOIN tasks t ON t.project_id = p.id
      JOIN users u ON u.id = t.assigned_to
      WHERE p.id = :projectId 
        AND p.is_deleted = false
        AND t.is_deleted = false
        AND u.is_deleted = false
        AND t.assigned_to IS NOT NULL
        AND u.id NOT IN (
          SELECT pm.user_id 
          FROM project_members pm 
          WHERE pm.project_id = :projectId 
            AND pm.is_deleted = false
        )
        AND u.id != p.owner_id
    `, {
      type: QueryTypes.SELECT,
      raw: true,
      replacements: { projectId }
    });

    // Add each task assignee as a project member with EDITOR role
    for (const assignee of taskAssignees as any[]) {
      await ProjectMember.create({
        projectId: projectId,
        userId: assignee.userId,
        role: 'EDITOR',
        isDeleted: false
      });
    }
  } catch (error) {
    // Log error but don't fail the main operation
    console.error('Error ensuring task assignees are project members:', error);
  }
};

/**
 * Project Members Management Resolvers
 * Handles CRUD operations for project members management
 * Follows GraphQL best practices with proper error handling
 */

/**
 * Get comprehensive project members (Owner + Project Members + Task Assignees) with search functionality
 * Matches the member counting logic from project detail page for consistency
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

    // Ensure all task assignees are project members with EDITOR role
    await ensureTaskAssigneesAreProjectMembers(projectIdInt);

    // Build search condition for SQL query
    const searchCondition = search && search.trim() 
      ? `AND (u.first_name LIKE '%${search.trim()}%' OR u.last_name LIKE '%${search.trim()}%' OR u.email LIKE '%${search.trim()}%')`
      : '';

    // Validate sort fields
    const allowedSortFields = ['firstName', 'lastName', 'email', 'memberRole', 'createdAt'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'firstName';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

    // Map sort field to SQL column (use column names from SELECT, not table aliases)
    let sortColumn;
    switch (validSortBy) {
      case 'firstName': sortColumn = 'firstName'; break;
      case 'lastName': sortColumn = 'lastName'; break;
      case 'email': sortColumn = 'email'; break;
      case 'memberRole': sortColumn = 'memberRole'; break;
      case 'createdAt': sortColumn = 'created_at'; break;
      default: sortColumn = 'firstName';
    }

    // Get comprehensive members using the same logic as project detail page
    const membersData = await sequelize.query(`
      (
        SELECT 
          u.id,
          u.uuid,
          u.first_name as firstName,
          u.last_name as lastName,
          u.email,
          u.role,
          'OWNER' as memberRole,
          u.created_at,
          NULL as projectMemberRole
        FROM projects p
        JOIN users u ON u.id = p.owner_id
        WHERE p.id = :projectId 
          AND p.is_deleted = false
          AND u.is_deleted = false
          AND p.owner_id IS NOT NULL
          ${searchCondition}
      )
      UNION ALL
      (
        SELECT 
          u.id,
          u.uuid,
          u.first_name as firstName,
          u.last_name as lastName,
          u.email,
          u.role,
          COALESCE(pm.role, 'VIEWER') as memberRole,
          u.created_at,
          pm.role as projectMemberRole
        FROM projects p
        JOIN project_members pm ON pm.project_id = p.id
        JOIN users u ON u.id = pm.user_id
        WHERE p.id = :projectId 
          AND p.is_deleted = false
          AND pm.is_deleted = false
          AND u.is_deleted = false
          AND u.id != p.owner_id
          ${searchCondition}
      )
      UNION ALL
      (
        SELECT 
          u.id,
          u.uuid,
          u.first_name as firstName,
          u.last_name as lastName,
          u.email,
          u.role,
          'ASSIGNEE' as memberRole,
          u.created_at,
          NULL as projectMemberRole
        FROM projects p
        JOIN tasks t ON t.project_id = p.id
        JOIN users u ON u.id = t.assigned_to
        WHERE p.id = :projectId 
          AND p.is_deleted = false
          AND t.is_deleted = false
          AND u.is_deleted = false
          AND t.assigned_to IS NOT NULL
          AND u.id != p.owner_id
          AND u.id NOT IN (
            SELECT pm.user_id 
            FROM project_members pm 
            WHERE pm.project_id = p.id 
              AND pm.is_deleted = false
          )
          ${searchCondition}
      )
      ORDER BY 
        CASE 
          WHEN memberRole = 'OWNER' THEN 1 
          WHEN memberRole = 'EDITOR' THEN 2
          WHEN memberRole = 'VIEWER' THEN 3
          WHEN memberRole = 'ASSIGNEE' THEN 4
          ELSE 5
        END,
        ${sortColumn} ${validSortOrder}
      LIMIT :limit OFFSET :offset
    `, {
      type: QueryTypes.SELECT,
      raw: true,
      replacements: { projectId: projectIdInt, limit, offset }
    });

    // Get total count for pagination (without LIMIT/OFFSET)
    const countData = await sequelize.query(`
      (
        SELECT COUNT(*) as count
        FROM projects p
        JOIN users u ON u.id = p.owner_id
        WHERE p.id = :projectId 
          AND p.is_deleted = false
          AND u.is_deleted = false
          AND p.owner_id IS NOT NULL
          ${searchCondition}
      )
      UNION ALL
      (
        SELECT COUNT(*) as count
        FROM projects p
        JOIN project_members pm ON pm.project_id = p.id
        JOIN users u ON u.id = pm.user_id
        WHERE p.id = :projectId 
          AND p.is_deleted = false
          AND pm.is_deleted = false
          AND u.is_deleted = false
          AND u.id != p.owner_id
          ${searchCondition}
      )
      UNION ALL
      (
        SELECT COUNT(*) as count
        FROM projects p
        JOIN tasks t ON t.project_id = p.id
        JOIN users u ON u.id = t.assigned_to
        WHERE p.id = :projectId 
          AND p.is_deleted = false
          AND t.is_deleted = false
          AND u.is_deleted = false
          AND t.assigned_to IS NOT NULL
          AND u.id != p.owner_id
          AND u.id NOT IN (
            SELECT pm.user_id 
            FROM project_members pm 
            WHERE pm.project_id = p.id 
              AND pm.is_deleted = false
          )
          ${searchCondition}
      )
    `, {
      type: QueryTypes.SELECT,
      raw: true,
      replacements: { projectId: projectIdInt }
    });

    // Calculate total count
    const totalCount = countData.reduce((sum: number, row: any) => sum + parseInt(row.count), 0);
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return {
      members: membersData.map((member: any) => ({
        projectId: projectIdInt.toString(),
        userId: member.id.toString(),
        role: member.projectMemberRole || member.memberRole,
        memberType: member.memberRole,
        createdAt: member.created_at ? new Date(member.created_at).toISOString() : null,
        updatedAt: null, // Not applicable for Owner and Task Assignees
        user: {
          id: member.id.toString(),
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          role: member.role,
        },
        project: {
          id: projectIdInt.toString(),
          name: project.name,
        }
      })),
      paginationInfo: {
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        totalCount,
        currentPage,
        totalPages,
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

    // Check if member already exists (including soft-deleted ones)
    const existingMember = await ProjectMember.findOne({
      where: {
        projectId: projectIdInt,
        userId: userIdInt
      }
    });

    if (existingMember) {
      if (!existingMember.isDeleted) {
        throw new Error('User is already a member of this project');
      }
      
      // If member exists but is soft-deleted, restore them
      await existingMember.update({
        role,
        isDeleted: false
      });
    } else {
      // Create new project member
      await ProjectMember.create({
        projectId: projectIdInt,
        userId: userIdInt,
        role,
        isDeleted: false
      });
    }

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
      memberType: createdMember.role, // For project members, memberType is the same as role
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
      memberType: updatedMember.role, // For project members, memberType is the same as role
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
 * Check if a member has assigned tasks before deletion
 * Returns task count and task details for warning purposes
 */
export const checkMemberTasks = async (
  _: any,
  { projectId, userId }: { projectId: string; userId: string }
) => {
  try {
    const projectIdInt = parseInt(projectId);
    const userIdInt = parseInt(userId);
    
    // Check if user has assigned tasks in this project
    const assignedTasks = await Task.findAll({
      where: {
        projectId: projectIdInt,
        assignedTo: userIdInt,
        isDeleted: false
      },
      attributes: ['id', 'title', 'status'],
      order: [['title', 'ASC']]
    });

    return {
      hasAssignedTasks: assignedTasks.length > 0,
      taskCount: assignedTasks.length,
      tasks: assignedTasks.map(task => ({
        id: task.id.toString(),
        title: task.title,
        status: task.status
      }))
    };
  } catch (error) {
    throw new Error(`Failed to check member tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    availableUsers: getAvailableUsers,
    checkMemberTasks
  },
  Mutation: {
    addProjectMember,
    updateProjectMemberRole: updateProjectMember,
    removeProjectMember
  }
};
