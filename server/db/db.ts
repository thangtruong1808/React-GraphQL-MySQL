import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Description: Configures Sequelize instance for MySQL using environment variables.
 * Data created: Sequelize connection instance for database interactions.
 * Author: thangtruong
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
const LOCAL_DB_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);
const isLocalConnection = DB_HOST ? LOCAL_DB_HOSTS.has(DB_HOST.toLowerCase()) : false;

if (!DB_PASSWORD && !isLocalConnection) {
  throw new Error('DB_PASSWORD environment variable is required for non-local connections');
}

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD || undefined,
  
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
