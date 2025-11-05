import { gql } from '@apollo/client';

/**
 * Comment GraphQL Mutations
 * Mutations for comment creation and like management
 */

/**
 * Create comment mutation
 * Creates a new comment on a project or task
 */
export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      id
      uuid
      content
      author {
        id
        firstName
        lastName
        email
        role
      }
      projectId
      taskId
      createdAt
      updatedAt
      likesCount
      isLikedByUser
    }
  }
`;

/**
 * Toggle comment like mutation
 * Toggles like status for a comment
 */
export const TOGGLE_COMMENT_LIKE = gql`
  mutation ToggleCommentLike($commentId: ID!) {
    toggleCommentLike(commentId: $commentId) {
      id
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
  }
`;

