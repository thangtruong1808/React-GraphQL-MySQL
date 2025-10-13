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
      // Use role filter values directly since we now use String instead of enum
      const dbRoles = roleFilter.filter(Boolean);
      
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
    
    // Order by created_at for consistent results
    sqlQuery += ` ORDER BY created_at ASC`;
    
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
    if (!statusFilter || statusFilter.length === 0) {
      return [];
    }

    // Map GraphQL status values to database status values (database stores enum values directly)
    const dbStatusMapping: { [key: string]: string } = {
      'PLANNING': 'PLANNING',
      'IN_PROGRESS': 'IN_PROGRESS',
      'COMPLETED': 'COMPLETED'
    };
    
    const dbStatuses = statusFilter.map(status => dbStatusMapping[status]).filter(Boolean);
    
    if (dbStatuses.length === 0) {
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
      ORDER BY p.created_at ASC
    `;
    
    
    const projects = await sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
      raw: true,
      replacements
    });

    
    // Map database status values to GraphQL status values (database stores enum values directly)
    const mapDBStatusToGraphQLStatus = (dbStatus: string): string => {
      const statusMapping: { [key: string]: string } = {
        'PLANNING': 'PLANNING',
        'IN_PROGRESS': 'IN_PROGRESS',
        'COMPLETED': 'COMPLETED'
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
    
    if (!taskStatusFilter || taskStatusFilter.length === 0) {
      return [];
    }

    // Map GraphQL status values to database status values (database stores enum values directly)
    const dbStatusMapping: { [key: string]: string } = {
      'TODO': 'TODO',
      'IN_PROGRESS': 'IN_PROGRESS',
      'DONE': 'DONE'
    };
    
    const dbStatuses = taskStatusFilter.map(status => dbStatusMapping[status]).filter(Boolean);
    
    if (dbStatuses.length === 0) {
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
        p.is_deleted as projectIsDeleted,
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
      ORDER BY t.created_at ASC
    `;
    
    const tasks = await sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
      raw: true,
      replacements
    });
    
    // Map database status values to GraphQL status values (database stores enum values directly)
    const mapDBStatusToGraphQLStatus = (dbStatus: string): string => {
      const statusMapping: { [key: string]: string } = {
        'TODO': 'TODO',
        'IN_PROGRESS': 'IN_PROGRESS',
        'DONE': 'DONE'
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
        status: task.projectStatus,
        isDeleted: task.projectIsDeleted
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