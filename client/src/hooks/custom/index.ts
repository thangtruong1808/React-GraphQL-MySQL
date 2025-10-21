/**
 * Custom Hooks Index
 * Exports all custom hooks for easy importing
 */

// Activity tracking hooks
export { useActivityTracker } from './useActivityTracker';
export { useAppActivityTracker } from './useAppActivityTracker';
export { useAppFocusedActivityTracker } from './useAppFocusedActivityTracker';
export { useActivityErrorHandler } from './useActivityErrorHandler';

// Authentication hooks
export { useAuthenticatedMutation } from './useAuthenticatedMutation';

// Search hooks
export { useSearchResults } from './useSearchResults';
export { useInfiniteScrollProjects } from './useInfiniteScrollProjects';

// Comment subscription hooks
export { useCommentSubscriptions } from './useCommentSubscriptions';
export { useRealTimeComments } from './useRealTimeComments';
