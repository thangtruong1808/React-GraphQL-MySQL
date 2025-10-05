import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { InlineError } from '../../components/ui';
import { SkeletonBox } from '../../components/ui/SkeletonLoader';
import { GET_PROJECT_DETAILS, CREATE_COMMENT, TOGGLE_COMMENT_LIKE } from '../../services/graphql/queries';
import { useAuth } from '../../contexts/AuthContext';
import { formatRoleForDisplay, isAdminRole } from '../../utils/roleFormatter';
import { useAuthenticatedMutation } from '../../hooks/custom/useAuthenticatedMutation';
import { useError } from '../../contexts/ErrorContext';

/**
 * Project Detail Page Component
 * Displays detailed information about a specific project
 * Fetches project data using GraphQL and shows comprehensive project information
 */

interface ProjectDetails {
  id: string;
  uuid: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate?: string;
    assignedUser?: {
      firstName: string;
      lastName: string;
    };
  }>;
  members: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    memberRole: string;
  }>;
  comments: Array<{
    id: string;
    uuid: string;
    content: string;
    author: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    isLikedByUser: boolean;
  }>;
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { showError, showInfo } = useError();
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Fetch project details
  const { data, loading, error, refetch } = useQuery<{ project: ProjectDetails }>(GET_PROJECT_DETAILS, {
    variables: { projectId: id },
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  });

  // Create comment mutation with optimized cache updates
  const [createComment] = useMutation(CREATE_COMMENT, {
    onCompleted: (data) => {
      setNewComment('');
      // Optimized: Update only comments cache instead of refetching entire project
    },
    update: (cache, { data }) => {
      console.log('Cache update called with data:', data);
      if (data?.createComment) {
        try {
          // Read current project data from cache
          const existingProject = cache.readQuery({
            query: GET_PROJECT_DETAILS,
            variables: { projectId: id }
          });

          console.log('Existing project data:', existingProject);

          if (existingProject?.project) {
            // Update project with new comment (add to beginning for latest-first order)
            cache.writeQuery({
              query: GET_PROJECT_DETAILS,
              variables: { projectId: id },
              data: {
                project: {
                  ...existingProject.project,
                  comments: [data.createComment, ...existingProject.project.comments]
                }
              }
            });
            console.log('Cache updated successfully');
          }
        } catch (error) {
          console.log('Cache update failed, falling back to refetch:', error);
          // Fallback to refetch if cache update fails
          refetch();
        }
      }
    },
    onError: (error) => {
      // Handle error silently
    }
  });

  // Toggle comment like mutation with optimized cache update
  const [toggleCommentLike] = useAuthenticatedMutation(TOGGLE_COMMENT_LIKE, {
    onCompleted: (data) => {
      // Optimized: Update only the comment cache instead of refetching entire project
    },
    update: (cache, { data }) => {
      if (data?.toggleCommentLike) {
        try {
          // Read the current project data from cache
          const existingProject = cache.readQuery({
            query: GET_PROJECT_DETAILS,
            variables: { projectId: id }
          });

          if (existingProject?.project) {
            // Update the specific comment with new like count
            const updatedComments = existingProject.project.comments.map(comment =>
              comment.id === data.toggleCommentLike.id
                ? { ...comment, likesCount: data.toggleCommentLike.likesCount, isLikedByUser: data.toggleCommentLike.isLikedByUser }
                : comment
            );

            // Update the project with the updated comment
            cache.writeQuery({
              query: GET_PROJECT_DETAILS,
              variables: { projectId: id },
              data: {
                project: {
                  ...existingProject.project,
                  comments: updatedComments
                }
              }
            });
          }
        } catch (error) {
          // Fallback to refetch if cache update fails
          refetch();
        }
      }
    },
    onError: (error) => {
      // Handle error silently
    }
  });


  // Handle comment submission with proper async flow and state management
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple simultaneous submissions
    if (isSubmittingComment || !newComment.trim() || !isAuthenticated || !id || !canPostComments()) {
      return;
    }

    // Debug: Check authentication state
    console.log('Comment submission debug:', {
      isAuthenticated,
      userId: user?.id,
      userRole: user?.role,
      projectId: id,
      canPost: canPostComments()
    });

    // Set submitting state to prevent race conditions
    setIsSubmittingComment(true);

    try {
      // Execute comment creation with proper async/await
      const result = await createComment({
        variables: {
          input: {
            content: newComment.trim(),
            projectId: id
          }
        }
      });

      // Show success notification
      showInfo('Comment posted successfully!');
      
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
      await toggleCommentLike({
        commentId: commentId
      });
    } catch (error) {
      // Handle error silently - authentication retry is handled by useAuthenticatedMutation
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


  // Format member role for display
  const formatMemberRoleForDisplay = (memberRole: string) => {
    switch (memberRole) {
      case 'OWNER': return 'Owner';
      case 'EDITOR': return 'Editor';
      case 'VIEWER': return 'Viewer';
      case 'ASSIGNEE': return 'Assignee';
      default: return 'Member';
    }
  };

  // Get status color for projects
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-purple-100 text-purple-800';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
      case 'PLANNING': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get task status color with better UX - DONE should be clearly successful
  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-800 border border-green-200'; // Success/completion
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border border-blue-200'; // Active work
      case 'TODO': return 'bg-gray-100 text-gray-800 border border-gray-200'; // Not started
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Get priority color for tasks with better urgency communication
  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border border-red-200'; // Urgent - red
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'; // Normal - yellow
      case 'LOW': return 'bg-gray-100 text-gray-600 border border-gray-200'; // Low urgency - muted
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Projects Link Skeleton */}
          <div className="mb-6">
            <SkeletonBox className="h-6 w-32" />
          </div>

          {/* Project Overview Skeleton */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <SkeletonBox className="h-8 w-96 mb-2" />
                <SkeletonBox className="h-6 w-full mb-2" />
                <SkeletonBox className="h-6 w-3/4" />
              </div>
              <SkeletonBox className="h-8 w-24 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center">
                  <SkeletonBox className="h-8 w-16 mx-auto mb-2" />
                  <SkeletonBox className="h-4 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Project Owner & Timeline Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Owner Skeleton */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <SkeletonBox className="h-6 w-32 mb-4" />
              <div className="flex items-center space-x-4">
                <SkeletonBox className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <SkeletonBox className="h-5 w-32 mb-1" />
                  <SkeletonBox className="h-4 w-40 mb-1" />
                  <SkeletonBox className="h-4 w-24" />
                </div>
              </div>
            </div>

            {/* Project Timeline Skeleton */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <SkeletonBox className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <SkeletonBox className="h-4 w-16" />
                  <SkeletonBox className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <SkeletonBox className="h-4 w-20" />
                  <SkeletonBox className="h-4 w-24" />
                </div>
              </div>
            </div>
          </div>

          {/* Project Tasks Skeleton */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <SkeletonBox className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <SkeletonBox className="h-5 w-3/4 mb-1" />
                      <div className="flex items-center space-x-4">
                        <SkeletonBox className="h-6 w-20 rounded-full" />
                        <SkeletonBox className="h-6 w-16 rounded-full" />
                        <SkeletonBox className="h-4 w-32" />
                        <SkeletonBox className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Members Skeleton */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <SkeletonBox className="h-6 w-32 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <SkeletonBox className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <SkeletonBox className="h-4 w-24 mb-1" />
                    <SkeletonBox className="h-3 w-32 mb-1" />
                    <SkeletonBox className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <InlineError message={error.message} />
            <div className="mt-6">
              <Link
                to={ROUTE_PATHS.PROJECTS}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                ← Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!data?.project) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-500 mb-6">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
              <p className="text-gray-600">The project you're looking for doesn't exist or has been removed.</p>
            </div>
            <Link
              to={ROUTE_PATHS.PROJECTS}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              ← Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const project = data.project;

  // Check if user can post comments (ADMIN or team member)
  const canPostComments = () => {

    if (!isAuthenticated || !user) return false;

    // ADMIN users can always post comments
    if (isAdminRole(user.role)) return true;

    // Check if user is project owner
    if (project.owner && project.owner.id === user.id) return true;

    // Check if user is a team member
    const isTeamMember = project.members.some(member => member.id === user.id);

    return isTeamMember;
  };

  // Check if user can like comments (same as posting comments - ADMIN or team member)
  const canLikeComments = () => {
    return canPostComments();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to={ROUTE_PATHS.PROJECTS}
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
        </div>

        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <p className="text-gray-600 text-lg">{project.description}</p>
            </div>
            <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{project.tasks.length}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{project.members.length}</div>
              <div className="text-sm text-gray-600">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {project.tasks.filter(task => task.status === 'DONE').length}
              </div>
              <div className="text-sm text-gray-600">Completed Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {project.tasks.filter(task => task.status === 'IN_PROGRESS').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Owner */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Owner</h2>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {project.owner.firstName.charAt(0)}{project.owner.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {project.owner.firstName} {project.owner.lastName}
                </div>
                <div className="text-sm text-gray-600">{project.owner.email}</div>
                <div className="text-sm text-purple-600 font-medium">
                  {formatRoleForDisplay(project.owner.role)}
                </div>
              </div>
            </div>
          </div>

          {/* Project Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Timeline</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{formatDate(project.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">{formatDate(project.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Tasks</h2>
          {project.tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              No tasks found for this project.
            </div>
          ) : (
            <div className="space-y-4">
              {project.tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200 hover:border-gray-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg">{task.title}</h3>

                      {/* Status and Priority Row */}
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getTaskStatusColor(task.status)}`}>
                          {task.status === 'DONE' ? '✅ Done' : task.status === 'IN_PROGRESS' ? '🔄 In Progress' : '📋 To Do'}
                        </span>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getTaskPriorityColor(task.priority)}`}>
                          {task.priority === 'HIGH' ? '🔴 High Priority' : task.priority === 'MEDIUM' ? '🟡 Medium Priority' : '⚪ Low Priority'}
                        </span>
                      </div>

                      {/* Task Details Row */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {task.assignedUser && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium text-gray-700">{task.assignedUser.firstName} {task.assignedUser.lastName}</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Due: {formatDate(task.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Members Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Members</h2>
          {project.members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              No team members found for this project.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.members.map((member) => {
                const isOwner = member.memberRole === 'OWNER';
                const isAssignee = member.memberRole === 'ASSIGNEE';

                // Determine styling based on member role
                let avatarColor, borderColor, bgColor, badgeColor, badgeText;
                if (isOwner) {
                  avatarColor = 'bg-purple-600';
                  borderColor = 'border-purple-200';
                  bgColor = 'bg-purple-50';
                  badgeColor = 'bg-purple-100 text-purple-800';
                  badgeText = 'Owner';
                } else if (isAssignee) {
                  avatarColor = 'bg-blue-600';
                  borderColor = 'border-blue-200';
                  bgColor = 'bg-blue-50';
                  badgeColor = 'bg-blue-100 text-blue-800';
                  badgeText = 'Task Assignee';
                } else {
                  avatarColor = 'bg-green-600';
                  borderColor = 'border-gray-200';
                  bgColor = 'bg-white';
                  badgeColor = 'bg-green-100 text-green-800';
                  badgeText = formatMemberRoleForDisplay(member.memberRole);
                }

                return (
                  <div key={member.id} className={`flex items-center space-x-3 p-3 border ${borderColor} rounded-lg ${bgColor}`}>
                    <div className={`w-10 h-10 ${avatarColor} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-semibold text-sm">
                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {member.firstName} {member.lastName}
                        <span className={`ml-2 text-xs ${badgeColor} px-2 py-1 rounded-full`}>
                          {badgeText}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">{member.email}</div>
                      <div className="text-xs text-green-600 font-medium">
                        {formatRoleForDisplay(member.role)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Comments</h2>

          {/* Comment Permissions Description - Only show for authenticated users */}
          {isAuthenticated && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-900 mb-1">Comment Permissions</h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Only <span className="font-semibold">Administrators</span> and <span className="font-semibold">team members</span> are allowed to post comments on this project.
                    All other authenticated users can view comments only.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Comment Input Form - Only show if user is authenticated and can post comments */}
          {isAuthenticated && canPostComments() ? (
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
          ) : isAuthenticated ? (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 text-yellow-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm font-medium">
                  Only project administrators, owners, and team members can post comments.
                </span>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm">
                  Please <Link to={ROUTE_PATHS.LOGIN} className="text-purple-600 hover:text-purple-700 font-medium">log in</Link> to add comments.
                </span>
              </div>
            </div>
          )}

          {/* Comments List */}
          {project.comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h3>
                <p className="text-gray-600 mb-4">Be the first to share your thoughts about this project!</p>
                {!isAuthenticated && (
                  <Link
                    to={ROUTE_PATHS.LOGIN}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Log in to comment
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {project.comments.map((comment, index) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
