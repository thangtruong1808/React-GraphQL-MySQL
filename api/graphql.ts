import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import { typeDefs } from '../server/graphql/schema';
import { resolvers } from '../server/graphql/resolvers';
import { createContext } from '../server/graphql/context';
import { setupDatabase } from '../server/db/setup';

// Load environment variables
dotenv.config();

/**
 * Main GraphQL Server
 * Sets up Express, Apollo Server, and database connection
 */
async function startServer() {
  try {
    // Initialize database
    await setupDatabase();
    console.log('✅ Database initialized successfully');

    // Create Express app
    const app = express();

    // Configure CORS
    app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
    }));

    // Parse JSON bodies
    app.use(express.json({ limit: '10mb' }));

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Create Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: createContext,
      formatError: (error) => {
        // Log errors for debugging
        console.error('GraphQL Error:', error);
        
        // Return user-friendly error messages
        return {
          message: error.message,
          path: error.path,
        };
      },
      plugins: [],
    });

    // Start Apollo Server
    await server.start();

    // Apply middleware
    server.applyMiddleware({ 
      app, 
      path: '/graphql',
      cors: false, // CORS is handled by Express
    });

    // Start server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 GraphQL Server running at http://localhost:${PORT}/graphql`);
      console.log(`📊 Apollo Studio available at http://localhost:${PORT}/graphql`);
      console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
