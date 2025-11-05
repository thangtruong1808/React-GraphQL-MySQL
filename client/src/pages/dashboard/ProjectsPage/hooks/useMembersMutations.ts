import { useMutation } from '@apollo/client';
import {
  ADD_PROJECT_MEMBER_MUTATION,
  UPDATE_PROJECT_MEMBER_ROLE_MUTATION,
  REMOVE_PROJECT_MEMBER_MUTATION,
} from '../../../../services/graphql/projectMemberQueries';

/**
 * Custom hook for managing GraphQL mutations for members
 * Encapsulates all member-related mutations
 */
export const useMembersMutations = () => {
  const [addMemberMutation] = useMutation(ADD_PROJECT_MEMBER_MUTATION);
  const [updateMemberRoleMutation] = useMutation(UPDATE_PROJECT_MEMBER_ROLE_MUTATION);
  const [removeMemberMutation] = useMutation(REMOVE_PROJECT_MEMBER_MUTATION);

  return {
    addMemberMutation,
    updateMemberRoleMutation,
    removeMemberMutation,
  };
};

