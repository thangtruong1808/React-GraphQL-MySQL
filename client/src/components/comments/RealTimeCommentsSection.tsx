import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_COMMENT, TOGGLE_COMMENT_LIKE } from '../../services/graphql/queries';
import { useRealTimeComments } from '../../hooks/custom/useRealTimeComments';
import { useAuth } from '../../contexts/AuthContext';
import { formatRoleForDisplay, isAdminRole } from '../../utils/roleFormatter';
import { useError } from '../../contexts/ErrorContext';
import { updateActivity } from '../../utils/tokenManager';
import { ensureAuthDataReady } from '../../services/graphql/apollo-client';
import { useAuthenticatedMutation } from '../../hooks/custom/useAuthenticatedMutation';

interface RealTimeCommentsSectionProps {
  projectId: string;
  projectStatus: string;
  projectMembers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    memberRole: string;
  }>;
  projectOwner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

/**
 * RealTimeCommentsSection Component
 * Displays real-time comments for a project with live updates
 * Handles comment creation, liking, and real-time subscription updates
 * 
 * CALLED BY: ProjectDetailPage component
 * SCENARIOS: Real-time collaborative commenting on projects
 */
const RealTimeCommentsSection: React.FC<RealTimeCommentsSectionProps> = ({
  projectId,
  projectStatus,
  projectMembers,
  projectOwner
}) => {
  const { user, isAuthenticated } = useAuth();
  const { showError, showInfo } = useError();
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Use real-time comments hook for live updates
  const { comments: realTimeComments, loading: commentsLoading, error: commentsError } = useRealTimeComments({
    projectId,
    initialComments: []
  });

  // Create comment mutation with optimized cache updates
  const [createComment, { data: createCommentData }] = useMutation(CREATE_COMMENT, {
    onError: (error) => {
      showError(error.message || 'Failed to post comment. Please try again.');
    }
  });

  // Handle comment creation completion
  useEffect(() => {
    if (createCommentData?.createComment) {
      setNewComment('');
      showInfo('Comment posted successfully!');
    }
  }, [createCommentData]);

  // Toggle comment like mutation with optimized cache update
  const [toggleCommentLike] = useAuthenticatedMutation(TOGGLE_COMMENT_LIKE, {
    onError: (error: any) => {
      showError(error.message || 'Failed to toggle like. Please try again.');
    }
  });

  // Handle comment submission with proper async flow and state management
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple simultaneous submissions
    if (isSubmittingComment || !newComment.trim() || !isAuthenticated || !canPostComments()) {
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
            projectId: projectId
          }
        }
      });

    } catch (error: any) {
      // Show error notification
      const errorMessage = error.message || 'Failed to post comment. Please try again.';
      showError(errorMessage);

    } finally {
      // Always reset submitting state
      setIsSubmittingComment(false);
    }
  };

  // Handle comment like toggle
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
        commentId: commentId
      });
    } catch (error) {
      // Handle error silently
    }
  };

  // Handle reply to comment
  const handleReply = (commentId: string, authorName: string) => {
    if (!isAuthenticated) return;

    // Set the comment input to mention the author
    setNewComment(`@${authorName} `);
    // Focus on the textarea (optional)
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  // Check if user can post comments (ADMIN or team member) and project is not completed
  const canPostComments = () => {
    // Don't allow comments on completed projects
    if (projectStatus === 'COMPLETED') return false;

    if (!isAuthenticated || !user) return false;

    // ADMIN users can always post comments (except on completed projects)
    if (isAdminRole(user.role)) return true;

    // Check if user is project owner
    if (projectOwner && projectOwner.id === user.id) return true;

    // Check if user is a team member
    const isTeamMember = projectMembers.some(member => member.id === user.id);

    return isTeamMember;
  };

  // Check if user can like comments (same as posting comments - ADMIN or team member)
  const canLikeComments = () => {
    return canPostComments();
  };

  // Check if user can view comments (ADMIN, Project Manager, or team member)
  const canViewComments = () => {
    if (!isAuthenticated || !user) return false;

    // ADMIN users can always view comments
    if (isAdminRole(user.role)) return true;

    // Project Manager role can view comments (including on completed projects)
    if (user.role === 'Project Manager') return true;

    // For non-completed projects, check team membership
    if (projectStatus !== 'COMPLETED') {
      // Check if user is project owner
      if (projectOwner && projectOwner.id === user.id) return true;

      // Check if user is a team member
      const isTeamMember = projectMembers.some(member => member.id === user.id);
      return isTeamMember;
    }

    // For completed projects, only ADMIN and Project Manager can view comments
    return false;
  };

  // Format date for display - handles both timestamp and date strings
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';

      // Handle timestamp strings (numbers) by converting to number first
      const timestamp = typeof dateString === 'string' && /^\d+$/.test(dateString)
        ? parseInt(dateString)
        : dateString;

      const date = new Date(timestamp);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'N/A';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-gray-900">Project Comments</h2>
        {realTimeComments.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates</span>
          </div>
        )}
      </div>

      {/* Permission Messages - Show only one relevant section based on user state and project status */}
      {projectStatus === 'COMPLETED' ? (
        // For completed projects - show only project completed message
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Project Completed</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This project has been completed. Comments are no longer available as the project is finished.
              </p>
            </div>
          </div>
        </div>
      ) : isAuthenticated ? (
        // For authenticated users on non-completed projects
        canPostComments() ? (
          // Team members and admins - show permission info
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-900 mb-1">Comment and View Permission</h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Only <span className="font-semibold">team members</span> and <span className="font-semibold">admins</span> are authorized to view or post comments.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Non-team members - show access restricted message
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-900 mb-1">Comment Access Restricted</h3>
                <p className="text-sm text-yellow-700 leading-relaxed">
                  Sorry, only <span className="font-semibold">team members</span> and <span className="font-semibold">ADMIN</span> can view or post comments.
                </p>
              </div>
            </div>
          </div>
        )
      ) : (
        // For unauthenticated users on non-completed projects - show login required
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Login Required</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Please log in to view and add comments.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Comment Input Form - Only show if user is authenticated and can post comments */}
      {isAuthenticated && canPostComments() && (
        <div className="mb-8">
          <form onSubmit={handleSubmitComment}>
            <div className="rounded-xl p-6 border border-gray-200">
              <div className="flex items-start space-x-4">
                {/* User Avatar */}
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white font-bold text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>

                {/* Comment Input Area */}
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts about this project..."
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-300 resize-none transition-all duration-200 placeholder-gray-400 text-gray-700 bg-white shadow-sm"
                      rows={4}
                      maxLength={500}
                      disabled={isSubmittingComment}
                    />

                    {/* Character Counter */}
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded-full shadow-sm">
                      {newComment.length}/500
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end mt-4">
                    <button
                      type="submit"
                      disabled={isSubmittingComment || !newComment.trim() || !canPostComments()}
                      className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex items-center space-x-2">
                        {isSubmittingComment ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Posting...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>Post Comment</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Comments List - Only show for users who can view comments */}
      {canViewComments() && (
        <>
          {realTimeComments.length === 0 && projectStatus !== 'COMPLETED' ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h3>
                <p className="text-gray-600 mb-4">Be the first to share your thoughts about this project!</p>
              </div>
            </div>
          ) : realTimeComments.length > 0 ? (
            <div className="space-y-6">
              {realTimeComments.map((comment, index) => (
                <div key={comment.id} className="group relative">
                  <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      {/* Author Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-white font-bold text-sm">
                            {comment.author.firstName.charAt(0)}{comment.author.lastName.charAt(0)}
                          </span>
                        </div>
                        {/* Online indicator */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        {/* Author Info */}
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900 text-base">
                              {comment.author.firstName} {comment.author.lastName}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                              {formatRoleForDisplay(comment.author.role)}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">{formatDate(comment.createdAt)}</span>
                          </div>
                        </div>

                        {/* Comment Text */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap text-left">
                            {comment.content}
                          </p>
                        </div>

                        {/* Comment Actions */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleToggleLike(comment.id)}
                              disabled={!isAuthenticated || !canLikeComments()}
                              className={`flex items-center space-x-1 transition-colors duration-200 ${comment.isLikedByUser
                                ? 'text-purple-600 hover:text-purple-700'
                                : 'text-gray-500 hover:text-purple-600'
                                } ${!isAuthenticated || !canLikeComments() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            >
                              <svg
                                className={`w-4 h-4 ${comment.isLikedByUser ? 'fill-current' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span className="text-sm">
                                {comment.likesCount > 0 ? comment.likesCount : ''} Like{comment.likesCount !== 1 ? 's' : ''}
                              </span>
                            </button>

                            <button
                              onClick={() => handleReply(comment.id, `${comment.author.firstName} ${comment.author.lastName}`)}
                              disabled={!isAuthenticated}
                              className={`flex items-center space-x-1 text-gray-500 hover:text-purple-600 transition-colors duration-200 ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                }`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span className="text-sm">Reply</span>
                            </button>
                          </div>

                          <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comment Number Badge */}
                  <div className="absolute -left-3 -top-3 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default RealTimeCommentsSection;
