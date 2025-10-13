import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../db';

/**
 * User Model
 * Handles user data with password hashing and validation
 * Matches the database schema exactly from db-schema.txt
 * Do NOT declare public fields to avoid shadowing Sequelize accessors.
 */
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare uuid: string;
  declare email: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare role: string;
  declare isDeleted: boolean;
  declare version: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  /**
   * Compare a candidate password with the user's hashed password
   * @param candidatePassword - The plain text password to check
   * @returns True if the password matches, false otherwise
   */
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    const hash = this.getDataValue('password');
    if (!candidatePassword || !hash) {
      return false;
    }
    return bcrypt.compare(candidatePassword, hash);
  }

  /**
   * Hash the user's password if it has changed
   */
  public async hashPassword(): Promise<void> {
    if (this.changed('password')) {
      const plain = this.getDataValue('password');
      const saltRounds = 12;
      const hashed = await bcrypt.hash(plain, saltRounds);
      this.setDataValue('password', hashed);
    }
  }
}

// Initialize User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(254),
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
    password: {
      type: DataTypes.STRING(255),
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
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name',
      validate: {
        len: {
          args: [1, 100],
          msg: 'First name must be between 1 and 100 characters',
        },
        notEmpty: {
          msg: 'First name is required',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'last_name',
      validate: {
        len: {
          args: [1, 100],
          msg: 'Last name must be between 1 and 100 characters',
        },
        notEmpty: {
          msg: 'Last name is required',
        },
      },
    },
    role: {
      type: DataTypes.ENUM(
        'ADMIN',
        'Project Manager',
        'Software Architect',
        'Frontend Developer',
        'Backend Developer',
        'Full-Stack Developer',
        'DevOps Engineer',
        'QA Engineer',
        'QC Engineer',
        'UX/UI Designer',
        'Business Analyst',
        'Database Administrator',
        'Technical Writer',
        'Support Engineer'
      ),
      defaultValue: 'Frontend Developer',
      validate: {
        isIn: {
          args: [[
            'ADMIN',
            'Project Manager',
            'Software Architect',
            'Frontend Developer',
            'Backend Developer',
            'Full-Stack Developer',
            'DevOps Engineer',
            'QA Engineer',
            'QC Engineer',
            'UX/UI Designer',
            'Business Analyst',
            'Database Administrator',
            'Technical Writer',
            'Support Engineer'
          ]],
          msg: 'Invalid role',
        },
      },
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_deleted',
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
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
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
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

export default User;
