import { useCallback } from 'react';
import { ApolloClient } from '@apollo/client';
import { GET_PROJECT_DETAILS } from '../../../../services/graphql/queries';
import { CommentLikeEvent } from '../../useCommentLikesSubscriptions';
import { LikeHandlersDependencies } from '../types';

/**
 * Like Handlers Hook
 * Description: Handles comment like/unlike operations with proper async state updates
 * Date: 2024-12-19
 * Author: thangtruong
 */
export const useLikeHandlers = (deps: LikeHandlersDependencies) => {
  const {
    apolloClient,
    projectId,
    setComments,
    currentUserId,
    onCommentLiked,
    onCommentUnliked,
  } = deps;

  /**
   * Calculate isLikedByUser based on current user and likers array
   */
  const calculateIsLikedByUser = useCallback((likers: any[], eventUserId: string, action: string): boolean => {
    if (!currentUserId) return false;
    
    // Check if current user is in the likers array
    const isInLikers = likers.some((liker: any) => liker.id === currentUserId.toString());
    
    // If the event is from the current user, use the action to determine state
    if (eventUserId === currentUserId.toString()) {
      return action === 'LIKED';
    }
    
    // Otherwise, check if current user is in likers
    return isInLikers;
  }, [currentUserId]);

  /**
   * Handle comment liked with state update
   * Updates Apollo cache and local state when a comment is liked
   */
  const handleCommentLiked = useCallback(async (event: CommentLikeEvent) => {
    try {
      // Update Apollo cache directly (readQuery/writeQuery are synchronous)
      const existingProject = apolloClient.readQuery({
        query: GET_PROJECT_DETAILS,
        variables: { projectId }
      });

      if (existingProject?.project) {
        const updatedComments = existingProject.project.comments.map((comment: any) => {
          if (comment.id === event.commentId) {
            const isLikedByUser = calculateIsLikedByUser(event.likers || [], event.userId, event.action);
            return { 
              ...comment, 
              likesCount: event.likesCount, 
              likers: event.likers || [],
              isLikedByUser
            };
          }
          return comment;
        });

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
        prev.map(comment => {
          if (comment.id === event.commentId) {
            const isLikedByUser = calculateIsLikedByUser(event.likers || [], event.userId, event.action);
            return { 
              ...comment, 
              likesCount: event.likesCount, 
              likers: event.likers || [],
              isLikedByUser
            };
          }
          return comment;
        })
      );
    }
    
    // Call custom handler if provided
    if (onCommentLiked) {
      onCommentLiked(event);
    }
  }, [onCommentLiked, apolloClient, projectId, setComments, calculateIsLikedByUser]);

  /**
   * Handle comment unliked with state update
   * Updates Apollo cache and local state when a comment is unliked
   */
  const handleCommentUnliked = useCallback(async (event: CommentLikeEvent) => {
    try {
      // Update Apollo cache directly (readQuery/writeQuery are synchronous)
      const existingProject = apolloClient.readQuery({
        query: GET_PROJECT_DETAILS,
        variables: { projectId }
      });

      if (existingProject?.project) {
        const updatedComments = existingProject.project.comments.map((comment: any) => {
          if (comment.id === event.commentId) {
            const isLikedByUser = calculateIsLikedByUser(event.likers || [], event.userId, event.action);
            return { 
              ...comment, 
              likesCount: event.likesCount, 
              likers: event.likers || [],
              isLikedByUser
            };
          }
          return comment;
        });

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
        prev.map(comment => {
          if (comment.id === event.commentId) {
            const isLikedByUser = calculateIsLikedByUser(event.likers || [], event.userId, event.action);
            return { 
              ...comment, 
              likesCount: event.likesCount, 
              likers: event.likers || [],
              isLikedByUser
            };
          }
          return comment;
        })
      );
    }
    
    // Call custom handler if provided
    if (onCommentUnliked) {
      onCommentUnliked(event);
    }
  }, [onCommentUnliked, apolloClient, projectId, setComments, calculateIsLikedByUser]);

  return {
    handleCommentLiked,
    handleCommentUnliked,
  };
};

