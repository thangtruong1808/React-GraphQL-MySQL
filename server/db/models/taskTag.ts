import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../db';

/**
 * TaskTag Model
 * Junction table for many-to-many relationship between tasks and tags
 * Based on task_tags table from db-schema.txt
 */
export class TaskTag extends Model<InferAttributes<TaskTag>, InferCreationAttributes<TaskTag>> {
  declare taskId: number;
  declare tagId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// Initialize TaskTag model
TaskTag.init(
  {
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'task_id',
      primaryKey: true,
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'tag_id',
      primaryKey: true,
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
    modelName: 'TaskTag',
    tableName: 'task_tags',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default TaskTag;
