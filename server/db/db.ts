import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Database Configuration
 * Sets up Sequelize connection to MySQL database
 */
// Validate required database environment variables
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

if (!DB_HOST) {
  throw new Error('DB_HOST environment variable is required');
}
if (!DB_PORT) {
  throw new Error('DB_PORT environment variable is required');
}
if (!DB_NAME) {
  throw new Error('DB_NAME environment variable is required');
}
if (!DB_USER) {
  throw new Error('DB_USER environment variable is required');
}
if (!DB_PASSWORD) {
  throw new Error('DB_PASSWORD environment variable is required');
}

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  
  // Connection pool settings
  pool: {
    max: 15, // Maximum number of connection instances
    min: 0, // Minimum number of connection instances
    acquire: 30000, // Maximum time to acquire connection
    idle: 10000, // Maximum time connection can be idle
  },
  
  // Logging configuration - only log errors in development
  logging: process.env.NODE_ENV === 'development' ? (msg: string) => {
    // Only log errors, not successful queries
    if (msg.includes('ERROR') || msg.includes('error')) {
      console.log(msg);
    }
  } : false,
  
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
