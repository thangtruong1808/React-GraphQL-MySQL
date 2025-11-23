import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { useAuthenticatedMutation } from '../../../../hooks/custom/useAuthenticatedMutation';
import { CREATE_COMMENT, GET_PROJECT_DETAILS, TOGGLE_COMMENT_LIKE } from '../../../../services/graphql/queries';
import { useError } from '../../../../contexts/ErrorContext';

/**
 * Custom hook for project detail mutations
 * Description: Handles comment creation and like toggling with cache updates
 * Date: 2024-12-19
 * Author: thangtruong
 */
export const useProjectDetailMutations = (
  projectId: string | undefined,
  refetch: () => void,
  setNewComment: (comment: string) => void,
  createCommentData: any
) => {
  const { showError } = useError();

  // Create comment mutation - uses authenticated mutation wrapper
  // Real-time subscription handles UI updates
  const [createCommentMutation, mutationResult] = useAuthenticatedMutation(CREATE_COMMENT, {
    onError: (error: any) => {
      showError(error?.message || 'Failed to post comment. Please try again.');
    },
  });

  // Wrapper to match expected signature
  // Extracts variables from options and passes them correctly to mutation
  const createComment = async (options: { variables: { input: { content: string; projectId: string } } }) => {
    // Pass variables directly - useAuthenticatedMutation expects { input: {...} }
    return await createCommentMutation(options.variables);
  };

  // Get data from mutation result
  const createCommentDataInternal = mutationResult.data;

  // Handle comment creation completion
  useEffect(() => {
    if (createCommentDataInternal?.createComment || createCommentData?.createComment) {
      setNewComment('');
    }
  }, [createCommentDataInternal, createCommentData, setNewComment]);

  // Toggle comment like mutation - subscription will handle real-time updates
  // Cache update provides optimistic UI feedback
  const [toggleCommentLike] = useAuthenticatedMutation(TOGGLE_COMMENT_LIKE, {
    update: (cache: any, { data }: { data: any }) => {
      if (data?.toggleCommentLike) {
        try {
          // Read the current project data from cache
          const existingProject = cache.readQuery({
            query: GET_PROJECT_DETAILS,
            variables: { projectId },
          });

          if (existingProject && 'project' in existingProject && existingProject.project) {
            // Update the specific comment with new like count
            // Subscription will update likers array and ensure consistency
            const updatedComments = existingProject.project.comments.map((comment: any) =>
              comment.id === data.toggleCommentLike.id
                ? { 
                    ...comment, 
                    likesCount: data.toggleCommentLike.likesCount, 
                    isLikedByUser: data.toggleCommentLike.isLikedByUser,
                    likers: data.toggleCommentLike.likers || comment.likers || []
                  }
                : comment
            );

            // Update the project with the updated comment
            cache.writeQuery({
              query: GET_PROJECT_DETAILS,
              variables: { projectId },
              data: {
                project: {
                  ...existingProject.project,
                  comments: updatedComments,
                },
              },
            });
          }
        } catch (error) {
          // Fallback to refetch if cache update fails
          refetch();
        }
      }
    },
    onError: (error: any) => {
      // Error handling - errors are shown via error context in handlers
      // Subscription will ensure correct state if mutation succeeds
    },
  }) as [(variables: { commentId: string }) => Promise<any>, any];

  return {
    createComment,
    toggleCommentLike,
    createCommentData: createCommentDataInternal || createCommentData,
  };
};

