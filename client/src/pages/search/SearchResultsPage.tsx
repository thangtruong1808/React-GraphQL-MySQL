import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { SEARCH_MEMBERS, SEARCH_PROJECTS, SEARCH_TASKS } from '../../services/graphql/queries';
import SearchSection from '../../components/search/SearchSection';

/**
 * Search Results Page Component
 * Displays search results for members, projects, and tasks on the main page
 * Follows React best practices with component separation and state management
 */

interface SearchResults {
  members: any[];
  projects: any[];
  tasks: any[];
}

/**
 * SearchResultsPage Component
 * Renders search results in organized sections on the main page
 */
const SearchResultsPage: React.FC = () => {
  // Get search query and filters from URL parameters
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const projectStatusFilter = searchParams.get('projectStatus')?.split(',') || [];

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

  // Reset pagination when search results change
  useEffect(() => {
    setCurrentPage({ members: 1, projects: 1, tasks: 1 });
  }, [searchResults]);

  // GraphQL queries for search functionality
  const { data: membersData, loading: membersLoading } = useQuery(SEARCH_MEMBERS, {
    variables: { query: searchQuery },
    skip: !searchQuery || searchQuery.length < 2,
    errorPolicy: 'all'
  });

  const { data: projectsData, loading: projectsLoading } = useQuery(SEARCH_PROJECTS, {
    variables: {
      query: searchQuery || '', // Allow empty query if filters are present
      statusFilter: projectStatusFilter.length > 0 ? projectStatusFilter : undefined
    },
    skip: (!searchQuery || searchQuery.length < 2) && projectStatusFilter.length === 0,
    errorPolicy: 'all'
  });

  const { data: tasksData, loading: tasksLoading } = useQuery(SEARCH_TASKS, {
    variables: { query: searchQuery },
    skip: !searchQuery || searchQuery.length < 2,
    errorPolicy: 'all'
  });

  // Update search results when GraphQL data changes
  useEffect(() => {
    if (membersData?.searchMembers || projectsData?.searchProjects || tasksData?.searchTasks) {
      // Extract projects and tasks from member search results
      const memberProjects: any[] = [];
      const memberTasks: any[] = [];

      // Collect all projects and tasks from member search results with member context
      if (membersData?.searchMembers) {
        membersData.searchMembers.forEach((member: any) => {
          // Add owned projects
          if (member.ownedProjects) {
            const projectsWithOwner = member.ownedProjects.map((project: any) => ({
              ...project,
              _searchContext: {
                owner: {
                  id: member.id,
                  name: `${member.firstName} ${member.lastName}`,
                  email: member.email,
                  role: member.role
                }
              }
            }));
            memberProjects.push(...projectsWithOwner);
          }

          // Add projects where user has assigned tasks (for better UX)
          if (member.assignedTasks) {
            member.assignedTasks.forEach((task: any) => {
              if (task.project && !memberProjects.find(p => p.id === task.project.id)) {
                // Only add if project not already included (avoid duplicates)
                const projectWithTaskContext = {
                  ...task.project,
                  _searchContext: {
                    hasTasks: {
                      id: member.id,
                      name: `${member.firstName} ${member.lastName}`,
                      email: member.email,
                      role: member.role,
                      taskCount: member.assignedTasks.filter(t => t.project?.id === task.project.id).length
                    }
                  }
                };
                memberProjects.push(projectWithTaskContext);
              }
            });
          }

          // Add assigned tasks
          if (member.assignedTasks) {
            const tasksWithAssignee = member.assignedTasks.map((task: any) => ({
              ...task,
              _searchContext: {
                assignee: {
                  id: member.id,
                  name: `${member.firstName} ${member.lastName}`,
                  email: member.email,
                  role: member.role
                }
              }
            }));
            memberTasks.push(...tasksWithAssignee);
          }
        });
      }

      // Combine projects from direct search and member search results
      const allProjects = [
        ...(projectsData?.searchProjects || []),
        ...memberProjects
      ];

      // Combine tasks from direct search and member search results
      const allTasks = [
        ...(tasksData?.searchTasks || []),
        ...memberTasks
      ];

      // Calculate accurate counts for each member by counting from combined results
      const membersWithAccurateCounts = (membersData?.searchMembers || []).map((member: any) => {
        // Count projects owned by this member from all results
        const ownedProjectsCount = allProjects.filter(project =>
          project._searchContext?.owner?.id === member.id ||
          project.owner?.id === member.id
        ).length;

        // Count tasks assigned to this member from all results
        const assignedTasksCount = allTasks.filter(task =>
          task._searchContext?.assignee?.id === member.id ||
          task.assignedUser?.id === member.id
        ).length;

        return {
          ...member,
          _accurateCounts: {
            ownedProjects: ownedProjectsCount,
            assignedTasks: assignedTasksCount
          }
        };
      });

      setSearchResults({
        members: membersWithAccurateCounts,
        projects: allProjects,
        tasks: allTasks
      });
    }
  }, [membersData, projectsData, tasksData]);

  // Calculate total results
  const totalResults = searchResults.members.length + searchResults.projects.length + searchResults.tasks.length;
  const isLoading = membersLoading || projectsLoading || tasksLoading;

  // Pagination component for better UX
  const PaginationControls: React.FC<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    section: string;
  }> = ({ currentPage, totalPages, totalItems, onPageChange, section }) => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} {section}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm rounded-md ${currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
          >
            Previous
          </button>

          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`px-3 py-1 text-sm rounded-md ${page === currentPage
                ? 'bg-purple-600 text-white'
                : page === '...'
                  ? 'text-gray-400 cursor-default'
                  : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm rounded-md ${currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Search Results
                {searchQuery && (
                  <span className="text-lg font-normal text-gray-600 ml-2">
                    for "{searchQuery}"
                  </span>
                )}
              </h1>
              {totalResults > 0 && (
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {totalResults} total results
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {searchResults.members.length} members
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    {searchResults.projects.length} projects
                  </span>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                    {searchResults.tasks.length} tasks
                  </span>
                </div>
              )}
            </div>
            {totalResults > ITEMS_PER_PAGE && (
              <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-medium">📄 Paginated Results</span>
                <br />
                <span>3 items per section</span>
              </div>
            )}
          </div>

          {/* Active filters display */}
          {projectStatusFilter.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Filtered by project status:</p>
              <div className="flex flex-wrap gap-2">
                {projectStatusFilter.map((status) => (
                  <span
                    key={status}
                    className={`px-3 py-1 text-xs rounded-full ${status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {status.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* No query or filters state */}
        {!searchQuery && projectStatusFilter.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No search criteria provided</h3>
            <p className="text-gray-500">
              Please enter a search term or select project status filters to find results.
            </p>
          </div>
        )}

        {/* Search results */}
        {(searchQuery || projectStatusFilter.length > 0) && (
          <div className="space-y-8">
            {/* Members section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <SearchSection
                title={`Members ${searchResults.members.length > 0 ? `(${searchResults.members.length})` : ''}`}
                results={getPaginatedResults(searchResults.members, currentPage.members)}
                loading={membersLoading}
                hasQuery={searchQuery.length >= 2 || projectStatusFilter.length > 0}
                emptyMessage="No members found"
                renderItem={(member) => (
                  <div key={member.id} className="p-4 hover:bg-gray-50 rounded-lg border border-gray-100">
                    {/* Member Basic Info with Labels */}
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-purple-600">
                          {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        {/* Name with label */}
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">NAME:</span>
                          <p className="font-medium text-gray-900 text-lg">
                            {member.firstName} {member.lastName}
                          </p>
                        </div>

                        {/* Email with label */}
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">EMAIL:</span>
                          <p className="text-gray-600">{member.email}</p>
                        </div>

                        {/* Role and activity summary */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">ROLE:</span>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${member.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                              member.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                              {member.role}
                            </span>
                          </div>

                          {/* Activity summary with label */}
                          {((member._accurateCounts?.ownedProjects > 0) || (member._accurateCounts?.assignedTasks > 0)) && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">ACTIVITY:</span>
                              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                {member._accurateCounts?.ownedProjects || 0} {member._accurateCounts?.ownedProjects === 1 ? 'project' : 'projects'}, {member._accurateCounts?.assignedTasks || 0} {member._accurateCounts?.assignedTasks === 1 ? 'task' : 'tasks'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
              {/* Pagination for Members section */}
              {searchResults.members.length > ITEMS_PER_PAGE && (
                <PaginationControls
                  currentPage={currentPage.members}
                  totalPages={getTotalPages(searchResults.members)}
                  totalItems={searchResults.members.length}
                  onPageChange={(page) => setCurrentPage(prev => ({ ...prev, members: page }))}
                  section="members"
                />
              )}
            </div>

            {/* Projects section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <SearchSection
                title={`Projects ${searchResults.projects.length > 0 ? `(${searchResults.projects.length})` : ''}`}
                results={getPaginatedResults(searchResults.projects, currentPage.projects)}
                loading={projectsLoading}
                hasQuery={searchQuery.length >= 2 || projectStatusFilter.length > 0}
                emptyMessage="No projects found"
                renderItem={(project) => (
                  <div key={project.id} className={`p-4 hover:bg-gray-50 rounded-lg border border-gray-100 ${project.isDeleted ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">TITLE:</span>
                          <h3 className={`font-medium text-lg ${project.isDeleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {project.name}
                          </h3>
                          {project.isDeleted && (
                            <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
                              DELETED
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2 text-sm mt-3">
                          {/* Show owner information with enhanced styling */}
                          {project._searchContext?.owner ? (
                            <div className={`flex items-center space-x-2 ${project.isDeleted ? 'text-gray-400' : 'text-blue-600'}`}>
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-700">
                                  {project._searchContext.owner.name.split(' ').map((n: string) => n[0]).join('')}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Owner:</span>
                              <span className="font-medium">{project._searchContext.owner.name}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${project._searchContext.owner.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                project._searchContext.owner.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                {project._searchContext.owner.role}
                              </span>
                            </div>
                          ) : project._searchContext?.hasTasks ? (
                            <div className={`flex items-center space-x-2 ${project.isDeleted ? 'text-gray-400' : 'text-green-600'}`}>
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-green-700">
                                  {project._searchContext.hasTasks.name.split(' ').map((n: string) => n[0]).join('')}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Has Tasks:</span>
                              <span className="font-medium">{project._searchContext.hasTasks.name}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${project._searchContext.hasTasks.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                project._searchContext.hasTasks.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                {project._searchContext.hasTasks.role}
                              </span>
                              <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
                                {project._searchContext.hasTasks.taskCount} task{project._searchContext.hasTasks.taskCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          ) : project.owner && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Owner:</span>
                              <span className={`${project.isDeleted ? 'text-gray-400' : 'text-gray-700'}`}>
                                {project.owner.firstName} {project.owner.lastName}
                              </span>
                            </div>
                          )}

                          {/* Description label */}
                          <div className="flex items-start space-x-2">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0.5">Description:</span>
                            <span className={`text-sm ${project.isDeleted ? 'text-gray-400' : 'text-gray-600'}`}>
                              {project.description || 'No description provided'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        {/* Status with label */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status:</span>
                          <span className={`px-3 py-1 text-sm rounded-full ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                            {project.status?.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Deletion status with label */}
                        {project.isDeleted && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Archive:</span>
                            <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700">
                              DELETED
                            </span>
                          </div>
                        )}

                        {/* Project ID with label */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID:</span>
                          <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {project.uuid}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
              {/* Pagination for Projects section */}
              {searchResults.projects.length > ITEMS_PER_PAGE && (
                <PaginationControls
                  currentPage={currentPage.projects}
                  totalPages={getTotalPages(searchResults.projects)}
                  totalItems={searchResults.projects.length}
                  onPageChange={(page) => setCurrentPage(prev => ({ ...prev, projects: page }))}
                  section="projects"
                />
              )}
            </div>

            {/* Tasks section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <SearchSection
                title={`Tasks ${searchResults.tasks.length > 0 ? `(${searchResults.tasks.length})` : ''}`}
                results={getPaginatedResults(searchResults.tasks, currentPage.tasks)}
                loading={tasksLoading}
                hasQuery={searchQuery.length >= 2 || projectStatusFilter.length > 0}
                emptyMessage="No tasks found"
                renderItem={(task) => (
                  <div key={task.id} className={`p-4 hover:bg-gray-50 rounded-lg border border-gray-100 ${task.isDeleted ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">TITLE:</span>
                          <h3 className={`font-medium text-lg ${task.isDeleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          {task.isDeleted && (
                            <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
                              DELETED
                            </span>
                          )}
                        </div>
                        <div className={`flex flex-col space-y-2 text-sm mt-3 ${task.isDeleted ? 'text-gray-400' : 'text-gray-600'}`}>
                          {/* Description with label */}
                          <div className="flex items-start space-x-2">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0.5">Description:</span>
                            <span className="text-sm">
                              {task.description || 'No description provided'}
                            </span>
                          </div>

                          {/* Project with label */}
                          {task.project && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Project:</span>
                              <span className={task.project.isDeleted ? 'line-through text-gray-400' : 'text-blue-600 font-medium'}>
                                {task.project.name}
                              </span>
                            </div>
                          )}

                          {/* Show assignee information with enhanced styling */}
                          {task._searchContext?.assignee ? (
                            <div className={`flex items-center space-x-2 ${task.isDeleted ? 'text-gray-400' : 'text-green-600'}`}>
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-green-700">
                                  {task._searchContext.assignee.name.split(' ').map((n: string) => n[0]).join('')}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned to:</span>
                              <span className="font-medium">{task._searchContext.assignee.name}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${task._searchContext.assignee.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                task._searchContext.assignee.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                {task._searchContext.assignee.role}
                              </span>
                            </div>
                          ) : task.assignedUser && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned to:</span>
                              <span className="text-gray-700">
                                {task.assignedUser.firstName} {task.assignedUser.lastName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        {/* Status with label */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status:</span>
                          <span className={`px-3 py-1 text-sm rounded-full ${task.status === 'DONE' ? 'bg-green-100 text-green-800' :
                            task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                            {task.status?.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Priority with label */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Priority:</span>
                          <span className={`px-3 py-1 text-sm rounded-full ${task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Deletion status with label */}
                        {task.isDeleted && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Archive:</span>
                            <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700">
                              DELETED
                            </span>
                          </div>
                        )}

                        {/* Task ID with label */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID:</span>
                          <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {task.uuid}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
              {/* Pagination for Tasks section */}
              {searchResults.tasks.length > ITEMS_PER_PAGE && (
                <PaginationControls
                  currentPage={currentPage.tasks}
                  totalPages={getTotalPages(searchResults.tasks)}
                  totalItems={searchResults.tasks.length}
                  onPageChange={(page) => setCurrentPage(prev => ({ ...prev, tasks: page }))}
                  section="tasks"
                />
              )}
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
