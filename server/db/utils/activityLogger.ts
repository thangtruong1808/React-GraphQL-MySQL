import { ActivityLog } from '../models/activityLog';
import { getActivityContext } from './activityContext';

/**
 * Activity Logger Utility
 * Centralized utility for creating activity logs across the application
 * Used by Sequelize hooks to automatically log CRUD operations
 */

export interface ActivityLogData {
  userId?: number; // The logged-in user performing the action (obtained from context if not provided)
  type: 'USER_CREATED' | 'USER_UPDATED' | 'USER_DELETED' | 'PROJECT_CREATED' | 'PROJECT_UPDATED' | 'PROJECT_DELETED' | 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_DELETED';
  action: string;
  targetUserId?: number; // The user being affected by the action
  projectId?: number;
  taskId?: number;
  metadata?: any;
}

/**
 * Create an activity log entry
 * @param data - Activity log data
 * @returns Promise<ActivityLog | null>
 */
export const createActivityLog = async (data: ActivityLogData): Promise<ActivityLog | null> => {
  try {
    // Validate required fields
    if (!data.type || data.type.trim() === '') {
      throw new Error('Activity type is required and cannot be empty');
    }

    // Get the current logged-in user from context
    const currentUser = getActivityContext();
    if (!currentUser) {
      throw new Error('No user context available for activity logging');
    }

    const activityLog = await ActivityLog.create({
      userId: currentUser.id, // Use logged-in user as the performer
      type: data.type,
      action: data.action,
      targetUserId: data.targetUserId || null, // The user being affected
      projectId: data.projectId || null,
      taskId: data.taskId || null,
      metadata: data.metadata || null,
    });

    return activityLog;
  } catch (error) {
    // Log error but don't throw to prevent breaking the main operation
    // Error handling without console.log for production
    return null;
  }
};

/**
 * Generate action description for different operations
 * @param operation - The operation type (create, update, delete)
 * @param entityType - The entity type (user, project, task)
 * @param entityName - The name/title of the entity
 * @returns Formatted action string
 */
export const generateActionDescription = (
  operation: 'create' | 'update' | 'delete',
  entityType: 'user' | 'project' | 'task',
  entityName: string
): string => {
  const operationText = {
    create: 'created',
    update: 'updated',
    delete: 'deleted'
  };

  const entityText = {
    user: 'user',
    project: 'project',
    task: 'task'
  };

  return `${operationText[operation]} ${entityText[entityType]} "${entityName}"`;
};

/**
 * Extract entity name from different entity types
 * @param entity - The entity object
 * @param entityType - The type of entity
 * @returns Entity name for logging
 */
export const extractEntityName = (entity: any, entityType: 'user' | 'project' | 'task'): string => {
  switch (entityType) {
    case 'user':
      return `${entity.firstName} ${entity.lastName}`;
    case 'project':
      return entity.name;
    case 'task':
      return entity.title;
    default:
      return 'Unknown';
  }
};
