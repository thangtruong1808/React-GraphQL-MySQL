import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../db';
import User from './user';
import Project from './project';

/**
 * ProjectMember Model
 * Junction table for many-to-many relationship between users and projects
 */
export class ProjectMember extends Model {
  public id!: string;
  public projectId!: string;
  public userId!: string;
  public role!: string;
  public joinedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: User;
  public readonly project?: Project;
}

// Initialize ProjectMember model
ProjectMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.ENUM('MEMBER', 'ADMIN', 'VIEWER'),
      defaultValue: 'MEMBER',
      validate: {
        isIn: {
          args: [['MEMBER', 'ADMIN', 'VIEWER']],
          msg: 'Invalid member role',
        },
      },
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'project_members',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['projectId', 'userId'],
      },
    ],
  }
);

// Define associations
ProjectMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ProjectMember.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

export default ProjectMember;
