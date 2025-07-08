import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../db';
import User from './user';
import Task from './task';

/**
 * Comment Model
 * Handles comment data with task and author relationships
 */
export class Comment extends Model {
  public id!: string;
  public content!: string;
  public taskId!: string;
  public authorId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly task?: Task;
  public readonly author?: User;
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

// Define associations
Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

export default Comment;
