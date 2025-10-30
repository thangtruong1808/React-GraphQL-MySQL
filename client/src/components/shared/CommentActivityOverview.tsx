import React from 'react';
import CommentLikesDisplay from './CommentLikesDisplay';

/**
 * Comment Activity Overview Component
 * Displays comment statistics and comment likes information by task status
 * Shows total comments, comments by task status, and comment likes with content
 */

// Props interface for CommentActivityOverview component
interface CommentActivityOverviewProps {
  stats: {
    totalComments: number;
    commentsOnCompletedTasks: number;
    commentsOnInProgressTasks: number;
    commentsOnTodoTasks: number;
    likesOnCommentsOnCompletedTasks: number;
    likesOnCommentsOnInProgressTasks: number;
    likesOnCommentsOnTodoTasks: number;
    commentsWithLikesOnCompletedTasks: Array<{ commentContent: string; likeCount: number }>;
    commentsWithLikesOnInProgressTasks: Array<{ commentContent: string; likeCount: number }>;
    commentsWithLikesOnTodoTasks: Array<{ commentContent: string; likeCount: number }>;
  };
}

/**
 * CommentActivityOverview Component
 * Renders comment activity statistics and comment likes information
 * Displays total comments, breakdown by task status, and popular comments
 */
const CommentActivityOverview: React.FC<CommentActivityOverviewProps> = ({ stats }) => {
  return (
    <div
      className="rounded-2xl shadow-lg border theme-border p-6 max-w-7xl mx-auto"
      style={{ backgroundColor: 'var(--card-bg)' }}
    >
      <h3 className="text-xl font-semibold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>Comment Activity Overview</h3>

      {/* Description */}
      <p className="text-sm mb-6 text-center leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Monitor comment engagement across your project tasks. Track discussion activity to understand team collaboration patterns and identify where more communication might be needed.
      </p>

      <div className="space-y-6">
        {/* Total Comments Display */}
        <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: 'var(--badge-success-bg)' }}>
          <span className="font-medium text-lg rounded-xl" style={{ color: 'var(--text-primary)' }}>Total Comments</span>
          <span className="text-3xl font-bold" style={{ color: 'var(--badge-success-text)' }}>{stats.totalComments}</span>
        </div>

        {/* Comments by Task Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 rounded-xl border theme-border" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{stats.commentsOnCompletedTasks}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Comments on Completed Tasks</div>
          </div>
          <div className="text-center p-4 rounded-xl border theme-border" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{stats.commentsOnInProgressTasks}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Comments on In Progress Tasks</div>
          </div>
          <div className="text-center p-4 rounded-xl border theme-border" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{stats.commentsOnTodoTasks}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Comments on Todo Tasks</div>
          </div>
        </div>

        {/* Comment Likes Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-center" style={{ color: 'var(--text-primary)' }}>Comment Likes by Task Status</h4>

          {/* Comments on Completed Tasks Likes */}
          <CommentLikesDisplay
            taskStatus="Completed"
            likeCount={stats.likesOnCommentsOnCompletedTasks}
            commentsWithLikes={stats.commentsWithLikesOnCompletedTasks}
            colorScheme={{
              text: "text-green-600",
              bg: "bg-green-100 text-green-800",
              icon: "text-green-600"
            }}
          />

          {/* Comments on In Progress Tasks Likes */}
          <CommentLikesDisplay
            taskStatus="In Progress"
            likeCount={stats.likesOnCommentsOnInProgressTasks}
            commentsWithLikes={stats.commentsWithLikesOnInProgressTasks}
            colorScheme={{
              text: "text-blue-600",
              bg: "bg-blue-100 text-blue-800",
              icon: "text-blue-600"
            }}
          />

          {/* Comments on Todo Tasks Likes */}
          <CommentLikesDisplay
            taskStatus="Todo"
            likeCount={stats.likesOnCommentsOnTodoTasks}
            commentsWithLikes={stats.commentsWithLikesOnTodoTasks}
            colorScheme={{
              text: "text-gray-600",
              bg: "bg-gray-100 text-gray-800",
              icon: "text-gray-600"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CommentActivityOverview;
