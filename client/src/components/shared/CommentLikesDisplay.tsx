import React, { useState } from 'react';

/**
 * Description: Presents themed comment like summaries with expandable badges for the public dashboard.
 * Data created: Manages local UI expansion state while consuming supplied comment like data.
 * Author: thangtruong
 */

// Props interface for CommentLikesDisplay component
interface CommentLikesDisplayProps {
  taskStatus: 'Completed' | 'In Progress' | 'Todo';
  likeCount: number;
  commentsWithLikes: Array<{ commentContent: string; likeCount: number }>;
  colorScheme: {
    badgeBg: string;
    badgeText: string;
    icon: string;
  };
}

/**
 * CommentLikesDisplay Component
 * Renders comment likes information for comments on tasks of specific status
 * Displays like count and expandable comment content with their individual like counts
 */
const CommentLikesDisplay: React.FC<CommentLikesDisplayProps> = ({
  taskStatus,
  likeCount,
  commentsWithLikes,
  colorScheme,
}) => {
  // State for expandable comment content
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle expansion state
  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Get comments to display based on expansion state
  const getDisplayComments = () => {
    if (isExpanded) {
      return commentsWithLikes;
    }
    return commentsWithLikes.slice(0, 3);
  };

  // Get remaining comments count
  const getRemainingCount = () => {
    return Math.max(0, commentsWithLikes.length - 3);
  };

  return (
    <div
      className="border theme-border rounded-xl p-4"
      style={{
        backgroundColor: 'var(--card-bg)',
        backgroundImage: 'var(--card-surface-overlay)',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* Header with task status and comment likes */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Comments on {taskStatus} Tasks</span>
        <div className="flex items-center" style={{ color: colorScheme.icon }}>
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium" style={{ color: colorScheme.icon }}>{likeCount} likes</span>
        </div>
      </div>

      {/* Comment content with like counts display */}
      {commentsWithLikes.length > 0 && (
        <div className="space-y-2">
          {/* Comment content badges with like counts */}
          <div className="flex flex-wrap gap-1">
            {getDisplayComments().map((comment, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: colorScheme.badgeBg,
                  color: colorScheme.badgeText
                }}
                title={comment.commentContent} // Show full comment on hover
              >
                {comment.commentContent.length > 30
                  ? `${comment.commentContent.substring(0, 30)}...`
                  : comment.commentContent
                } - {comment.likeCount} {comment.likeCount === 1 ? 'like' : 'likes'}
              </span>
            ))}

            {/* More button for remaining comments */}
            {getRemainingCount() > 0 && (
              <button
                onClick={handleToggleExpansion}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs transition-colors transform hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--badge-neutral-bg)',
                  color: 'var(--badge-neutral-text)'
                }}
              >
                {isExpanded ? 'Show less' : `+${getRemainingCount()} more`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentLikesDisplay;
