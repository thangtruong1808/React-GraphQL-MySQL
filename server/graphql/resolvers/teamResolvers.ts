import { User, Project, Task, sequelize } from '../../db';
import { QueryTypes } from 'sequelize';

/**
 * Team Resolvers
 * GraphQL resolvers for team member data
 * Follows GraphQL best practices with simple, focused resolvers
 */

/**
 * Map database role values to GraphQL enum values
 */
const mapRoleToEnum = (dbRole: string): string => {
  const roleMapping: { [key: string]: string } = {
    'ADMIN': 'ADMIN',
    'Project Manager (PM)': 'PROJECT_MANAGER_PM',
    'Software Architect': 'SOFTWARE_ARCHITECT',
    'Frontend Developer': 'FRONTEND_DEVELOPER',
    'Backend Developer': 'BACKEND_DEVELOPER',
    'Full-Stack Developer': 'FULL_STACK_DEVELOPER',
    'DevOps Engineer': 'DEVOPS_ENGINEER',
    'QA Engineer': 'QA_ENGINEER',
    'QC Engineer': 'QC_ENGINEER',
    'UX/UI Designer': 'UX_UI_DESIGNER',
    'Business Analyst': 'BUSINESS_ANALYST',
    'Database Administrator': 'DATABASE_ADMINISTRATOR',
    'Technical Writer': 'TECHNICAL_WRITER',
    'Support Engineer': 'SUPPORT_ENGINEER'
  };
  return roleMapping[dbRole] || 'FRONTEND_DEVELOPER'; // Default fallback
};

/**
 * Get all team members with aggregated project and task counts
 * Returns active users with their project ownership count and task assignment count
 * Includes join date for team member display
 */
export const teamMembers = async () => {
  try {
    console.log('Fetching team members with aggregated stats');

    // Use raw SQL query for better performance with aggregated counts
    const teamMembers = await sequelize.query(`
      SELECT 
        u.id,
        u.uuid,
        u.first_name as firstName,
        u.last_name as lastName,
        u.role,
        DATE_FORMAT(u.created_at, '%Y-%m-%d') as joinDate,
        DATE_FORMAT(u.created_at, '%Y-%m-%d') as createdAt,
        COALESCE(project_counts.project_count, 0) as projectCount,
        COALESCE(task_counts.task_count, 0) as taskCount
      FROM users u
      LEFT JOIN (
        SELECT 
          owner_id,
          COUNT(*) as project_count
        FROM projects 
        WHERE is_deleted = false
        GROUP BY owner_id
      ) project_counts ON u.id = project_counts.owner_id
      LEFT JOIN (
        SELECT 
          assigned_to,
          COUNT(*) as task_count
        FROM tasks 
        WHERE is_deleted = false
        GROUP BY assigned_to
      ) task_counts ON u.id = task_counts.assigned_to
      WHERE u.is_deleted = false
      ORDER BY u.created_at DESC
    `, {
      type: QueryTypes.SELECT,
      raw: true
    });

    // Map database roles to GraphQL enum values
    const mappedTeamMembers = teamMembers.map((member: any) => ({
      ...member,
      role: mapRoleToEnum(member.role)
    }));

    console.log(`Found ${mappedTeamMembers.length} team members`);
    return mappedTeamMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
};

/**
 * Team resolvers for GraphQL
 * Exports all team functions for use in GraphQL schema
 */
export const teamResolvers = {
  Query: {
    teamMembers,
  },
};
