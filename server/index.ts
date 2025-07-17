import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { createContext } from './graphql/context';
import { authenticateUser, createContext as createAuthContext } from './auth/middleware';
import { csrfProtection } from './auth/csrf';
import { testConnection, setupAssociations } from './db';
import { makeExecutableSchema } from '@graphql-tools/schema';

// Load environment variables
dotenv.config();

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
app.use(cookieParser());

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
    console.error('❌ Error generating CSRF token:', error);
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
    console.log('🔍 APOLLO CONTEXT - Final context created:', {
      hasUser: !!context.user,
      userId: context.user?.id,
      userEmail: context.user?.email,
      userRole: context.user?.role,
      isAuthenticated: context.isAuthenticated
    });
    return context;
  },
  formatError: (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('GraphQL Error:', error);
    }
    
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
    await testConnection();
    
    // Setup model associations
    setupAssociations();
    
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
      console.log(`🚀 Server running on http://${SERVER_HOST}:${PORT}`);
      console.log(`📊 GraphQL endpoint: http://${SERVER_HOST}:${PORT}${server.graphqlPath}`);
      console.log(`🔍 GraphQL Playground: http://${SERVER_HOST}:${PORT}${server.graphqlPath}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🍪 Cookie handling: Enabled with httpOnly`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  await server.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  await server.stop();
  process.exit(0);
});

// Start the server
startServer(); 