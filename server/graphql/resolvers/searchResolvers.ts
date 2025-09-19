import { User, Project, Task, sequelize } from '../../db';
import { Op } from 'sequelize';

/**
 * Search Resolvers
 * GraphQL resolvers for searching members, projects, and tasks
 * Follows GraphQL best practices with simple, focused resolvers
 */

/**
 * Search members by name or email with associated projects and tasks
 * If query is provided, searches users table for matching first name, last name, or email
 * If no query provided, returns all active users
 * Includes owned projects and assigned tasks for comprehensive member information
 */
export const searchMembers = async (_: any, { query }: { query?: string }) => {
  try {
    // If no query provided, return all active users
    if (!query || query.trim().length === 0) {
      console.log('No search query provided - returning all active users');
      const allUsers = await User.findAll({
        where: { isDeleted: false },
        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
        include: [
          // Include owned projects with their tasks
          {
            model: Project,
            as: 'ownedProjects',
            attributes: ['id', 'uuid', 'name', 'description', 'status', 'isDeleted'],
            required: false,
            where: { isDeleted: false },
            include: [
              // Include tasks in owned projects
              {
                model: Task,
                as: 'tasks',
                attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'isDeleted'],
                required: false,
                where: { isDeleted: false },
                include: [
                  // Include assigned user for each task
                  {
                    model: User,
                    as: 'assignedUser',
                    attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
                    required: false
                  }
                ]
              }
            ]
          },
          // Include assigned tasks
          {
            model: Task,
            as: 'assignedTasks',
            attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'isDeleted'],
            required: false,
            where: { isDeleted: false },
            include: [
              {
                model: Project,
                as: 'project',
                attributes: ['id', 'uuid', 'name', 'description', 'status', 'isDeleted'],
                required: false,
                where: { isDeleted: false }
              }
            ]
          }
        ],
        limit: 50
      });
      console.log(`Returning ${allUsers.length} active users`);
      return allUsers;
    }

    const searchTerm = query.trim().toLowerCase();
    console.log(`Searching members with term: "${searchTerm}"`);

    // Search for users by first name, last name, or email
    const members = await User.findAll({
      where: {
        isDeleted: false,
        [Op.or]: [
          { firstName: { [Op.like]: `%${searchTerm}%` } },
          { lastName: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
      include: [
        // Include owned projects with their tasks
        {
          model: Project,
          as: 'ownedProjects',
          attributes: ['id', 'uuid', 'name', 'description', 'status', 'isDeleted'],
          required: false,
          where: { isDeleted: false },
          include: [
            // Include tasks in owned projects
            {
              model: Task,
              as: 'tasks',
              attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'isDeleted'],
              required: false,
              where: { isDeleted: false },
              include: [
                // Include assigned user for each task
                {
                  model: User,
                  as: 'assignedUser',
                  attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
                  required: false
                }
              ]
            }
          ]
        },
        // Include assigned tasks
        {
          model: Task,
          as: 'assignedTasks',
          attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'isDeleted'],
          required: false,
          where: { isDeleted: false },
          include: [
            {
              model: Project,
              as: 'project',
              attributes: ['id', 'uuid', 'name', 'description', 'status', 'isDeleted'],
              required: false,
              where: { isDeleted: false }
            }
          ]
        }
      ],
      limit: 50
    });

    console.log(`Found ${members.length} members matching "${searchTerm}"`);
    return members;
  } catch (error) {
    console.error('Error searching members:', error);
    return [];
  }
};

/**
 * Search projects by status filter
 * If statusFilter is provided, returns projects with matching status
 * If no filter provided, returns empty array (no projects to show)
 * Includes owner information and tasks for comprehensive project details
 */
export const searchProjects = async (_: any, { statusFilter }: { statusFilter?: string[] }) => {
  try {
    // If no status filter provided, return empty array
    if (!statusFilter || statusFilter.length === 0) {
      console.log('No project status filter provided - returning empty array');
      return [];
    }

    const whereClause: any = { 
      isDeleted: false,
      status: { [Op.in]: statusFilter }
    };

    console.log(`Searching projects with status filter: ${statusFilter.join(', ')}`);
    console.log('Status filter array:', statusFilter);
    console.log('Where clause:', whereClause);

    const projects = await Project.findAll({
      where: whereClause,
      attributes: ['id', 'uuid', 'name', 'description', 'status', 'isDeleted'],
      include: [
        // Include project owner
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
          required: false
        },
        // Include tasks within the project
        {
          model: Task,
          as: 'tasks',
          attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'isDeleted'],
          required: false,
          where: { isDeleted: false },
          include: [
            // Include assigned user for each task
            {
              model: User,
              as: 'assignedUser',
              attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
              required: false
            }
          ]
        }
      ],
      limit: 50
    });

    console.log(`Found ${projects.length} projects with their tasks`);
    
    // Debug logging to help identify the issue
    let totalTasks = 0;
    projects.forEach(project => {
      if (project.tasks) {
        totalTasks += project.tasks.length;
        console.log(`Project "${project.name}" has ${project.tasks.length} tasks`);
      }
    });
    console.log(`Total tasks across all projects: ${totalTasks}`);
    
    return projects;
  } catch (error) {
    console.error('Error searching projects:', error);
    return [];
  }
};

/**
 * Search tasks by status filter
 * If taskStatusFilter is provided, returns tasks with matching status
 * If no filter provided, returns empty array (no tasks to show)
 * Includes project and assigned user information for comprehensive task details
 */
export const searchTasks = async (_: any, { taskStatusFilter }: { taskStatusFilter?: string[] }) => {
  try {
    // If no task status filter provided, return empty array
    if (!taskStatusFilter || taskStatusFilter.length === 0) {
      console.log('No task status filter provided - returning empty array');
      return [];
    }

    const whereClause: any = { 
      isDeleted: false,
      status: { [Op.in]: taskStatusFilter }
    };

    console.log(`Searching tasks with status filter: ${taskStatusFilter.join(', ')}`);

    const tasks = await Task.findAll({
      where: whereClause,
      attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'isDeleted'],
      include: [
        // Include project with owner information
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'description', 'status', 'isDeleted'],
          required: false,
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
              required: false
            }
          ]
        },
        // Include assigned user
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
          required: false
        }
      ],
      limit: 50
    });

    console.log(`Found ${tasks.length} tasks`);
    
    // Debug logging to help identify the issue
    let tasksWithProjects = 0;
    tasks.forEach(task => {
      if (task.project) {
        tasksWithProjects++;
        console.log(`Task "${task.title}" belongs to project "${task.project.name}"`);
      }
    });
    console.log(`Tasks with projects: ${tasksWithProjects}/${tasks.length}`);
    
    return tasks;
  } catch (error) {
    console.error('Error searching tasks:', error);
    return [];
  }
};

/**
 * Search resolvers for GraphQL
 * Exports all search functions for use in GraphQL schema
 */
export const searchResolvers = {
  Query: {
    searchMembers,
    searchProjects,
    searchTasks,
  },
};