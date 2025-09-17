import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { SEARCH_MEMBERS, SEARCH_PROJECTS, SEARCH_TASKS } from '../../services/graphql/queries';
import {
  SearchHeader,
  ActiveFilters,
  MembersSection,
  ProjectsSection,
  TasksSection,
  NoSearchCriteria,
  DetailModal
} from '../../components/search';

/**
 * Search Results Page Component
 * Displays search results for members, projects, and tasks
 * Refactored into smaller, maintainable components
 */

interface SearchResults {
  members: any[];
  projects: any[];
  tasks: any[];
}

/**
 * SearchResultsPage Component
 * Orchestrates search results display using smaller components
 */
const SearchResultsPage: React.FC = () => {
  // Get search query and filters from URL parameters
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const projectStatusFilter = searchParams.get('projectStatus')?.split(',') || [];
  const taskStatusFilter = searchParams.get('taskStatus')?.split(',') || [];

  // State for search results
  const [searchResults, setSearchResults] = useState<SearchResults>({
    members: [],
    projects: [],
    tasks: []
  });

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

  // Items per page for each section
  const ITEMS_PER_PAGE = 3;

  // Pagination helper functions
  const getPaginatedResults = (items: any[], currentPageNum: number) => {
    const startIndex = (currentPageNum - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items: any[]) => {
    return Math.ceil(items.length / ITEMS_PER_PAGE);
  };

  // Modal handlers for detail view
  const handleMemberClick = (member: any) => {
    setModalData(member);
    setModalType('member');
    setIsModalOpen(true);
  };

  const handleProjectClick = (project: any) => {
    setModalData(project);
    setModalType('project');
    setIsModalOpen(true);
  };

  const handleTaskClick = (task: any) => {
    setModalData(task);
    setModalType('task');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  // Reset pagination when search results change
  useEffect(() => {
    setCurrentPage({ members: 1, projects: 1, tasks: 1 });
  }, [searchResults]);

  // GraphQL queries for search functionality - only run when there are actual search criteria
  const { data: membersData, loading: membersLoading } = useQuery(SEARCH_MEMBERS, {
    variables: { query: searchQuery || undefined },
    skip: !searchQuery || searchQuery.length < 2, // Only run when there's a search query
    errorPolicy: 'all'
  });

  const { data: projectsData, loading: projectsLoading } = useQuery(SEARCH_PROJECTS, {
    variables: {
      statusFilter: projectStatusFilter.length > 0 ? projectStatusFilter : undefined
    },
    skip: projectStatusFilter.length === 0, // Only run when there are project status filters
    errorPolicy: 'all'
  });

  const { data: tasksData, loading: tasksLoading } = useQuery(SEARCH_TASKS, {
    variables: {
      taskStatusFilter: taskStatusFilter.length > 0 ? taskStatusFilter : undefined
    },
    skip: taskStatusFilter.length === 0, // Only run when there are task status filters
    errorPolicy: 'all'
  });

  // Update search results when GraphQL data changes
  useEffect(() => {
    const members = membersData?.searchMembers || [];
    const directProjects = projectsData?.searchProjects || [];
    const directTasks = tasksData?.searchTasks || [];

    // Extract projects and tasks from members' owned projects
    const relatedProjects: any[] = [];
    const relatedTasks: any[] = [];

    members.forEach((member: any) => {
      if (member.ownedProjects) {
        member.ownedProjects.forEach((project: any) => {
          // Add project to related projects
          relatedProjects.push(project);

          // Add tasks from this project to related tasks
          if (project.tasks) {
            project.tasks.forEach((task: any) => {
              relatedTasks.push(task);
            });
          }
        });
      }

      // Also add assigned tasks
      if (member.assignedTasks) {
        member.assignedTasks.forEach((task: any) => {
          relatedTasks.push(task);
        });
      }
    });

    // Combine direct results with related results
    const allProjects = [...directProjects, ...relatedProjects];
    const allTasks = [...directTasks, ...relatedTasks];

    setSearchResults({
      members,
      projects: allProjects,
      tasks: allTasks
    });
  }, [membersData, projectsData, tasksData]);

  // Calculate total results
  const totalResults = searchResults.members.length + searchResults.projects.length + searchResults.tasks.length;

  // Check if any search criteria is active
  const hasSearchCriteria = (searchQuery && searchQuery.length >= 2) || projectStatusFilter.length > 0 || taskStatusFilter.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <SearchHeader
          totalResults={totalResults}
          memberCount={searchResults.members.length}
          projectCount={searchResults.projects.length}
          taskCount={searchResults.tasks.length}
        />

        {/* Active Filters */}
        <ActiveFilters
          projectStatusFilter={projectStatusFilter}
          taskStatusFilter={taskStatusFilter}
        />

        {/* No search criteria state */}
        {!hasSearchCriteria && <NoSearchCriteria />}

        {/* Search Results with Enhanced Layout */}
        {hasSearchCriteria && (
          <div className="space-y-10">
            {/* Members Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-50"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200 p-6">
                <MembersSection
                  members={getPaginatedResults(searchResults.members, currentPage.members)}
                  loading={membersLoading}
                  hasQuery={hasSearchCriteria}
                  currentPage={currentPage.members}
                  totalPages={getTotalPages(searchResults.members)}
                  onPageChange={(page) => setCurrentPage(prev => ({ ...prev, members: page }))}
                  totalItems={searchResults.members.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onMemberClick={handleMemberClick}
                />
              </div>
            </div>

            {/* Projects Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl opacity-50"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-6">
                <ProjectsSection
                  projects={getPaginatedResults(searchResults.projects, currentPage.projects)}
                  loading={projectsLoading}
                  hasQuery={hasSearchCriteria}
                  currentPage={currentPage.projects}
                  totalPages={getTotalPages(searchResults.projects)}
                  onPageChange={(page) => setCurrentPage(prev => ({ ...prev, projects: page }))}
                  totalItems={searchResults.projects.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onProjectClick={handleProjectClick}
                />
              </div>
            </div>

            {/* Tasks Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl opacity-50"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-200 p-6">
                <TasksSection
                  tasks={getPaginatedResults(searchResults.tasks, currentPage.tasks)}
                  loading={tasksLoading}
                  hasQuery={hasSearchCriteria}
                  currentPage={currentPage.tasks}
                  totalPages={getTotalPages(searchResults.tasks)}
                  onPageChange={(page) => setCurrentPage(prev => ({ ...prev, tasks: page }))}
                  totalItems={searchResults.tasks.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onTaskClick={handleTaskClick}
                />
              </div>
            </div>
          </div>
        )}
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

export default SearchResultsPage;