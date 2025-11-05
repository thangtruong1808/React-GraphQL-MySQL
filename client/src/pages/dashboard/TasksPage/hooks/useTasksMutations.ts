import { useMutation } from '@apollo/client';
import {
  CREATE_TASK_MUTATION,
  UPDATE_TASK_MUTATION,
  DELETE_TASK_MUTATION,
} from '../../../../services/graphql/taskQueries';

/**
 * Custom hook for managing GraphQL mutations for tasks
 * Encapsulates all task-related mutations
 */
export const useTasksMutations = () => {
  const [createTaskMutation] = useMutation(CREATE_TASK_MUTATION);
  const [updateTaskMutation] = useMutation(UPDATE_TASK_MUTATION);
  const [deleteTaskMutation] = useMutation(DELETE_TASK_MUTATION);

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
};

