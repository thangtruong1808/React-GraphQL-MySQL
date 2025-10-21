import React, { useState } from 'react';

/**
 * Comment Likers Component
 * Displays who liked a comment with max 3 names and hover tooltip for remaining
 * 
 * @param likers - Array of user objects who liked the comment
 * @param totalLikes - Total number of likes
 */
interface CommentLikersProps {
  likers?: Array<{
    id: string;
    uuid?: string;
    firstName: string;
    lastName: string;
    email?: string;
    role?: string;
    isDeleted?: boolean;
    version?: number;
    createdAt?: string;
    updatedAt?: string;
  }>;
  totalLikes: number;
}

const CommentLikers: React.FC<CommentLikersProps> = ({ likers, totalLikes }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Debug: Log what we receive
  console.log('CommentLikers received:', { likers, totalLikes, likersLength: likers?.length });

  // Don't show anything if no likes
  if (totalLikes === 0) {
    return null;
  }

  // Show up to 3 names
  const visibleLikers = (likers || []).slice(0, 3);
  const remainingCount = totalLikes - visibleLikers.length;

  // If no likers data but we have likes, show count only
  if (visibleLikers.length === 0 && totalLikes > 0) {
    return (
      <div className="flex items-center space-x-1 text-xs text-gray-600">
        <span>{totalLikes} {totalLikes === 1 ? 'like' : 'likes'}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 text-xs text-gray-600">
      <span>Liked by</span>
      <div className="flex items-center space-x-1">
        {visibleLikers.map((liker, index) => (
          <span key={liker.id} className="font-medium">
            {liker.firstName} {liker.lastName}
            {index < visibleLikers.length - 1 && ', '}
          </span>
        ))}
        {remainingCount > 0 && (
          <div className="relative">
            <span
              className="font-medium text-purple-600 cursor-pointer hover:text-purple-700"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              and {remainingCount} other{remainingCount !== 1 ? 's' : ''}
            </span>

            {/* Tooltip for remaining likers */}
            {showTooltip && (
              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10 max-w-xs">
                <div className="space-y-1">
                  {(likers || []).slice(3).map((liker) => (
                    <div key={liker.id} className="font-medium">
                      {liker.firstName} {liker.lastName}
                    </div>
                  ))}
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentLikers;
