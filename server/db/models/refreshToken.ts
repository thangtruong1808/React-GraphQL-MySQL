import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../db';
import User from './user';

/**
 * RefreshToken Model
 * Handles refresh token storage for JWT authentication
 * Matches the database schema exactly from db-schema.txt
 * Do NOT declare public fields to avoid shadowing Sequelize accessors.
 * This is a standard Sequelize ORM pattern where all models that extend Model automatically inherit static methods like create, findOne, findAll, update, destroy, etc.
 */
export class RefreshToken extends Model<InferAttributes<RefreshToken>, InferCreationAttributes<RefreshToken>> {
  declare id: string;
  declare userId: number;
  declare tokenHash: string;
  declare expiresAt: Date;
  declare isRevoked: boolean;
  declare createdAt: CreationOptional<Date>;

  // Associations will be defined in database index
}

// Initialize RefreshToken model
RefreshToken.init(
  {
    id: {
      type: DataTypes.STRING(255),
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
    tokenHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'token_hash',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
    isRevoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_revoked',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'refresh_tokens',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // No updated_at field in schema
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['is_revoked'],
      },
      {
        fields: ['expires_at'],
      },
    ],
  }
);

export default RefreshToken; 