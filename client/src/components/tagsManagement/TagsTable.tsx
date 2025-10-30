import React from 'react';
import { FaEdit, FaTrash, FaTag, FaCalendarAlt, FaCog } from 'react-icons/fa';
import {
  TAGS_TABLE_COLUMNS,
  TAG_TYPE_COLORS,
  TAG_CATEGORY_COLORS,
  PAGE_SIZE_OPTIONS,
} from '../../constants/tagsManagement';
import { TagsTableProps } from '../../types/tagsManagement';

/**
 * Tags Table Component
 * Displays tags in a paginated table with sorting and CRUD actions
 * Features responsive design and loading states
 */
const TagsTable: React.FC<TagsTableProps> = ({
  tags,
  loading,
  paginationInfo,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSort,
  currentSortBy,
  currentSortOrder,
  onEdit,
  onDelete,
}) => {
  // Format date with error handling
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Get sort icon for column headers
  const getSortIcon = (column: string) => {
    // Map UI column names to database field names for icon display
    const fieldMapping: { [key: string]: string } = {
      'id': 'id',
      'name': 'name',
      'type': 'type',
      'category': 'category',
      'created': 'createdAt',
      'updated': 'updatedAt'
    };

    const dbField = fieldMapping[column] || column;

    if (currentSortBy !== dbField) {
      return (
        <svg className="w-4 h-4 theme-sort-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return currentSortOrder === 'ASC' ? (
      <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 theme-sort-icon-active" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Handle sort click
  const handleSort = (column: string) => {
    // Map UI column names to database field names
    const fieldMapping: { [key: string]: string } = {
      'id': 'id',
      'name': 'name',
      'type': 'type',
      'category': 'category',
      'created': 'createdAt',
      'updated': 'updatedAt'
    };

    const dbField = fieldMapping[column] || column;
    let newSortOrder = 'ASC';

    if (currentSortBy === dbField) {
      // If already sorting by this field, toggle order
      newSortOrder = currentSortOrder === 'ASC' ? 'DESC' : 'ASC';
    }

    onSort(dbField, newSortOrder);
  };

  // Loading skeleton rows
  const renderLoadingRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <tr key={index} className="animate-pulse">
        {/* ID Column - Hidden on mobile */}
        <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </td>
        {/* Name Column */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </td>
        {/* Description Column - Hidden on small screens */}
        <td className="hidden sm:table-cell px-4 py-4 text-sm text-gray-900 text-left">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </td>
        {/* Type Column - Hidden on extra small screens */}
        <td className="hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </td>
        {/* Category Column - Hidden on mobile and tablet */}
        <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </td>
        {/* Created Column - Hidden on extra small screens */}
        <td className="hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        {/* Updated Column - Hidden on mobile and tablet */}
        <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        {/* Actions Column */}
        <td className="px-4 py-4 whitespace-nowrap text-left">
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </td>
      </tr>
    ));
  };

  if (loading && tags.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full theme-table-divide table-fixed">
            <thead className="theme-table-header-bg">
              <tr>
                {/* ID Column - Hidden on mobile */}
                <th className="hidden lg:table-cell w-16 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
                  ID
                </th>
                {/* Name Column */}
                <th className="w-32 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
                  Name
                </th>
                {/* Description Column - Hidden on small screens */}
                <th className="hidden sm:table-cell w-48 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
                  Description
                </th>
                {/* Type Column - Hidden on extra small screens */}
                <th className="hidden xs:table-cell w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
                  Type
                </th>
                {/* Category Column - Hidden on mobile and tablet */}
                <th className="hidden lg:table-cell w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
                  Category
                </th>
                {/* Created Column - Hidden on extra small screens */}
                <th className="hidden xs:table-cell w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
                  Created
                </th>
                {/* Updated Column - Hidden on mobile and tablet */}
                <th className="hidden lg:table-cell w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
                  Updated
                </th>
                {/* Actions Column */}
                <th className="w-32 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="theme-table-row-bg theme-table-divide">
              {renderLoadingRows()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderWidth: '1px' }}>
      <div className="overflow-x-auto">
        <table className="min-w-full" style={{ borderColor: 'var(--border-color)' }}>
          <thead style={{ backgroundColor: 'var(--table-header-bg)' }}>
            <tr>
              {/* ID Column - Hidden on mobile */}
              <th
                className="hidden lg:table-cell w-16 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-200"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('id')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center space-x-2">
                  <span>ID</span>
                  {getSortIcon('id')}
                </div>
              </th>
              {/* Name Column */}
              <th
                className="w-32 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-200"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('name')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center space-x-2">
                  <FaTag className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              {/* Description Column - Hidden on small screens */}
              <th className="hidden sm:table-cell w-48 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
                <div className="flex items-center space-x-2">
                  <FaCog className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Description</span>
                </div>
              </th>
              {/* Type Column - Hidden on extra small screens */}
              <th
                className="hidden xs:table-cell w-24 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-200"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('type')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center space-x-2">
                  <span>Type</span>
                  {getSortIcon('type')}
                </div>
              </th>
              {/* Category Column - Hidden on mobile and tablet */}
              <th
                className="hidden lg:table-cell w-24 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-200"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('category')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center space-x-2">
                  <span>Category</span>
                  {getSortIcon('category')}
                </div>
              </th>
              {/* Created Column - Hidden on extra small screens */}
              <th
                className="hidden xs:table-cell w-24 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-200"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('createdAt')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Created</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              {/* Updated Column - Hidden on mobile and tablet */}
              <th
                className="hidden lg:table-cell w-24 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-200"
                style={{ color: 'var(--table-text-secondary)' }}
                onClick={() => handleSort('updatedAt')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Updated</span>
                  {getSortIcon('updatedAt')}
                </div>
              </th>
              {/* Actions Column */}
              <th className="w-32 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--table-text-secondary)' }}>
                <div className="flex items-center space-x-2">
                  <FaCog className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  <span>Actions</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: 'var(--table-row-bg)' }}>
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-900 text-left">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </td>
                  <td className="hidden xs:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="hidden xs:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : tags.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FaTag className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No tags found</h3>
                    <p className="text-gray-500 max-w-sm">Try adjusting your search criteria or create a new tag to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tags.map((tag, index) => (
                <tr 
                  key={tag.id} 
                  className="transition-colors duration-200"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? 'var(--table-row-bg)' : 'var(--table-row-hover-bg)',
                    borderBottomColor: 'var(--border-color)',
                    borderBottomWidth: '1px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'var(--table-row-bg)' : 'var(--table-row-hover-bg)';
                  }}
                >
                  {/* ID Column - Hidden on mobile */}
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm font-medium text-left" style={{ color: 'var(--table-text-primary)' }}>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--badge-neutral-bg)', color: 'var(--badge-neutral-text)' }}>
                      #{tag.id}
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
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--table-text-secondary)' }} title={tag.description}>
                      {tag.description}
                    </p>
                  </td>

                  {/* Type Column - Hidden on extra small screens */}
                  <td className="hidden xs:table-cell px-6 py-4 whitespace-nowrap text-left">
                    {tag.type ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--badge-primary-bg)', color: 'var(--badge-primary-text)' }}>
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
                        {tag.category}
                      </span>
                    ) : (
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>

                  {/* Created Column - Hidden on extra small screens */}
                  <td className="hidden xs:table-cell px-6 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-muted)' }}>
                    <div className="flex items-center space-x-1">
                      <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{formatDate(tag.createdAt)}</span>
                    </div>
                  </td>

                  {/* Updated Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-muted)' }}>
                    <div className="flex items-center space-x-1">
                      <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      <span>{formatDate(tag.updatedAt)}</span>
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(tag)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white transition-all duration-200 shadow-sm"
                        style={{ backgroundColor: 'var(--button-secondary-bg)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--button-secondary-hover-bg)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--button-secondary-bg)';
                        }}
                        title="Edit tag"
                      >
                        <FaEdit className="w-3 h-3 mr-1.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(tag)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white transition-all duration-200 shadow-sm"
                        style={{ backgroundColor: 'var(--button-danger-bg)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--button-danger-hover-bg)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--button-danger-bg)';
                        }}
                        title="Delete tag"
                      >
                        <FaTrash className="w-3 h-3 mr-1.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4" style={{ backgroundColor: 'var(--table-header-bg)', borderTopColor: 'var(--border-color)', borderTopWidth: '1px' }}>
        {/* Mobile pagination - show on small screens */}
        <div className="flex-1 flex justify-between sm:hidden">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(paginationInfo.currentPage - 1)}
              disabled={!paginationInfo.hasPreviousPage || loading}
              className="px-3 py-2 text-xs font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 shadow-sm"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                color: 'var(--text-primary)', 
                borderColor: 'var(--border-color)',
                borderWidth: '1px'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'var(--card-bg)';
                }
              }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden xs:inline">Previous</span>
            </button>
            <span className="px-3 py-2 text-xs font-medium rounded-lg" style={{ backgroundColor: 'var(--badge-primary-bg)', color: 'var(--badge-primary-text)', borderColor: 'var(--border-color)', borderWidth: '1px' }}>
              {paginationInfo.currentPage} / {paginationInfo.totalPages}
            </span>
            <button
              onClick={() => onPageChange(paginationInfo.currentPage + 1)}
              disabled={!paginationInfo.hasNextPage || loading}
              className="px-3 py-2 text-xs font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 shadow-sm"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                color: 'var(--text-primary)', 
                borderColor: 'var(--border-color)',
                borderWidth: '1px'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = 'var(--card-bg)';
                }
              }}
            >
              <span className="hidden xs:inline">Next</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop pagination - show on sm and larger screens */}
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          {/* Page info and size selector */}
          <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-6">
            {/* Enhanced page info */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 [data-theme='brand']:bg-purple-600 rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-300 [data-theme='brand']:text-purple-700">
                <span className="hidden md:inline">Showing </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100 [data-theme='brand']:text-purple-900">{paginationInfo.totalCount === 0 ? 0 : (paginationInfo.currentPage - 1) * pageSize + 1}</span>
                <span className="hidden md:inline"> to </span>
                <span className="md:hidden">-</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100 [data-theme='brand']:text-purple-900">{Math.min(paginationInfo.currentPage * pageSize, paginationInfo.totalCount)}</span>
                <span className="hidden md:inline"> of </span>
                <span className="md:hidden">/</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100 [data-theme='brand']:text-purple-900">{paginationInfo.totalCount}</span>
                <span className="hidden md:inline"> results</span>
              </p>
            </div>

            {/* Enhanced page size selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300 [data-theme='brand']:text-purple-700">Show</span>
              <select
                id="page-size"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                disabled={loading}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 [data-theme='brand']:border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 [data-theme='brand']:focus:ring-purple-500 focus:border-purple-500 dark:focus:border-purple-400 [data-theme='brand']:focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 [data-theme='brand']:bg-white text-gray-900 dark:text-gray-100 [data-theme='brand']:text-purple-900 shadow-sm"
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600 dark:text-gray-300 [data-theme='brand']:text-purple-700">entries</span>
            </div>
          </div>

          {/* Enhanced Navigation buttons */}
          <div className="flex items-center space-x-2">
            {/* First page button - hidden on small screens */}
            <button
              onClick={() => onPageChange(1)}
              disabled={paginationInfo.currentPage === 1 || loading}
              className="hidden md:flex px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-700 bg-white dark:bg-gray-800 [data-theme='brand']:bg-white border border-gray-300 dark:border-gray-600 [data-theme='brand']:border-purple-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 [data-theme='brand']:hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 items-center space-x-1 shadow-sm"
              title="Go to first page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <span className="hidden lg:inline">First</span>
            </button>

            {/* Previous button */}
            <button
              onClick={() => onPageChange(paginationInfo.currentPage - 1)}
              disabled={!paginationInfo.hasPreviousPage || loading}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-700 bg-white dark:bg-gray-800 [data-theme='brand']:bg-white border border-gray-300 dark:border-gray-600 [data-theme='brand']:border-purple-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 [data-theme='brand']:hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1 shadow-sm"
              title="Go to previous page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden lg:inline">Previous</span>
            </button>

            {/* Page numbers - responsive spacing */}
            <div className="flex items-center space-x-1 mx-2">
              {Array.from({ length: Math.min(3, paginationInfo.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(paginationInfo.totalPages - 2, paginationInfo.currentPage - 1)) + i;
                if (pageNum > paginationInfo.totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    disabled={loading}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 min-w-[2.5rem] ${
                      pageNum === paginationInfo.currentPage
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 [data-theme="brand"]:from-purple-700 [data-theme="brand"]:to-purple-800 text-white shadow-lg transform scale-105'
                        : 'text-gray-700 dark:text-gray-300 [data-theme="brand"]:text-purple-700 bg-white dark:bg-gray-800 [data-theme="brand"]:bg-white border border-gray-300 dark:border-gray-600 [data-theme="brand"]:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-700 [data-theme="brand"]:hover:bg-purple-50 hover:border-purple-300 dark:hover:border-purple-400 [data-theme="brand"]:hover:border-purple-400 hover:shadow-md'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={`Go to page ${pageNum}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={() => onPageChange(paginationInfo.currentPage + 1)}
              disabled={!paginationInfo.hasNextPage || loading}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-700 bg-white dark:bg-gray-800 [data-theme='brand']:bg-white border border-gray-300 dark:border-gray-600 [data-theme='brand']:border-purple-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 [data-theme='brand']:hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1 shadow-sm"
              title="Go to next page"
            >
              <span className="hidden lg:inline">Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Last page button - hidden on small screens */}
            <button
              onClick={() => onPageChange(paginationInfo.totalPages)}
              disabled={paginationInfo.currentPage === paginationInfo.totalPages || loading}
              className="hidden md:flex px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 [data-theme='brand']:text-purple-700 bg-white dark:bg-gray-800 [data-theme='brand']:bg-white border border-gray-300 dark:border-gray-600 [data-theme='brand']:border-purple-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 [data-theme='brand']:hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 items-center space-x-1 shadow-sm"
              title="Go to last page"
            >
              <span className="hidden lg:inline">Last</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagsTable;
