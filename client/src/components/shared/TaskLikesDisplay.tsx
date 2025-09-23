import React, { useState } from 'react';

/**
 * Task Likes Display Component
 * Displays likes count and expandable task names with their individual like counts for a specific task status
 * Shows 3 tasks by default with "more" button to expand remaining tasks
 */

interface TaskLikesDisplayProps {
  taskStatus: string;
  likeCount: number;
  tasksWithLikes: Array<{ taskName: string; likeCount: number }>;
  colorScheme: {
    text: string;
    bg: string;
    icon: string;
  };
}

const TaskLikesDisplay: React.FC<TaskLikesDisplayProps> = ({
  taskStatus,
  likeCount,
  tasksWithLikes,
  colorScheme
}) => {
  // State for expandable task names
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle expansion state
  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  // Get tasks to display based on expansion state
  const getDisplayTasks = () => {
    if (isExpanded) {
      return tasksWithLikes;
    }
    return tasksWithLikes.slice(0, 3);
  };

  // Get remaining tasks count
  const getRemainingCount = () => {
    return Math.max(0, tasksWithLikes.length - 3);
  };

  return (
    <div className="border border-gray-300 rounded-xl p-4 bg-gray-100">
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

      {/* Task names with like counts display */}
      {tasksWithLikes.length > 0 && (
        <div className="space-y-2">
          {/* Task name badges with like counts */}
          <div className="flex flex-wrap gap-1">
            {getDisplayTasks().map((task, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${colorScheme.bg} ${colorScheme.text}`}
              >
                {task.taskName} - {task.likeCount} {task.likeCount === 1 ? 'like' : 'likes'}
              </span>
            ))}

            {/* More button for remaining tasks */}
            {getRemainingCount() > 0 && (
              <button
                onClick={handleToggleExpansion}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors transform hover:scale-105 hover:shadow-lg"
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
