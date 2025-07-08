import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../db';
import Project from './project';
import Task from './task';
import Comment from './comment';

/**
 * User Model
 * Handles user data with password hashing and validation
 */
export class User extends Model {
  public id!: string;
  public email!: string;
  public username!: string;
  public password!: string;
  public firstName?: string;
  public lastName?: string;
  public role!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance method to compare password with hash
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Instance method to hash password
  public async hashPassword(): Promise<void> {
    if (this.changed('password')) {
      const saltRounds = 12;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }
}

// Initialize User model
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email address',
        },
        notEmpty: {
          msg: 'Email is required',
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 20],
          msg: 'Username must be between 3 and 20 characters',
        },
        is: {
          args: /^[a-zA-Z0-9_]+$/,
          msg: 'Username can only contain letters, numbers, and underscores',
        },
        notEmpty: {
          msg: 'Username is required',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 255],
          msg: 'Password must be at least 8 characters long',
        },
        notEmpty: {
          msg: 'Password is required',
        },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 50],
          msg: 'First name must be less than 50 characters',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 50],
          msg: 'Last name must be less than 50 characters',
        },
      },
    },
    role: {
      type: DataTypes.ENUM('USER', 'ADMIN', 'MODERATOR'),
      defaultValue: 'USER',
      validate: {
        isIn: {
          args: [['USER', 'ADMIN', 'MODERATOR']],
          msg: 'Invalid role',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      // Hash password before saving
      beforeSave: async (user: User) => {
        await user.hashPassword();
      },
      beforeUpdate: async (user: User) => {
        await user.hashPassword();
      },
    },
  }
);

// Define associations
User.hasMany(Project, { as: 'ownedProjects', foreignKey: 'ownerId' });
User.belongsToMany(Project, { as: 'memberProjects', through: 'project_members', foreignKey: 'userId' });
User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assigneeId' });
User.hasMany(Comment, { as: 'comments', foreignKey: 'authorId' });

export default User;
