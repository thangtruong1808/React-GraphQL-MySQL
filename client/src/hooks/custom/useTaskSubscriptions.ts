import { useSubscription } from '@apollo/client';
import { useCallback, useEffect } from 'react';
import { 
  TASK_ADDED_SUBSCRIPTION, 
  TASK_UPDATED_SUBSCRIPTION, 
  TASK_DELETED_SUBSCRIPTION,
  TaskAddedEvent,
  TaskUpdatedEvent,
  TaskDeletedEvent,
  Task
} from '../../services/graphql/taskSubscriptions';

/**
 * Task Subscription Hook Options
 * Configuration options for task subscription hook
 */
export interface UseTaskSubscriptionsOptions {
  projectId: string;
  onTaskAdded?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
  onTaskDeleted?: (event: TaskDeletedEvent['taskDeleted']) => void;
  enabled?: boolean;
}

/**
 * Custom hook for real-time task subscriptions
 * Provides real-time updates for task events in a project
 * 
 * @param options - Configuration options for the subscription
 * @returns Object containing subscription data and loading states
 */
export const useTaskSubscriptions = (options: UseTaskSubscriptionsOptions) => {
  const { 
    projectId, 
    onTaskAdded, 
    onTaskUpdated, 
    onTaskDeleted, 
    enabled = true 
  } = options;

  // Subscribe to task added events
  const { data: addedData, loading: addedLoading } = useSubscription<TaskAddedEvent>(
    TASK_ADDED_SUBSCRIPTION,
    {
      variables: { projectId },
      skip: !enabled
    }
  );

  // Subscribe to task updated events
  const { data: updatedData, loading: updatedLoading } = useSubscription<TaskUpdatedEvent>(
    TASK_UPDATED_SUBSCRIPTION,
    {
      variables: { projectId },
      skip: !enabled
    }
  );

  // Subscribe to task deleted events
  const { data: deletedData, loading: deletedLoading } = useSubscription<TaskDeletedEvent>(
    TASK_DELETED_SUBSCRIPTION,
    {
      variables: { projectId },
      skip: !enabled
    }
  );

  // Handle task added event
  const handleTaskAdded = useCallback((task: Task) => {
    if (onTaskAdded) {
      onTaskAdded(task);
    }
  }, [onTaskAdded]);

  // Handle task updated event
  const handleTaskUpdated = useCallback((task: Task) => {
    if (onTaskUpdated) {
      onTaskUpdated(task);
    }
  }, [onTaskUpdated]);

  // Handle task deleted event
  const handleTaskDeleted = useCallback((event: TaskDeletedEvent['taskDeleted']) => {
    if (onTaskDeleted) {
      onTaskDeleted(event);
    }
  }, [onTaskDeleted]);

  // Effect to handle subscription data changes - only trigger once per event
  useEffect(() => {
    if (addedData?.taskAdded) {
      handleTaskAdded(addedData.taskAdded);
    }
  }, [addedData, handleTaskAdded]);

  useEffect(() => {
    if (updatedData?.taskUpdated) {
      handleTaskUpdated(updatedData.taskUpdated);
    }
  }, [updatedData, handleTaskUpdated]);

  useEffect(() => {
    if (deletedData?.taskDeleted) {
      handleTaskDeleted(deletedData.taskDeleted);
    }
  }, [deletedData, handleTaskDeleted]);

  return {
    // Subscription data
    addedData: addedData?.taskAdded,
    updatedData: updatedData?.taskUpdated,
    deletedData: deletedData?.taskDeleted,
    
    // Loading states
    loading: addedLoading || updatedLoading || deletedLoading,
    addedLoading,
    updatedLoading,
    deletedLoading,
    
    // Event handlers
    handleTaskAdded,
    handleTaskUpdated,
    handleTaskDeleted
  };
};
