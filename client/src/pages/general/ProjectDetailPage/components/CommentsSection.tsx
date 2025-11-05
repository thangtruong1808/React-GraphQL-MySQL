import React from 'react';
import { Comment } from '../../../../services/graphql/commentQueries';
import { ProjectDetails } from '../types';
import { CommentPermissions } from './CommentPermissions';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

/**
 * Comments Section Props
 */
export interface CommentsSectionProps {
  project: ProjectDetails;
  comments: Comment[];
  isAuthenticated: boolean;
  user: any;
  canPostComments: () => boolean;
  canLikeComments: () => boolean;
  canViewComments: () => boolean;
  newComment: string;
  setNewComment: (comment: string) => void;
  isSubmittingComment: boolean;
  formatDate: (dateString: string) => string;
  onSubmitComment: (e: React.FormEvent) => void;
  onToggleLike: (commentId: string) => void;
  onReply: (commentId: string, authorName: string) => void;
}

/**
 * Comments Section Component
 * Displays comments section with permissions, form, and list
 */
export const CommentsSection: React.FC<CommentsSectionProps> = ({
  project,
  comments,
  isAuthenticated,
  user,
  canPostComments,
  canLikeComments,
  canViewComments,
  newComment,
  setNewComment,
  isSubmittingComment,
  formatDate,
  onSubmitComment,
  onToggleLike,
  onReply,
}) => {
  return (
    <div
      className="rounded-lg shadow-lg p-6 mt-6"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: '1px', borderStyle: 'solid' }}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Project Comments
        </h2>
        {comments.length > 0 && (
          <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--button-primary-bg)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--button-primary-bg)' }}></div>
            <span>Live updates</span>
          </div>
        )}
      </div>

      {/* Permission Messages */}
      <CommentPermissions project={project} isAuthenticated={isAuthenticated} canPostComments={canPostComments} />

      {/* Comment Input Form - Only show if user is authenticated and can post comments */}
      {isAuthenticated && canPostComments() && (
        <CommentForm
          newComment={newComment}
          setNewComment={setNewComment}
          isSubmittingComment={isSubmittingComment}
          canPostComments={canPostComments()}
          onSubmit={onSubmitComment}
          user={user}
        />
      )}

      {/* Comments List - Only show for users who can view comments */}
      {canViewComments() && (
        <CommentList
          comments={comments}
          isAuthenticated={isAuthenticated}
          canLikeComments={canLikeComments}
          formatDate={formatDate}
          onToggleLike={onToggleLike}
          onReply={onReply}
        />
      )}
    </div>
  );
};

