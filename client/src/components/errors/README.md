# Database Error Handling Components

This directory contains components and utilities for handling database connection errors, specifically the "max_connections_per_hour" error.

## Components

### DatabaseConnectionError
A friendly error page that displays when database connection limits are exceeded.

**Features:**
- Clear explanation of the error
- User-friendly messaging
- Retry functionality
- Support contact information
- Technical details (collapsible)

### DatabaseErrorBoundary
A React error boundary that catches database connection errors and displays the appropriate error page.

**Usage:**
```tsx
import { DatabaseErrorBoundary } from './components/errors';

<DatabaseErrorBoundary>
  <YourComponent />
</DatabaseErrorBoundary>
```

## Utilities

### errorDetection.ts
Utility functions to detect and categorize database connection errors.

**Functions:**
- `isDatabaseConnectionLimitError(error)` - Detects connection limit errors
- `isDatabaseConnectionError(error)` - Detects general database connection errors
- `getDatabaseErrorMessage(error)` - Returns user-friendly error messages

### graphqlErrorHandler.ts
Utilities for handling GraphQL errors, especially database connection errors.

**Functions:**
- `isGraphQLDatabaseError(error)` - Detects database errors in GraphQL responses
- `getGraphQLErrorMessage(error)` - Returns user-friendly GraphQL error messages
- `shouldShowDatabaseErrorPage(error)` - Determines if database error page should be shown

## Hooks

### useDatabaseErrorHandler
A custom hook for handling database connection errors in components.

**Usage:**
```tsx
import { useDatabaseErrorHandler } from '../hooks/useDatabaseErrorHandler';

const MyComponent = () => {
  const { 
    showDatabaseError, 
    databaseErrorMessage, 
    handleError, 
    clearError, 
    handleRetry 
  } = useDatabaseErrorHandler();

  // Handle GraphQL errors
  const handleGraphQLError = (error) => {
    if (handleError(error)) {
      // Error was handled by the hook
      return;
    }
    // Handle other errors normally
  };

  if (showDatabaseError) {
    return (
      <DatabaseConnectionError 
        error={databaseErrorMessage}
        onRetry={handleRetry}
      />
    );
  }

  return <div>Your component content</div>;
};
```

## Integration

The database error boundary is automatically integrated into the main App component and will catch database connection errors throughout the application.

## Error Types Handled

- `max_connections_per_hour` - Database connection limit exceeded
- `Too many connections` - General connection limit errors
- `Connection limit exceeded` - Connection limit errors
- `ER_TOO_MANY_USER_CONNECTIONS` - MySQL connection limit errors
- `ECONNREFUSED` - Connection refused errors
- `Connection refused` - General connection refused errors
