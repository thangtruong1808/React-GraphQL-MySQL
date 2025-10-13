import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { csrfProtection } from './auth/csrf';
import { authenticateUser } from './auth/middleware';
import { setupAssociations, testConnection } from './db';
import { createContext } from './graphql/context';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/schema';

// Load environment variables from project root
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Main Server Setup
 * Configures Express and Apollo Server with authentication and secure cookie handling
 */

const app = express();
const PORT = process.env.PORT || 4000; // PORT can have fallback for deployment flexibility

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// CORS configuration from environment variables
if (!process.env.CORS_ORIGINS) {
  throw new Error('CORS_ORIGINS environment variable is required');
}

const corsOrigins = process.env.CORS_ORIGINS.split(',').map(origin => origin.trim());

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

// Cookie parser middleware for httpOnly cookies
app.use(cookieParser(undefined, {
  // Enable cookie parsing for all requests
  decode: (val) => val, // Don't decode cookies (keep as-is)
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Apply authentication middleware to all routes
app.use(authenticateUser);

// Apply CSRF protection middleware to all routes
app.use(csrfProtection);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// CSRF token endpoint for initial token generation
app.get('/csrf-token', (req, res) => {
  try {
    const { generateCSRFToken, setCSRFToken } = require('./auth/csrf');
    const csrfToken = setCSRFToken(res);
    res.json({ csrfToken });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate CSRF token' });
  }
});

/**
 * Create GraphQL Schema
 * Creates executable schema for Apollo Server
 */
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

/**
 * Apollo Server Configuration
 * Sets up GraphQL server with authentication context and cookie support
 */
const server = new ApolloServer({
  schema: schema,
  context: ({ req, res }: { req: any; res: any }) => {
    // Create unified context with authentication
    const context = createContext({ req, res });
    return context;
  },
  formatError: (error) => {
    // Return sanitized error to client
    return {
      message: error.message,
      path: error.path,
    };
  },
  plugins: [],
});

/**
 * Start Server Function
 * Initializes database and starts the server
 */
async function startServer() {
  try {
    // Test database connection first
    try {
      await testConnection();
      // Setup model associations
      setupAssociations();
    } catch (dbError) {
      console.warn('⚠️  Database connection failed, server will start with mock data:', dbError);
    }
    
    // Start Apollo Server
    await server.start();
    
    // Apply Apollo middleware to Express
    server.applyMiddleware({ 
      app: app as any, 
      path: '/graphql',
      cors: {
        origin: corsOrigins,
        credentials: true,
      },
    });

    // Start Express server
    const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
    
    app.listen(PORT, () => {
      // Server started successfully
    });

    // Graceful shutdown handling
    process.on('SIGTERM', async () => {
      await server.stop();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      await server.stop();
      process.exit(0);
    });

  } catch (error) {
    process.exit(1);
  }
}

// Start the server
startServer(); 