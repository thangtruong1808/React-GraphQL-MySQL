import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
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
                <th className="hidden lg:table-cell w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                {/* Name Column */}
                <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                {/* Description Column - Hidden on small screens */}
                <th className="hidden sm:table-cell w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                {/* Type Column - Hidden on extra small screens */}
                <th className="hidden xs:table-cell w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                {/* Category Column - Hidden on mobile and tablet */}
                <th className="hidden lg:table-cell w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                {/* Created Column - Hidden on extra small screens */}
                <th className="hidden xs:table-cell w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                {/* Updated Column - Hidden on mobile and tablet */}
                <th className="hidden lg:table-cell w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                {/* Actions Column */}
                <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full theme-table-divide table-fixed">
          <thead className="theme-table-header-bg">
            <tr>
              {/* ID Column - Hidden on mobile */}
              <th
                className="hidden lg:table-cell w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  {getSortIcon('id')}
                </div>
              </th>
              {/* Name Column */}
              <th
                className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              {/* Description Column - Hidden on small screens */}
              <th className="hidden sm:table-cell w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              {/* Type Column - Hidden on extra small screens */}
              <th
                className="hidden xs:table-cell w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  {getSortIcon('type')}
                </div>
              </th>
              {/* Category Column - Hidden on mobile and tablet */}
              <th
                className="hidden lg:table-cell w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  {getSortIcon('category')}
                </div>
              </th>
              {/* Created Column - Hidden on extra small screens */}
              <th
                className="hidden xs:table-cell w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              {/* Updated Column - Hidden on mobile and tablet */}
              <th
                className="hidden lg:table-cell w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Updated</span>
                  {getSortIcon('updatedAt')}
                </div>
              </th>
              {/* Actions Column */}
              <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="theme-table-row-bg theme-table-divide">
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${TAGS_TABLE_COLUMNS.ID.width}`}>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${TAGS_TABLE_COLUMNS.NAME.width}`}>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className={`px-4 py-4 text-sm text-gray-900 text-left ${TAGS_TABLE_COLUMNS.DESCRIPTION.width}`}>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${TAGS_TABLE_COLUMNS.TYPE.width}`}>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left ${TAGS_TABLE_COLUMNS.CATEGORY.width}`}>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${TAGS_TABLE_COLUMNS.CREATED.width}`}>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left ${TAGS_TABLE_COLUMNS.UPDATED.width}`}>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-left ${TAGS_TABLE_COLUMNS.ACTIONS.width}`}>
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : tags.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-sm text-gray-500">
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
                <tr key={tag.id} className="theme-table-row-hover-bg transition-colors duration-200">
                  {/* ID Column - Hidden on mobile */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    {tag.id}
                  </td>

                  {/* Name Column */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                    <div className="flex flex-col">
                      <p className="font-medium">{tag.name}</p>
                      {tag.title && (
                        <p className="text-xs text-gray-500">{tag.title}</p>
                      )}
                    </div>
                  </td>

                  {/* Description Column - Hidden on small screens */}
                  <td className="hidden sm:table-cell px-4 py-4 text-sm text-gray-900 text-left">
                    <p className="truncate" title={tag.description}>
                      {tag.description}
                    </p>
                  </td>

                  {/* Type Column - Hidden on extra small screens */}
                  <td className="hidden xs:table-cell px-4 py-4 whitespace-nowrap text-left">
                    {tag.type ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TAG_TYPE_COLORS[tag.type as keyof typeof TAG_TYPE_COLORS] || TAG_TYPE_COLORS.other}`}>
                        {tag.type}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>

                  {/* Category Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-left">
                    {tag.category ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TAG_CATEGORY_COLORS[tag.category as keyof typeof TAG_CATEGORY_COLORS] || TAG_CATEGORY_COLORS.other}`}>
                        {tag.category}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>

                  {/* Created Column - Hidden on extra small screens */}
                  <td className="hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                    {formatDate(tag.createdAt)}
                  </td>

                  {/* Updated Column - Hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                    {formatDate(tag.updatedAt)}
                  </td>

                  {/* Actions Column */}
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <div className="flex justify-start space-x-2">
                      <button
                        onClick={() => onEdit(tag)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150"
                        title="Edit tag"
                      >
                        <FaEdit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(tag)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                        title="Delete tag"
                      >
                        <FaTrash className="w-3 h-3 mr-1" />
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
      <div className="bg-white px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between theme-border-medium">
        {/* Mobile pagination - show on small screens */}
        <div className="flex-1 flex justify-between sm:hidden">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(paginationInfo.currentPage - 1)}
              disabled={!paginationInfo.hasPreviousPage || loading}
              className="px-2 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden xs:inline">Previous</span>
            </button>
            <span className="px-2 py-1.5 text-xs text-gray-700 bg-gray-50 border border-gray-300 rounded">
              {paginationInfo.currentPage} / {paginationInfo.totalPages}
            </span>
            <button
              onClick={() => onPageChange(paginationInfo.currentPage + 1)}
              disabled={!paginationInfo.hasNextPage || loading}
              className="px-2 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
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
          <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
            {/* Compact page info */}
            <p className="text-xs lg:text-sm text-gray-600">
              <span className="hidden md:inline">Showing </span>
              <span className="font-medium">{paginationInfo.totalCount === 0 ? 0 : (paginationInfo.currentPage - 1) * pageSize + 1}</span>
              <span className="hidden md:inline"> to </span>
              <span className="md:hidden">-</span>
              <span className="font-medium">{Math.min(paginationInfo.currentPage * pageSize, paginationInfo.totalCount)}</span>
              <span className="hidden md:inline"> of </span>
              <span className="md:hidden">/</span>
              <span className="font-medium">{paginationInfo.totalCount}</span>
            </p>

            {/* Page size selector */}
            <div className="flex items-center space-x-1">
              <span className="text-xs lg:text-sm text-gray-600">Show</span>
              <select
                id="page-size"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                disabled={loading}
                className="px-2 py-1 text-xs lg:text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="text-xs lg:text-sm text-gray-600">entries</span>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-1">
            {/* First page button - hidden on small screens */}
            <button
              onClick={() => onPageChange(1)}
              disabled={paginationInfo.currentPage === 1 || loading}
              className="hidden md:flex px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors items-center space-x-1"
              title="Go to first page"
            >
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <span className="hidden lg:inline">First</span>
            </button>

            {/* Previous button */}
            <button
              onClick={() => onPageChange(paginationInfo.currentPage - 1)}
              disabled={!paginationInfo.hasPreviousPage || loading}
              className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="Go to previous page"
            >
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden lg:inline">Previous</span>
            </button>

            {/* Page numbers - responsive spacing */}
            <div className="flex items-center space-x-1 mx-1 lg:mx-2">
              {Array.from({ length: Math.min(3, paginationInfo.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(paginationInfo.totalPages - 2, paginationInfo.currentPage - 1)) + i;
                if (pageNum > paginationInfo.totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    disabled={loading}
                    className={`px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors min-w-[2rem] lg:min-w-[2.5rem] ${pageNum === paginationInfo.currentPage
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-purple-300'
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
              className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              title="Go to next page"
            >
              <span className="hidden lg:inline">Next</span>
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Last page button - hidden on small screens */}
            <button
              onClick={() => onPageChange(paginationInfo.totalPages)}
              disabled={paginationInfo.currentPage === paginationInfo.totalPages || loading}
              className="hidden md:flex px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors items-center space-x-1"
              title="Go to last page"
            >
              <span className="hidden lg:inline">Last</span>
              <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
