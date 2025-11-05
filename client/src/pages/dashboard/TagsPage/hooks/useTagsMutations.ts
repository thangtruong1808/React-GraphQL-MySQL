import { useMutation } from '@apollo/client';
import {
  CREATE_TAG_MUTATION,
  UPDATE_TAG_MUTATION,
  DELETE_TAG_MUTATION,
} from '../../../../services/graphql/tagsQueries';

/**
 * Custom hook for managing GraphQL mutations for tags
 * Encapsulates all tag-related mutations
 */
export const useTagsMutations = () => {
  const [createTagMutation] = useMutation(CREATE_TAG_MUTATION);
  const [updateTagMutation] = useMutation(UPDATE_TAG_MUTATION);
  const [deleteTagMutation] = useMutation(DELETE_TAG_MUTATION);

  return {
    createTagMutation,
    updateTagMutation,
    deleteTagMutation,
  };
};

