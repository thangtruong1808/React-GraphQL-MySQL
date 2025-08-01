# React GraphQL MySQL App

A modern full-stack application built with React, GraphQL, and MySQL featuring simplified authentication and user management.

## Features

### Authentication System
- **Access Tokens**: Short-lived (1 minute) JWT tokens for API calls
- **Refresh Tokens**: Longer-lived tokens stored in HTTP-only cookies
- **Automatic Token Refresh**: Seamless user experience with automatic token renewal
- **Role-Based Access Control**: Comprehensive role system (ADMIN, MANAGER, DEVELOPER)
- **Authentication Guards**: Clean, reusable protection for GraphQL resolvers
- **CSRF Protection**: Cross-site request forgery protection for mutations

### User Management
- User registration and login
- Profile management
- Session management
- Admin user management

### Security Features
- HTTP-only cookies for refresh tokens
- Password hashing with bcrypt
- JWT token validation
- CORS protection
- Input validation

## Architecture

### Backend (Node.js + Express + Apollo Server)
- **GraphQL API** with authentication directives
- **MySQL Database** with Sequelize ORM
- **JWT Authentication** with access/refresh token pattern
- **Role-based Authorization** using authentication guards
- **CSRF Protection** for secure mutations
- **Middleware-based Authentication** for request-level security

### Frontend (React + TypeScript)
- **Modern React** with hooks and functional components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Apollo Client** for GraphQL communication

## Database Schema

The application uses a simplified database schema focused on authentication and user management:

- **users**: User accounts with roles
- **refresh_tokens**: Secure refresh token storage
- **projects**: Project management (basic structure)
- **tasks**: Task management (basic structure)
- **comments**: Comment system (basic structure)

## Authentication Flow

1. **Login**: User provides credentials → receives access token + refresh token cookie
2. **API Calls**: Access token used in Authorization header
3. **Token Refresh**: When access token expires, refresh token automatically gets new access token
4. **Logout**: Refresh token deleted from database and cookie cleared

## Authentication Guards

The application uses a comprehensive guard system for protecting GraphQL resolvers:

### Available Guards
- **`authGuard`**: Basic authentication check
- **`roleGuard`**: Role-based authorization (DEVELOPER, MANAGER, ADMIN)
- **`adminGuard`**: Admin-only access
- **`managerGuard`**: Manager or higher access

### Usage Example
```typescript
import { withAuth, withAdmin, withManager } from '../auth/guard';

// Basic authentication
const getMyProfile = withAuth((_, __, context) => context.user, authGuard);

// Admin-only access
const getAllUsers = withAdmin(async (_, __, context) => {
  return await User.findAll();
});

// Manager or higher access
const createProject = withManager(async (_, { input }, context) => {
  return await Project.create(input);
});
```

For detailed documentation, see `server/auth/README.md`.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-graphql-mysql-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp .env.example .env
   cp client/.env.example client/.env
   ```

4. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE graphql_app;
   ```

5. **Configure Environment Variables**
   ```env
   # Server (.env)
   NODE_ENV=development
   PORT=4000
   JWT_SECRET=your-super-secret-jwt-key
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=graphql_app
   DB_USER=root
   DB_PASSWORD=your-db-password
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173

   # Client (client/.env)
   VITE_API_URL=http://localhost:4000/graphql
   ```

6. **Start the Application**
   ```bash
   # Start server
   npm run dev

   # Start client (in new terminal)
   cd client && npm run dev
   ```

## API Documentation

### Authentication Mutations

```graphql
# Register new user
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      firstName
      lastName
      role
    }
  }
}

# Login user
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      firstName
      lastName
      role
    }
  }
}

# Logout user
mutation Logout {
  logout {
    success
    message
  }
}

# Refresh access token
mutation RefreshToken {
  refreshToken {
    accessToken
    refreshToken
    user {
      id
      email
      firstName
      lastName
      role
    }
  }
}
```

### User Queries

```graphql
# Get current user
query CurrentUser {
  currentUser {
    id
    email
    firstName
    lastName
    role
  }
}

# Get all users (admin only)
query Users($limit: Int, $offset: Int) {
  users(limit: $limit, offset: $offset) {
    id
    email
    firstName
    lastName
    role
  }
}
```

## Security Considerations

- **JWT Secret**: Use a strong, unique JWT secret in production
- **HTTPS**: Always use HTTPS in production for secure cookie transmission
- **Environment Variables**: Never commit sensitive data to version control
- **Database Security**: Use strong database passwords and limit database access
- **CORS**: Configure CORS origins properly for production

## Development

### Project Structure
```
├── server/                 # Backend server
│   ├── auth/              # Authentication logic
│   ├── db/                # Database models and setup
│   ├── graphql/           # GraphQL schema and resolvers
│   └── constants/         # Application constants
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── constants/     # Frontend constants
│   └── public/            # Static assets
└── README.md
```

### Available Scripts

**Server:**
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server

**Client:**
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
