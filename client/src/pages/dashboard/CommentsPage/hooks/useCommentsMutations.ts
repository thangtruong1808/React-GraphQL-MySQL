import { useMutation } from '@apollo/client';
import {
  CREATE_COMMENT_MUTATION,
  UPDATE_COMMENT_MUTATION,
  DELETE_COMMENT_MUTATION,
} from '../../../../services/graphql/commentQueries';

/**
 * Custom hook for managing GraphQL mutations
 * Handles all CRUD mutations for comments
 */
export const useCommentsMutations = () => {
  // Mutations for CRUD operations
  const [createCommentMutation] = useMutation(CREATE_COMMENT_MUTATION);
  const [updateCommentMutation] = useMutation(UPDATE_COMMENT_MUTATION);
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION);

  return {
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
  };
};

