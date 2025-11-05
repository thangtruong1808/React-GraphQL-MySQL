import { gql } from '@apollo/client';
import { ACTIVITY_FRAGMENT } from './fragments';

/**
 * GraphQL Mutations for Activity Management
 * Provides CRUD operations for activities
 */

/**
 * Mutation to create a new activity
 * Creates an activity log entry
 */
export const CREATE_ACTIVITY_MUTATION = gql`
  ${ACTIVITY_FRAGMENT}
  mutation CreateActivity($input: ActivityInput!) {
    createActivity(input: $input) {
      ...ActivityFragment
    }
  }
`;

/**
 * Mutation to update an existing activity
 * Updates activity metadata and details
 */
export const UPDATE_ACTIVITY_MUTATION = gql`
  ${ACTIVITY_FRAGMENT}
  mutation UpdateActivity($id: ID!, $input: ActivityUpdateInput!) {
    updateActivity(id: $id, input: $input) {
      ...ActivityFragment
    }
  }
`;

/**
 * Mutation to delete an activity
 * Removes an activity log entry
 */
export const DELETE_ACTIVITY_MUTATION = gql`
  mutation DeleteActivity($id: ID!) {
    deleteActivity(id: $id)
  }
`;

