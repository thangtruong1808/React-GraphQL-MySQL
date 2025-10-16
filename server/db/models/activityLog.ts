import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../db';

/**
 * Activity Log Model
 * Handles activity log data matching the database schema
 * Based on activity_logs table from db-schema.txt
 */
export class ActivityLog extends Model<InferAttributes<ActivityLog>, InferCreationAttributes<ActivityLog>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare targetUserId: number | null;
  declare projectId: number | null;
  declare taskId: number | null;
  declare action: string;
  declare type: 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_ASSIGNED' | 'COMMENT_ADDED' | 'PROJECT_CREATED' | 'PROJECT_COMPLETED' | 'USER_MENTIONED';
  declare metadata: any | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// Initialize ActivityLog model
ActivityLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    targetUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'target_user_id',
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'project_id',
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'task_id',
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('TASK_CREATED', 'TASK_UPDATED', 'TASK_ASSIGNED', 'COMMENT_ADDED', 'PROJECT_CREATED', 'PROJECT_COMPLETED', 'USER_MENTIONED'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['TASK_CREATED', 'TASK_UPDATED', 'TASK_ASSIGNED', 'COMMENT_ADDED', 'PROJECT_CREATED', 'PROJECT_COMPLETED', 'USER_MENTIONED']],
          msg: 'Invalid activity type',
        },
      },
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'activity_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default ActivityLog;
