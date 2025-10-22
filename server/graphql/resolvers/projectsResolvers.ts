import { Project, Task, User, sequelize } from '../../db';
import { QueryTypes } from 'sequelize';

/**
 * Projects Resolver for Public Projects Page
 * Fetches project data with aggregated statistics for public display
 * Includes task counts, member counts, and owner information
 */

export const projects = async () => {
  try {
    // Fetch all public projects with aggregated stats
    
    const projectsData = await sequelize.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.status,
        DATE_FORMAT(p.created_at, '%Y-%m-%d') as createdAt,
        u.first_name as ownerFirstName,
        u.last_name as ownerLastName,
        COALESCE(task_counts.task_count, 0) as taskCount,
        COALESCE(member_counts.member_count, 0) as memberCount
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      LEFT JOIN (
        SELECT 
          project_id,
          COUNT(*) as task_count
        FROM tasks 
        WHERE is_deleted = false
        GROUP BY project_id
      ) task_counts ON p.id = task_counts.project_id
      LEFT JOIN (
        SELECT 
          p.id as project_id,
          (
            CASE WHEN p.owner_id IS NOT NULL THEN 1 ELSE 0 END +
            (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id AND pm.is_deleted = false) +
            (SELECT COUNT(DISTINCT t.assigned_to) FROM tasks t 
             WHERE t.project_id = p.id AND t.is_deleted = false AND t.assigned_to IS NOT NULL 
             AND t.assigned_to != p.owner_id 
             AND t.assigned_to NOT IN (
               SELECT pm2.user_id FROM project_members pm2 
               WHERE pm2.project_id = p.id AND pm2.is_deleted = false
             )
            )
          ) as member_count
        FROM projects p
        WHERE p.is_deleted = false
      ) member_counts ON p.id = member_counts.project_id
      WHERE p.is_deleted = false
      ORDER BY p.created_at DESC
    `, {
      type: QueryTypes.SELECT,
      raw: true
    });

    const formattedProjects = projectsData.map((project: any) => ({
      id: project.id.toString(),
      name: project.name,
      description: project.description,
      status: project.status,
      taskCount: parseInt(project.taskCount) || 0,
      memberCount: parseInt(project.memberCount) || 0,
      createdAt: project.createdAt,
      owner: {
        firstName: project.ownerFirstName || 'Unknown',
        lastName: project.ownerLastName || 'Owner'
      }
    }));

    return formattedProjects;
  } catch (error) {
    console.error('Error fetching public projects:', error);
    return [];
  }
};

/**
 * Paginated Projects Resolver for Infinite Scroll
 * Fetches paginated project data with aggregated statistics
 * Returns projects with pagination metadata for infinite scroll support
 */
export const paginatedProjects = async (_: any, { limit = 12, offset = 0, statusFilter }: { limit?: number; offset?: number; statusFilter?: string }) => {
  try {
    // Build status filter condition
    const statusFilterCondition = statusFilter ? `AND p.status = '${statusFilter}'` : '';
    
    // Get total count for pagination info with status filtering
    const totalCountResult = await sequelize.query(`
      SELECT COUNT(*) as totalCount
      FROM projects p
      WHERE p.is_deleted = false ${statusFilterCondition}
    `, {
      type: QueryTypes.SELECT,
      raw: true
    });
    
    const totalCount = parseInt((totalCountResult[0] as any).totalCount) || 0;
    
    // Fetch paginated projects with simplified query for better performance
    const projectsData = await sequelize.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.status,
        DATE_FORMAT(p.created_at, '%Y-%m-%d') as createdAt,
        u.first_name as ownerFirstName,
        u.last_name as ownerLastName,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.is_deleted = false) as taskCount,
        (
          CASE WHEN p.owner_id IS NOT NULL THEN 1 ELSE 0 END +
          (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id AND pm.is_deleted = false) +
          (SELECT COUNT(DISTINCT t.assigned_to) FROM tasks t 
           WHERE t.project_id = p.id AND t.is_deleted = false AND t.assigned_to IS NOT NULL 
           AND t.assigned_to != p.owner_id 
           AND t.assigned_to NOT IN (
             SELECT pm2.user_id FROM project_members pm2 
             WHERE pm2.project_id = p.id AND pm2.is_deleted = false
           )
          )
        ) as memberCount
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.is_deleted = false ${statusFilterCondition}
      ORDER BY p.created_at DESC
      LIMIT :limit OFFSET :offset
    `, {
      type: QueryTypes.SELECT,
      raw: true,
      replacements: { limit, offset }
    });

    const formattedProjects = projectsData.map((project: any) => ({
      id: project.id.toString(),
      name: project.name,
      description: project.description,
      status: project.status,
      taskCount: parseInt(project.taskCount) || 0,
      memberCount: parseInt(project.memberCount) || 0,
      createdAt: project.createdAt,
      owner: {
        firstName: project.ownerFirstName || 'Unknown',
        lastName: project.ownerLastName || 'Owner'
      }
    }));

    // Calculate pagination info
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = offset + limit < totalCount;
    const hasPreviousPage = offset > 0;

    const paginationInfo = {
      hasNextPage,
      hasPreviousPage,
      totalCount,
      currentPage,
      totalPages
    };

    return {
      projects: formattedProjects,
      paginationInfo
    };
  } catch (error) {
    console.error('Error fetching paginated projects:', error);
    return {
      projects: [],
      paginationInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalCount: 0,
        currentPage: 1,
        totalPages: 0
      }
    };
  }
};

