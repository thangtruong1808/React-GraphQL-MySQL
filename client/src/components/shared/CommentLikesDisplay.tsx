import React, { useState } from 'react';

/**
 * Comment Likes Display Component
 * Displays comment likes information with user details
 * Shows total likes count and expandable list of users who liked comments by task status
 * Follows the same design pattern as TaskLikesDisplay for consistency
 */

// Props interface for CommentLikesDisplay component
interface CommentLikesDisplayProps {
  taskStatus: 'Completed' | 'In Progress' | 'Todo';
  likeCount: number;
  userNames: string[];
  colorScheme: {
    text: string;
    bg: string;
    icon: string;
  };
}

/**
 * CommentLikesDisplay Component
 * Renders comment likes information for comments on tasks of specific status
 * Displays like count and expandable user names who liked comments
 */
const CommentLikesDisplay: React.FC<CommentLikesDisplayProps> = ({
  taskStatus,
  likeCount,
  userNames,
  colorScheme,
}) => {
  // State for expandable user names
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle expansion state
  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Get users to display based on expansion state
  const getDisplayUsers = () => {
    if (isExpanded) {
      return userNames;
    }
    return userNames.slice(0, 3);
  };

  // Get remaining users count
  const getRemainingCount = () => {
    return Math.max(0, userNames.length - 3);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {/* Header with task status and comment likes */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">Comments on {taskStatus} Tasks</span>
        <div className={`flex items-center ${colorScheme.text}`}>
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{likeCount} likes</span>
        </div>
      </div>

      {/* User names display */}
      {userNames.length > 0 && (
        <div className="space-y-2">
          {/* User name badges */}
          <div className="flex flex-wrap gap-1">
            {getDisplayUsers().map((userName, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${colorScheme.bg} ${colorScheme.text}`}
              >
                {userName}
              </span>
            ))}

            {/* More button for remaining users */}
            {getRemainingCount() > 0 && (
              <button
                onClick={handleToggleExpansion}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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
