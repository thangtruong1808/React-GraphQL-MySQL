import React, { useState } from 'react';
import SearchHeader from './SearchHeader';
import ActiveFilters from './ActiveFilters';
import NoSearchCriteria from './NoSearchCriteria';
import DetailModal from './DetailModal';
import SearchSectionsContainer from './SearchSectionsContainer';
import { SearchHeaderSkeleton, ActiveFiltersSkeleton } from '../ui/DashboardSkeletons';

/**
 * Search Results Container Component
 * Manages the main search results layout and modal state
 * Handles pagination state and modal interactions
 */

interface SearchResultsContainerProps {
  searchResults: {
    members: any[];
    projects: any[];
    tasks: any[];
  };
  loading: {
    members: boolean;
    projects: boolean;
    tasks: boolean;
  };
  hasSearchCriteria: boolean;
  searchType: {
    isUserSearch: boolean;
    isProjectStatusSearch: boolean;
    isTaskStatusSearch: boolean;
    isRoleSearch: boolean;
  };
  projectStatusFilter: string[];
  taskStatusFilter: string[];
  searchQuery: string;
  roleFilter: string[];
}

/**
 * SearchResultsContainer Component
 * Main container for search results with modal management
 */
const SearchResultsContainer: React.FC<SearchResultsContainerProps> = ({
  searchResults,
  loading,
  hasSearchCriteria,
  searchType,
  projectStatusFilter,
  taskStatusFilter,
  searchQuery,
  roleFilter
}) => {
  // Pagination state for better UX with large result sets
  const [currentPage, setCurrentPage] = useState({
    members: 1,
    projects: 1,
    tasks: 1
  });

  // Modal state for detail view
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [modalType, setModalType] = useState<'member' | 'project' | 'task'>('member');

  // Calculate total results
  const totalResults = searchResults.members.length + searchResults.projects.length + searchResults.tasks.length;

  // Determine if any section is loading (for header and filters skeleton)
  const isAnySectionLoading = loading.members || loading.projects || loading.tasks;

  // Handle pagination changes
  const handlePageChange = (section: 'members' | 'projects' | 'tasks', page: number) => {
    setCurrentPage(prev => ({ ...prev, [section]: page }));
  };

  // Handle member click - open modal with member details
  const handleMemberClick = (member: any) => {
    setModalData(member);
    setModalType('member');
    setIsModalOpen(true);
  };

  // Handle project click - open modal with project details
  const handleProjectClick = (project: any) => {
    setModalData(project);
    setModalType('project');
    setIsModalOpen(true);
  };

  // Handle task click - open modal with task details
  const handleTaskClick = (task: any) => {
    setModalData(task);
    setModalType('task');
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  return (
    <div className="w-full h-full bg-gray-50">
      <div className="px-8 py-8">
        <div className="space-y-10">
          {/* Page Header */}
          {isAnySectionLoading ? (
            <SearchHeaderSkeleton />
          ) : (
            <SearchHeader
              totalResults={totalResults}
              memberCount={searchResults.members.length}
              projectCount={searchResults.projects.length}
              taskCount={searchResults.tasks.length}
              searchType={searchType}
            />
          )}

          {/* Active Filters */}
          {isAnySectionLoading ? (
            <ActiveFiltersSkeleton />
          ) : (
            <ActiveFilters
              projectStatusFilter={projectStatusFilter}
              taskStatusFilter={taskStatusFilter}
              searchQuery={searchQuery}
              searchType={searchType}
              roleFilter={roleFilter}
            />
          )}

          {/* No search criteria state */}
          {!hasSearchCriteria && <NoSearchCriteria />}

          {/* Search Results with Enhanced Layout */}
          <SearchSectionsContainer
            searchResults={searchResults}
            loading={loading}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onMemberClick={handleMemberClick}
            onProjectClick={handleProjectClick}
            onTaskClick={handleTaskClick}
            hasSearchCriteria={hasSearchCriteria}
            searchType={searchType}
          />
        </div>
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data={modalData}
        type={modalType}
      />
    </div>
  );
};

export default SearchResultsContainer;
