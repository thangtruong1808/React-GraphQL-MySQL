# React GraphQL MySQL App

A full-stack application with React frontend, GraphQL API, and MySQL database using JWT with Refresh Token authentication.

## 🚀 Features

- **JWT with Refresh Tokens**: Secure token-based authentication with automatic token refresh
- **Token Rotation**: Enhanced security with automatic refresh token rotation
- **GraphQL API**: Apollo Server with Express
- **React Frontend**: Modern React with TypeScript
- **MySQL Database**: Sequelize ORM with proper relationships
- **Project Management**: Create and manage projects, tasks, and comments
- **Role-based Access**: Admin and user roles with proper permissions

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd react-graphql-mysql-app
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
npm install --prefix client
```

### 3. Database Setup
Create a MySQL database:
```sql
CREATE DATABASE graphql_app;
```

### 4. Environment Configuration
Copy the environment example and configure your settings:
```bash
cp env.example .env
```

Update the `.env` file with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=graphql_app
DB_USER=root
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_change_in_production
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=4000
NODE_ENV=development

# Client Configuration
VITE_API_URL=http://localhost:4000/graphql
```

### 5. Start Development Servers
```bash
# Start both client and server concurrently
npm run dev

# Or start them separately:
npm run dev:client  # Starts React dev server on http://localhost:3000
npm run dev:server  # Starts GraphQL server on http://localhost:4000
```

## 🎯 JWT with Refresh Tokens Authentication Flow

### Token Structure
- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal
- **Token Rotation**: New refresh token issued with each refresh

### Security Features
- **Automatic Token Refresh**: Tokens refreshed before expiration
- **Token Blacklisting**: Revoked tokens are blacklisted
- **Secure Storage**: Tokens stored in localStorage with proper management
- **Token Rotation**: Enhanced security with new refresh tokens on each refresh

### Authentication Flow
1. **Login/Register**: User receives both access and refresh tokens
2. **API Requests**: Access token automatically included in requests
3. **Token Refresh**: Automatic refresh when token expires or is about to expire
4. **Token Rotation**: New refresh token issued with each refresh
5. **Logout**: Both tokens blacklisted and cleared from storage

### Default Admin User
The system creates a default admin user on first run:
- **Email**: admin@example.com
- **Username**: admin
- **Password**: Admin123!
- **Role**: ADMIN

## 📊 Database Schema

### Core Tables
- **users**: User accounts with authentication
- **projects**: Project management
- **project_members**: Many-to-many relationship between users and projects
- **tasks**: Task management within projects
- **comments**: Comments on tasks

### Relationships
- Users can own multiple projects
- Users can be members of multiple projects
- Projects contain multiple tasks
- Tasks can have multiple comments
- Tasks can be assigned to users

## 🔧 API Endpoints

### GraphQL Endpoint
- **URL**: `http://localhost:4000/graphql`
- **Playground**: `http://localhost:4000/graphql` (in development)

### Key Queries
- `currentUser` - Get authenticated user
- `users` - List users (admin only)
- `projects` - List user's projects
- `tasks` - List tasks with filters

### Key Mutations
- `login` - User authentication (returns access + refresh tokens)
- `register` - User registration (returns access + refresh tokens)
- `refreshToken` - Refresh access token using refresh token
- `logout` - User logout (blacklists tokens)
- `createProject` - Create new project
- `createTask` - Create new task
- `updateTaskStatus` - Update task status

## 🛡️ Security Features

- **JWT with Refresh Tokens**: Secure token-based auth with automatic refresh
- **Token Rotation**: Enhanced security with new refresh tokens
- **Token Blacklisting**: Revoked tokens are blacklisted
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive validation on all inputs
- **Role-based Access**: Admin and user permissions
- **CORS Protection**: Configured for development and production
- **Security Headers**: XSS protection and content type validation

## 🚀 Deployment

### Production Build
```bash
# Build the client
npm run build

# Start production server
npm start
```

### Environment Variables
Make sure to update all environment variables for production:
- Use strong JWT secrets
- Configure production database
- Set proper CORS origins
- Enable production logging

## 📝 Development Notes

### Code Structure
- **Frontend**: React with TypeScript, Apollo Client with automatic token refresh
- **Backend**: Express with Apollo Server, Sequelize ORM
- **Database**: MySQL with proper relationships
- **Authentication**: JWT with refresh tokens and token rotation

### Best Practices
- Comprehensive error handling
- Input validation on all endpoints
- Proper TypeScript types
- React best practices with hooks
- Secure authentication flow with token rotation
- Automatic token refresh and management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
