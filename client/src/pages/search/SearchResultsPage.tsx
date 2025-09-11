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
      setSearchResults({
        members: membersData?.searchMembers || [],
        projects: projectsData?.searchProjects || [],
        tasks: tasksData?.searchTasks || []
      });
    }
  }, [membersData, projectsData, tasksData]);

  // Calculate total results
  const totalResults = searchResults.members.length + searchResults.projects.length + searchResults.tasks.length;
  const isLoading = membersLoading || projectsLoading || tasksLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
            {searchQuery && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                for "{searchQuery}"
              </span>
            )}
          </h1>

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

          {totalResults > 0 && (
            <p className="text-gray-600">
              Found {totalResults} result{totalResults !== 1 ? 's' : ''} across all categories
            </p>
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
                title="Members"
                results={searchResults.members}
                loading={membersLoading}
                hasQuery={searchQuery.length >= 2 || projectStatusFilter.length > 0}
                emptyMessage="No members found"
                renderItem={(member) => (
                  <div key={member.id} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-purple-600">
                        {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-lg">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-gray-500">{member.email}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${member.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        member.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                )}
              />
            </div>

            {/* Projects section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <SearchSection
                title="Projects"
                results={searchResults.projects}
                loading={projectsLoading}
                hasQuery={searchQuery.length >= 2 || projectStatusFilter.length > 0}
                emptyMessage="No projects found"
                renderItem={(project) => (
                  <div key={project.id} className="p-4 hover:bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-lg mb-1">{project.name}</h3>
                        <p className="text-gray-600 mb-3 line-clamp-3">{project.description}</p>
                        {project.owner && (
                          <p className="text-sm text-gray-500">
                            Owner: {project.owner.firstName} {project.owner.lastName}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 text-sm rounded-full ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {project.status?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                )}
              />
            </div>

            {/* Tasks section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <SearchSection
                title="Tasks"
                results={searchResults.tasks}
                loading={tasksLoading}
                hasQuery={searchQuery.length >= 2 || projectStatusFilter.length > 0}
                emptyMessage="No tasks found"
                renderItem={(task) => (
                  <div key={task.id} className="p-4 hover:bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-lg mb-1">{task.title}</h3>
                        <p className="text-gray-600 mb-3 line-clamp-3">{task.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {task.project && (
                            <span>Project: {task.project.name}</span>
                          )}
                          {task.assignedUser && (
                            <span>Assigned to: {task.assignedUser.firstName} {task.assignedUser.lastName}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className={`px-3 py-1 text-sm rounded-full ${task.status === 'DONE' ? 'bg-green-100 text-green-800' :
                          task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                          {task.status?.replace('_', ' ')}
                        </span>
                        <span className={`px-3 py-1 text-sm rounded-full ${task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                          task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              />
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
