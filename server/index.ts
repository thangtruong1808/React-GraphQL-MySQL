import { ApolloServer } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { csrfProtection, setCSRFToken } from './auth/csrf';
import { authenticateUser } from './auth/middleware';
import { verifyAccessToken } from './auth/jwt';
import { setupAssociations, testConnection } from './db';
import User from './db/models/user';
import { createContext } from './graphql/context';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/schema';

// Load environment variables from project root
dotenv.config({ path: `${process.cwd()}/.env` });

/**
 * Main Server Setup
 * Description: Configures Express and Apollo Server with authentication and secure cookie handling
 * Date: 2024-12-19
 * Author: thangtruong
 */

// Create PubSub instance for real-time subscriptions
export const pubsub = new PubSub();


const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000; // PORT can have fallback for deployment flexibility

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// CORS configuration from environment variables with fallback
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:5173']; // Default development origins

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
    const csrfToken = setCSRFToken(res);
    res.json({ csrfToken });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate CSRF token' });
  }
});

/**
 * Start Server Function
 * Description: Initializes database and starts the server with WebSocket support
 * Date: 2024-12-19
 * Author: thangtruong
 */
async function startServer() {
  try {
    // Test database connection first
    try {
      await testConnection();
      // Setup model associations
      setupAssociations();
    } catch (dbError) {
      // Error handling without console.log for production
      throw new Error('Database connection is required for the server to start');
    }
    
    const { makeExecutableSchema } = await import('@graphql-tools/schema');
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    const server = new ApolloServer({
      schema,
      context: ({ req, res }: { req: any; res: any }) => {
        // Create unified context with authentication
        const context = createContext({ req, res });
        // Add pubsub to context for subscriptions
        return {
          ...context,
          pubsub,
        };
      },
      formatError: (error: any) => {
        // Return sanitized error to client
        return {
          message: error.message,
          path: error.path,
        };
      },
      plugins: [],
    });

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

    // Create WebSocket server for subscriptions
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    });

    // Configure WebSocket server for GraphQL subscriptions
    // Description: Sets up WebSocket context with authentication matching HTTP context
    // Date: 2024-12-19
    // Author: thangtruong
    useServer({
      schema,
      context: async ({ connectionParams }: { connectionParams: any }) => {
        // Handle WebSocket authentication - must match HTTP context structure
        const token = connectionParams?.authorization?.replace('Bearer ', '');
        if (token) {
          try {
            // Verify JWT token using the same method as HTTP context
            const decoded = verifyAccessToken(token);
            
            if (decoded && decoded.userId) {
              // Load full user from database to match HTTP context structure
              const user = await User.findByPk(decoded.userId, {
                attributes: ['id', 'uuid', 'firstName', 'lastName', 'email', 'role', 'isDeleted', 'version', 'createdAt', 'updatedAt']
              });
              
              if (user && !user.isDeleted) {
                return { 
                  user: user,
                  pubsub // Use the same pubsub instance
                };
              }
            }
            return { user: null, pubsub };
          } catch (error: any) {
            // Error handling without console.log for production
            return { user: null, pubsub };
          }
        }
        return { user: null, pubsub };
      },
      onConnect: () => {
        // WebSocket client connected
      },
      onDisconnect: () => {
        // WebSocket client disconnected
      },
    }, wsServer);

    // Start HTTP server
    const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
    
    httpServer.listen(PORT, () => {
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