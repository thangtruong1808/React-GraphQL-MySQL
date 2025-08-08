# Activity Tracking Fix

## Issue Description

The application was experiencing a bug where the inactivity timer would reset even when the user moved their mouse outside the application window or to a different browser tab. This was causing false activity detection and preventing proper session timeout management.

## Root Cause

The original `useActivityTracker` hook was listening to `mousemove` events on the `window` object, which meant it would trigger activity updates even when the user was not actually interacting with the application. This included:

1. Mouse movements outside the application window
2. Mouse movements when the application tab was not focused
3. System-generated mouse events

## Solution Implemented

### 1. Created Focus-Based Activity Tracking

- **New Hook**: `useAppFocusedActivityTracker` - Only tracks activity when the application window is focused
- **Focus Detection**: Uses `document.hasFocus()` and `document.hidden` to determine if the app is active
- **Event Filtering**: Only processes user interaction events when the app is focused

### 2. Improved Event Handling

- **Removed `mousemove` tracking**: No longer tracks mouse movements to prevent false activity
- **Enhanced throttling**: Better throttling for high-frequency events like scrolling
- **System event filtering**: Filters out system-generated events

### 3. Centralized Constants

- **New Constants File**: `client/src/constants/activity.ts` - Contains all activity tracking configuration
- **Event Types**: Defined all user interaction events in one place
- **Feature Flags**: Configurable options for different tracking behaviors

### 4. Component Organization

- **Dedicated Component**: `ActivityTracker` component to handle activity tracking logic
- **Separation of Concerns**: Keeps App component focused on routing and layout
- **Better Maintainability**: Smaller, focused components

## Key Changes

### Files Modified/Created:

1. **`client/src/hooks/custom/useAppFocusedActivityTracker.ts`** (NEW)
   - Focus-based activity tracking
   - Visibility change detection
   - Enhanced event filtering

2. **`client/src/constants/activity.ts`** (NEW)
   - Centralized activity tracking constants
   - Event type definitions
   - Feature flags

3. **`client/src/components/activity/ActivityTracker.tsx`** (NEW)
   - Dedicated activity tracking component
   - Clean separation of concerns

4. **`client/src/App.tsx`** (MODIFIED)
   - Uses new ActivityTracker component
   - Removed direct hook usage

5. **`client/src/hooks/custom/useActivityTracker.ts`** (MODIFIED)
   - Updated to use new constants
   - Improved event handling

## Benefits

1. **Accurate Activity Detection**: Only tracks real user interactions with the application
2. **Proper Session Management**: Inactivity timers work correctly
3. **Better Performance**: Reduced unnecessary event processing
4. **Maintainable Code**: Centralized constants and smaller components
5. **Configurable**: Easy to adjust tracking behavior through constants

## Testing

To verify the fix works correctly:

1. **Login to the application**
2. **Move your mouse outside the application window** - Activity should NOT reset
3. **Switch to a different browser tab** - Activity should NOT reset
4. **Click back into the application** - Activity should only reset when you actually interact with the app
5. **Perform actual interactions** (clicking, typing, scrolling) - Activity should reset normally

## Configuration

Activity tracking behavior can be configured in `client/src/constants/activity.ts`:

```typescript
export const ACTIVITY_FEATURES = {
  ENABLE_FOCUS_BASED_TRACKING: true, // Only track when app is focused
  ENABLE_EVENT_THROTTLING: true,     // Throttle high-frequency events
  ENABLE_SYSTEM_EVENT_FILTERING: true, // Filter system events
  ENABLE_ACTIVITY_DEBUG_LOGGING: process.env.NODE_ENV === 'development',
} as const;
```

## Best Practices Followed

- ✅ **No database table drops** - Only frontend changes
- ✅ **React best practices** - Proper hooks, components, and state management
- ✅ **GraphQL/Apollo best practices** - No changes to GraphQL layer
- ✅ **Concise comments** - Each event and function documented
- ✅ **No layout/styling changes** - Only logic improvements
- ✅ **Constants file** - No hardcoded values in components
- ✅ **Component size limits** - Components under 300 lines
- ✅ **No secrets exposed** - Only frontend configuration
