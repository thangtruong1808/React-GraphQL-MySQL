import sequelize, { testConnection } from './db';

// Import models
import User from './models/user';
import RefreshToken from './models/refreshToken';
import Project from './models/project';
import Task from './models/task';
import ActivityLog from './models/activityLog';
import Comment from './models/comment';
import TaskLike from './models/taskLike';
import ProjectLike from './models/projectLike';
import CommentLike from './models/commentLike';

/**
 * Database Models Index
 * Centralizes model imports for authentication and project management functionality
 * Associations are handled separately to avoid conflicts
 */

// Export models
export {
  User,
  RefreshToken,
  Project,
  Task,
  ActivityLog,
  Comment,
  TaskLike,
  ProjectLike,
  CommentLike,
};

// Export sequelize instance and database functions
export { sequelize, testConnection };

/**
 * Setup Model Associations
 * Establishes relationships between models
 * Includes authentication and project management functionality
 */
export const setupAssociations = (): void => {
  // User associations
  User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
  
  // Task associations
  Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments' });
  Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });
  
  // User associations for comments
  User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
  Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  
  // Task like associations
  Task.hasMany(TaskLike, { foreignKey: 'taskId', as: 'likes' });
  TaskLike.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });
  User.hasMany(TaskLike, { foreignKey: 'userId', as: 'taskLikes' });
  TaskLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Project like associations
  Project.hasMany(ProjectLike, { foreignKey: 'projectId', as: 'likes' });
  ProjectLike.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
  User.hasMany(ProjectLike, { foreignKey: 'userId', as: 'projectLikes' });
  ProjectLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Comment like associations
  Comment.hasMany(CommentLike, { foreignKey: 'commentId', as: 'likes' });
  CommentLike.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });
  User.hasMany(CommentLike, { foreignKey: 'userId', as: 'commentLikes' });
  CommentLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });
};

// Don't setup associations automatically to avoid conflicts
// setupAssociations();
