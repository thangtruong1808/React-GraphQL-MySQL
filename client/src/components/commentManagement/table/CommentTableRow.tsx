import React from 'react';
import { FaCommentDots, FaUser, FaTasks, FaFolder, FaHeart, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { COMMENT_TABLE_COLUMNS, COMMENT_PRIORITY_COLORS } from '../../../constants/commentManagement';
import { Comment } from '../../../types/commentManagement';
import { formatRoleForDisplay } from '../../../utils/roleFormatter';
import { formatDate, formatContentWithWordWrap, getCommentPriority } from './utils';

interface CommentTableRowProps {
  comment: Comment;
  onEdit?: (comment: Comment) => void;
  onDelete?: (comment: Comment) => void;
}

/**
 * Comment Table Row Component
 * Displays a single comment row in the table
 */
const CommentTableRow: React.FC<CommentTableRowProps> = ({
  comment,
  onEdit,
  onDelete
}) => {
  const contentLines = formatContentWithWordWrap(comment.content);
  const priority = getCommentPriority(comment.likesCount);

  return (
    <tr
      key={comment.id}
      className="transition-colors"
      style={{ backgroundColor: 'var(--table-row-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--table-row-hover-bg)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--table-row-bg)'; }}
    >
      {/* ID Column - Hidden on mobile */}
      <td className={`hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left ${COMMENT_TABLE_COLUMNS.ID.width}`} style={{ color: 'var(--table-text-primary)' }}>
        {comment.id}
      </td>

      {/* Content */}
      <td className={`px-4 py-4 text-sm text-left ${COMMENT_TABLE_COLUMNS.CONTENT.width}`} style={{ color: 'var(--table-text-primary)' }}>
        <div className="space-y-1">
          {contentLines.map((line, index) => (
            <p key={index} className="leading-relaxed flex items-start space-x-2">
              <FaCommentDots className="w-3 h-3 mt-1" style={{ color: 'var(--text-muted)' }} />
              <span>{line}</span>
            </p>
          ))}
        </div>
      </td>

      {/* Author Column - Hidden on small screens */}
      <td className={`hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-left ${COMMENT_TABLE_COLUMNS.AUTHOR.width}`} style={{ color: 'var(--table-text-primary)' }}>
        <div className="flex flex-col">
          <p className="font-medium flex items-center space-x-2">
            <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>{comment.author.firstName} {comment.author.lastName}</span>
          </p>
          <p className="text-xs" style={{ color: 'var(--table-text-secondary)' }}>{formatRoleForDisplay(comment.author.role)}</p>
        </div>
      </td>

      {/* Task Column - Hidden on extra small screens */}
      <td className={`hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm text-left ${COMMENT_TABLE_COLUMNS.TASK.width}`} style={{ color: 'var(--table-text-primary)' }}>
        <p className="truncate flex items-center space-x-2" title={comment.task.title}>
          <FaTasks className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{comment.task.title}</span>
        </p>
      </td>

      {/* Project Column - Hidden on mobile and tablet */}
      <td className={`hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left ${COMMENT_TABLE_COLUMNS.PROJECT.width}`} style={{ color: 'var(--table-text-primary)' }}>
        <p className="truncate flex items-center space-x-2" title={comment.task.project.name}>
          <FaFolder className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{comment.task.project.name}</span>
        </p>
      </td>

      {/* Likes Column - Hidden on small screens */}
      <td className={`hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-left ${COMMENT_TABLE_COLUMNS.LIKES.width}`} style={{ color: 'var(--table-text-primary)' }}>
        <div className="flex items-center space-x-1">
          <FaHeart className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span className={`font-medium ${COMMENT_PRIORITY_COLORS[priority]}`}>
            {comment.likesCount}
          </span>
        </div>
      </td>

      {/* Created Column - Hidden on extra small screens */}
      <td className={`hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm text-left ${COMMENT_TABLE_COLUMNS.CREATED.width}`} style={{ color: 'var(--table-text-secondary)' }}>
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(comment.createdAt)}</span>
        </div>
      </td>

      {/* Updated Column - Hidden on mobile and tablet */}
      <td className={`hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-left ${COMMENT_TABLE_COLUMNS.UPDATED.width}`} style={{ color: 'var(--table-text-secondary)' }}>
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(comment.updatedAt)}</span>
        </div>
      </td>

      {/* Actions */}
      <td className={`px-4 py-4 whitespace-nowrap text-left ${COMMENT_TABLE_COLUMNS.ACTIONS.width}`}>
        {(onEdit || onDelete) && (
          <div className="flex justify-start space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(comment)}
                className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150"
                style={{ backgroundColor: 'var(--button-secondary-bg)', color: 'var(--button-primary-text)', borderColor: 'var(--button-secondary-bg)' }}
                title="Edit comment"
              >
                <FaEdit className="w-3 h-3 mr-1" />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(comment)}
                className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150"
                style={{ backgroundColor: 'var(--button-danger-bg)', color: 'var(--button-primary-text)', borderColor: 'var(--button-danger-bg)' }}
                title="Delete comment"
              >
                <FaTrash className="w-3 h-3 mr-1" />
                Delete
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

export default CommentTableRow;

