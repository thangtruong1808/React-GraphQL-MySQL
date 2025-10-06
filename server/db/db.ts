import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

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
  
  // Connection pool settings - optimized for hosting limits
  pool: {
    max: 10, // Reduced from 15 to 10 to stay within hosting limits
    min: 0, // Minimum number of connection instances
    acquire: 30000, // Maximum time to acquire connection
    idle: 10000, // Maximum time connection can be idle
  },
  
  // Logging configuration - disabled for cleaner output
  logging: false,
  
  // Timezone configuration
  timezone: '+00:00',
});

// Log database connection status
const logMessage = (msg: string) => {
  console.log(msg);
};

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logMessage('✅ Database connection established successfully.');
  } catch (error) {
    logMessage(`❌ Database connection failed: ${error}`);
    throw error;
  }
};

export default sequelize;
