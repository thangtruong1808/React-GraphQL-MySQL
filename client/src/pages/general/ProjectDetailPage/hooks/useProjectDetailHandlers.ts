import { useState } from 'react';
import { ensureAuthDataReady } from '../../../../services/graphql/apollo-client';
import { updateActivity } from '../../../../utils/tokenManager';
import { useError } from '../../../../contexts/ErrorContext';

/**
 * Project Detail Handlers Dependencies
 */
export interface UseProjectDetailHandlersDependencies {
  projectId: string | undefined;
  isAuthenticated: boolean;
  canPostComments: () => boolean;
  canLikeComments: () => boolean;
  createComment: (variables: any) => Promise<any>;
  toggleCommentLike: (variables: { commentId: string }) => Promise<any>;
}

/**
 * Custom hook for project detail event handlers
 * Handles comment submission, like toggling, and reply actions
 */
export const useProjectDetailHandlers = ({
  projectId,
  isAuthenticated,
  canPostComments,
  canLikeComments,
  createComment,
  toggleCommentLike,
}: UseProjectDetailHandlersDependencies) => {
  const { showError } = useError();
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [newComment, setNewCommentState] = useState('');

  /**
   * Handle comment submission with proper async flow and state management
   */
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple simultaneous submissions
    if (isSubmittingComment || !newComment.trim() || !isAuthenticated || !projectId || !canPostComments()) {
      return;
    }

    // Set submitting state to prevent race conditions
    setIsSubmittingComment(true);

    try {
      // Ensure all authentication data is ready before mutation
      const authDataReady = await ensureAuthDataReady();
      if (!authDataReady) {
        showError('Authentication data not ready. Please try again.');
        return;
      }

      // Update user activity after ensuring auth data is ready
      try {
        await updateActivity();
      } catch (error) {
        // Continue with comment submission even if activity update fails
      }

      // Execute comment creation with proper async/await
      await createComment({
        variables: {
          input: {
            content: newComment.trim(),
            projectId: projectId,
          },
        },
      });

      // Success toast will be shown in cache update when UI rendering is complete
      setNewCommentState('');
    } catch (error: any) {
      // Show error notification
      const errorMessage = error.message || 'Failed to post comment. Please try again.';
      showError(errorMessage);
    } finally {
      // Always reset submitting state
      setIsSubmittingComment(false);
    }
  };

  /**
   * Handle comment like toggle
   */
  const handleToggleLike = async (commentId: string) => {
    if (!isAuthenticated || !canLikeComments()) return;

    try {
      // Ensure all authentication data is ready before mutation
      const authDataReady = await ensureAuthDataReady();
      if (!authDataReady) {
        showError('Authentication data not ready. Please try again.');
        return;
      }

      // Update user activity after ensuring auth data is ready
      try {
        await updateActivity();
      } catch (error) {
        // Continue with like toggle even if activity update fails
      }

      await toggleCommentLike({
        commentId: commentId,
      });
    } catch (error) {
      // Handle error silently
    }
  };

  /**
   * Handle reply to comment
   */
  const handleReply = (commentId: string, authorName: string) => {
    if (!isAuthenticated) return;

    // Set the comment input to mention the author
    const replyText = `@${authorName} `;
    setNewCommentState(replyText);
    // Focus on the textarea (optional)
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  return {
    newComment,
    setNewComment: setNewCommentState,
    isSubmittingComment,
    handleSubmitComment,
    handleToggleLike,
    handleReply,
  };
};

