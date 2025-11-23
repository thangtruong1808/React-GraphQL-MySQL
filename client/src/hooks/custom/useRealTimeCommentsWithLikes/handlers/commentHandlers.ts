import { useCallback } from 'react';
import { ApolloClient } from '@apollo/client';
import { Comment } from '../../../../services/graphql/commentQueries';
import { GET_PROJECT_DETAILS } from '../../../../services/graphql/queries';
import { CommentHandlersDependencies } from '../types';

/**
 * Comment Handlers Hook
 * Description: Handles comment CRUD operations (added, updated, deleted) with proper async state updates
 * Date: 2024-12-19
 * Author: thangtruong
 */
export const useCommentHandlers = (deps: CommentHandlersDependencies) => {
  const {
    apolloClient,
    projectId,
    setComments,
    onCommentAdded,
    onCommentUpdated,
    onCommentDeleted,
    showNotifications,
  } = deps;

  /**
   * Handle comment added with state update
   * Updates Apollo cache and local state when a new comment is added
   */
  const handleCommentAdded = useCallback(async (comment: Comment) => {
    try {
      // Update Apollo cache directly (readQuery/writeQuery are synchronous)
      const existingProject = apolloClient.readQuery({
        query: GET_PROJECT_DETAILS,
        variables: { projectId }
      });

      if (existingProject?.project) {
        // Check if comment already exists to prevent duplicates
        const exists = existingProject.project.comments.some((c: any) => c.id === comment.id);
        if (exists) {
          return;
        }
        
        // New comments should always have isLikedByUser: false initially
        const commentWithCorrectLikeStatus = {
          ...comment,
          isLikedByUser: false,
          likers: comment.likers || []
        };
        
        // Add new comment and sort by creation date (latest first)
        const updatedComments = [commentWithCorrectLikeStatus, ...existingProject.project.comments].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Write updated comments to cache - Apollo will automatically trigger re-render
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
        
        // Also update local state as backup to ensure UI updates
        setComments(updatedComments);
      }
    } catch (error) {
      // Fallback to local state update if cache update fails
      setComments(prev => {
        // Check if comment already exists to prevent duplicates
        const exists = prev.some(c => c.id === comment.id);
        if (exists) {
          return prev;
        }
        
        // New comments should always have isLikedByUser: false initially
        const commentWithCorrectLikeStatus = {
          ...comment,
          isLikedByUser: false,
          likers: comment.likers || []
        };
        
        // Add new comment and sort by creation date (latest first)
        const updated = [commentWithCorrectLikeStatus, ...prev];
        return updated.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    }
    
    // Call custom handler if provided
    if (onCommentAdded) {
      onCommentAdded(comment);
    }

    // Show notification if enabled
    if (showNotifications) {
      // Notification system integration can be added here
    }
  }, [onCommentAdded, showNotifications, apolloClient, projectId, setComments]);

  /**
   * Handle comment updated with state update
   * Updates Apollo cache and local state when a comment is updated
   */
  const handleCommentUpdated = useCallback(async (updatedComment: Comment) => {
    try {
      // Update Apollo cache directly (readQuery/writeQuery are synchronous)
      const existingProject = apolloClient.readQuery({
        query: GET_PROJECT_DETAILS,
        variables: { projectId }
      });

      if (existingProject?.project) {
        const updatedComments = existingProject.project.comments.map((comment: any) => 
          comment.id === updatedComment.id ? updatedComment : comment
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
      setComments(prev => {
        // Update the comment and maintain sorted order
        const updated = prev.map(comment => 
          comment.id === updatedComment.id ? updatedComment : comment
        );
        // Sort by creation date (latest first) to maintain consistent ordering
        return updated.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    }
    
    // Call custom handler if provided
    if (onCommentUpdated) {
      onCommentUpdated(updatedComment);
    }
  }, [onCommentUpdated, apolloClient, projectId, setComments]);

  /**
   * Handle comment deleted with state update
   * Updates Apollo cache and local state when a comment is deleted
   */
  const handleCommentDeleted = useCallback(async (event: { commentId: string; projectId: string; deletedAt: string }) => {
    try {
      // Update Apollo cache directly (readQuery/writeQuery are synchronous)
      const existingProject = apolloClient.readQuery({
        query: GET_PROJECT_DETAILS,
        variables: { projectId }
      });

      if (existingProject?.project) {
        const updatedComments = existingProject.project.comments.filter((comment: any) => 
          comment.id !== event.commentId
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
        prev.filter(comment => comment.id !== event.commentId)
      );
    }
    
    // Call custom handler if provided
    if (onCommentDeleted) {
      onCommentDeleted(event);
    }
  }, [onCommentDeleted, apolloClient, projectId, setComments]);

  return {
    handleCommentAdded,
    handleCommentUpdated,
    handleCommentDeleted,
  };
};

