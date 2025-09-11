import React, { useState } from 'react';

/**
 * Project Likes Display Component
 * Displays project likes information with user details
 * Shows total likes count and expandable list of users who liked projects by status
 * Follows the same design pattern as TaskLikesDisplay for consistency
 */

// Props interface for ProjectLikesDisplay component
interface ProjectLikesDisplayProps {
  projectStatus: 'Completed' | 'Active' | 'Planning';
  likeCount: number;
  userNames: string[];
  colorScheme: {
    text: string;
    bg: string;
    icon: string;
  };
}

/**
 * ProjectLikesDisplay Component
 * Renders project likes information for a specific project status
 * Displays like count and expandable user names who liked projects
 */
const ProjectLikesDisplay: React.FC<ProjectLikesDisplayProps> = ({
  projectStatus,
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
      {/* Header with project status and like count */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">{projectStatus} Projects</span>
        <div className={`flex items-center ${colorScheme.text}`}>
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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

export default ProjectLikesDisplay;
