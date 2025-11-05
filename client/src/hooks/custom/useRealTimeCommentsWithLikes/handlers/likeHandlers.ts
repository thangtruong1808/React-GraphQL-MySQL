import { useCallback } from 'react';
import { ApolloClient } from '@apollo/client';
import { GET_PROJECT_DETAILS } from '../../../../services/graphql/queries';
import { CommentLikeEvent } from '../../useCommentLikesSubscriptions';
import { LikeHandlersDependencies } from '../types';

/**
 * Like Handlers Hook
 * Handles comment like/unlike operations
 */
export const useLikeHandlers = (deps: LikeHandlersDependencies) => {
  const {
    apolloClient,
    projectId,
    setComments,
    onCommentLiked,
    onCommentUnliked,
  } = deps;

  /**
   * Handle comment liked with state update
   * Updates Apollo cache and local state when a comment is liked
   */
  const handleCommentLiked = useCallback((event: CommentLikeEvent) => {
    // Update Apollo cache directly
    try {
      const existingProject = apolloClient.readQuery({
        query: GET_PROJECT_DETAILS,
        variables: { projectId }
      });

      if (existingProject?.project) {
        const updatedComments = existingProject.project.comments.map((comment: any) =>
          comment.id === event.commentId 
            ? { 
                ...comment, 
                likesCount: event.likesCount, 
                likers: event.likers || []
                // Don't update isLikedByUser - preserve existing value
              }
            : comment
        );

        apolloClient.writeQuery({
          query: GET_PROJECT_DETAILS,
          variables: { projectId },
          data: {
            project: {
              ...existingProject.project,
              comments: updatedComments
            }
          }
        });
      }
    } catch (error) {
      // Fallback to local state update if cache update fails
      setComments(prev => 
        prev.map(comment => 
          comment.id === event.commentId 
            ? { 
                ...comment, 
                likesCount: event.likesCount, 
                likers: event.likers || []
              }
            : comment
        )
      );
    }
    
    // Call custom handler if provided
    if (onCommentLiked) {
      onCommentLiked(event);
    }
  }, [onCommentLiked, apolloClient, projectId, setComments]);

  /**
   * Handle comment unliked with state update
   * Updates Apollo cache and local state when a comment is unliked
   */
  const handleCommentUnliked = useCallback((event: CommentLikeEvent) => {
    // Update Apollo cache directly
    try {
      const existingProject = apolloClient.readQuery({
        query: GET_PROJECT_DETAILS,
        variables: { projectId }
      });

      if (existingProject?.project) {
        const updatedComments = existingProject.project.comments.map((comment: any) =>
          comment.id === event.commentId 
            ? { 
                ...comment, 
                likesCount: event.likesCount, 
                likers: event.likers || []
                // Don't update isLikedByUser - preserve existing value
              }
            : comment
        );

        apolloClient.writeQuery({
          query: GET_PROJECT_DETAILS,
          variables: { projectId },
          data: {
            project: {
              ...existingProject.project,
              comments: updatedComments
            }
          }
        });
      }
    } catch (error) {
      // Fallback to local state update if cache update fails
      setComments(prev => 
        prev.map(comment => 
          comment.id === event.commentId 
            ? { 
                ...comment, 
                likesCount: event.likesCount, 
                likers: event.likers || []
              }
            : comment
        )
      );
    }
    
    // Call custom handler if provided
    if (onCommentUnliked) {
      onCommentUnliked(event);
    }
  }, [onCommentUnliked, apolloClient, projectId, setComments]);

  return {
    handleCommentLiked,
    handleCommentUnliked,
  };
};

