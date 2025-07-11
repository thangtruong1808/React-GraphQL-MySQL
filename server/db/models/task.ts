import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../db';

/**
 * Task Model
 * Handles task data with project, assignee, and comment relationships
 */
export class Task extends Model {
  // Remove public class fields to avoid shadowing Sequelize's attribute getters & setters
  // Sequelize will automatically provide these attributes based on the schema definition
}

// Initialize Task model
Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 200],
          msg: 'Task title must be between 1 and 200 characters',
        },
        notEmpty: {
          msg: 'Task title is required',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 2000],
          msg: 'Description must be less than 2000 characters',
        },
      },
    },
    status: {
      type: DataTypes.ENUM('TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED'),
      defaultValue: 'TODO',
      validate: {
        isIn: {
          args: [['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED']],
          msg: 'Invalid task status',
        },
      },
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
      defaultValue: 'MEDIUM',
      validate: {
        isIn: {
          args: [['LOW', 'MEDIUM', 'HIGH', 'URGENT']],
          msg: 'Invalid task priority',
        },
      },
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    assigneeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
        isAfterNow(value: Date) {
          if (value && value <= new Date()) {
            throw new Error('Due date must be in the future');
          }
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true,
    indexes: [
      {
        fields: ['projectId'],
      },
      {
        fields: ['assigneeId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['priority'],
      },
    ],
  }
);

export default Task;