/**
 * Single Project Resolver
 * Fetches detailed project information by ID including owner, tasks, and members
 */
export const project = async (_: any, { id }: { id: string }) => {
  try {
    // Find the project by ID
    const projectData = await Project.findByPk(parseInt(id), {
      where: { isDeleted: false },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
          required: false
        },
        {
          model: Task,
          as: 'tasks',
          attributes: ['id', 'uuid', 'title', 'status', 'priority', 'dueDate'],
          required: false,
          where: { isDeleted: false },
          include: [
            {
              model: User,
              as: 'assignedUser',
              attributes: ['firstName', 'lastName'],
              required: false
            }
          ]
        }
      ]
    });

    if (!projectData) {
      return null;
    }

    // Fetch all team members (project owner + project members + task assignees) with roles using UNION
    const membersData = await sequelize.query(`
      (
        SELECT 
          u.id,
          u.uuid,
          u.first_name as firstName,
          u.last_name as lastName,
          u.email,
          u.role,
          'OWNER' as memberRole
        FROM projects p
        JOIN users u ON u.id = p.owner_id
        WHERE p.id = :projectId 
          AND p.is_deleted = false
          AND u.is_deleted = false
          AND p.owner_id IS NOT NULL
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
          COALESCE(pm.role, 'VIEWER') as memberRole
        FROM projects p
        JOIN project_members pm ON pm.project_id = p.id
        JOIN users u ON u.id = pm.user_id
        WHERE p.id = :projectId 
          AND p.is_deleted = false
          AND pm.is_deleted = false
          AND u.is_deleted = false
          AND u.id != p.owner_id
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
          'ASSIGNEE' as memberRole
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
      )
      ORDER BY 
        CASE 
          WHEN memberRole = 'OWNER' THEN 1 
          WHEN memberRole = 'EDITOR' THEN 2
          WHEN memberRole = 'VIEWER' THEN 3
          WHEN memberRole = 'ASSIGNEE' THEN 4
          ELSE 5
        END,
        firstName, lastName
    `, {
      type: QueryTypes.SELECT,
      raw: true,
      replacements: { projectId: parseInt(id) }
    });

    // Format the response
    const formattedProject = {
      id: projectData.id.toString(),
      uuid: projectData.uuid,
      name: projectData.name,
      description: projectData.description,
      status: projectData.status,
      owner: projectData.owner ? {
        id: projectData.owner.id.toString(),
        firstName: projectData.owner.firstName,
        lastName: projectData.owner.lastName,
        email: projectData.owner.email,
        role: projectData.owner.role
      } : null,
      createdAt: projectData.createdAt,
      updatedAt: projectData.updatedAt,
      tasks: projectData.tasks?.map((task: any) => ({
        id: task.id.toString(),
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignedUser: task.assignedUser ? {
          firstName: task.assignedUser.firstName,
          lastName: task.assignedUser.lastName
        } : null
      })) || [],
      members: membersData.map((member: any) => ({
        id: member.id.toString(),
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        role: member.role,
        memberRole: member.memberRole
      }))
    };

    return formattedProject;
  } catch (error) {
    console.error('Error fetching single project:', error);
    return null;
  }
};

/**
 * Project Status Distribution Resolver
 * Fetches project status counts from entire database for statistics
 */
export const projectStatusDistribution = async () => {
  try {
    const result = await sequelize.query(`
      SELECT 
        SUM(CASE WHEN status = 'PLANNING' THEN 1 ELSE 0 END) as planning,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed
      FROM projects 
      WHERE is_deleted = false
    `, {
      type: QueryTypes.SELECT,
      raw: true
    });

    const counts = result[0] as any;
    return {
      planning: parseInt(counts.planning) || 0,
      inProgress: parseInt(counts.inProgress) || 0,
      completed: parseInt(counts.completed) || 0
    };
  } catch (error) {
    // Return default values on error
    return {
      planning: 0,
      inProgress: 0,
      completed: 0
    };
  }
};

export const projectsResolvers = {
  Query: {
    projects,
    project,
    paginatedProjects,
    projectStatusDistribution,
  },
};
