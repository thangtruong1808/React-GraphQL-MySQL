import { Op, Transaction } from 'sequelize';
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
  planningProjects: number;
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
 * Retry function with exponential backoff for database operations
 */
const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is connection-related
      const isConnectionError = /ECONNRESET|ETIMEDOUT|EHOSTUNREACH|SequelizeConnectionError/i.test(lastError.message);
      
      if (!isConnectionError || attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff delay
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

/**
 * Optimized public statistics calculation using fewer, more efficient queries
 * Reduces database connection usage and implements retry logic
 */
export const calculatePublicStats = async (): Promise<PublicStats> => {
  const transaction = await sequelize.transaction();
  
  try {
    return await retryWithBackoff(async () => {
      // Use single comprehensive query for all basic counts
      const basicStatsQuery = `
        SELECT 
          -- Project counts by status
          SUM(CASE WHEN p.is_deleted = false THEN 1 ELSE 0 END) as totalProjects,
          SUM(CASE WHEN p.status = 'IN_PROGRESS' AND p.is_deleted = false THEN 1 ELSE 0 END) as activeProjects,
          SUM(CASE WHEN p.status = 'COMPLETED' AND p.is_deleted = false THEN 1 ELSE 0 END) as completedProjects,
          SUM(CASE WHEN p.status = 'PLANNING' AND p.is_deleted = false THEN 1 ELSE 0 END) as planningProjects,
          
          -- Task counts by status
          (SELECT COUNT(*) FROM tasks WHERE is_deleted = false) as totalTasks,
          (SELECT COUNT(*) FROM tasks WHERE status = 'DONE' AND is_deleted = false) as completedTasks,
          (SELECT COUNT(*) FROM tasks WHERE status = 'IN_PROGRESS' AND is_deleted = false) as inProgressTasks,
          (SELECT COUNT(*) FROM tasks WHERE status = 'TODO' AND is_deleted = false) as todoTasks,
          
          -- Comment counts
          (SELECT COUNT(*) FROM comments WHERE is_deleted = false) as totalComments,
          
          -- User count
          (SELECT COUNT(*) FROM users WHERE is_deleted = false) as totalUsers
        FROM projects p
      `;

      const [basicStats] = await sequelize.query(basicStatsQuery, { 
        transaction, 
        type: sequelize.QueryTypes.SELECT 
      }) as any[];

      // Get recent activity count (last 7 days) in parallel
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const [recentActivityResult, commentsStatsResult, likesStatsResult] = await Promise.all([
        // Recent activity query
        sequelize.query(`
      SELECT COUNT(*) as count
          FROM activity_logs 
          WHERE created_at >= ?
        `, {
          replacements: [sevenDaysAgo],
          transaction,
          type: sequelize.QueryTypes.SELECT
        }),
        
        // Comments by task status in single query
        sequelize.query(`
          SELECT 
            t.status,
            COUNT(c.id) as count
      FROM comments c
      INNER JOIN tasks t ON c.task_id = t.id
      WHERE c.is_deleted = false 
        AND t.is_deleted = false
          GROUP BY t.status
        `, { transaction, type: sequelize.QueryTypes.SELECT }),
        
        // All likes data in single comprehensive query (do not depend on task_likes existing rows)
        sequelize.query(`
          SELECT 
            -- Task likes by status
            SUM(CASE WHEN t.status = 'DONE' AND t.is_deleted = false THEN 1 ELSE 0 END) as likesOnCompletedTasks,
            SUM(CASE WHEN t.status = 'IN_PROGRESS' AND t.is_deleted = false THEN 1 ELSE 0 END) as likesOnInProgressTasks,
            SUM(CASE WHEN t.status = 'TODO' AND t.is_deleted = false THEN 1 ELSE 0 END) as likesOnTodoTasks,
            
            -- Project likes by status
            (SELECT COUNT(*) FROM project_likes pl 
             INNER JOIN projects p ON pl.project_id = p.id 
             WHERE p.status = 'COMPLETED' AND p.is_deleted = false) as likesOnCompletedProjects,
            (SELECT COUNT(*) FROM project_likes pl 
             INNER JOIN projects p ON pl.project_id = p.id 
             WHERE p.status = 'IN_PROGRESS' AND p.is_deleted = false) as likesOnActiveProjects,
            (SELECT COUNT(*) FROM project_likes pl 
             INNER JOIN projects p ON pl.project_id = p.id 
             WHERE p.status = 'PLANNING' AND p.is_deleted = false) as likesOnPlanningProjects,
             
            -- Comment likes by task status
            (SELECT COUNT(*) FROM comment_likes cl 
             INNER JOIN comments c ON cl.comment_id = c.id 
             INNER JOIN tasks t ON c.task_id = t.id 
             WHERE c.is_deleted = false AND t.status = 'DONE' AND t.is_deleted = false) as likesOnCommentsOnCompletedTasks,
            (SELECT COUNT(*) FROM comment_likes cl 
             INNER JOIN comments c ON cl.comment_id = c.id 
             INNER JOIN tasks t ON c.task_id = t.id 
             WHERE c.is_deleted = false AND t.status = 'IN_PROGRESS' AND t.is_deleted = false) as likesOnCommentsOnInProgressTasks,
            (SELECT COUNT(*) FROM comment_likes cl 
             INNER JOIN comments c ON cl.comment_id = c.id 
             INNER JOIN tasks t ON c.task_id = t.id 
             WHERE c.is_deleted = false AND t.status = 'TODO' AND t.is_deleted = false) as likesOnCommentsOnTodoTasks
          FROM tasks t
          LEFT JOIN task_likes tl ON tl.task_id = t.id
        `, { transaction, type: sequelize.QueryTypes.SELECT })
      ]);

      // Process results
      const recentActivity = parseInt((recentActivityResult[0] as any).count) || 0;
      const likesStats = (likesStatsResult[0] as any) || {};
      
      // Process comments by task status
      const commentsStats = (commentsStatsResult as any[]).reduce((acc, row) => {
        acc[`commentsOn${row.status === 'DONE' ? 'Completed' : row.status === 'IN_PROGRESS' ? 'InProgress' : 'Todo'}Tasks`] = parseInt(row.count);
      return acc;
      }, {
        commentsOnCompletedTasks: 0,
        commentsOnInProgressTasks: 0,
        commentsOnTodoTasks: 0
      });

      // Get detailed likes data for tasks, projects, and comments (with names/content)
      const [taskLikesData, projectLikesData, commentLikesData] = await Promise.all([
        // Task likes with names
        sequelize.query(`
          SELECT 
            t.title as taskName,
            t.status,
            COUNT(tl.id) as likeCount
          FROM task_likes tl
          INNER JOIN tasks t ON tl.task_id = t.id
          INNER JOIN users u ON tl.user_id = u.id
          WHERE t.is_deleted = false AND u.is_deleted = false
          GROUP BY t.id, t.title, t.status
          ORDER BY likeCount DESC
        `, { transaction, type: sequelize.QueryTypes.SELECT }),
        
        // Project likes with names
        sequelize.query(`
          SELECT 
            p.name as projectName,
            p.status,
            COUNT(pl.id) as likeCount
          FROM project_likes pl
          INNER JOIN projects p ON pl.project_id = p.id
          INNER JOIN users u ON pl.user_id = u.id
          WHERE p.is_deleted = false AND u.is_deleted = false
          GROUP BY p.id, p.name, p.status
          ORDER BY likeCount DESC
        `, { transaction, type: sequelize.QueryTypes.SELECT }),
        
        // Comment likes with content
        sequelize.query(`
          SELECT 
            c.content as commentContent,
            t.status as taskStatus,
            COUNT(cl.id) as likeCount
      FROM comment_likes cl
      INNER JOIN comments c ON cl.comment_id = c.id
      INNER JOIN tasks t ON c.task_id = t.id
      INNER JOIN users u ON cl.user_id = u.id
          WHERE c.is_deleted = false AND t.is_deleted = false AND u.is_deleted = false
          GROUP BY c.id, c.content, t.status
          ORDER BY likeCount DESC
        `, { transaction, type: sequelize.QueryTypes.SELECT })
      ]);

      // Process task likes by status
      const tasksWithLikesCompleted = (taskLikesData as any[])
        .filter(row => row.status === 'DONE')
        .map(row => ({ taskName: row.taskName?.trim() || '', likeCount: parseInt(row.likeCount) }))
        .filter(item => item.taskName);
      
      const tasksWithLikesInProgress = (taskLikesData as any[])
        .filter(row => row.status === 'IN_PROGRESS')
        .map(row => ({ taskName: row.taskName?.trim() || '', likeCount: parseInt(row.likeCount) }))
        .filter(item => item.taskName);
      
      const tasksWithLikesTodo = (taskLikesData as any[])
        .filter(row => row.status === 'TODO')
        .map(row => ({ taskName: row.taskName?.trim() || '', likeCount: parseInt(row.likeCount) }))
        .filter(item => item.taskName);

      // Process project likes by status
      const projectsWithLikesCompleted = (projectLikesData as any[])
        .filter(row => row.status === 'COMPLETED')
        .map(row => ({ projectName: row.projectName?.trim() || '', likeCount: parseInt(row.likeCount) }))
        .filter(item => item.projectName);
      
      const projectsWithLikesActive = (projectLikesData as any[])
        .filter(row => row.status === 'IN_PROGRESS')
        .map(row => ({ projectName: row.projectName?.trim() || '', likeCount: parseInt(row.likeCount) }))
        .filter(item => item.projectName);
      
      const projectsWithLikesPlanning = (projectLikesData as any[])
        .filter(row => row.status === 'PLANNING')
        .map(row => ({ projectName: row.projectName?.trim() || '', likeCount: parseInt(row.likeCount) }))
        .filter(item => item.projectName);

      // Process comment likes by task status
      const commentsWithLikesOnCompletedTasks = (commentLikesData as any[])
        .filter(row => row.taskStatus === 'DONE')
        .map(row => ({ commentContent: row.commentContent?.trim() || '', likeCount: parseInt(row.likeCount) }))
        .filter(item => item.commentContent);
      
      const commentsWithLikesOnInProgressTasks = (commentLikesData as any[])
        .filter(row => row.taskStatus === 'IN_PROGRESS')
        .map(row => ({ commentContent: row.commentContent?.trim() || '', likeCount: parseInt(row.likeCount) }))
        .filter(item => item.commentContent);
      
      const commentsWithLikesOnTodoTasks = (commentLikesData as any[])
        .filter(row => row.taskStatus === 'TODO')
        .map(row => ({ commentContent: row.commentContent?.trim() || '', likeCount: parseInt(row.likeCount) }))
        .filter(item => item.commentContent);

      // Calculate average project completion rate
      const averageProjectCompletion = basicStats.totalProjects > 0 
        ? Math.round((basicStats.completedProjects / basicStats.totalProjects) * 100) 
        : 0;

      await transaction.commit();

    return {
        // Basic stats
        totalProjects: parseInt(basicStats.totalProjects) || 0,
        activeProjects: parseInt(basicStats.activeProjects) || 0,
        completedProjects: parseInt(basicStats.completedProjects) || 0,
        planningProjects: parseInt(basicStats.planningProjects) || 0,
        totalTasks: parseInt(basicStats.totalTasks) || 0,
        completedTasks: parseInt(basicStats.completedTasks) || 0,
        inProgressTasks: parseInt(basicStats.inProgressTasks) || 0,
        todoTasks: parseInt(basicStats.todoTasks) || 0,
        totalComments: parseInt(basicStats.totalComments) || 0,
        totalUsers: parseInt(basicStats.totalUsers) || 0,
      recentActivity,
      averageProjectCompletion,
        
        // Comments by task status
        ...commentsStats,
        
        // Likes counts
        likesOnCompletedTasks: parseInt(likesStats.likesOnCompletedTasks) || 0,
        likesOnInProgressTasks: parseInt(likesStats.likesOnInProgressTasks) || 0,
        likesOnTodoTasks: parseInt(likesStats.likesOnTodoTasks) || 0,
        likesOnCompletedProjects: parseInt(likesStats.likesOnCompletedProjects) || 0,
        likesOnActiveProjects: parseInt(likesStats.likesOnActiveProjects) || 0,
        likesOnPlanningProjects: parseInt(likesStats.likesOnPlanningProjects) || 0,
        likesOnCommentsOnCompletedTasks: parseInt(likesStats.likesOnCommentsOnCompletedTasks) || 0,
        likesOnCommentsOnInProgressTasks: parseInt(likesStats.likesOnCommentsOnInProgressTasks) || 0,
        likesOnCommentsOnTodoTasks: parseInt(likesStats.likesOnCommentsOnTodoTasks) || 0,
        
        // Detailed likes data
      tasksWithLikesCompleted,
      tasksWithLikesInProgress,
      tasksWithLikesTodo,
      projectsWithLikesCompleted,
      projectsWithLikesActive,
      projectsWithLikesPlanning,
      commentsWithLikesOnCompletedTasks,
      commentsWithLikesOnInProgressTasks,
      commentsWithLikesOnTodoTasks,
    };
    });
  } catch (error) {
    await transaction.rollback();
    
    // Return empty stats on error to prevent crashes
    return {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      planningProjects: 0,
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
      likesOnCompletedProjects: 0,
      likesOnActiveProjects: 0,
      likesOnPlanningProjects: 0,
      projectsWithLikesCompleted: [],
      projectsWithLikesActive: [],
      projectsWithLikesPlanning: [],
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
