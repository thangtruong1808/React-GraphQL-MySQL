import React from 'react';
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
      'created': 'createdAt'
    };

    const dbField = fieldMapping[column] || column;

    if (currentSortBy !== dbField) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return currentSortOrder === 'ASC' ? (
      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      'created': 'createdAt'
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
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${TAGS_TABLE_COLUMNS.ID.width}`}>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${TAGS_TABLE_COLUMNS.NAME.width}`}>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </td>
        <td className={`px-4 py-4 text-sm text-gray-900 text-left ${TAGS_TABLE_COLUMNS.DESCRIPTION.width}`}>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-left ${TAGS_TABLE_COLUMNS.TYPE.width}`}>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-left ${TAGS_TABLE_COLUMNS.CATEGORY.width}`}>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${TAGS_TABLE_COLUMNS.CREATED.width}`}>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className={`px-4 py-4 whitespace-nowrap text-left ${TAGS_TABLE_COLUMNS.ACTIONS.width}`}>
          <div className="flex justify-start space-x-2">
            <div className="h-6 bg-gray-200 rounded w-12"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </td>
      </tr>
    ));
  };

  if (loading && tags.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${TAGS_TABLE_COLUMNS.ID.width}`}>
                  ID
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${TAGS_TABLE_COLUMNS.NAME.width}`}>
                  Name
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${TAGS_TABLE_COLUMNS.DESCRIPTION.width}`}>
                  Description
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${TAGS_TABLE_COLUMNS.TYPE.width}`}>
                  Type
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${TAGS_TABLE_COLUMNS.CATEGORY.width}`}>
                  Category
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${TAGS_TABLE_COLUMNS.CREATED.width}`}>
                  Created
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${TAGS_TABLE_COLUMNS.ACTIONS.width}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {renderLoadingRows()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${TAGS_TABLE_COLUMNS.ID.width}`}
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  {getSortIcon('id')}
                </div>
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${TAGS_TABLE_COLUMNS.NAME.width}`}
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${TAGS_TABLE_COLUMNS.DESCRIPTION.width}`}>
                Description
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${TAGS_TABLE_COLUMNS.TYPE.width}`}
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  {getSortIcon('type')}
                </div>
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${TAGS_TABLE_COLUMNS.CATEGORY.width}`}
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  {getSortIcon('category')}
                </div>
              </th>
              <th
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${TAGS_TABLE_COLUMNS.CREATED.width}`}
                onClick={() => handleSort('created')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  {getSortIcon('created')}
                </div>
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${TAGS_TABLE_COLUMNS.ACTIONS.width}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tags.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900 mb-1">No tags found</p>
                    <p className="text-gray-500">Try adjusting your search criteria or create a new tag.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50 transition-colors duration-200">
                  {/* ID */}
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${TAGS_TABLE_COLUMNS.ID.width}`}>
                    {tag.id}
                  </td>

                  {/* Name */}
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${TAGS_TABLE_COLUMNS.NAME.width}`}>
                    <div className="flex flex-col">
                      <p className="font-medium">{tag.name}</p>
                      {tag.title && (
                        <p className="text-xs text-gray-500">{tag.title}</p>
                      )}
                    </div>
                  </td>

                  {/* Description */}
                  <td className={`px-4 py-4 text-sm text-gray-900 text-left ${TAGS_TABLE_COLUMNS.DESCRIPTION.width}`}>
                    <p className="truncate" title={tag.description}>
                      {tag.description}
                    </p>
                  </td>

                  {/* Type */}
                  <td className={`px-4 py-4 whitespace-nowrap text-left ${TAGS_TABLE_COLUMNS.TYPE.width}`}>
                    {tag.type ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TAG_TYPE_COLORS[tag.type as keyof typeof TAG_TYPE_COLORS] || TAG_TYPE_COLORS.other}`}>
                        {tag.type}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>

                  {/* Category */}
                  <td className={`px-4 py-4 whitespace-nowrap text-left ${TAGS_TABLE_COLUMNS.CATEGORY.width}`}>
                    {tag.category ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TAG_CATEGORY_COLORS[tag.category as keyof typeof TAG_CATEGORY_COLORS] || TAG_CATEGORY_COLORS.other}`}>
                        {tag.category}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>

                  {/* Created */}
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${TAGS_TABLE_COLUMNS.CREATED.width}`}>
                    {formatDate(tag.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className={`px-4 py-4 whitespace-nowrap text-left ${TAGS_TABLE_COLUMNS.ACTIONS.width}`}>
                    <div className="flex justify-start space-x-2">
                      <button
                        onClick={() => onEdit(tag)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150"
                        title="Edit tag"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(tag)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                        title="Delete tag"
                      >
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
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          {/* Mobile pagination */}
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(paginationInfo.currentPage - 1)}
              disabled={!paginationInfo.hasPreviousPage || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>
            <button
              onClick={() => onPageChange(paginationInfo.currentPage + 1)}
              disabled={!paginationInfo.hasNextPage || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
            >
              <span>Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            {/* Show entries dropdown */}
            <div className="flex items-center space-x-2">
              <label htmlFor="page-size" className="text-sm text-gray-700">
                Show
              </label>
              <select
                id="page-size"
                value={paginationInfo.totalCount > 0 ? Math.ceil(paginationInfo.totalCount / paginationInfo.totalPages) : 10}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="block w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                disabled={loading}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>

            {/* Results info */}
            <div className="text-sm text-gray-700">
              Showing {((paginationInfo.currentPage - 1) * Math.ceil(paginationInfo.totalCount / paginationInfo.totalPages)) + 1} to{' '}
              {Math.min(paginationInfo.currentPage * Math.ceil(paginationInfo.totalCount / paginationInfo.totalPages), paginationInfo.totalCount)} of{' '}
              {paginationInfo.totalCount} results
            </div>
          </div>

          {/* Desktop pagination */}
          <div className="flex items-center space-x-2">
            {/* First page */}
            <button
              onClick={() => onPageChange(1)}
              disabled={paginationInfo.currentPage === 1 || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="First"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">First</span>
            </button>

            {/* Previous page */}
            <button
              onClick={() => onPageChange(paginationInfo.currentPage - 1)}
              disabled={!paginationInfo.hasPreviousPage || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="Previous"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, paginationInfo.totalPages) }, (_, i) => {
              const startPage = Math.max(1, paginationInfo.currentPage - 2);
              const pageNumber = startPage + i;
              if (pageNumber > paginationInfo.totalPages) return null;

              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  disabled={loading}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${pageNumber === paginationInfo.currentPage
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next page */}
            <button
              onClick={() => onPageChange(paginationInfo.currentPage + 1)}
              disabled={!paginationInfo.hasNextPage || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="Next"
            >
              <span className="hidden sm:inline">Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Last page */}
            <button
              onClick={() => onPageChange(paginationInfo.totalPages)}
              disabled={paginationInfo.currentPage === paginationInfo.totalPages || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="Last"
            >
              <span className="hidden sm:inline">Last</span>
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
