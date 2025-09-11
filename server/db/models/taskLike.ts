import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../db';

/**
 * Task Like Model
 * Handles task like data matching the database schema
 * Based on task_likes table from db-schema.txt
 */
export class TaskLike extends Model<InferAttributes<TaskLike>, InferCreationAttributes<TaskLike>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare taskId: number;
  declare createdAt: CreationOptional<Date>;
}

// Initialize TaskLike model
TaskLike.init(
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
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'task_id',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'task_likes',
    timestamps: false, // Using created_at field directly
  }
);

export default TaskLike;
