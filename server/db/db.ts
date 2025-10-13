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
  
  // Basic pool settings
  pool: {
    max: 15,
    min: 2,
  },
  
  // Query options
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  },
  
  // Logging configuration - disabled for cleaner output
  logging: false,
});

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    throw error;
  }
};

export default sequelize;
