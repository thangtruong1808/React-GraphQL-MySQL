import { useMutation, useLazyQuery } from '@apollo/client';
import {
  CREATE_PROJECT_MUTATION,
  UPDATE_PROJECT_MUTATION,
  DELETE_PROJECT_MUTATION,
  CHECK_PROJECT_DELETION_QUERY,
} from '../../../../services/graphql/projectQueries';

/**
 * Custom hook for managing GraphQL mutations for projects
 * Encapsulates all project-related mutations
 */
export const useProjectsMutations = () => {
  const [createProjectMutation] = useMutation(CREATE_PROJECT_MUTATION);
  const [updateProjectMutation] = useMutation(UPDATE_PROJECT_MUTATION);
  const [deleteProjectMutation] = useMutation(DELETE_PROJECT_MUTATION);
  const [checkProjectDeletion] = useLazyQuery(CHECK_PROJECT_DELETION_QUERY);

  return {
    createProjectMutation,
    updateProjectMutation,
    deleteProjectMutation,
    checkProjectDeletion,
  };
};

