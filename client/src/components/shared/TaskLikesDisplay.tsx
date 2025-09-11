import React, { useState } from 'react';

/**
 * Task Likes Display Component
 * Displays likes count and expandable user names for a specific task status
 * Shows 3 users by default with "more" button to expand remaining users
 */

interface TaskLikesDisplayProps {
  taskStatus: string;
  likeCount: number;
  userNames: string[];
  colorScheme: {
    text: string;
    bg: string;
    icon: string;
  };
}

const TaskLikesDisplay: React.FC<TaskLikesDisplayProps> = ({
  taskStatus,
  likeCount,
  userNames,
  colorScheme
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
      {/* Header with task status and like count */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">{taskStatus} Tasks</span>
        <div className={`flex items-center ${colorScheme.text}`}>
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
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

export default TaskLikesDisplay;
