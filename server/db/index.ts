import sequelize, { testConnection } from './db';

// Import models
import User from './models/user';
import RefreshToken from './models/refreshToken';
import Project from './models/project';
import ProjectMember from './models/projectMember';
import Task from './models/task';
import ActivityLog from './models/activityLog';
import Comment from './models/comment';
import Notification from './models/notification';
import Tag from './models/tag';
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
  ProjectMember,
  Task,
  ActivityLog,
  Comment,
  Notification,
  Tag,
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
  
  // Project associations
  User.hasMany(Project, { foreignKey: 'owner_id', as: 'ownedProjects' });
  Project.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
  
  // Project member associations
  Project.belongsToMany(User, { through: ProjectMember, foreignKey: 'projectId', otherKey: 'userId', as: 'members' });
  User.belongsToMany(Project, { through: ProjectMember, foreignKey: 'userId', otherKey: 'projectId', as: 'projects' });
  
  // Task associations
  Project.hasMany(Task, { foreignKey: 'project_id', as: 'tasks' });
  Task.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
  User.hasMany(Task, { foreignKey: 'assigned_to', as: 'assignedTasks' });
  Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignedUser' });
  
  // Comment associations
  Task.hasMany(Comment, { foreignKey: 'task_id', as: 'taskComments' });
  Comment.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });
  User.hasMany(Comment, { foreignKey: 'user_id', as: 'userComments' });
  Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  
  // Task like associations
  Task.hasMany(TaskLike, { foreignKey: 'taskId', as: 'taskLikes' });
  TaskLike.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });
  User.hasMany(TaskLike, { foreignKey: 'userId', as: 'userTaskLikes' });
  TaskLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Project like associations
  Project.hasMany(ProjectLike, { foreignKey: 'projectId', as: 'projectLikes' });
  ProjectLike.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
  User.hasMany(ProjectLike, { foreignKey: 'userId', as: 'userProjectLikes' });
  ProjectLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Comment like associations
  Comment.hasMany(CommentLike, { foreignKey: 'commentId', as: 'commentLikes' });
  CommentLike.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });
  User.hasMany(CommentLike, { foreignKey: 'userId', as: 'userCommentLikes' });
  CommentLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Activity log associations
  User.hasMany(ActivityLog, { foreignKey: 'user_id', as: 'userActivities' });
  ActivityLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  User.hasMany(ActivityLog, { foreignKey: 'target_user_id', as: 'targetActivities' });
  ActivityLog.belongsTo(User, { foreignKey: 'target_user_id', as: 'targetUser' });
  Project.hasMany(ActivityLog, { foreignKey: 'project_id', as: 'projectActivities' });
  ActivityLog.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
  Task.hasMany(ActivityLog, { foreignKey: 'task_id', as: 'taskActivities' });
  ActivityLog.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });

  // Notification associations
  User.hasMany(Notification, { foreignKey: 'user_id', as: 'userNotifications' });
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
};

// Don't setup associations automatically to avoid conflicts
// setupAssociations();
