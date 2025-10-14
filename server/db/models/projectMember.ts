import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../db';

/**
 * Project Member Model
 * Handles project member data matching the database schema
 * Based on project_members table from db-schema.txt
 */
export class ProjectMember extends Model<InferAttributes<ProjectMember>, InferCreationAttributes<ProjectMember>> {
  declare projectId: number;
  declare userId: number;
  declare role: 'VIEWER' | 'EDITOR' | 'OWNER';
  declare isDeleted: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// Initialize ProjectMember model
ProjectMember.init(
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'project_id',
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM('VIEWER', 'EDITOR', 'OWNER'),
      defaultValue: 'VIEWER',
      validate: {
        isIn: {
          args: [['VIEWER', 'EDITOR', 'OWNER']],
          msg: 'Invalid project member role',
        },
      },
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_deleted',
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
    tableName: 'project_members',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default ProjectMember;
