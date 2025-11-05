import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../db';
import { createActivityLog, generateActionDescription, extractEntityName } from '../utils/activityLogger';

/**
 * Project Model
 * Handles project data matching the database schema
 * Based on projects table from db-schema.txt
 */
export class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
  declare id: CreationOptional<number>;
  declare uuid: string;
  declare name: string;
  declare description: string;
  declare status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED';
  declare ownerId: number | null;
  declare isDeleted: boolean;
  declare version: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// Initialize Project model
Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        len: {
          args: [1, 150],
          msg: 'Project name must be between 1 and 150 characters',
        },
        notEmpty: {
          msg: 'Project name is required',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Project description is required',
        },
      },
    },
    status: {
      type: DataTypes.ENUM('PLANNING', 'IN_PROGRESS', 'COMPLETED'),
      defaultValue: 'PLANNING',
      validate: {
        isIn: {
          args: [['PLANNING', 'IN_PROGRESS', 'COMPLETED']],
          msg: 'Invalid project status',
        },
      },
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'owner_id',
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_deleted',
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
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
    tableName: 'projects',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      // Activity logging hooks
      afterCreate: async (project: Project) => {
        // Log project creation activity
        await createActivityLog({
          type: 'PROJECT_CREATED',
          action: generateActionDescription('create', 'project', extractEntityName(project, 'project')),
          targetUserId: project.ownerId ?? undefined, // The project owner being affected
          projectId: project.id,
          metadata: {
            name: project.name,
            description: project.description,
            status: project.status,
            ownerId: project.ownerId
          }
        });
      },
      afterUpdate: async (project: Project) => {
        // Log project update activity
        await createActivityLog({
          type: 'PROJECT_UPDATED',
          action: generateActionDescription('update', 'project', extractEntityName(project, 'project')),
          targetUserId: project.ownerId ?? undefined, // The project owner being affected
          projectId: project.id,
          metadata: {
            name: project.name,
            description: project.description,
            status: project.status,
            ownerId: project.ownerId
          }
        });
      },
      afterDestroy: async (project: Project) => {
        // Log project deletion activity
        await createActivityLog({
          type: 'PROJECT_DELETED',
          action: generateActionDescription('delete', 'project', extractEntityName(project, 'project')),
          targetUserId: project.ownerId ?? undefined, // The project owner being affected
          projectId: project.id,
          metadata: {
            name: project.name,
            description: project.description,
            status: project.status,
            ownerId: project.ownerId
          }
        });
      },
    },
  }
);

export default Project;
