import { User, Project, Task } from '../../db';
import { Op } from 'sequelize';

/**
 * Search Resolvers
 * GraphQL resolvers for searching members, projects, and tasks
 * Follows GraphQL best practices with simple, focused resolvers
 */

/**
 * Search members by name or email
 * Searches users table for matching first name, last name, or email
 */
export const searchMembers = async (_: any, { query }: { query: string }) => {
  try {
    // Search in first name, last name, or email
    const members = await User.findAll({
      where: {
        isDeleted: false,
        [Op.or]: [
          { firstName: { [Op.like]: `%${query}%` } },
          { lastName: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
          // Search for full name combination
          { 
            [Op.and]: [
              { firstName: { [Op.like]: `%${query.split(' ')[0]}%` } },
              { lastName: { [Op.like]: `%${query.split(' ')[1] || ''}%` } }
            ]
          }
        ]
      },
      attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
      limit: 10,
      order: [['firstName', 'ASC']]
    });

    return members;
  } catch (error) {
    console.error('Error searching members:', error);
    return [];
  }
};

/**
 * Search projects by name or description with optional status filtering
 * Searches projects table for matching name or description and filters by status if provided
 */
export const searchProjects = async (_: any, { query, statusFilter }: { query: string; statusFilter?: string[] }) => {
  try {
    // Build where clause for search
    const whereClause: any = {
      isDeleted: false
    };

    // Add text search if query is provided and not empty
    if (query && query.trim().length > 0) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${query.trim()}%` } },
        { description: { [Op.like]: `%${query.trim()}%` } }
      ];
    }

    // Add status filter if provided
    if (statusFilter && statusFilter.length > 0) {
      whereClause.status = { [Op.in]: statusFilter };
    }

    // Search in project name or description with optional status filter
    const projects = await Project.findAll({
      where: whereClause,
      attributes: ['id', 'uuid', 'name', 'description', 'status'],
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName'],
          required: false
        }
      ],
      limit: 10,
      order: [['name', 'ASC']]
    });

    return projects;
  } catch (error) {
    console.error('Error searching projects:', error);
    return [];
  }
};

/**
 * Search tasks by title or description
 * Searches tasks table for matching title or description
 */
export const searchTasks = async (_: any, { query }: { query: string }) => {
  try {
    // Search in task title or description
    const tasks = await Task.findAll({
      where: {
        isDeleted: false,
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority'],
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name'],
          required: true
        },
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'firstName', 'lastName'],
          required: false
        }
      ],
      limit: 10,
      order: [['title', 'ASC']]
    });

    return tasks;
  } catch (error) {
    console.error('Error searching tasks:', error);
    return [];
  }
};
