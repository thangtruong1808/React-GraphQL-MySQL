import { useMutation, useLazyQuery } from '@apollo/client';
import {
  CREATE_USER_MUTATION,
  UPDATE_USER_MUTATION,
  DELETE_USER_MUTATION,
  CHECK_USER_DELETION_QUERY,
} from '../../../../services/graphql/userQueries';

/**
 * Custom hook for managing GraphQL mutations for users
 * Encapsulates all user-related mutations and queries
 */
export const useUsersMutations = () => {
  const [createUserMutation] = useMutation(CREATE_USER_MUTATION);
  const [updateUserMutation] = useMutation(UPDATE_USER_MUTATION);
  const [deleteUserMutation] = useMutation(DELETE_USER_MUTATION);
  const [checkUserDeletion] = useLazyQuery(CHECK_USER_DELETION_QUERY);

  return {
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    checkUserDeletion,
  };
};

