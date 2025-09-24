import { Project, Task, User, sequelize } from '../../db';
import { QueryTypes } from 'sequelize';

/**
 * Projects Resolver for Public Projects Page
 * Fetches project data with aggregated statistics for public display
 * Includes task counts, member counts, and owner information
 */

export const projects = async () => {
  try {
    console.log('Fetching public projects with aggregated stats');
    
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

    console.log(`Found ${formattedProjects.length} public projects`);
    return formattedProjects;
  } catch (error) {
    console.error('Error fetching public projects:', error);
    return [];
  }
};

export const projectsResolvers = {
  Query: {
    projects,
  },
};
