# Activity Tracking System

This directory contains hooks for tracking user activity at both the application level and user interaction level.

## Overview

The activity tracking system monitors comprehensive user interactions to determine if a user is actively using the application. It tracks both meaningful application actions and basic user interactions like mouse movements, keystrokes, clicks, and touch events.

## Hooks

### `useActivityTracker`

**Purpose**: Automatically tracks navigation and comprehensive user interactions.

**Features**:
- Tracks route changes (navigation between pages)
- Monitors mouse movements, clicks, and scroll events (throttled)
- Tracks keyboard input (keystrokes)
- Monitors touch interactions (mobile devices)
- Tracks form interactions (focus, input, submit)
- Automatically updates activity timestamp
- Throttles high-frequency events (mousemove, scroll) to improve performance

**Tracked Events**:
- Mouse: `mousedown`, `mouseup`, `click`, `dblclick`, `mousemove`, `wheel`
- Keyboard: `keydown`, `keyup`, `keypress`
- Touch: `touchstart`, `touchend`, `touchmove`
- Scroll: `scroll`
- Forms: `focus`, `blur`, `input`, `change`, `submit`
- Navigation: `beforeunload`

**Usage**:
```tsx
import { useActivityTracker } from './hooks/custom/useActivityTracker';

function App() {
  useActivityTracker(); // Automatically tracks navigation and user interactions
  return <div>...</div>;
}
```

### `useAppActivityTracker`

**Purpose**: Provides functions to manually track specific application actions.

**Available Functions**:
- `trackFormSubmission()` - Call when user submits forms
- `trackDataOperation()` - Call when user performs CRUD operations
- `trackApiCall()` - Call when user triggers API calls
- `trackPreferenceChange()` - Call when user changes settings
- `trackAppAction(actionName)` - Generic function for any application action

**Usage**:
```tsx
import { useAppActivityTracker } from './hooks/custom/useAppActivityTracker';

function LoginForm() {
  const { trackFormSubmission } = useAppActivityTracker();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    trackFormSubmission(); // Track this meaningful action
    // ... rest of form submission logic
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Configuration

Activity tracking settings are configured in `client/src/constants/index.ts`:

```typescript
export const AUTH_CONFIG = {
  // Session management
  SESSION_DURATION: 60 * 60 * 1000, // 1 hour
  
  // Activity tracking for session management
  ACTIVITY_CHECK_INTERVAL: 2000, // Check user activity every 2 seconds
  INACTIVITY_THRESHOLD: 1 * 60 * 1000, // 1 minute of inactivity before logout
} as const;
```

## Authentication Flow

The activity tracking system works in conjunction with the authentication system:

1. **Active User**: When users interact with the application (mouse, keyboard, touch, etc.), their activity timestamp is updated
2. **Token Refresh**: Active users get their access tokens refreshed proactively (when token is more than halfway through its 1-minute lifetime)
3. **Inactive User**: Users who don't interact for 1 minute are automatically logged out
4. **Absolute Timeout**: Users are logged out after 5 minutes regardless of activity (refresh token expiry)

## Performance Considerations

- High-frequency events (mousemove, scroll) are throttled to update activity at most once per second
- Event listeners use `passive: true` for better performance
- System-generated events are filtered out using `event.isTrusted`
- Event listeners are properly cleaned up to prevent memory leaks 