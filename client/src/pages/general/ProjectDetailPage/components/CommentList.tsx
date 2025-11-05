import React from 'react';
import { Link } from 'react-router-dom';
import { Comment } from '../../../../services/graphql/commentQueries';
import CommentLikers from '../../../../components/comments/CommentLikers';
import { formatRoleForDisplay } from '../../../../utils/roleFormatter';
import { ROUTE_PATHS } from '../../../../constants/routingConstants';

/**
 * Comment List Props
 */
export interface CommentListProps {
  comments: Comment[];
  isAuthenticated: boolean;
  canLikeComments: () => boolean;
  formatDate: (dateString: string) => string;
  onToggleLike: (commentId: string) => void;
  onReply: (commentId: string, authorName: string) => void;
}

/**
 * Comment List Component
 * Displays list of comments with like and reply functionality
 */
export const CommentList: React.FC<CommentListProps> = ({
  comments,
  isAuthenticated,
  canLikeComments,
  formatDate,
  onToggleLike,
  onReply,
}) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="rounded-2xl p-8 border" style={{ backgroundColor: 'var(--table-row-bg)', borderColor: 'var(--border-color)' }}>
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--badge-primary-bg)' }}
          >
            <svg className="w-8 h-8" style={{ color: 'var(--badge-primary-text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No comments yet
          </h3>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            Be the first to share your thoughts about this project!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment, index) => (
        <div key={comment.id} className="group relative">
          <div
            className="border-2 rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-from)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className="flex items-start space-x-4">
              {/* Author Avatar */}
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={{ background: 'linear-gradient(to right, var(--accent-from), var(--accent-to))' }}
                >
                  <span className="text-white font-bold text-sm">
                    {comment.author.firstName.charAt(0)}
                    {comment.author.lastName.charAt(0)}
                  </span>
                </div>
                {/* Online indicator */}
                <div
                  className="absolute -bottom-1 -right-1 w-4 h-4 border-2 rounded-full"
                  style={{ backgroundColor: 'var(--button-primary-bg)', borderColor: 'var(--card-bg)' }}
                ></div>
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                {/* Author Info */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                      {comment.author.firstName} {comment.author.lastName}
                    </span>
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                      style={{
                        backgroundColor: 'var(--badge-primary-bg)',
                        color: 'var(--badge-primary-text)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      {formatRoleForDisplay(comment.author.role)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1" style={{ color: 'var(--text-secondary)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm">{formatDate(comment.createdAt)}</span>
                  </div>
                </div>

                {/* Comment Text */}
                <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--table-row-bg)', borderColor: 'var(--border-color)' }}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-left" style={{ color: 'var(--text-primary)' }}>
                    {comment.content}
                  </p>
                </div>

                {/* Comment Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => onToggleLike(comment.id)}
                      disabled={!isAuthenticated || !canLikeComments()}
                      className={`flex items-center space-x-1 transition-colors duration-200 ${
                        !isAuthenticated || !canLikeComments() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      }`}
                      style={{ color: comment.isLikedByUser ? 'var(--accent-from)' : 'var(--text-secondary)' }}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.color = 'var(--accent-from)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.color = comment.isLikedByUser ? 'var(--accent-from)' : 'var(--text-secondary)';
                        }
                      }}
                    >
                      <svg
                        className={`w-4 h-4 ${comment.isLikedByUser ? 'fill-current' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="text-sm">
                        {comment.likesCount > 0 ? comment.likesCount : ''} Like{comment.likesCount !== 1 ? 's' : ''}
                      </span>
                    </button>

                    {/* Show who liked the comment */}
                    {comment.likesCount > 0 && (
                      <div className="mt-1">
                        <CommentLikers likers={comment.likers} totalLikes={comment.likesCount} />
                      </div>
                    )}

                    <button
                      onClick={() => onReply(comment.id, `${comment.author.firstName} ${comment.author.lastName}`)}
                      disabled={!isAuthenticated}
                      className={`flex items-center space-x-1 transition-colors duration-200 ${
                        !isAuthenticated ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      }`}
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.color = 'var(--accent-from)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span className="text-sm">Reply</span>
                    </button>
                  </div>

                  <button
                    className="transition-colors duration-200"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comment Number Badge */}
          <div
            className="absolute -left-3 -top-3 w-6 h-6 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
            style={{ background: 'linear-gradient(to right, var(--accent-from), var(--accent-to))' }}
          >
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

