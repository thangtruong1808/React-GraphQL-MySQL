# Frontend Constants Documentation

This directory contains centralized constants for the React GraphQL application, following best practices for maintainability and consistency.

## Overview

The constants are organized into logical groups and exported from a single `index.ts` file for easy importing throughout the application.

## Structure

### `index.ts` - Main Constants File

Contains all centralized constants organized into the following categories:

#### API Configuration (`API_CONFIG`)
- **GRAPHQL_URL**: GraphQL endpoint URL
- **REQUEST_TIMEOUT**: Request timeout in milliseconds
- **MAX_RETRIES**: Maximum retry attempts for failed requests
- **RETRY_DELAY**: Delay between retry attempts

#### Authentication Configuration (`AUTH_CONFIG`)
- **ACCESS_TOKEN_KEY**: Key for storing access tokens in session storage
- **USER_DATA_KEY**: Key for storing user data in session storage
- **TOKEN_EXPIRY_KEY**: Key for storing token expiry timestamps
- **REFRESH_ATTEMPT_KEY**: Key for tracking refresh attempts
- **TOKEN_REFRESH_THRESHOLD**: Time before expiry to refresh tokens
- **MAX_REFRESH_ATTEMPTS**: Maximum refresh attempts allowed
- **SESSION_DURATION**: Session duration in milliseconds
- **SESSION_KEYS**: Keys for session storage

#### Validation Configuration (`VALIDATION_CONFIG`)
- **EMAIL_REGEX**: Email validation regex pattern
- **EMAIL_MAX_LENGTH**: Maximum email length
- **PASSWORD_MIN_LENGTH**: Minimum password length
- **PASSWORD_REGEX**: Password validation regex pattern
- **PASSWORD_REQUIREMENTS**: Detailed password requirements
- **NAME_MIN_LENGTH**: Minimum name length
- **NAME_MAX_LENGTH**: Maximum name length
- **USERNAME_MIN_LENGTH**: Minimum username length
- **USERNAME_MAX_LENGTH**: Maximum username length
- **USERNAME_REGEX**: Username validation regex pattern
- **TITLE_MIN_LENGTH**: Minimum title length
- **TITLE_MAX_LENGTH**: Maximum title length
- **DESCRIPTION_MIN_LENGTH**: Minimum description length
- **DESCRIPTION_MAX_LENGTH**: Maximum description length

#### UI Configuration (`UI_CONFIG`)
- **COLORS**: Australian-themed color palette
  - PRIMARY: Green shades (emerald)
  - SECONDARY: Blue shades
  - ACCENT: Yellow shades
  - NEUTRAL: Gray shades
  - SUCCESS, WARNING, ERROR, INFO: Status colors
- **SPACING**: Consistent spacing values
- **BORDER_RADIUS**: Border radius values
- **SHADOWS**: Box shadow values
- **TRANSITIONS**: Transition timing values
- **Z_INDEX**: Z-index hierarchy values

#### Error Messages (`ERROR_MESSAGES`)
Centralized error messages for consistency across the application:
- Authentication errors
- Validation errors
- Form errors
- Network errors
- Permission errors
- General errors

#### Success Messages (`SUCCESS_MESSAGES`)
Centralized success messages for consistency:
- Authentication success
- User operations success
- Data operations success
- Form submissions success

#### Routes (`ROUTES`)
Centralized route definitions:
- Public routes (HOME, LOGIN, REGISTER)
- Protected routes (DASHBOARD, PROJECTS, TASKS, etc.)
- API routes (GRAPHQL, HEALTH)

#### User Roles (`USER_ROLES`)
Defined user roles:
- ADMIN
- MANAGER
- DEVELOPER

#### Feature Flags (`FEATURE_FLAGS`)
Feature toggles for enabling/disabling features:
- DEBUG_MODE: Development mode flag
- ENABLE_NOTIFICATIONS: Notifications feature flag
- ENABLE_REAL_TIME_UPDATES: Real-time updates flag
- ENABLE_ANALYTICS: Analytics feature flag
- ENABLE_EXPERIMENTAL_FEATURES: Experimental features flag

