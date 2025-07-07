# React GraphQL MySQL App

A modern full-stack application built with React, Apollo GraphQL, and MySQL following best practices for scalable development.

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Apollo Client** - GraphQL client with caching and state management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Apollo Server** - GraphQL server
- **TypeScript** - Type-safe backend development
- **MySQL** - Relational database
- **mysql2** - MySQL client for Node.js
- **JWT** - Authentication and authorization

## 📁 Project Structure

```
react-graphql-mysql-app/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── admin/          # Admin-specific components
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── common/         # Shared components
│   │   │   ├── forms/          # Form components
│   │   │   ├── layout/         # Layout components
│   │   │   └── ui/             # Base UI components
│   │   ├── pages/              # Page components
│   │   │   ├── auth/           # Authentication pages
│   │   │   ├── dashboard/      # Dashboard pages
│   │   │   └── home/           # Home page
│   │   ├── services/           # API and service layer
│   │   │   ├── api/            # REST API services
│   │   │   └── graphql/        # GraphQL queries and mutations
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── custom/         # General custom hooks
│   │   │   └── graphql/        # GraphQL-specific hooks
│   │   ├── utils/              # Utility functions
│   │   │   ├── helpers/        # Helper functions
│   │   │   └── validation/     # Form validation
│   │   └── types/              # TypeScript type definitions
│   │       ├── api/            # API types
│   │       └── graphql/        # GraphQL types
│   └── package.json
├── server/                     # GraphQL backend
│   ├── auth/                   # Authentication logic
│   ├── db/                     # Database configuration and models
│   ├── graphql/                # GraphQL schema and resolvers
│   └── utils/                  # Backend utilities
├── api/                        # API entry point
├── types/                      # Shared TypeScript types
└── package.json
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

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
cd client
npm install

# Install server dependencies (if separate)
cd ../server
npm install
```

### 3. Environment Configuration
Copy the example environment file and configure your database:
```bash
cp env.example .env
```

Update the `.env` file with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=graphql_app
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=4000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 4. Database Setup
Create a MySQL database and run the setup script:
```sql
CREATE DATABASE graphql_app;
USE graphql_app;
```

The database tables will be created automatically when you start the server.

### 5. Start Development Servers
```bash
# Start both client and server concurrently
npm run dev

# Or start them separately:
npm run dev:client  # Starts React dev server on http://localhost:3000
npm run dev:server  # Starts GraphQL server on http://localhost:4000
```

## 🎯 Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Role-based access control

### Project Management
- Create and manage projects
- Team collaboration
- Project member roles
- Project status tracking

### Task Management
- Create and assign tasks
- Task status updates
- Priority levels
- Due date tracking
- Comments and discussions

### Real-time Updates
- GraphQL subscriptions
- Live updates for comments
- Real-time notifications

## 🔧 Development

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Consistent naming conventions

### Best Practices
- Component composition
- Custom hooks for logic reuse
- Form validation
- Error handling
- Loading states
- Responsive design

### Testing
- Unit tests for utilities
- Component testing
- Integration tests
- E2E testing (planned)

## 📚 API Documentation

### GraphQL Endpoint
- **URL**: `http://localhost:4000/graphql`
- **Playground**: `http://localhost:4000/graphql` (in development)

### Key Queries
- `currentUser` - Get authenticated user
- `projects` - List user's projects
- `tasks` - List tasks with filters
- `users` - List users (admin only)

### Key Mutations
- `login` - User authentication
- `register` - User registration
- `createProject` - Create new project
- `createTask` - Create new task
- `updateTaskStatus` - Update task status

## 🚀 Deployment

### Frontend Deployment
```bash
cd client
npm run build
```

### Backend Deployment
```bash
cd server
npm run build
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Configure production database
- Set secure JWT secret
- Configure CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the GraphQL schema

## 🔄 Updates

Stay updated with the latest changes:
- Follow the repository
- Check the changelog
- Review release notes
