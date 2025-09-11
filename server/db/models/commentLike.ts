import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../db';

/**
 * Comment Like Model
 * Handles comment like data matching the database schema
 * Based on comment_likes table from db-schema.txt
 */
export class CommentLike extends Model<InferAttributes<CommentLike>, InferCreationAttributes<CommentLike>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare commentId: number;
  declare createdAt: CreationOptional<Date>;
}

CommentLike.init(
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
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'comment_id',
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
    tableName: 'comment_likes',
    timestamps: false, // We only have created_at, not updated_at
    indexes: [
      {
        fields: ['user_id'],
      },
    ],
  }
);

export default CommentLike;