#### Storage Keys (`STORAGE_KEYS`)
Consistent keys for localStorage and sessionStorage:
- Authentication keys
- Settings keys
- Cache keys

#### HTTP Status Codes (`HTTP_STATUS`)
Common HTTP status codes for error handling.

### `navigation.ts` - Navigation Configuration

Contains navigation-specific constants and utilities:
- **NavItem**: Interface for navigation items
- **NAV_ITEMS**: Array of navigation items with role-based access
- **getNavItemsForUser()**: Function to filter navigation items by user role
- **getMobileNavItems()**: Function to get mobile-optimized navigation items

## Usage Examples

### Importing Constants

```typescript
import { 
  API_CONFIG, 
  AUTH_CONFIG, 
  VALIDATION_CONFIG, 
  ERROR_MESSAGES, 
  ROUTES 
} from '../constants';
```

### Using API Configuration

```typescript
// Apollo Client configuration
const httpLink = createHttpLink({
  uri: API_CONFIG.GRAPHQL_URL,
  fetchOptions: {
    timeout: API_CONFIG.REQUEST_TIMEOUT,
  },
});
```

### Using Validation Configuration

```typescript
// Form validation
const validateEmail = (email: string): boolean => {
  return VALIDATION_CONFIG.EMAIL_REGEX.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= VALIDATION_CONFIG.PASSWORD_MIN_LENGTH;
};
```

### Using Error Messages

```typescript
// Consistent error handling
if (!email) {
  setError(ERROR_MESSAGES.EMAIL_REQUIRED);
}

if (loginFailed) {
  setError(ERROR_MESSAGES.LOGIN_FAILED);
}
```

### Using Routes

```typescript
// Navigation
navigate(ROUTES.DASHBOARD);

// Link components
<Link to={ROUTES.LOGIN}>Sign In</Link>
```

### Using UI Configuration

```typescript
// Styling with consistent colors
const buttonStyle = {
  backgroundColor: UI_CONFIG.COLORS.PRIMARY[500],
  borderRadius: UI_CONFIG.BORDER_RADIUS.LG,
  boxShadow: UI_CONFIG.SHADOWS.MD,
};
```

## Best Practices

### 1. Always Use Constants
- Never hardcode values in components
- Use centralized constants for all configuration values
- This ensures consistency and makes maintenance easier

### 2. Type Safety
- All constants are typed with `as const` for better TypeScript support
- Use TypeScript interfaces for complex constant structures

### 3. Environment Variables
- Use environment variables for sensitive configuration
- Provide fallback values for development

### 4. Documentation
- Keep constants well-documented with JSDoc comments
- Group related constants logically
- Use descriptive names for all constants

### 5. Validation
- Use centralized validation rules
- Keep validation logic consistent across the application
- Update validation rules in one place

### 6. Error Handling
- Use centralized error messages
- Maintain consistent error messaging
- Support internationalization if needed

### 7. Testing
- Test constants for correct values
- Ensure constants are properly imported
- Validate that constants are used consistently

## Migration Guide

When migrating from hardcoded values to constants:

1. **Identify hardcoded values** in your components
2. **Add appropriate constants** to the centralized file
3. **Update imports** to use the new constants
4. **Test thoroughly** to ensure functionality is preserved
5. **Update documentation** to reflect the changes

## Security Considerations

- Never store sensitive information in constants
- Use environment variables for API keys and secrets
- Keep validation rules secure and up-to-date
- Ensure error messages don't expose sensitive information

## Performance Considerations

- Constants are evaluated at build time
- No runtime performance impact
- Tree-shaking works effectively with named exports
- Bundle size is minimal for constants

## Maintenance

- Review constants regularly for accuracy
- Update constants when requirements change
- Ensure all team members use the centralized constants
- Document any changes to constants
- Test applications after constant updates 