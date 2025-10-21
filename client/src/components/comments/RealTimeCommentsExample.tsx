import React, { useEffect, useState } from 'react';
import { useRealTimeComments } from '../../hooks/custom/useRealTimeComments';
import { Comment } from '../../services/graphql/commentQueries';

/**
 * Real-time Comments Example Component
 * Demonstrates how to use real-time comment subscriptions
 * 
 * This component shows how to integrate real-time comments
 * into your application for collaborative discussions
 */
interface RealTimeCommentsExampleProps {
  projectId: string;
  initialComments?: Comment[];
}

const RealTimeCommentsExample: React.FC<RealTimeCommentsExampleProps> = ({
  projectId,
  initialComments = []
}) => {
  const [notifications, setNotifications] = useState<string[]>([]);

  // Use the real-time comments hook
  const {
    comments,
    isConnected,
    loading,
    addComment,
    updateComment,
    removeComment,
    setInitialComments
  } = useRealTimeComments({
    projectId,
    onCommentAdded: (comment) => {
      // Handle new comment
      setNotifications(prev => [
        ...prev,
        `New comment by ${comment.author.firstName} ${comment.author.lastName}`
      ]);
    },
    onCommentUpdated: (comment) => {
      // Handle comment update
      setNotifications(prev => [
        ...prev,
        `Comment updated by ${comment.author.firstName} ${comment.author.lastName}`
      ]);
    },
    onCommentDeleted: (event) => {
      // Handle comment deletion
      setNotifications(prev => [
        ...prev,
        `Comment deleted at ${new Date(event.deletedAt).toLocaleTimeString()}`
      ]);
    },
    onError: (error) => {
      // Handle subscription errors
      setNotifications(prev => [
        ...prev,
        `Subscription error: ${error.message}`
      ]);
    },
    showNotifications: true,
    enabled: true
  });

  // Set initial comments when component mounts
  useEffect(() => {
    if (initialComments.length > 0) {
      setInitialComments(initialComments);
    }
  }, [initialComments, setInitialComments]);

  // Clear notifications after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notifications]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {/* Connection Status */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Real-time Comments
        </h3>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
          />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Recent Activity
          </h4>
          <div className="space-y-1">
            {notifications.slice(-3).map((notification, index) => (
              <p key={index} className="text-sm text-blue-700">
                {notification}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Loading comments...</p>
          </div>
        )}

        {comments.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet. Start the conversation!</p>
          </div>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">
                    {comment.author.firstName} {comment.author.lastName}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({comment.author.role})
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Task: {comment.task.title}</span>
                  <span>Project: {comment.task.project.name}</span>
                  <span>Likes: {comment.likesCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-2">
          How to Use Real-time Comments
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Comments appear in real-time as they're created</li>
          <li>• Updates are synchronized across all project members</li>
          <li>• Only project members receive real-time updates</li>
          <li>• Regular users (non-admin/PM) can see comments in real-time</li>
        </ul>
      </div>
    </div>
  );
};

export default RealTimeCommentsExample;
