# Activity Tracking System

This document describes the comprehensive activity tracking system implemented in the React GraphQL application.

## Overview

The activity tracking system monitors user interactions to determine if a user is active or inactive, and manages authentication tokens accordingly. The system supports both traditional fixed token expiry and a new activity-based token expiry system.

## Configuration

### Constants (client/src/constants/index.ts)

```typescript
export const AUTH_CONFIG = {
  // Session management
  SESSION_DURATION: 60 * 60 * 1000, // 1 hour
  
  // Activity tracking for session management
  ACTIVITY_CHECK_INTERVAL: 2000, // Check user activity every 2 seconds
  INACTIVITY_THRESHOLD: 1 * 60 * 1000, // 1 minute of inactivity before logout
  ACTIVITY_THROTTLE_DELAY: 1000, // Throttle high-frequency events (mousemove, scroll) to 1 second
  
  // Activity-based token configuration
  ACTIVITY_BASED_TOKEN_ENABLED: true, // Enable activity-based token expiry
  ACTIVITY_TOKEN_EXPIRY: 1 * 60 * 1000, // 1 minute from last activity in milliseconds
  ACTIVITY_TOKEN_REFRESH_THRESHOLD: 30 * 1000, // Refresh token when 30 seconds remaining
  
  // Token refresh thresholds for proactive refresh
  TOKEN_REFRESH_WARNING_THRESHOLD: 30 * 1000, // 30 seconds - warning threshold (red)
  TOKEN_REFRESH_CAUTION_THRESHOLD: 60 * 1000, // 60 seconds - caution threshold (yellow)
  
  // Refresh token configuration (matches server REFRESH_TOKEN_EXPIRY)
  REFRESH_TOKEN_EXPIRY_MS: 5 * 60 * 1000, // 5 minutes in milliseconds
} as const;
```

### Server Constants (server/constants/index.ts)

```typescript
export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '1m', // 1 minute
  REFRESH_TOKEN_EXPIRY: '5m', // 5 minutes
  REFRESH_TOKEN_EXPIRY_MS: 5 * 60 * 1000, // 5 minutes in milliseconds
  
  // Activity-based token configuration
  ACTIVITY_BASED_TOKEN_ENABLED: true, // Enable activity-based token expiry
  ACTIVITY_TOKEN_EXPIRY: '1m', // 1 minute from last activity
  ACTIVITY_TOKEN_EXPIRY_MS: 1 * 60 * 1000, // 1 minute in milliseconds
} as const;
```

## How It Works

### Activity-Based Token Expiry System

The new activity-based token expiry system works as follows:

1. **Token Storage**: When tokens are stored, an activity-based expiry timestamp is initialized to 1 minute from the current time.

2. **Activity Detection**: When user activity is detected, the activity-based expiry timestamp is reset to 1 minute from the current time.

3. **Token Validation**: The system checks if the activity-based token is expired by comparing the current time with the activity-based expiry timestamp.

4. **Proactive Refresh**: When the activity-based token is more than halfway through its lifetime (30 seconds remaining), it proactively refreshes the token.

### User Interaction Events

The system tracks comprehensive user interactions:

- **Mouse Events**: `mousedown`, `mouseup`, `click`, `dblclick`, `mousemove` (throttled)
- **Keyboard Events**: `keydown`, `keyup`, `keypress`
- **Touch Events**: `touchstart`, `touchend`, `touchmove`
- **Scroll Events**: `scroll` (throttled), `wheel`
- **Form Events**: `focus`, `blur`, `input`, `change`, `submit`
- **Navigation Events**: `beforeunload`

### Throttling

High-frequency events like `mousemove` and `scroll` are throttled to 1 second to prevent excessive activity updates.

## Key Features

### 1. Activity-Based Token Expiry
- **Active Users**: Access token expiry resets from last activity time
- **Inactive Users**: Access token expires based on inactivity threshold
- **Proactive Refresh**: Tokens are refreshed before expiry for active users

### 2. Comprehensive Activity Tracking
- Monitors all user interactions across the application
- Filters out system-generated events using `event.isTrusted`
- Uses passive event listeners for performance

### 3. Configurable Timeouts
- Activity check interval: 2 seconds
- Inactivity threshold: 1 minute
- Activity token expiry: 1 minute from last activity
- Refresh token expiry: 5 minutes (absolute timeout)

### 4. Debug Support
- Real-time activity monitoring via ActivityDebugger component
- Displays both fixed and activity-based token expiry information
- Shows user activity status and time since last activity

## Token Management Flow

### For Active Users:
1. User performs any interaction
2. Activity timestamp is updated
3. Activity-based token expiry is reset to 1 minute from now
4. If token is more than halfway through lifetime, it's proactively refreshed
5. User remains logged in

### For Inactive Users:
1. No user activity for 1 minute
2. Activity-based token expires
3. User is automatically logged out
4. User must login again

### Absolute Timeout:
1. Refresh token expires after 5 minutes (regardless of activity)
2. User is automatically logged out
3. User must login again

## Benefits

1. **Better User Experience**: Active users stay logged in longer
2. **Security**: Inactive users are logged out promptly
3. **Performance**: Efficient activity tracking with throttling
4. **Maintainability**: Centralized configuration and clear separation of concerns
5. **Debugging**: Comprehensive debug information for troubleshooting
6. **Easy Configuration**: All timeout values are centralized in constants for easy maintenance

## Maintainability

All authentication timeout values are centralized in the constants files:

### Client-Side Constants (`client/src/constants/index.ts`)
- All timeout values, thresholds, and intervals are defined as constants
- No hardcoded values in components or utilities
- Easy to modify timeout behavior by changing constants
- Clear documentation for each constant's purpose

### Server-Side Constants (`server/constants/index.ts`)
- JWT token expiry times are defined as constants
- Activity-based token configuration is centralized
- Consistent with client-side configuration

### Benefits of Centralized Constants:
- **Single Source of Truth**: All timeout values defined in one place
- **Easy Maintenance**: Change timeout behavior by updating constants
- **Consistency**: Ensures client and server use same values
- **Documentation**: Clear comments explain each constant's purpose
- **Type Safety**: TypeScript ensures proper usage of constants

## Usage

The activity tracking system is automatically initialized when a user logs in and is managed by the `AuthContext`. The `ActivityDebugger` component provides real-time visibility into the system's operation during development. 