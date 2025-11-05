import { UseCommentSubscriptionsOptions } from '../useCommentSubscriptions';
import { UseCommentLikesSubscriptionsOptions } from '../useCommentLikesSubscriptions';
import { Comment } from '../../../services/graphql/commentQueries';

/**
 * Real-time Comments with Likes Hook Options
 * Extended options for real-time comment and like management
 */
export interface UseRealTimeCommentsWithLikesOptions extends UseCommentSubscriptionsOptions, UseCommentLikesSubscriptionsOptions {
  onError?: (error: Error) => void;
  showNotifications?: boolean;
  initialComments?: Comment[];
}

/**
 * Comment Handlers Dependencies Interface
 * Defines dependencies needed for comment event handlers
 */
export interface CommentHandlersDependencies {
  apolloClient: any;
  projectId: string;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  onCommentAdded?: (comment: Comment) => void;
  onCommentUpdated?: (comment: Comment) => void;
  onCommentDeleted?: (event: { commentId: string; projectId: string; deletedAt: string }) => void;
  showNotifications?: boolean;
}

/**
 * Like Handlers Dependencies Interface
 * Defines dependencies needed for like event handlers
 */
export interface LikeHandlersDependencies {
  apolloClient: any;
  projectId: string;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  onCommentLiked?: (event: any) => void;
  onCommentUnliked?: (event: any) => void;
}

