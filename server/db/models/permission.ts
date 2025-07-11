import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../db';
import User from './user';

/**
 * Permission Model
 * Handles fine-grained access control on projects/tasks/comments
 * Matches the database schema exactly from db-schema.txt
 */
export class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare resourceType: 'PROJECT' | 'TASK' | 'COMMENT';
  declare resourceId: number;
  declare permission: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Associations
  declare permissionUser?: User;
}

// Initialize Permission model
Permission.init(
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
      references: {
        model: 'users',
        key: 'id',
      },
    },
    resourceType: {
      type: DataTypes.ENUM('PROJECT', 'TASK', 'COMMENT'),
      allowNull: false,
      field: 'resource_type',
    },
    resourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'resource_id',
    },
    permission: {
      type: DataTypes.ENUM('READ', 'WRITE', 'DELETE', 'ADMIN'),
      allowNull: false,
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
    tableName: 'permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id', 'resource_type', 'resource_id'],
      },
      {
        fields: ['user_id'],
      },
      {
        fields: ['resource_type', 'resource_id'],
      },
    ],
  }
);

// Define associations
Permission.belongsTo(User, { foreignKey: 'userId', as: 'permissionUser' });

export default Permission; 