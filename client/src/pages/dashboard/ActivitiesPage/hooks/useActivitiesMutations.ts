import { useMutation } from '@apollo/client';
import {
  CREATE_ACTIVITY_MUTATION,
  UPDATE_ACTIVITY_MUTATION,
  DELETE_ACTIVITY_MUTATION,
} from '../../../../services/graphql/activityQueries';

/**
 * Custom hook for managing GraphQL mutations
 * Handles all CRUD mutations for activities
 */
export const useActivitiesMutations = () => {
  // Mutations for CRUD operations
  const [createActivityMutation] = useMutation(CREATE_ACTIVITY_MUTATION);
  const [updateActivityMutation] = useMutation(UPDATE_ACTIVITY_MUTATION);
  const [deleteActivityMutation] = useMutation(DELETE_ACTIVITY_MUTATION);

  return {
    createActivityMutation,
    updateActivityMutation,
    deleteActivityMutation,
  };
};

