import { Op } from 'sequelize';
import { User, Project, Task, ActivityLog, Comment, TaskLike, sequelize } from '../../db';
import { ProjectLike, CommentLike } from '../../db';

/**
 * Public Statistics Resolver
 * Provides public dashboard statistics without authentication
 * Calculates real-time data from database using Sequelize models
 */

export interface PublicStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  totalComments: number;
  commentsOnCompletedTasks: number;
  commentsOnInProgressTasks: number;
  commentsOnTodoTasks: number;
  totalUsers: number;
  recentActivity: number;
  averageProjectCompletion: number;
  likesOnCompletedTasks: number;
  likesOnInProgressTasks: number;
  likesOnTodoTasks: number;
  tasksWithLikesCompleted: Array<{ taskName: string; likeCount: number }>;
  tasksWithLikesInProgress: Array<{ taskName: string; likeCount: number }>;
  tasksWithLikesTodo: Array<{ taskName: string; likeCount: number }>;
  // Project likes data by status
  likesOnCompletedProjects: number;
  likesOnActiveProjects: number;
  likesOnPlanningProjects: number;
  projectsWithLikesCompleted: Array<{ projectName: string; likeCount: number }>;
  projectsWithLikesActive: Array<{ projectName: string; likeCount: number }>;
  projectsWithLikesPlanning: Array<{ projectName: string; likeCount: number }>;
  // Comment likes data by task status
  likesOnCommentsOnCompletedTasks: number;
  likesOnCommentsOnInProgressTasks: number;
  likesOnCommentsOnTodoTasks: number;
  commentsWithLikesOnCompletedTasks: Array<{ commentContent: string; likeCount: number }>;
  commentsWithLikesOnInProgressTasks: Array<{ commentContent: string; likeCount: number }>;
  commentsWithLikesOnTodoTasks: Array<{ commentContent: string; likeCount: number }>;
}

/**
 * Calculate public statistics from database using Sequelize models
 * Uses actual data from projects, tasks, users, and activity_logs tables
 */
