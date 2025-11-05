import React from 'react';

/**
 * Comment Form Props
 */
export interface CommentFormProps {
  newComment: string;
  setNewComment: (comment: string) => void;
  isSubmittingComment: boolean;
  canPostComments: boolean;
  onSubmit: (e: React.FormEvent) => void;
  user: any;
}

/**
 * Comment Form Component
 * Displays comment input form for authenticated users
 */
export const CommentForm: React.FC<CommentFormProps> = ({
  newComment,
  setNewComment,
  isSubmittingComment,
  canPostComments,
  onSubmit,
  user,
}) => {
  return (
    <div className="mb-8">
      <form onSubmit={onSubmit}>
        <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-start space-x-4">
            {/* User Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
              style={{ background: 'linear-gradient(to right, var(--accent-from), var(--accent-to))' }}
            >
              <span className="text-white font-bold text-sm">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </span>
            </div>

            {/* Comment Input Area */}
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this project..."
                  className="w-full px-4 py-4 border-2 rounded-xl resize-none transition-all duration-200 shadow-sm"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-color)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-from)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-ring)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  rows={4}
                  maxLength={500}
                  disabled={isSubmittingComment}
                />

                {/* Character Counter */}
                <div
                  className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full shadow-sm"
                  style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-muted)' }}
                >
                  {newComment.length}/500
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end mt-4">
                <button
                  type="submit"
                  disabled={isSubmittingComment || !newComment.trim() || !canPostComments}
                  className="group relative px-8 py-3 text-white rounded-xl focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(to right, var(--accent-from), var(--accent-to))',
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.opacity = '0.9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.opacity = '1';
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    {isSubmittingComment ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        <span>Post Comment</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

