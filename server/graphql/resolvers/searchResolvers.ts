import { User, Project, Task, sequelize } from '../../db';
import { Op, QueryTypes } from 'sequelize';

/**
 * Search members by name, email, or role with associated projects and tasks
 * If query is provided, searches users table for matching first name, last name, or email
 * If roleFilter is provided, filters users by specific roles
 * If no query or roleFilter provided, returns all active users
 * Includes owned projects and assigned tasks for comprehensive member information
 */
export const searchMembers = async (_: any, { query, roleFilter }: { query?: string; roleFilter?: string[] }) => {
  try {

    // Build SQL query based on filters
    let sqlQuery = `
      SELECT 
        id,
        uuid,
        first_name as firstName,
        last_name as lastName,
        email,
        role
      FROM users 
      WHERE is_deleted = false
    `;
    
    const conditions: string[] = [];
    const replacements: any = {};
    
    // Add role filter if provided
    if (roleFilter && roleFilter.length > 0) {
      // Map GraphQL enum values to database role strings (from db-schema.txt)
      const mapGraphQLRoleToDBRole = (graphqlRole: string): string => {
        const dbRoleMapping: { [key: string]: string } = {
          'ADMIN': 'ADMIN',
          'PROJECT_MANAGER_PM': 'Project Manager (PM)',
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
        return dbRoleMapping[graphqlRole] || '';
      };
      
      const dbRoles = roleFilter.map(mapGraphQLRoleToDBRole).filter(Boolean);
      
      if (dbRoles.length > 0) {
        const placeholders = dbRoles.map((_, index) => `:role${index}`).join(', ');
        conditions.push(`role IN (${placeholders})`);
        
        dbRoles.forEach((role, index) => {
          replacements[`role${index}`] = role;
        });
      }
    }
    
    // Add text search if provided
    if (query && query.trim().length > 0) {
      conditions.push(`(LOWER(first_name) LIKE :searchTerm OR LOWER(last_name) LIKE :searchTerm OR LOWER(email) LIKE :searchTerm)`);
      replacements.searchTerm = `%${query.trim().toLowerCase()}%`;
    }
    
    // Apply conditions to query
    if (conditions.length > 0) {
      sqlQuery += ` AND ${conditions.join(' AND ')}`;
    }
    
    sqlQuery += ` LIMIT 50`;
    
    // Execute query
    const members = await sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
      raw: true,
      replacements
    });

    // Return results with ID converted to string (role mapping handled by User type resolver)
    return members.map((member: any) => ({
      ...member,
      id: member.id ? member.id.toString() : null
    }));
  } catch (error) {
    console.error('Error searching members:', error);
    return [];
  }
};

/**
 * Search projects by status filter
 * If statusFilter is provided, returns projects with matching status
 * If no filter provided, returns empty array (no projects to show)
 */
export const searchProjects = async (_: any, { statusFilter }: { statusFilter?: string[] }) => {
  try {
    console.log('Searching projects with status filter:', statusFilter);
    
    if (!statusFilter || statusFilter.length === 0) {
      console.log('No status filter provided, returning empty array');
      return [];
    }

    // Map GraphQL status values to database status values
    const dbStatusMapping: { [key: string]: string } = {
      'PLANNING': 'Planning',
      'IN_PROGRESS': 'In Progress',
      'ON_HOLD': 'On Hold',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled'
    };
    
    const dbStatuses = statusFilter.map(status => dbStatusMapping[status]).filter(Boolean);
    console.log('Mapped to database statuses:', dbStatuses);
    
    if (dbStatuses.length === 0) {
      console.log('No valid statuses found, returning empty array');
      return [];
    }
    
    // Build SQL query with status filter
    const placeholders = dbStatuses.map((_, index) => `:status${index}`).join(', ');
    const replacements: any = {};
    dbStatuses.forEach((status, index) => {
      replacements[`status${index}`] = status;
    });
    
    const sqlQuery = `
      SELECT 
        p.id,
        p.uuid,
        p.name,
        p.description,
        p.status,
        p.is_deleted as isDeleted,
        u.id as ownerId,
        u.uuid as ownerUuid,
        u.first_name as ownerFirstName,
        u.last_name as ownerLastName,
        u.email as ownerEmail,
        u.role as ownerRole
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.is_deleted = false 
      AND p.status IN (${placeholders})
      LIMIT 50
    `;
    
    console.log('Executing project status filter query:', sqlQuery);
    console.log('With replacements:', replacements);
    
    const projects = await sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
      raw: true,
      replacements
    });

    console.log(`Found ${projects.length} projects with specified statuses`);
    
    // Map database status values to GraphQL status values
    const mapDBStatusToGraphQLStatus = (dbStatus: string): string => {
      const statusMapping: { [key: string]: string } = {
        'Planning': 'PLANNING',
        'In Progress': 'IN_PROGRESS',
        'On Hold': 'ON_HOLD',
        'Completed': 'COMPLETED',
        'Cancelled': 'CANCELLED'
      };
      return statusMapping[dbStatus] || 'PLANNING';
    };
    
    return projects.map((project: any) => ({
      id: project.id ? project.id.toString() : null,
      uuid: project.uuid,
      name: project.name,
      description: project.description,
      status: mapDBStatusToGraphQLStatus(project.status),
      isDeleted: project.isDeleted,
      owner: project.ownerId ? {
        id: project.ownerId.toString(),
        uuid: project.ownerUuid,
        firstName: project.ownerFirstName,
        lastName: project.ownerLastName,
        email: project.ownerEmail,
        role: project.ownerRole
      } : null
    }));
  } catch (error) {
    console.error('Error searching projects:', error);
    return [];
  }
};

