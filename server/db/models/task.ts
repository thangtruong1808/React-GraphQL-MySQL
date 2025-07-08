import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../db';
import User from './user';
import Project from './project';
import Comment from './comment';

/**
 * Task Model
 * Handles task data with project, assignee, and comment relationships
 */
export class Task extends Model {
  public id!: string;
  public title!: string;
  public description?: string;
  public status!: string;
  public priority!: string;
  public projectId!: string;
  public assigneeId?: string;
  public dueDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly project?: Project;
  public readonly assignee?: User;
  public readonly comments?: any[];
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

// Define associations
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Task.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });
Task.hasMany(Comment, { as: 'comments', foreignKey: 'taskId' });

export default Task;
