import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../db';

/**
 * Comment Model
 * Handles comment data with task and author relationships
 */
export class Comment extends Model {
  // Remove public class fields to avoid shadowing Sequelize's attribute getters & setters
  // Sequelize will automatically provide these attributes based on the schema definition
}

// Initialize Comment model
Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [1, 2000],
          msg: 'Comment content must be between 1 and 2000 characters',
        },
        notEmpty: {
          msg: 'Comment content is required',
        },
      },
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tasks',
        key: 'id',
      },
    },
    authorId: {
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
    tableName: 'comments',
    timestamps: true,
    indexes: [
      {
        fields: ['taskId'],
      },
      {
        fields: ['authorId'],
      },
    ],
  }
);

export default Comment;
