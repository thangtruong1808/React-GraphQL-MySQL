import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Database Configuration
 * Sets up Sequelize connection to MySQL database
 */
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'react_graphql_app',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  
  // Connection pool settings
  pool: {
    max: 5, // Maximum number of connection instances
    min: 0, // Minimum number of connection instances
    acquire: 30000, // Maximum time to acquire connection
    idle: 10000, // Maximum time connection can be idle
  },
  
  // Logging configuration
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  
  // Timezone configuration
  timezone: '+00:00',
});

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
