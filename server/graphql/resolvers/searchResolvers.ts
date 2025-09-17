import { User, Project, Task, Comment, sequelize } from '../../db';
import { Op } from 'sequelize';

/**
 * Search Resolvers
 * GraphQL resolvers for searching members, projects, and tasks
 * Follows GraphQL best practices with simple, focused resolvers
 */

/**
 * Search members by name or email with associated projects and tasks
 * Searches users table for matching first name, last name, or email
 * Includes owned projects and assigned tasks for comprehensive member information
 * Handles case-insensitive search and improved full name matching
 */
export const searchMembers = async (_: any, { query }: { query: string }) => {
  try {
    // Debug: Check if there are any users in the database
    const totalUsers = await User.count({ where: { isDeleted: false } });
    console.log(`Total active users in database: ${totalUsers}`);
    
    // If searching for "debug", return all users for debugging
    if (query.toLowerCase() === 'debug') {
      const allUsers = await User.findAll({
        where: { isDeleted: false },
        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
        limit: 50
      });
      console.log('All users for debugging:', allUsers.map(u => `${u.firstName} ${u.lastName} (${u.email})`));
      return allUsers;
    }

    // If searching for "debug-sample", return first 10 users for quick debugging
    if (query.toLowerCase() === 'debug-sample') {
      const sampleUsers = await User.findAll({
        where: { isDeleted: false },
        attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
        limit: 10
      });
      console.log('Sample users for debugging:', sampleUsers.map(u => `${u.firstName} ${u.lastName} (${u.email})`));
      return sampleUsers;
    }

    // If searching for "debug-thang", look specifically for users with "thang" in their name
    if (query.toLowerCase() === 'debug-thang') {
      const thangUsers = await User.findAll({
        where: { 
          isDeleted: false,
          [Op.or]: [
            { firstName: { [Op.like]: '%thang%' } },
            { lastName: { [Op.like]: '%thang%' } },
            { firstName: { [Op.like]: '%Thang%' } },
            { lastName: { [Op.like]: '%Thang%' } }
          ]
        },
        attributes: ['id', 'firstName', 'lastName', 'email', 'role']
      });
      console.log('Users with "thang" in name:', thangUsers.map(u => `${u.firstName} ${u.lastName} (${u.email})`));
      return thangUsers;
    }

    // If searching for "debug-direct", test direct database query
    if (query.toLowerCase() === 'debug-direct') {
      console.log('Testing direct database query...');
      
      // Test 1: Direct query with raw SQL
      const [rawResults] = await sequelize.query(
        "SELECT first_name, last_name, email FROM users WHERE is_deleted = 0 AND (LOWER(first_name) LIKE '%thang%' OR LOWER(last_name) LIKE '%thang%') LIMIT 10"
      );
      console.log('Raw SQL results:', rawResults);
      
      // Test 2: Sequelize query with exact column names
      const sequelizeResults = await User.findAll({
        where: {
          isDeleted: false,
          [Op.or]: [
            sequelize.where(sequelize.fn('LOWER', sequelize.col('User.first_name')), { [Op.like]: '%thang%' }),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('User.last_name')), { [Op.like]: '%thang%' })
          ]
        },
        attributes: ['id', 'firstName', 'lastName', 'email'],
        limit: 10
      });
      console.log('Sequelize results:', sequelizeResults.map(u => `${u.firstName} ${u.lastName} (${u.email})`));
      
      return sequelizeResults;
    }

    // Normalize query for case-insensitive search
    const normalizedQuery = query.trim().toLowerCase();
    const queryParts = normalizedQuery.split(' ').filter(part => part.length > 0);
    
    // Build search conditions using basic Sequelize operators (more reliable)
    const searchConditions = [
      // Search in first name (case-insensitive)
      { firstName: { [Op.like]: `%${normalizedQuery}%` } },
      // Search in last name (case-insensitive)
      { lastName: { [Op.like]: `%${normalizedQuery}%` } },
      // Search in email (case-insensitive)
      { email: { [Op.like]: `%${normalizedQuery}%` } }
    ];

    // Add full name search if query has multiple parts
    if (queryParts.length >= 2) {
      const firstName = queryParts[0];
      const lastName = queryParts[1];
      
      // Search for exact first name and last name combination (case-insensitive)
      searchConditions.push({
        [Op.and]: [
          { firstName: { [Op.like]: `%${firstName}%` } },
          { lastName: { [Op.like]: `%${lastName}%` } }
        ]
      });
      
      // Also try reverse order (last name first, first name last) (case-insensitive)
      searchConditions.push({
        [Op.and]: [
          { firstName: { [Op.like]: `%${lastName}%` } },
          { lastName: { [Op.like]: `%${firstName}%` } }
        ]
      });
    }

    // Search in first name, last name, or email with associated data
    const members = await User.findAll({
      where: {
        isDeleted: false,
        [Op.or]: searchConditions
      },
      attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
      include: [
        // Include all owned projects (complete history - regardless of status)
        {
          model: Project,
          as: 'ownedProjects',
          attributes: ['id', 'uuid', 'name', 'description', 'status', 'isDeleted'],
          required: false,  // No status filtering - show all projects
          separate: false   // Ensure all projects are included
        },
        // Include all assigned tasks (complete history - regardless of status)
        {
          model: Task,
          as: 'assignedTasks',
          attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'isDeleted', 'projectId'],
          required: false,  // No status filtering - show all tasks
          separate: false,  // Ensure all tasks are included
          include: [
            {
              model: Project,
              as: 'project',
              attributes: ['id', 'uuid', 'name', 'description', 'status', 'isDeleted'],
              required: false  // Show all projects even if deleted
            }
          ]
        }
      ],
      order: [['firstName', 'ASC']],
      logging: console.log  // Enable SQL query logging for debugging
    });

    // Debug logging to help troubleshoot search issues
    console.log(`Search query: "${query}" -> normalized: "${normalizedQuery}"`);
    console.log(`Found ${members.length} members`);
    if (members.length > 0) {
      console.log('Members found:', members.map(m => `${m.firstName} ${m.lastName} (${m.email})`));
      
      // Debug: Check task-project relationships for members with tasks
      members.forEach(member => {
        console.log(`\n${member.firstName} ${member.lastName} - Total assigned tasks: ${member.assignedTasks?.length || 0}`);
        if (member.assignedTasks && member.assignedTasks.length > 0) {
          member.assignedTasks.forEach((task, index) => {
            console.log(`  [${index + 1}] Task: "${task.title}" -> Project: "${task.project?.name || 'NO PROJECT'}" (project_id: ${task.projectId || 'NO ID'})`);
          });
        } else {
          console.log(`  No tasks found for ${member.firstName} ${member.lastName}`);
        }
        
        console.log(`\n${member.firstName} ${member.lastName} - Total owned projects: ${member.ownedProjects?.length || 0}`);
        if (member.ownedProjects && member.ownedProjects.length > 0) {
          member.ownedProjects.forEach((project, index) => {
            console.log(`  [${index + 1}] Project: "${project.name}" (id: ${project.id})`);
          });
        } else {
          console.log(`  No projects found for ${member.firstName} ${member.lastName}`);
        }
      });
    }

    // If no results found, try a simpler search approach as fallback
    if (members.length === 0) {
      console.log('No results with complex search, trying simple search...');
      const simpleMembers = await User.findAll({
        where: {
          isDeleted: false,
          [Op.or]: [
            { firstName: { [Op.like]: `%${normalizedQuery}%` } },
            { lastName: { [Op.like]: `%${normalizedQuery}%` } },
            { email: { [Op.like]: `%${normalizedQuery}%` } }
          ]
        },
        attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
        limit: 10
      });
      console.log(`Simple search found ${simpleMembers.length} members`);
      if (simpleMembers.length > 0) {
        console.log('Simple search results:', simpleMembers.map(m => `${m.firstName} ${m.lastName} (${m.email})`));
        return simpleMembers;
      }
    }

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
 * Search tasks by title or description with optional task status filtering
 * Searches tasks table for matching title or description and filters by status if provided
 * Includes full table relationships: project, assigned user, and comments
 */
