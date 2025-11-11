import { useState, useCallback, useEffect } from 'react';
import { useTaskSubscriptions, UseTaskSubscriptionsOptions } from './useTaskSubscriptions';
import { Task } from '../../services/graphql/taskSubscriptions';

/**
 * Real-time Tasks Hook Options
 * Configuration options for real-time tasks hook
 */
export interface UseRealTimeTasksOptions extends UseTaskSubscriptionsOptions {
  showNotifications?: boolean;
  onError?: (error: Error) => void;
  initialTasks?: Task[];
}

/**
 * Custom hook for real-time task management
 * Provides real-time updates for task events with local state management
 * 
 * @param options - Configuration options for the hook
 * @returns Object containing task state and management functions
 */
export const useRealTimeTasks = (options: UseRealTimeTasksOptions) => {
  const { 
    projectId, 
    onTaskAdded, 
    onTaskUpdated, 
    onTaskDeleted, 
    onError,
    showNotifications = false,
    enabled = true,
    initialTasks = []
  } = options;

  // Local state for tasks
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);
  const [processedTaskIds, setProcessedTaskIds] = useState<Set<string>>(new Set());

  // Handle task added with state update
  const handleTaskAdded = useCallback((newTask: Task) => {
    // Check if this task has already been processed to prevent duplicates
    if (processedTaskIds.has(newTask.id)) {
      return; // Skip if already processed
    }
    
    setTasks(prev => {
      // Double-check if task already exists in state
      const taskExists = prev.some(task => task.id === newTask.id);
      if (taskExists) {
        return prev; // Don't add duplicate
      }
      return [newTask, ...prev]; // Add new task to beginning
    });
    
    // Mark task as processed
    setProcessedTaskIds(prev => {
      const next = new Set(prev);
      next.add(newTask.id);
      return next;
    });
    
    // Show notification if enabled and not within 2 seconds of last notification
    const now = Date.now();
    if (showNotifications && (now - lastNotificationTime) > 2000) {
      setNotifications(prev => [
        ...prev,
        `New task "${newTask.title}" added to project`
      ]);
      setLastNotificationTime(now);
    }
    
    // Call custom handler if provided
    if (onTaskAdded) {
      onTaskAdded(newTask);
    }
  }, [onTaskAdded, showNotifications, lastNotificationTime, processedTaskIds]);

  // Handle task updated with state update
  const handleTaskUpdated = useCallback((updatedTask: Task) => {
    setTasks(prev => 
      prev.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
    
    // Show notification if enabled and not within 2 seconds of last notification
    const now = Date.now();
    if (showNotifications && (now - lastNotificationTime) > 2000) {
      setNotifications(prev => [
        ...prev,
        `Task "${updatedTask.title}" was updated`
      ]);
      setLastNotificationTime(now);
    }
    
    // Call custom handler if provided
    if (onTaskUpdated) {
      onTaskUpdated(updatedTask);
    }
  }, [onTaskUpdated, showNotifications, lastNotificationTime]);

  // Handle task deleted with state update
  const handleTaskDeleted = useCallback((event: { taskId: string; projectId: string; deletedAt: string }) => {
    setTasks(prev => 
      prev.filter(task => task.id !== event.taskId)
    );
    
    // Show notification if enabled and not within 2 seconds of last notification
    const now = Date.now();
    if (showNotifications && (now - lastNotificationTime) > 2000) {
      setNotifications(prev => [
        ...prev,
        `Task deleted at ${new Date(event.deletedAt).toLocaleTimeString()}`
      ]);
      setLastNotificationTime(now);
    }
    
    setProcessedTaskIds(prev => {
      if (prev.has(event.taskId)) {
        const updated = new Set(prev);
        updated.delete(event.taskId);
        return updated;
      }
      return prev;
    });
    
    // Call custom handler if provided
    if (onTaskDeleted) {
      onTaskDeleted(event);
    }
  }, [onTaskDeleted, showNotifications, lastNotificationTime]);

  // Handle subscription errors
  const handleError = useCallback((error: Error) => {
    if (onError) {
      onError(error);
    }
  }, [onError]);

  // Use the subscription hook
  const subscription = useTaskSubscriptions({
    projectId,
    onTaskAdded: handleTaskAdded,
    onTaskUpdated: handleTaskUpdated,
    onTaskDeleted: handleTaskDeleted,
    enabled
  });

  // Update connection status
  const updateConnectionStatus = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);

  // Add task to local state (for optimistic updates)
  const addTask = useCallback((task: Task) => {
    setTasks(prev => [task, ...prev]);
  }, []);

  // Update task in local state (for optimistic updates)
  const updateTask = useCallback((task: Task) => {
    setTasks(prev => 
      prev.map(t => t.id === task.id ? task : t)
    );
  }, []);

  // Remove task from local state (for optimistic updates)
  const removeTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  // Clear all tasks
  const clearTasks = useCallback(() => {
    setTasks([]);
  }, []);

  // Set initial tasks
  const setInitialTasks = useCallback((incomingTasks: Task[]) => {
    setTasks(incomingTasks);
    setIsInitialized(true);
  }, []);

  // Initialize tasks when initialTasks change
  useEffect(() => {
    const incomingTasks = initialTasks as Task[];

    if (!isInitialized) {
      setTasks(incomingTasks);
      setIsInitialized(true);
      return;
    }

    setTasks(prevTasks => {
      if (incomingTasks.length === 0 && prevTasks.length === 0) {
        return prevTasks;
      }

      if (incomingTasks.length < prevTasks.length) {
        return prevTasks;
      }

      const incomingIds = new Set(incomingTasks.map(task => task.id));
      const prevIds = new Set(prevTasks.map(task => task.id));
      const sameComposition =
        prevTasks.length === incomingTasks.length &&
        prevTasks.every(task => incomingIds.has(task.id)) &&
        incomingTasks.every(task => prevIds.has(task.id));

      if (sameComposition) {
        return prevTasks;
      }

      return incomingTasks;
    });
  }, [initialTasks, isInitialized]);

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  // Clear last notification time when notifications are cleared
  useEffect(() => {
    if (notifications.length === 0) {
      setLastNotificationTime(0);
    }
  }, [notifications]);

  // Clean up processed task IDs periodically to prevent memory leaks
  useEffect(() => {
    const cleanup = setInterval(() => {
      setProcessedTaskIds(new Set()); // Clear processed IDs every 5 minutes
    }, 300000); // 5 minutes

    return () => clearInterval(cleanup);
  }, []);

  return {
    // Task state
    tasks,
    isConnected,
    notifications,
    
    // Loading states - only show loading during initial connection, not continuously
    loading: false, // Disable continuous loading to prevent infinite spinner
    
    // Subscription data
    addedData: subscription.addedData,
    updatedData: subscription.updatedData,
    deletedData: subscription.deletedData,
    
    // Management functions
    addTask,
    updateTask,
    removeTask,
    clearTasks,
    setInitialTasks,
    updateConnectionStatus,
    
    // Event handlers
    handleTaskAdded,
    handleTaskUpdated,
    handleTaskDeleted,
    handleError
  };
};
