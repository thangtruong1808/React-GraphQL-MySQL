import React, { useState, useEffect } from 'react';
import { useRealTimeComments } from '../../hooks/custom/useRealTimeComments';
import { useMutation } from '@apollo/client';
import { CREATE_COMMENT_MUTATION } from '../../services/graphql/commentQueries';
import { useAuth } from '../../contexts/AuthContext';

interface RealTimeCommentsTestProps {
  projectId: string;
}

/**
 * RealTimeCommentsTest Component
 * Test component to verify real-time comment subscriptions are working
 * Shows live updates when comments are added, updated, or deleted
 * 
 * CALLED BY: Test pages or development environments
 * SCENARIOS: Testing real-time comment functionality
 */
const RealTimeCommentsTest: React.FC<RealTimeCommentsTestProps> = ({ projectId }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  // Use real-time comments hook
  const { comments, loading, error, addComment, updateComment, removeComment } = useRealTimeComments({
    projectId,
    initialComments: [],
    onCommentAdded: (comment) => {
      setTestResults(prev => [...prev, `✅ Comment added: ${comment.content.substring(0, 50)}...`]);
    },
    onCommentUpdated: (comment) => {
      setTestResults(prev => [...prev, `🔄 Comment updated: ${comment.content.substring(0, 50)}...`]);
    },
    onCommentDeleted: (event) => {
      setTestResults(prev => [...prev, `🗑️ Comment deleted: ${event.commentId}`]);
    },
    onError: (error) => {
      setTestResults(prev => [...prev, `❌ Error: ${error.message}`]);
    }
  });

  // Create comment mutation
  const [createComment, { data: createCommentData }] = useMutation(CREATE_COMMENT_MUTATION, {
    onError: (error) => {
      setIsSubmitting(false);
      setTestResults(prev => [...prev, `❌ Failed to create comment: ${error.message}`]);
    }
  });

  // Handle comment creation completion
  useEffect(() => {
    if (createCommentData?.createComment) {
      setNewComment('');
      setIsSubmitting(false);
      setTestResults(prev => [...prev, `✅ Comment created successfully`]);
    }
  }, [createCommentData]);

  // Handle new comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createComment({
        variables: {
          input: {
            content: newComment.trim(),
            projectId: projectId
          }
        }
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  // Clear test results
  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Real-Time Comments Test</h2>
        <p className="text-gray-600">Project ID: {projectId}</p>
        <p className="text-sm text-gray-500">User: {user?.firstName} {user?.lastName} ({user?.role})</p>
      </div>

      {/* Test Results */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
          <button
            onClick={clearResults}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500 text-sm">No test results yet. Try creating a comment!</p>
          ) : (
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div className="mb-6">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Add Test Comment
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter a test comment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Comment'}
          </button>
        </form>
      </div>

      {/* Comments List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Real-Time Comments ({comments.length})</h3>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Loading comments...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-600">
            <p>Error loading comments: {error.message}</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet. Create a comment to test real-time updates!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {comment.author.firstName} {comment.author.lastName}
                      </span>
                      <span className="text-sm text-gray-500">({comment.author.role})</span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Likes: {comment.likesCount}</span>
                      <span>Task: {comment.task.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Test Instructions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>1. Open this page in multiple browser tabs/windows</li>
          <li>2. Create a comment in one tab</li>
          <li>3. Watch for real-time updates in other tabs</li>
          <li>4. Check the test results above for subscription events</li>
        </ul>
      </div>
    </div>
  );
};

export default RealTimeCommentsTest;
