import mysql from "mysql2/promise";

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Database configuration - requires .env file
const dbConfig = {
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 20, // Increased from 3 to 20 for better performance
  queueLimit: 0, // Removed queue limit to prevent connection blocking
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // Increased to 10 seconds
  connectTimeout: 30000, // Increased to 30 seconds
  idleTimeout: 60000, // Keep idle connections for 60 seconds
  maxIdle: 5, // Increased to match connectionLimit
};

// Create the connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection and log the result
pool
  .getConnection()
  .then((_connection) => {
    _connection.release();
  })
  .catch((err) => {
    throw new Error(`Failed to connect to database: ${err.message}`);
  });

export default pool;

// Query function with improved error handling
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{
  data: T[] | null;
  error: string | null;
}> {
  let _connection;
  try {
    _connection = await pool.getConnection();
    const [rows] = await _connection.execute(text, params);
    return { data: rows as T[], error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Database query failed";
    
    // Enhanced error handling with specific error types
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        return {
          data: null,
          error: "Database connection refused. Please check if the database server is running.",
        };
      }
      if (error.message.includes("ER_ACCESS_DENIED_ERROR")) {
        return {
          data: null,
          error: "Database access denied. Please verify your credentials.",
        };
      }
      if (error.message.includes("ER_BAD_DB_ERROR")) {
        return {
          data: null,
          error: "Database not found. Please check your database name.",
        };
      }
      if (error.message.includes("ETIMEDOUT")) {
        return {
          data: null,
          error: "Database connection timed out. Please try again.",
        };
      }
      if (error.message.includes("PROTOCOL_CONNECTION_LOST")) {
        return {
          data: null,
          error: "Database connection was lost. Please try again.",
        };
      }
    }
    return { data: null, error: errorMessage };
  } finally {
    if (_connection) {
      try {
        _connection.release();
      } catch (error) {
        // Silent error handling for connection release
      }
    }
  }
}

// Transaction function with proper connection handling
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const _connection = await pool.getConnection();
  try {
    await _connection.beginTransaction();
    const result = await callback(_connection);
    await _connection.commit();
    return result;
  } catch (error) {
    await _connection.rollback();
    throw error;
  } finally {
    _connection.release();
  }
}

/**
 * Gets a connection from the pool
 * @returns A database connection
 */
export async function getConnection() {
  try {
    const _connection = await pool.getConnection();
    return { connection: _connection, error: null };
  } catch (error) {
    console.error("Database connection error:", error);
    return {
      connection: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Begins a transaction
 * @param connection The database connection
 * @returns The result of starting the transaction
 */
export async function beginTransaction(_connection: mysql.PoolConnection) {
  try {
    await _connection.beginTransaction();
    return { error: null };
  } catch (error) {
    console.error("Transaction begin error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Commits a transaction
 * @param connection The database connection
 * @returns The result of committing the transaction
 */
export async function commitTransaction(_connection: mysql.PoolConnection) {
  try {
    await _connection.commit();
    return { error: null };
  } catch (error) {
    console.error("Transaction commit error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Rollbacks a transaction
 * @param connection The database connection
 * @returns The result of rolling back the transaction
 */
export async function rollbackTransaction(_connection: mysql.PoolConnection) {
  try {
    await _connection.rollback();
    return { error: null };
  } catch (error) {
    console.error("Transaction rollback error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * Releases a connection back to the pool
 * @param connection The database connection to release
 */
export async function releaseConnection(_connection: mysql.PoolConnection) {
  try {
    _connection.release();
    return { error: null };
  } catch (error) {
    console.error("Connection release error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
