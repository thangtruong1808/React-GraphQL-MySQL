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
          project_id,
          COUNT(*) as member_count
        FROM project_members 
        WHERE is_deleted = false
        GROUP BY project_id
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
        (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id AND pm.is_deleted = false) as memberCount
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
    paginatedProjects,
    projectStatusDistribution,
  },
};
