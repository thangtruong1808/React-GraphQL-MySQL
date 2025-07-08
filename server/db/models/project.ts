import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../db';
import User from './user';
import Task from './task';

/**
 * Project Model
 * Handles project data with owner and member relationships
 */
export class Project extends Model {
  public id!: string;
  public name!: string;
  public description?: string;
  public status!: string;
  public ownerId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly owner?: User;
  public readonly members?: any[];
  public readonly tasks?: any[];
}

// Initialize Project model
Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 100],
          msg: 'Project name must be between 1 and 100 characters',
        },
        notEmpty: {
          msg: 'Project name is required',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Description must be less than 1000 characters',
        },
      },
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'COMPLETED', 'ARCHIVED', 'ON_HOLD'),
      defaultValue: 'ACTIVE',
      validate: {
        isIn: {
          args: [['ACTIVE', 'COMPLETED', 'ARCHIVED', 'ON_HOLD']],
          msg: 'Invalid project status',
        },
      },
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'projects',
    timestamps: true,
  }
);

// Define associations
Project.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
Project.belongsToMany(User, { as: 'members', through: 'project_members', foreignKey: 'projectId' });
Project.hasMany(Task, { as: 'tasks', foreignKey: 'projectId' });

export default Project;
