import { gql } from '@apollo/client';

/**
 * GraphQL Subscriptions for Comment Management
 * Provides real-time comment updates for collaborative discussions
 */

// Fragment for comment data in subscriptions
export const COMMENT_SUBSCRIPTION_FRAGMENT = gql`
  fragment CommentSubscriptionFragment on Comment {
    id
    uuid
    content
    author {
      id
      uuid
      firstName
      lastName
      email
      role
    }
    task {
      id
      uuid
      title
      project {
        id
        uuid
        name
      }
    }
    isDeleted
    version
    createdAt
    updatedAt
    likesCount
    isLikedByUser
  }
`;

// Fragment for comment deleted event
export const COMMENT_DELETED_FRAGMENT = gql`
  fragment CommentDeletedFragment on CommentDeletedEvent {
    commentId
    projectId
    deletedAt
  }
`;

// Subscription for new comments added to a project
export const COMMENT_ADDED_SUBSCRIPTION = gql`
  ${COMMENT_SUBSCRIPTION_FRAGMENT}
  subscription CommentAdded($projectId: ID!) {
    commentAdded(projectId: $projectId) {
      ...CommentSubscriptionFragment
    }
  }
`;

// Subscription for comments updated in a project
export const COMMENT_UPDATED_SUBSCRIPTION = gql`
  ${COMMENT_SUBSCRIPTION_FRAGMENT}
  subscription CommentUpdated($projectId: ID!) {
    commentUpdated(projectId: $projectId) {
      ...CommentSubscriptionFragment
    }
  }
`;

// Subscription for comments deleted in a project
export const COMMENT_DELETED_SUBSCRIPTION = gql`
  ${COMMENT_DELETED_FRAGMENT}
  subscription CommentDeleted($projectId: ID!) {
    commentDeleted(projectId: $projectId) {
      ...CommentDeletedFragment
    }
  }
`;

// Combined subscription for all comment events in a project
export const COMMENT_EVENTS_SUBSCRIPTION = gql`
  ${COMMENT_SUBSCRIPTION_FRAGMENT}
  ${COMMENT_DELETED_FRAGMENT}
  subscription CommentEvents($projectId: ID!) {
    commentAdded(projectId: $projectId) {
      ...CommentSubscriptionFragment
    }
    commentUpdated(projectId: $projectId) {
      ...CommentSubscriptionFragment
    }
    commentDeleted(projectId: $projectId) {
      ...CommentDeletedFragment
    }
  }
`;