/**
 * Search tasks by status filter
 * If taskStatusFilter is provided, returns tasks with matching status
 * If no filter provided, returns empty array (no tasks to show)
 */
export const searchTasks = async (_: any, { taskStatusFilter }: { taskStatusFilter?: string[] }) => {
  try {
    console.log('Searching tasks with status filter:', taskStatusFilter);
    
    if (!taskStatusFilter || taskStatusFilter.length === 0) {
      console.log('No task status filter provided, returning empty array');
      return [];
    }

    // Map GraphQL status values to database status values
    const dbStatusMapping: { [key: string]: string } = {
      'TODO': 'To Do',
      'IN_PROGRESS': 'In Progress',
      'IN_REVIEW': 'In Review',
      'DONE': 'Done',
      'CANCELLED': 'Cancelled'
    };
    
    const dbStatuses = taskStatusFilter.map(status => dbStatusMapping[status]).filter(Boolean);
    console.log('Mapped to database statuses:', dbStatuses);
    
    if (dbStatuses.length === 0) {
      console.log('No valid statuses found, returning empty array');
      return [];
    }
    
    // Build SQL query with status filter
    const placeholders = dbStatuses.map((_, index) => `:status${index}`).join(', ');
    const replacements: any = {};
    dbStatuses.forEach((status, index) => {
      replacements[`status${index}`] = status;
    });
    
    const sqlQuery = `
      SELECT 
        t.id,
        t.uuid,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.is_deleted as isDeleted,
        p.id as projectId,
        p.uuid as projectUuid,
        p.name as projectName,
        p.description as projectDescription,
        p.status as projectStatus,
        u.id as assignedUserId,
        u.uuid as assignedUserUuid,
        u.first_name as assignedUserFirstName,
        u.last_name as assignedUserLastName,
        u.email as assignedUserEmail,
        u.role as assignedUserRole
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.is_deleted = false 
      AND t.status IN (${placeholders})
      LIMIT 50
    `;
    
    console.log('Executing task status filter query:', sqlQuery);
    console.log('With replacements:', replacements);
    
    const tasks = await sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
      raw: true,
      replacements
    });

    console.log(`Found ${tasks.length} tasks with specified statuses`);
    
    // Map database status values to GraphQL status values
    const mapDBStatusToGraphQLStatus = (dbStatus: string): string => {
      const statusMapping: { [key: string]: string } = {
        'To Do': 'TODO',
        'In Progress': 'IN_PROGRESS',
        'In Review': 'IN_REVIEW',
        'Done': 'DONE',
        'Cancelled': 'CANCELLED'
      };
      return statusMapping[dbStatus] || 'TODO';
    };
    
    const mapDBPriorityToGraphQLPriority = (dbPriority: string): string => {
      const priorityMapping: { [key: string]: string } = {
        'Low': 'LOW',
        'Medium': 'MEDIUM',
        'High': 'HIGH',
        'Critical': 'CRITICAL'
      };
      return priorityMapping[dbPriority] || 'MEDIUM';
    };
    
    return tasks.map((task: any) => ({
      id: task.id ? task.id.toString() : null,
      uuid: task.uuid,
      title: task.title,
      description: task.description,
      status: mapDBStatusToGraphQLStatus(task.status),
      priority: mapDBPriorityToGraphQLPriority(task.priority),
      isDeleted: task.isDeleted,
      project: task.projectId ? {
        id: task.projectId.toString(),
        uuid: task.projectUuid,
        name: task.projectName,
        description: task.projectDescription,
        status: task.projectStatus
      } : null,
      assignedUser: task.assignedUserId ? {
        id: task.assignedUserId.toString(),
        uuid: task.assignedUserUuid,
        firstName: task.assignedUserFirstName,
        lastName: task.assignedUserLastName,
        email: task.assignedUserEmail,
        role: task.assignedUserRole
      } : null
    }));
  } catch (error) {
    console.error('Error searching tasks:', error);
    return [];
  }
};