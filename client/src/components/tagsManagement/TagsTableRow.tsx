import React from 'react';
import { FaEdit, FaTrash, FaTag, FaCalendarAlt, FaFolder, FaAlignLeft } from 'react-icons/fa';
import { Tag } from '../../types/tagsManagement';
import { formatDate } from './tagsUtils';

interface TagsTableRowProps {
  tag: Tag;
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
}

/** Description: Displays a single tag row with themed action buttons in the tags dashboard table; Data created: None (stateless row component); Author: thangtruong */
const TagsTableRow: React.FC<TagsTableRowProps> = ({ tag, onEdit, onDelete }) => {
  // Handle edit click
  const handleEdit = () => {
    onEdit(tag);
  };

  // Handle delete click
  const handleDelete = () => {
    onDelete(tag);
  };

  // Handle mouse enter for row
  const handleMouseEnter = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
  };

  // Handle mouse leave for row
  const handleMouseLeave = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--table-row-bg)';
  };

  return (
    <tr
      className="transition-colors duration-200"
      style={{ backgroundColor: 'var(--table-row-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: '1px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ID Column - Hidden on mobile */}
      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm font-medium text-left" style={{ color: 'var(--table-text-primary)' }}>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--badge-neutral-bg)', color: 'var(--badge-neutral-text)' }}>
          {tag.id}
        </span>
      </td>

      {/* Name Column */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-from)' }}>
              <FaTag className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--table-text-primary)' }}>{tag.name}</p>
            {tag.title && (
              <p className="text-xs truncate" style={{ color: 'var(--table-text-muted)' }}>{tag.title}</p>
            )}
          </div>
        </div>
      </td>

      {/* Description Column - Hidden on small screens */}
      <td className="hidden sm:table-cell px-6 py-4 text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <div className="flex items-center space-x-2">
          <FaAlignLeft className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm line-clamp-2" style={{ color: 'var(--table-text-secondary)' }} title={tag.description}>
            {tag.description}
          </p>
        </div>
      </td>

      {/* Type Column - Hidden on extra small screens */}
      <td className="hidden xs:table-cell px-6 py-4 whitespace-nowrap text-left">
        {tag.type ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--badge-primary-bg)', color: 'var(--badge-primary-text)' }}>
            <FaTag className="w-3 h-3 mr-1" />
            {tag.type}
          </span>
        ) : (
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>-</span>
        )}
      </td>

      {/* Category Column - Hidden on mobile and tablet */}
      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-left">
        {tag.category ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--badge-secondary-bg)', color: 'var(--badge-secondary-text)' }}>
            <FaFolder className="w-3 h-3 mr-1" />
            {tag.category}
          </span>
        ) : (
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>-</span>
        )}
      </td>

      {/* Created Column - Hidden on extra small screens */}
      <td className="hidden xs:table-cell px-6 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-secondary)' }}>
        <div className="flex items-center space-x-1">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(tag.createdAt)}</span>
        </div>
      </td>

      {/* Updated Column - Hidden on mobile and tablet */}
      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-secondary)' }}>
        <div className="flex items-center space-x-1">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(tag.updatedAt)}</span>
        </div>
      </td>

      {/* Actions Column */}
      <td className="px-6 py-4 whitespace-nowrap text-left">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform duration-150"
            style={{
              backgroundImage: 'linear-gradient(120deg, var(--button-secondary-bg), var(--accent-to))',
              color: 'var(--button-primary-text)',
              boxShadow: '0 10px 20px -8px var(--shadow-color)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 12px 24px -8px var(--shadow-color)';
              e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-secondary-hover-bg), var(--accent-to))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 20px -8px var(--shadow-color)';
              e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-secondary-bg), var(--accent-to))';
            }}
            title="Edit tag"
          >
            <FaEdit className="w-3 h-3 mr-1.5" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform duration-150"
            style={{
              backgroundImage: 'linear-gradient(120deg, var(--button-danger-bg), #ef4444)',
              color: 'var(--button-primary-text)',
              boxShadow: '0 10px 20px -8px rgba(220, 38, 38, 0.45)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(220, 38, 38, 0.55)';
              e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-danger-hover-bg), #ef4444)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 20px -8px rgba(220, 38, 38, 0.45)';
              e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-danger-bg), #ef4444)';
            }}
            title="Delete tag"
          >
            <FaTrash className="w-3 h-3 mr-1.5" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TagsTableRow;

