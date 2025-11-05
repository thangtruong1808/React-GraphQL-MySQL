import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { useAuthenticatedMutation } from '../../../../hooks/custom/useAuthenticatedMutation';
import { CREATE_COMMENT, GET_PROJECT_DETAILS, TOGGLE_COMMENT_LIKE } from '../../../../services/graphql/queries';
import { useError } from '../../../../contexts/ErrorContext';

/**
 * Custom hook for project detail mutations
 * Handles comment creation and like toggling
 */
export const useProjectDetailMutations = (
  projectId: string | undefined,
  refetch: () => void,
  setNewComment: (comment: string) => void,
  createCommentData: any
) => {
  const { showError } = useError();

  // Create comment mutation - let real-time subscription handle UI updates
  const [createComment, { data: createCommentDataInternal }] = useMutation(CREATE_COMMENT, {
    onError: (error) => {
      showError(error.message || 'Failed to post comment. Please try again.');
    },
  });

  // Handle comment creation completion
  useEffect(() => {
    if (createCommentDataInternal?.createComment || createCommentData?.createComment) {
      setNewComment('');
    }
  }, [createCommentDataInternal, createCommentData, setNewComment]);

  // Toggle comment like mutation with optimized cache update
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
            const updatedComments = existingProject.project.comments.map((comment: any) =>
              comment.id === data.toggleCommentLike.id
                ? { ...comment, likesCount: data.toggleCommentLike.likesCount, isLikedByUser: data.toggleCommentLike.isLikedByUser }
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
      // Handle error silently
    },
  }) as [(variables: { commentId: string }) => Promise<any>, any];

  return {
    createComment,
    toggleCommentLike,
    createCommentData: createCommentDataInternal || createCommentData,
  };
};

