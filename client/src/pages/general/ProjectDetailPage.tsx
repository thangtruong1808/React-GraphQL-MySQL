import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRealTimeCommentsWithLikes } from '../../hooks/custom/useRealTimeCommentsWithLikes';
import { useRealTimeTasks } from '../../hooks/custom/useRealTimeTasks';
import {
  useProjectDetailData,
  useProjectDetailMutations,
  useProjectDetailPermissions,
  useProjectDetailUtils,
  useProjectDetailHandlers,
} from './ProjectDetailPage/hooks';
import {
  BackNavigation,
  ProjectHeader,
  ProjectOwner,
  ProjectTimeline,
  TasksSection,
  MembersSection,
  CommentsSection,
  ProjectDetailSkeleton,
  ProjectDetailError,
  ProjectDetailNotFound,
} from './ProjectDetailPage/components';

/**
 * Project Detail Page Component
 * Displays detailed information about a specific project
 * Fetches project data using GraphQL and shows comprehensive project information
 */
const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();

  // Fetch and process project detail data
  const { data, loading, error, refetch, mappedComments, mappedTasks, project } = useProjectDetailData(id);

  // Use real-time comments with likes hook for live updates
  const { comments: realTimeComments, loading: commentsLoading, error: commentsError } = useRealTimeCommentsWithLikes({
    projectId: id || '',
    initialComments: mappedComments,
  });

  // Use real-time tasks hook for live task updates
  const { tasks: realTimeTasks, loading: tasksLoading } = useRealTimeTasks({
    projectId: id || '',
    initialTasks: mappedTasks,
    showNotifications: false, // Disable notifications to prevent duplicate toasts
    onTaskAdded: (task) => {
      // Handle new task added - real-time updates will show the task automatically
    },
    onTaskUpdated: (task) => {
      // Handle task updated - real-time updates will show the changes automatically
    },
    onTaskDeleted: (event) => {
      // Handle task deleted - real-time updates will remove the task automatically
    },
  });

  // State for comment input
  const [newCommentState, setNewCommentState] = React.useState('');

  // Process mutations
  const { createComment, toggleCommentLike, createCommentData } = useProjectDetailMutations(
    id,
    refetch,
    setNewCommentState,
    null
  );

  // Check permissions
  const { canPostComments, canLikeComments, canViewComments } = useProjectDetailPermissions(project, user, isAuthenticated);

  // Get utility functions
  const { getStatusColor, getTaskStatusColor, getTaskPriorityColor, formatDate, formatDueDate, formatMemberRoleForDisplay } =
    useProjectDetailUtils();

  // Handle event handlers
  const { newComment, setNewComment, isSubmittingComment, handleSubmitComment, handleToggleLike, handleReply } =
    useProjectDetailHandlers({
      projectId: id,
      isAuthenticated,
      canPostComments,
      canLikeComments,
      createComment,
      toggleCommentLike,
    });

  // Always use real-time tasks (they are initialized with data from query)
  // Sort tasks by creation date (oldest to latest)
  const displayTasks = useMemo(
    () =>
      [...realTimeTasks].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateA.getTime() - dateB.getTime();
      }),
    [realTimeTasks]
  );

  // Calculate task statistics
  const taskStats = useMemo(
    () => ({
      total: displayTasks.length,
      completed: displayTasks.filter((task) => task.status === 'DONE').length,
      inProgress: displayTasks.filter((task) => task.status === 'IN_PROGRESS').length,
    }),
    [displayTasks]
  );

  // Show loading state
  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  // Show error state
  if (error) {
    return <ProjectDetailError error={error} />;
  }

  // Show not found state
  if (!project) {
    return <ProjectDetailNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <BackNavigation />

        {/* Project Header */}
        <ProjectHeader
          project={project}
          totalTasks={taskStats.total}
          totalMembers={project.members.length}
          completedTasks={taskStats.completed}
          inProgressTasks={taskStats.inProgress}
          getStatusColor={getStatusColor}
        />

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Owner */}
          <ProjectOwner project={project} />

          {/* Project Timeline */}
          <ProjectTimeline project={project} formatDate={formatDate} />
        </div>

        {/* Tasks Section */}
        <TasksSection
          tasks={displayTasks}
          loading={tasksLoading}
          getTaskStatusColor={getTaskStatusColor}
          getTaskPriorityColor={getTaskPriorityColor}
          formatDueDate={formatDueDate}
        />

        {/* Team Members Section */}
        <MembersSection project={project} formatMemberRoleForDisplay={formatMemberRoleForDisplay} />

        {/* Comments Section */}
        <CommentsSection
          project={project}
          comments={realTimeComments}
          isAuthenticated={isAuthenticated}
          user={user}
          canPostComments={canPostComments}
          canLikeComments={canLikeComments}
          canViewComments={canViewComments}
          newComment={newComment}
          setNewComment={setNewComment}
          isSubmittingComment={isSubmittingComment}
          formatDate={formatDate}
          onSubmitComment={handleSubmitComment}
          onToggleLike={handleToggleLike}
          onReply={handleReply}
        />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