export const searchTasks = async (_: any, { query, taskStatusFilter }: { query: string; taskStatusFilter?: string[] }) => {
  try {
    // Build where clause for search
    const whereClause: any = {
      isDeleted: false
    };

    // Add text search if query is provided and not empty
    if (query && query.trim().length > 0) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${query.trim()}%` } },
        { description: { [Op.like]: `%${query.trim()}%` } }
      ];
    }

    // Add task status filter if provided
    if (taskStatusFilter && taskStatusFilter.length > 0) {
      whereClause.status = { [Op.in]: taskStatusFilter };
    }

    // Search in task title or description with optional status filter and full relationships
    const tasks = await Task.findAll({
      where: whereClause,
      attributes: ['id', 'uuid', 'title', 'description', 'status', 'priority', 'projectId', 'assignedUserId'],
      include: [
        // Include project information with owner details
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'description', 'status', 'isDeleted'],
          required: true,
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
              required: false
            }
          ]
        },
        // Include assigned user information
        {
          model: User,
          as: 'assignedUser',
          attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role'],
          required: false
        },
        // Include comments with user information
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'uuid', 'content', 'isDeleted'],
          required: false,
          where: { isDeleted: false },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'uuid', 'firstName', 'lastName', 'email'],
              required: false
            }
          ]
        }
      ],
      limit: 20,
      order: [['title', 'ASC']]
    });

    // Debug logging for task search results
    console.log(`Task search query: "${query}" with status filter: ${taskStatusFilter ? taskStatusFilter.join(', ') : 'none'}`);
    console.log(`Found ${tasks.length} tasks`);
    
    if (tasks.length > 0) {
      tasks.forEach((task, index) => {
        console.log(`[${index + 1}] Task: "${task.title}" (${task.status}) -> Project: "${task.project?.name}" -> Assigned to: ${task.assignedUser ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}` : 'Unassigned'} -> Comments: ${task.comments?.length || 0}`);
      });
    }

    return tasks;
  } catch (error) {
    console.error('Error searching tasks:', error);
    return [];
  }
};
