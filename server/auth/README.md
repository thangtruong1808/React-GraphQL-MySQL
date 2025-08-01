# Authentication Guards Documentation

This directory contains the authentication and authorization system for the GraphQL application.

## Overview

The authentication system consists of several components that work together to provide secure access control:

- **`jwt.ts`**: JWT token generation and verification
- **`middleware.ts`**: Express middleware for authentication
- **`guard.ts`**: GraphQL resolver protection with role-based access control
- **`csrf.ts`**: CSRF protection for mutations

## Guard System

The guard system provides a clean, reusable way to protect GraphQL resolvers with authentication and authorization checks.

### Available Guards

#### 1. `authGuard`
Basic authentication check - ensures user is logged in.

```typescript
import { withAuth, authGuard } from '../auth/guard';

// Basic authentication
const myResolver = withAuth((_, __, context) => {
  // User is guaranteed to be authenticated here
  return context.user;
}, authGuard);
```

#### 2. `roleGuard`
Role-based authorization - ensures user has minimum required role.

```typescript
import { withRole } from '../auth/guard';

// Manager or higher role required
const managerResolver = withRole((_, __, context) => {
  // User has MANAGER or ADMIN role
  return { data: [] };
}, 'MANAGER');
```

#### 3. `adminGuard`
Admin-only access - ensures user has ADMIN role.

```typescript
import { withAdmin } from '../auth/guard';

// Admin only
const adminResolver = withAdmin((_, __, context) => {
  // User has ADMIN role
  return { adminData: [] };
});
```

#### 4. `managerGuard`
Manager or higher access - ensures user has MANAGER or ADMIN role.

```typescript
import { withManager } from '../auth/guard';

// Manager or admin
const managerResolver = withManager((_, __, context) => {
  // User has MANAGER or ADMIN role
  return { teamData: [] };
});
```

### Role Hierarchy

Roles are defined in `server/constants/index.ts`:

```typescript
export const AUTHZ_CONFIG = {
  ROLES: {
    DEVELOPER: 1,  // Lowest level
    MANAGER: 2,    // Middle level
    ADMIN: 3,      // Highest level
  },
};
```

- **DEVELOPER**: Basic access to assigned resources
- **MANAGER**: Can manage teams and projects
- **ADMIN**: Full system access

### Usage Examples

#### Basic Authentication
```typescript
// Query: Get current user profile
const getMyProfile = withAuth((_, __, context) => {
  return context.user;
}, authGuard);
```

#### Role-Based Access
```typescript
// Query: Get all users (admin only)
const getAllUsers = withAdmin(async (_, __, context) => {
  const users = await User.findAll();
  return users;
});

// Mutation: Create project (manager or admin)
const createProject = withManager(async (_, { input }, context) => {
  const project = await Project.create(input);
  return project;
});
```

#### Custom Guards
```typescript
// Custom guard with additional business logic
const updateMyProfile = withAuth(async (_, { input }, context) => {
  // Additional validation: user can only update their own profile
  if (input.userId !== context.user.id) {
    throw new Error('Can only update own profile');
  }
  
  const updatedUser = await User.update(input, { where: { id: context.user.id } });
  return updatedUser;
}, (context) => {
  // Custom guard logic
  if (!context.user) {
    throw new Error('Authentication required');
  }
  return context.user;
});
```

### Integration with Resolvers

To use guards in your resolvers:

1. **Import the guards**:
```typescript
import { withAuth, withRole, withAdmin, withManager } from '../auth/guard';
```

2. **Wrap your resolver**:
```typescript
export const resolvers = {
  Query: {
    currentUser: withAuth(getCurrentUser, authGuard),
    adminDashboard: withAdmin(getAdminDashboard),
    managerReports: withManager(getManagerReports),
  },
  Mutation: {
    createUser: withAdmin(createUser),
    assignProject: withManager(assignProject),
  },
};
```

### Error Handling

Guards automatically handle authentication and authorization errors:

- **UNAUTHENTICATED**: User is not logged in
- **FORBIDDEN**: User doesn't have required permissions
- **INTERNAL_SERVER_ERROR**: Unexpected errors

### Best Practices

1. **Use the most restrictive guard**: Choose the guard that provides the minimum required access
2. **Keep business logic separate**: Guards handle authentication/authorization, resolvers handle business logic
3. **Test guards independently**: Ensure guards work correctly before adding business logic
4. **Document role requirements**: Clearly document which roles can access which operations
5. **Use consistent naming**: Follow the established patterns for guard usage

### Future Expansion

The guard system is designed to be easily expandable:

1. **Add new roles**: Update `AUTHZ_CONFIG.ROLES` in constants
2. **Create custom guards**: Use `withAuth` with custom guard functions
3. **Add resource-based guards**: Create guards that check resource ownership
4. **Add time-based guards**: Create guards that check time-based permissions

### Security Considerations

- Guards run before resolver execution, preventing unauthorized access
- Role checks use numeric comparison for security
- All authentication errors are properly handled and logged
- Guards integrate with the existing CSRF protection system

## Related Files

- `server/graphql/resolvers/auth/guards-example.ts`: Comprehensive examples
- `server/constants/index.ts`: Role definitions and configuration
- `server/graphql/resolvers/auth/index.ts`: Current implementation 