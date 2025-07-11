import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

/**
 * Blacklisted Access Token Model
 * Stores blacklisted JWT access tokens for immediate invalidation
 * Used for force logout and security breach scenarios
 */
class BlacklistedAccessToken extends Model {
  // Remove public class fields to avoid shadowing Sequelize's attribute getters & setters
  // Sequelize will automatically provide these attributes based on the schema definition
}

BlacklistedAccessToken.init(
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
      onDelete: 'CASCADE',
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
    blacklistedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'blacklisted_at',
    },
    reason: {
      type: DataTypes.ENUM('FORCE_LOGOUT', 'MANUAL_LOGOUT', 'SECURITY_BREACH'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'blacklisted_access_tokens',
    timestamps: false, // Disable timestamps since table doesn't have created_at/updated_at
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['expires_at'],
      },
      {
        fields: ['token_hash'],
      },
    ],
  }
);

export default BlacklistedAccessToken; 