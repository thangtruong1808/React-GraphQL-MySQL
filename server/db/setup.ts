import sequelize from './db';
import { testConnection } from './db';

// Import all models to register them with Sequelize
import User from './models/user';
import Project from './models/project';
import ProjectMember from './models/projectMember';
import Task from './models/task';
import Comment from './models/comment';

/**
 * Database Setup
 * Initializes database tables and syncs models with all relationships
 */
export const setupDatabase = async (): Promise<void> => {
  try {
    // Test database connection
    await testConnection();

    // Import all models to register them
    const models = {
      User,
      Project,
      ProjectMember,
      Task,
      Comment,
    };

    // Sync all models with database (create tables if they don't exist)
    await sequelize.sync({ alter: true });

    console.log('✅ Database tables synchronized successfully.');

    // Create default admin user if no users exist
    const userCount = await User.count();
    if (userCount === 0) {
      await User.create({
        email: 'admin@example.com',
        username: 'admin',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      });
      console.log('✅ Default admin user created.');
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

export default setupDatabase;