export const calculatePublicStats = async (): Promise<PublicStats> => {
  try {
    // Get total projects count (excluding deleted)
    const totalProjects = await Project.count({
      where: { isDeleted: false }
    });

    // Get active projects count (IN_PROGRESS status)
    const activeProjects = await Project.count({
      where: { 
        status: 'IN_PROGRESS',
        isDeleted: false 
      }
    });

    // Get completed projects count (COMPLETED status)
    const completedProjects = await Project.count({
      where: { 
        status: 'COMPLETED',
        isDeleted: false 
      }
    });

    // Get total tasks count (excluding deleted)
    const totalTasks = await Task.count({
      where: { isDeleted: false }
    });

    // Get completed tasks count (DONE status)
    const completedTasks = await Task.count({
      where: { 
        status: 'DONE',
        isDeleted: false 
      }
    });

    // Get in progress tasks count (IN_PROGRESS status)
    const inProgressTasks = await Task.count({
      where: { 
        status: 'IN_PROGRESS',
        isDeleted: false 
      }
    });

    // Get todo tasks count (TODO status)
    const todoTasks = await Task.count({
      where: { 
        status: 'TODO',
        isDeleted: false 
      }
    });

    // Get total comments count (excluding deleted)
    const totalComments = await Comment.count({
      where: { isDeleted: false }
    });

    // Get comments on completed tasks using raw SQL to avoid association issues
    const commentsOnCompletedTasksResult = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM comments c
      INNER JOIN tasks t ON c.task_id = t.id
      WHERE c.is_deleted = false 
        AND t.status = 'DONE' 
        AND t.is_deleted = false
    `, { type: sequelize.QueryTypes.SELECT });
    const commentsOnCompletedTasks = parseInt((commentsOnCompletedTasksResult[0] as any).count);

    // Get comments on in progress tasks using raw SQL
    const commentsOnInProgressTasksResult = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM comments c
      INNER JOIN tasks t ON c.task_id = t.id
      WHERE c.is_deleted = false 
        AND t.status = 'IN_PROGRESS' 
        AND t.is_deleted = false
    `, { type: sequelize.QueryTypes.SELECT });
    const commentsOnInProgressTasks = parseInt((commentsOnInProgressTasksResult[0] as any).count);

    // Get comments on todo tasks using raw SQL
    const commentsOnTodoTasksResult = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM comments c
      INNER JOIN tasks t ON c.task_id = t.id
      WHERE c.is_deleted = false 
        AND t.status = 'TODO' 
        AND t.is_deleted = false
    `, { type: sequelize.QueryTypes.SELECT });
    const commentsOnTodoTasks = parseInt((commentsOnTodoTasksResult[0] as any).count);

    // Get total users count (excluding deleted)
    const totalUsers = await User.count({
      where: { isDeleted: false }
    });

    // Get recent activity count (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = await ActivityLog.count({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      }
    });

    // Calculate average project completion rate
    // Based on completed projects vs total projects
    const averageProjectCompletion = totalProjects > 0 
      ? Math.round((completedProjects / totalProjects) * 100) 
      : 0;

    // Get likes on completed tasks with task information
    const completedTasksLikes = await TaskLike.findAll({
      include: [{
        model: Task,
        as: 'task',
        attributes: ['title'],
        where: { 
          status: 'DONE',
          isDeleted: false 
        },
        required: true
      }, {
        model: User,
        as: 'user',
        where: { isDeleted: false },
        required: true
      }],
      order: [['createdAt', 'DESC']] // Order by most recent likes first
    });

    // Get likes on in progress tasks with task information
    const inProgressTasksLikes = await TaskLike.findAll({
      include: [{
        model: Task,
        as: 'task',
        attributes: ['title'],
        where: { 
          status: 'IN_PROGRESS',
          isDeleted: false 
        },
        required: true
      }, {
        model: User,
        as: 'user',
        where: { isDeleted: false },
        required: true
      }],
      order: [['createdAt', 'DESC']] // Order by most recent likes first
    });

    // Get likes on todo tasks with task information
    const todoTasksLikes = await TaskLike.findAll({
      include: [{
        model: Task,
        as: 'task',
        attributes: ['title'],
        where: { 
          status: 'TODO',
          isDeleted: false 
        },
        required: true
      }, {
        model: User,
        as: 'user',
        where: { isDeleted: false },
        required: true
      }],
      order: [['createdAt', 'DESC']] // Order by most recent likes first
    });

    // Count total likes for each task status from task_likes table using direct count queries
    // This ensures we're counting actual likes from the database, not reusing task counts
    const likesOnCompletedTasksCount = await TaskLike.count({
      include: [{
        model: Task,
        as: 'task',
        where: { 
          status: 'DONE',
          isDeleted: false 
        },
        required: true
      }]
    });

    const likesOnInProgressTasksCount = await TaskLike.count({
      include: [{
        model: Task,
        as: 'task',
        where: { 
          status: 'IN_PROGRESS',
          isDeleted: false 
        },
        required: true
      }]
    });

    const likesOnTodoTasksCount = await TaskLike.count({
      include: [{
        model: Task,
        as: 'task',
        where: { 
          status: 'TODO',
          isDeleted: false 
        },
        required: true
      }]
    });

    // Use the direct count results to ensure accuracy
    const likesOnCompletedTasks = likesOnCompletedTasksCount;
    const likesOnInProgressTasks = likesOnInProgressTasksCount;
    const likesOnTodoTasks = likesOnTodoTasksCount;

    // Verification: likes counts are now explicitly calculated from task_likes table
    // Each count represents actual like records in the database, not task counts

    // Count likes per task name for each task status
    const tasksWithLikesCompleted = completedTasksLikes.reduce((acc, like) => {
      const taskName = like.task?.title?.trim();
      if (taskName) {
        const existing = acc.find(t => t.taskName === taskName);
        if (existing) {
          existing.likeCount += 1;
        } else {
          acc.push({ taskName, likeCount: 1 });
        }
      }
      return acc;
    }, [] as Array<{ taskName: string; likeCount: number }>);

    const tasksWithLikesInProgress = inProgressTasksLikes.reduce((acc, like) => {
      const taskName = like.task?.title?.trim();
      if (taskName) {
        const existing = acc.find(t => t.taskName === taskName);
        if (existing) {
          existing.likeCount += 1;
        } else {
          acc.push({ taskName, likeCount: 1 });
        }
      }
      return acc;
    }, [] as Array<{ taskName: string; likeCount: number }>);

    const tasksWithLikesTodo = todoTasksLikes.reduce((acc, like) => {
      const taskName = like.task?.title?.trim();
      if (taskName) {
        const existing = acc.find(t => t.taskName === taskName);
        if (existing) {
          existing.likeCount += 1;
        } else {
          acc.push({ taskName, likeCount: 1 });
        }
      }
      return acc;
    }, [] as Array<{ taskName: string; likeCount: number }>);

    // Get project likes data for each project status with like counts per project
    // Get likes on completed projects with project information and count likes per project
    const completedProjectsLikes = await ProjectLike.findAll({
      include: [{
        model: Project,
        as: 'project',
        attributes: ['name'],
        where: { 
          status: 'COMPLETED',
          isDeleted: false 
        },
        required: true
      }, {
        model: User,
        as: 'user',
        where: { isDeleted: false },
        required: true
      }],
      order: [['createdAt', 'DESC']]
    });

    // Get likes on active projects with project information and count likes per project
    const activeProjectsLikes = await ProjectLike.findAll({
      include: [{
        model: Project,
        as: 'project',
        attributes: ['name'],
        where: { 
          status: 'IN_PROGRESS',
          isDeleted: false 
        },
        required: true
      }, {
        model: User,
        as: 'user',
        where: { isDeleted: false },
        required: true
      }],
      order: [['createdAt', 'DESC']]
    });

    // Get likes on planning projects with project information and count likes per project
    const planningProjectsLikes = await ProjectLike.findAll({
      include: [{
        model: Project,
        as: 'project',
        attributes: ['name'],
        where: { 
          status: 'PLANNING',
          isDeleted: false 
        },
        required: true
      }, {
        model: User,
        as: 'user',
        where: { isDeleted: false },
        required: true
      }],
      order: [['createdAt', 'DESC']]
    });

    // Count project likes for each status using direct count queries
    const likesOnCompletedProjectsCount = await ProjectLike.count({
      include: [{
        model: Project,
        as: 'project',
        where: { 
          status: 'COMPLETED',
          isDeleted: false 
        },
        required: true
      }]
    });

    const likesOnActiveProjectsCount = await ProjectLike.count({
      include: [{
        model: Project,
        as: 'project',
        where: { 
          status: 'IN_PROGRESS',
          isDeleted: false 
        },
        required: true
      }]
    });

    const likesOnPlanningProjectsCount = await ProjectLike.count({
      include: [{
        model: Project,
        as: 'project',
        where: { 
          status: 'PLANNING',
          isDeleted: false 
        },
        required: true
      }]
    });

    // Use the direct count results for project likes
    const likesOnCompletedProjects = likesOnCompletedProjectsCount;
    const likesOnActiveProjects = likesOnActiveProjectsCount;
    const likesOnPlanningProjects = likesOnPlanningProjectsCount;

    // Count likes per project name for each project status
    const projectsWithLikesCompleted = completedProjectsLikes.reduce((acc, like) => {
      const projectName = like.project?.name?.trim();
      if (projectName) {
        const existing = acc.find(p => p.projectName === projectName);
        if (existing) {
          existing.likeCount += 1;
        } else {
          acc.push({ projectName, likeCount: 1 });
        }
      }
      return acc;
    }, [] as Array<{ projectName: string; likeCount: number }>);

    const projectsWithLikesActive = activeProjectsLikes.reduce((acc, like) => {
      const projectName = like.project?.name?.trim();
      if (projectName) {
        const existing = acc.find(p => p.projectName === projectName);
        if (existing) {
          existing.likeCount += 1;
        } else {
          acc.push({ projectName, likeCount: 1 });
        }
      }
      return acc;
    }, [] as Array<{ projectName: string; likeCount: number }>);

    const projectsWithLikesPlanning = planningProjectsLikes.reduce((acc, like) => {
      const projectName = like.project?.name?.trim();
      if (projectName) {
        const existing = acc.find(p => p.projectName === projectName);
        if (existing) {
          existing.likeCount += 1;
        } else {
          acc.push({ projectName, likeCount: 1 });
        }
      }
      return acc;
    }, [] as Array<{ projectName: string; likeCount: number }>);

    // Get comment likes data for each task status using raw SQL to avoid association issues
    // Get likes on comments of completed tasks
    const commentsOnCompletedTasksLikesResult = await sequelize.query(`
      SELECT c.content
      FROM comment_likes cl
      INNER JOIN comments c ON cl.comment_id = c.id
      INNER JOIN tasks t ON c.task_id = t.id
      INNER JOIN users u ON cl.user_id = u.id
      WHERE c.is_deleted = false 
        AND t.status = 'DONE' 
        AND t.is_deleted = false
        AND u.is_deleted = false
      ORDER BY cl.created_at DESC
    `, { type: sequelize.QueryTypes.SELECT });
    const commentsOnCompletedTasksLikes = commentsOnCompletedTasksLikesResult.map((row: any) => ({
      comment: { content: row.content }
    }));

    // Get likes on comments of in progress tasks
    const commentsOnInProgressTasksLikesResult = await sequelize.query(`
      SELECT c.content
      FROM comment_likes cl
      INNER JOIN comments c ON cl.comment_id = c.id
      INNER JOIN tasks t ON c.task_id = t.id
      INNER JOIN users u ON cl.user_id = u.id
      WHERE c.is_deleted = false 
        AND t.status = 'IN_PROGRESS' 
        AND t.is_deleted = false
        AND u.is_deleted = false
      ORDER BY cl.created_at DESC
    `, { type: sequelize.QueryTypes.SELECT });
    const commentsOnInProgressTasksLikes = commentsOnInProgressTasksLikesResult.map((row: any) => ({
      comment: { content: row.content }
    }));

    // Get likes on comments of todo tasks
    const commentsOnTodoTasksLikesResult = await sequelize.query(`
      SELECT c.content
      FROM comment_likes cl
      INNER JOIN comments c ON cl.comment_id = c.id
      INNER JOIN tasks t ON c.task_id = t.id
      INNER JOIN users u ON cl.user_id = u.id
      WHERE c.is_deleted = false 
        AND t.status = 'TODO' 
        AND t.is_deleted = false
        AND u.is_deleted = false
      ORDER BY cl.created_at DESC
    `, { type: sequelize.QueryTypes.SELECT });
    const commentsOnTodoTasksLikes = commentsOnTodoTasksLikesResult.map((row: any) => ({
      comment: { content: row.content }
    }));

    // Count comment likes for each task status using raw SQL to avoid association issues
    const likesOnCommentsOnCompletedTasksResult = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM comment_likes cl
      INNER JOIN comments c ON cl.comment_id = c.id
      INNER JOIN tasks t ON c.task_id = t.id
      WHERE c.is_deleted = false 
        AND t.status = 'DONE' 
        AND t.is_deleted = false
    `, { type: sequelize.QueryTypes.SELECT });
    const likesOnCommentsOnCompletedTasksCount = parseInt((likesOnCommentsOnCompletedTasksResult[0] as any).count);

    const likesOnCommentsOnInProgressTasksResult = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM comment_likes cl
      INNER JOIN comments c ON cl.comment_id = c.id
      INNER JOIN tasks t ON c.task_id = t.id
      WHERE c.is_deleted = false 
        AND t.status = 'IN_PROGRESS' 
        AND t.is_deleted = false
    `, { type: sequelize.QueryTypes.SELECT });
    const likesOnCommentsOnInProgressTasksCount = parseInt((likesOnCommentsOnInProgressTasksResult[0] as any).count);

    const likesOnCommentsOnTodoTasksResult = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM comment_likes cl
      INNER JOIN comments c ON cl.comment_id = c.id
      INNER JOIN tasks t ON c.task_id = t.id
      WHERE c.is_deleted = false 
        AND t.status = 'TODO' 
        AND t.is_deleted = false
    `, { type: sequelize.QueryTypes.SELECT });
    const likesOnCommentsOnTodoTasksCount = parseInt((likesOnCommentsOnTodoTasksResult[0] as any).count);

    // Use the direct count results for comment likes
    const likesOnCommentsOnCompletedTasks = likesOnCommentsOnCompletedTasksCount;
    const likesOnCommentsOnInProgressTasks = likesOnCommentsOnInProgressTasksCount;
    const likesOnCommentsOnTodoTasks = likesOnCommentsOnTodoTasksCount;

    // Count likes per comment content for each task status
    const commentsWithLikesOnCompletedTasks = commentsOnCompletedTasksLikes.reduce((acc, like) => {
      const commentContent = like.comment?.content?.trim();
      if (commentContent) {
        const existing = acc.find(c => c.commentContent === commentContent);
        if (existing) {
          existing.likeCount += 1;
        } else {
          acc.push({ commentContent, likeCount: 1 });
        }
      }
      return acc;
    }, [] as Array<{ commentContent: string; likeCount: number }>);

    const commentsWithLikesOnInProgressTasks = commentsOnInProgressTasksLikes.reduce((acc, like) => {
      const commentContent = like.comment?.content?.trim();
      if (commentContent) {
        const existing = acc.find(c => c.commentContent === commentContent);
        if (existing) {
          existing.likeCount += 1;
        } else {
          acc.push({ commentContent, likeCount: 1 });
        }
      }
      return acc;
    }, [] as Array<{ commentContent: string; likeCount: number }>);

    const commentsWithLikesOnTodoTasks = commentsOnTodoTasksLikes.reduce((acc, like) => {
      const commentContent = like.comment?.content?.trim();
      if (commentContent) {
        const existing = acc.find(c => c.commentContent === commentContent);
        if (existing) {
          existing.likeCount += 1;
        } else {
          acc.push({ commentContent, likeCount: 1 });
        }
      }
      return acc;
    }, [] as Array<{ commentContent: string; likeCount: number }>);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      totalComments,
      commentsOnCompletedTasks,
      commentsOnInProgressTasks,
      commentsOnTodoTasks,
      totalUsers,
      recentActivity,
      averageProjectCompletion,
      likesOnCompletedTasks,
      likesOnInProgressTasks,
      likesOnTodoTasks,
      tasksWithLikesCompleted,
      tasksWithLikesInProgress,
      tasksWithLikesTodo,
      // Project likes data by status
      likesOnCompletedProjects,
      likesOnActiveProjects,
      likesOnPlanningProjects,
      projectsWithLikesCompleted,
      projectsWithLikesActive,
      projectsWithLikesPlanning,
      // Comment likes data by task status
      likesOnCommentsOnCompletedTasks,
      likesOnCommentsOnInProgressTasks,
      likesOnCommentsOnTodoTasks,
      commentsWithLikesOnCompletedTasks,
      commentsWithLikesOnInProgressTasks,
      commentsWithLikesOnTodoTasks,
    };
  } catch (error) {
    console.error('❌ Error calculating public stats:', error);
    // Return empty data structure if database query fails
    return {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      todoTasks: 0,
      totalComments: 0,
      commentsOnCompletedTasks: 0,
      commentsOnInProgressTasks: 0,
      commentsOnTodoTasks: 0,
      totalUsers: 0,
      recentActivity: 0,
      averageProjectCompletion: 0,
      likesOnCompletedTasks: 0,
      likesOnInProgressTasks: 0,
      likesOnTodoTasks: 0,
      tasksWithLikesCompleted: [],
      tasksWithLikesInProgress: [],
      tasksWithLikesTodo: [],
      // Project likes data by status
      likesOnCompletedProjects: 0,
      likesOnActiveProjects: 0,
      likesOnPlanningProjects: 0,
      projectsWithLikesCompleted: [],
      projectsWithLikesActive: [],
      projectsWithLikesPlanning: [],
      // Comment likes data by task status
      likesOnCommentsOnCompletedTasks: 0,
      likesOnCommentsOnInProgressTasks: 0,
      likesOnCommentsOnTodoTasks: 0,
      commentsWithLikesOnCompletedTasks: [],
      commentsWithLikesOnInProgressTasks: [],
      commentsWithLikesOnTodoTasks: []
    };
  }
};

/**
 * Public statistics resolver for GraphQL
 * Returns real-time statistics from database
 */
export const publicStatsResolvers = {
  Query: {
    publicStats: async (): Promise<PublicStats> => {
      return await calculatePublicStats();
    },
  },
};
