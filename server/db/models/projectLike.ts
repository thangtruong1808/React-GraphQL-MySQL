import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../db';

/**
 * Project Like Model
 * Handles project like data matching the database schema
 * Based on project_likes table from db-schema.txt
 */
export class ProjectLike extends Model<InferAttributes<ProjectLike>, InferCreationAttributes<ProjectLike>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare projectId: number;
  declare createdAt: CreationOptional<Date>;
}

ProjectLike.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'project_id',
    },
    createdAt: {
      type: DataTypes.DATE(3),
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  },
  {
    sequelize,
    tableName: 'project_likes',
    timestamps: false, // We only have created_at, not updated_at
    indexes: [
      {
        fields: ['user_id'],
      },
    ],
  }
);

export default ProjectLike;