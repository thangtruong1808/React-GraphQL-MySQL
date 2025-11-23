import { useState } from 'react';
import { updateActivity } from '../../../../utils/tokenManager';
import { useError } from '../../../../contexts/ErrorContext';
import { verifyAuthenticationBeforeMutation } from '../../../../utils/authVerification';

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
 * Description: Handles comment submission, like toggling, and reply actions with async/await
 * Date: 2024-12-19
 * Author: thangtruong
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
   * Description: Ensures authentication is ready before submitting comment
   * Date: 2024-12-19
   * Author: thangtruong
   */
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Synchronous check: Verify AuthContext state first (source of truth)
    if (!isAuthenticated) {
      showError('You must be logged in to post comments');
      return;
    }

    // Prevent multiple simultaneous submissions
    if (isSubmittingComment || !newComment.trim() || !projectId || !canPostComments()) {
      return;
    }

    // Set submitting state to prevent race conditions
    setIsSubmittingComment(true);

    try {
      // Verify authentication before mutation (checks AuthContext and tokens)
      // AuthContext already checked synchronously above, this ensures tokens are ready
      const authVerification = await verifyAuthenticationBeforeMutation(isAuthenticated);
      
      if (!authVerification.isValid) {
        showError(authVerification.error || 'Authentication verification failed. Please try again.');
        return;
      }

      // Update user activity after verifying authentication
      try {
        await updateActivity();
      } catch (error) {
        // Continue with comment submission even if activity update fails
      }

      // Execute comment creation with verified authentication
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
   * Description: Handles comment like/unlike with proper async authentication flow
   * Date: 2024-12-19
   * Author: thangtruong
   */
  const handleToggleLike = async (commentId: string) => {
    // Synchronous check: Verify AuthContext state first (source of truth)
    if (!isAuthenticated) {
      showError('You must be logged in to like comments');
      return;
    }

    if (!canLikeComments()) return;

    try {
      // Verify authentication before mutation (checks AuthContext and tokens)
      // AuthContext already checked synchronously above, this ensures tokens are ready
      const authVerification = await verifyAuthenticationBeforeMutation(isAuthenticated);
      
      if (!authVerification.isValid) {
        showError(authVerification.error || 'Authentication verification failed. Please try again.');
        return;
      }

      // Update user activity after verifying authentication
      try {
        await updateActivity();
      } catch (error) {
        // Continue with like toggle even if activity update fails
      }

      // Execute mutation with verified authentication
      await toggleCommentLike({
        commentId: commentId,
      });
    } catch (error: any) {
      // Show error message to user
      const errorMessage = error?.message || 'Failed to toggle like. Please try again.';
      showError(errorMessage);
    }
  };

  /**
   * Handle reply to comment
   * Description: Sets up reply text in comment input field
   * Date: 2024-12-19
   * Author: thangtruong
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

