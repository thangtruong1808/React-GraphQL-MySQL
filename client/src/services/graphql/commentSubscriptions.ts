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
    likers {
      id
      uuid
      firstName
      lastName
      email
      role
      isDeleted
      version
      createdAt
      updatedAt
    }
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

// Fragment for comment like events
export const COMMENT_LIKE_FRAGMENT = gql`
  fragment CommentLikeFragment on CommentLikeEvent {
    commentId
    projectId
    userId
    action
    likesCount
    likers {
      id
      uuid
      firstName
      lastName
      email
      role
      isDeleted
      version
      createdAt
      updatedAt
    }
    timestamp
  }
`;

// Comment liked subscription
export const COMMENT_LIKED_SUBSCRIPTION = gql`
  ${COMMENT_LIKE_FRAGMENT}
  subscription CommentLiked($projectId: ID!) {
    commentLiked(projectId: $projectId) {
      ...CommentLikeFragment
    }
  }
`;

// Comment unliked subscription
export const COMMENT_UNLIKED_SUBSCRIPTION = gql`
  ${COMMENT_LIKE_FRAGMENT}
  subscription CommentUnliked($projectId: ID!) {
    commentUnliked(projectId: $projectId) {
      ...CommentLikeFragment
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

// Combined subscription for all comment and like events in a project
export const COMMENT_AND_LIKE_EVENTS_SUBSCRIPTION = gql`
  ${COMMENT_SUBSCRIPTION_FRAGMENT}
  ${COMMENT_DELETED_FRAGMENT}
  ${COMMENT_LIKE_FRAGMENT}
  subscription CommentAndLikeEvents($projectId: ID!) {
    commentAdded(projectId: $projectId) {
      ...CommentSubscriptionFragment
    }
    commentUpdated(projectId: $projectId) {
      ...CommentSubscriptionFragment
    }
    commentDeleted(projectId: $projectId) {
      ...CommentDeletedFragment
    }
    commentLiked(projectId: $projectId) {
      ...CommentLikeFragment
    }
    commentUnliked(projectId: $projectId) {
      ...CommentLikeFragment
    }
  }
`;
