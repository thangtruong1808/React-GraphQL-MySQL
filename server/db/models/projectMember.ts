import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../db';

/**
 * ProjectMember Model
 * Junction table for many-to-many relationship between users and projects
 */
export class ProjectMember extends Model {
  // Remove public class fields to avoid shadowing Sequelize's attribute getters & setters
  // Sequelize will automatically provide these attributes based on the schema definition
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

export default ProjectMember;
