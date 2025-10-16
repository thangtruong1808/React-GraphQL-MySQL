import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../db';
import { createActivityLog, generateActionDescription, extractEntityName } from '../utils/activityLogger';

/**
 * Task Model
 * Handles task data matching the database schema
 * Based on tasks table from db-schema.txt
 */
export class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
  declare id: CreationOptional<number>;
  declare uuid: string;
  declare title: string;
  declare description: string;
  declare status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  declare priority: 'LOW' | 'MEDIUM' | 'HIGH';
  declare dueDate: Date | null;
  declare projectId: number;
  declare assignedTo: number | null;
  declare isDeleted: boolean;
  declare version: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// Initialize Task model
Task.init(
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
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        len: {
          args: [1, 150],
          msg: 'Task title must be between 1 and 150 characters',
        },
        notEmpty: {
          msg: 'Task title is required',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Task description is required',
        },
      },
    },
    status: {
      type: DataTypes.ENUM('TODO', 'IN_PROGRESS', 'DONE'),
      defaultValue: 'TODO',
      validate: {
        isIn: {
          args: [['TODO', 'IN_PROGRESS', 'DONE']],
          msg: 'Invalid task status',
        },
      },
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
      defaultValue: 'MEDIUM',
      validate: {
        isIn: {
          args: [['LOW', 'MEDIUM', 'HIGH']],
          msg: 'Invalid task priority',
        },
      },
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'due_date',
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'project_id',
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'assigned_to',
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
    tableName: 'tasks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      // Activity logging hooks
      afterCreate: async (task: Task) => {
        // Log task creation activity
        await createActivityLog({
          type: 'TASK_CREATED',
          action: generateActionDescription('create', 'task', extractEntityName(task, 'task')),
          targetUserId: task.assignedTo || null, // The user assigned to the task
          projectId: task.projectId,
          taskId: task.id,
          metadata: {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            projectId: task.projectId,
            assignedTo: task.assignedTo
          }
        });
      },
      afterUpdate: async (task: Task) => {
        // Log task update activity
        await createActivityLog({
          type: 'TASK_UPDATED',
          action: generateActionDescription('update', 'task', extractEntityName(task, 'task')),
          targetUserId: task.assignedTo || null, // The user assigned to the task
          projectId: task.projectId,
          taskId: task.id,
          metadata: {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            projectId: task.projectId,
            assignedTo: task.assignedTo
          }
        });
      },
      afterDestroy: async (task: Task) => {
        // Log task deletion activity
        await createActivityLog({
          type: 'TASK_DELETED',
          action: generateActionDescription('delete', 'task', extractEntityName(task, 'task')),
          targetUserId: task.assignedTo || null, // The user assigned to the task
          projectId: task.projectId,
          taskId: task.id,
          metadata: {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            projectId: task.projectId,
            assignedTo: task.assignedTo
          }
        });
      },
    },
  }
);

export default Task;
