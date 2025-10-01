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
    'Project Manager': 'PROJECT_MANAGER_PM',
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

    return mappedTeamMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
};

/**
 * Get paginated team members with aggregated project and task counts
 * Returns paginated active users with their project ownership count and task assignment count
 * Includes pagination info for load more functionality
 */
export const paginatedTeamMembers = async (_: any, { limit = 12, offset = 0, roleFilter }: { limit?: number; offset?: number; roleFilter?: string }) => {
  try {
    // Convert GraphQL enum role to database role format
    const convertRoleToDatabaseFormat = (graphqlRole: string): string => {
      const roleMapping: { [key: string]: string } = {
        'ADMIN': 'ADMIN',
        'PROJECT_MANAGER_PM': 'Project Manager',
        'SOFTWARE_ARCHITECT': 'Software Architect',
        'FRONTEND_DEVELOPER': 'Frontend Developer',
        'BACKEND_DEVELOPER': 'Backend Developer',
        'FULL_STACK_DEVELOPER': 'Full-Stack Developer',
        'DEVOPS_ENGINEER': 'DevOps Engineer',
        'QA_ENGINEER': 'QA Engineer',
        'QC_ENGINEER': 'QC Engineer',
        'UX_UI_DESIGNER': 'UX/UI Designer',
        'BUSINESS_ANALYST': 'Business Analyst',
        'DATABASE_ADMINISTRATOR': 'Database Administrator',
        'TECHNICAL_WRITER': 'Technical Writer',
        'SUPPORT_ENGINEER': 'Support Engineer'
      };
      return roleMapping[graphqlRole] || graphqlRole;
    };

    // Build role filter condition with proper database role format
    const databaseRole = roleFilter ? convertRoleToDatabaseFormat(roleFilter) : null;
    const roleFilterCondition = databaseRole ? `AND u.role = '${databaseRole}'` : '';
    
    // Get total count for pagination info with role filtering
    const totalCountResult = await sequelize.query(`
      SELECT COUNT(*) as totalCount
      FROM users u
      WHERE u.is_deleted = false ${roleFilterCondition}
    `, {
      type: QueryTypes.SELECT,
      raw: true
    });
    
    const totalCount = parseInt((totalCountResult[0] as any).totalCount) || 0;
    
    // Get paginated team members with aggregated counts and role filtering
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
      WHERE u.is_deleted = false ${roleFilterCondition}
      ORDER BY u.created_at DESC
      LIMIT :limit OFFSET :offset
    `, {
      type: QueryTypes.SELECT,
      raw: true,
      replacements: { limit, offset }
    });

    // Map database roles to GraphQL enum values
    const mappedTeamMembers = teamMembers.map((member: any) => ({
      ...member,
      role: mapRoleToEnum(member.role)
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
      teamMembers: mappedTeamMembers,
      paginationInfo
    };
  } catch (error) {
    console.error('Error fetching paginated team members:', error);
    return {
      teamMembers: [],
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
 * Get team statistics from entire database
 * Returns counts for all team member roles across the entire database
 * Provides database-wide statistics for team composition overview
 */
export const teamStats = async () => {
  try {
    // Get role counts from entire database
    const roleCounts = await sequelize.query(`
      SELECT 
        u.role,
        COUNT(*) as count
      FROM users u
      WHERE u.is_deleted = false
      GROUP BY u.role
    `, {
      type: QueryTypes.SELECT,
      raw: true
    });

    // Initialize counters
    let totalMembers = 0;
    let administrators = 0;
    let projectManagers = 0;
    let developers = 0;
    let architects = 0;
    let specialists = 0;
    
    // Individual role counters
    let frontendDevelopers = 0;
    let backendDevelopers = 0;
    let fullStackDevelopers = 0;
    let softwareArchitects = 0;
    let devopsEngineers = 0;
    let databaseAdministrators = 0;
    let qaEngineers = 0;
    let qcEngineers = 0;
    let uxUiDesigners = 0;
    let businessAnalysts = 0;
    let technicalWriters = 0;
    let supportEngineers = 0;

    // Process role counts and categorize them
    roleCounts.forEach((row: any) => {
      const count = parseInt(row.count) || 0;
      totalMembers += count;

      switch (row.role) {
        case 'ADMIN':
          administrators += count;
          break;
        case 'Project Manager':
          projectManagers += count;
          break;
        case 'Frontend Developer':
          developers += count;
          frontendDevelopers += count;
          break;
        case 'Backend Developer':
          developers += count;
          backendDevelopers += count;
          break;
        case 'Full-Stack Developer':
          developers += count;
          fullStackDevelopers += count;
          break;
        case 'Software Architect':
          architects += count;
          softwareArchitects += count;
          break;
        case 'DevOps Engineer':
          architects += count;
          devopsEngineers += count;
          break;
        case 'Database Administrator':
          architects += count;
          databaseAdministrators += count;
          break;
        case 'QA Engineer':
          specialists += count;
          qaEngineers += count;
          break;
        case 'QC Engineer':
          specialists += count;
          qcEngineers += count;
          break;
        case 'UX/UI Designer':
          specialists += count;
          uxUiDesigners += count;
          break;
        case 'Business Analyst':
          specialists += count;
          businessAnalysts += count;
          break;
        case 'Technical Writer':
          specialists += count;
          technicalWriters += count;
          break;
        case 'Support Engineer':
          specialists += count;
          supportEngineers += count;
          break;
        default:
          // Unknown roles go to specialists as fallback
          specialists += count;
          break;
      }
    });

    return {
      totalMembers,
      administrators,
      projectManagers,
      developers,
      architects,
      specialists,
      frontendDevelopers,
      backendDevelopers,
      fullStackDevelopers,
      softwareArchitects,
      devopsEngineers,
      databaseAdministrators,
      qaEngineers,
      qcEngineers,
      uxUiDesigners,
      businessAnalysts,
      technicalWriters,
      supportEngineers
    };
  } catch (error) {
    console.error('Error fetching team statistics:', error);
    return {
      totalMembers: 0,
      administrators: 0,
      projectManagers: 0,
      developers: 0,
      architects: 0,
      specialists: 0,
      frontendDevelopers: 0,
      backendDevelopers: 0,
      fullStackDevelopers: 0,
      softwareArchitects: 0,
      devopsEngineers: 0,
      databaseAdministrators: 0,
      qaEngineers: 0,
      qcEngineers: 0,
      uxUiDesigners: 0,
      businessAnalysts: 0,
      technicalWriters: 0,
      supportEngineers: 0
    };
  }
};

/**
 * Team resolvers for GraphQL
 * Exports all team functions for use in GraphQL schema
 */
export const teamResolvers = {
  Query: {
    teamMembers,
    paginatedTeamMembers,
    teamStats,
  },
};
