import React from 'react';
import CommentLikesDisplay from './CommentLikesDisplay';

/**
 * Description: Summarises comment engagement metrics and passes themed colour accents into comment like displays.
 * Data created: Reads provided statistics to derive presentation-only aggregates without storing additional state.
 * Author: thangtruong
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
      style={{
        backgroundColor: 'var(--card-bg)',
        backgroundImage: 'var(--card-surface-overlay)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 20px 40px var(--shadow-color)'
      }}
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
          <div className="text-center p-4 rounded-xl border theme-border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{stats.commentsOnCompletedTasks}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Comments on Completed Tasks</div>
          </div>
          <div className="text-center p-4 rounded-xl border theme-border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{stats.commentsOnInProgressTasks}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Comments on In Progress Tasks</div>
          </div>
          <div className="text-center p-4 rounded-xl border theme-border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
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
              badgeBg: 'var(--badge-success-bg)',
              badgeText: 'var(--badge-success-text)',
              icon: 'var(--badge-success-text)'
            }}
          />

          {/* Comments on In Progress Tasks Likes */}
          <CommentLikesDisplay
            taskStatus="In Progress"
            likeCount={stats.likesOnCommentsOnInProgressTasks}
            commentsWithLikes={stats.commentsWithLikesOnInProgressTasks}
            colorScheme={{
              badgeBg: 'var(--badge-secondary-bg)',
              badgeText: 'var(--badge-secondary-text)',
              icon: 'var(--badge-secondary-text)'
            }}
          />

          {/* Comments on Todo Tasks Likes */}
          <CommentLikesDisplay
            taskStatus="Todo"
            likeCount={stats.likesOnCommentsOnTodoTasks}
            commentsWithLikes={stats.commentsWithLikesOnTodoTasks}
            colorScheme={{
              badgeBg: 'var(--badge-neutral-bg)',
              badgeText: 'var(--badge-neutral-text)',
              icon: 'var(--badge-neutral-text)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CommentActivityOverview;
