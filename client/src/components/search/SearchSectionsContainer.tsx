import React from 'react';
import MembersSection from './MembersSection';
import ProjectsSection from './ProjectsSection';
import TasksSection from './TasksSection';

/**
 * Search Sections Container Component
 * Manages the display of search result sections
 * Handles pagination and section visibility logic
 */

interface SearchSectionsContainerProps {
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
  currentPage: {
    members: number;
    projects: number;
    tasks: number;
  };
  onPageChange: (section: 'members' | 'projects' | 'tasks', page: number) => void;
  onMemberClick: (member: any) => void;
  onProjectClick: (project: any) => void;
  onTaskClick: (task: any) => void;
  hasSearchCriteria: boolean;
  searchType: {
    isUserSearch: boolean;
    isProjectStatusSearch: boolean;
    isTaskStatusSearch: boolean;
  };
}

/**
 * Helper function to get paginated results
 * Extracts the current page of results for a given section
 */
const getPaginatedResults = (items: any[], currentPage: number, itemsPerPage: number = 2) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
};

/**
 * Helper function to calculate total pages
 * Determines the total number of pages for pagination
 */
const getTotalPages = (items: any[], itemsPerPage: number = 2) => {
  return Math.ceil(items.length / itemsPerPage);
};

/**
 * SearchSectionsContainer Component
 * Renders search result sections with conditional visibility
 */
const SearchSectionsContainer: React.FC<SearchSectionsContainerProps> = ({
  searchResults,
  loading,
  currentPage,
  onPageChange,
  onMemberClick,
  onProjectClick,
  onTaskClick,
  hasSearchCriteria,
  searchType
}) => {
  const ITEMS_PER_PAGE = 3; // Display only 2 rows per section

  // Determine which sections to display based on search type
  // Members section: Show ONLY when searching by user name (q parameter exists)
  const shouldShowMembersSection = searchType.isUserSearch;

  // Projects section: Show ONLY when explicitly searching by project status
  const shouldShowProjectsSection = searchType.isProjectStatusSearch;

  // Tasks section: Show ONLY when explicitly searching by task status
  const shouldShowTasksSection = searchType.isTaskStatusSearch;

  // Debug logging for section visibility decisions
  console.log('Section Visibility Debug:', {
    searchType,
    resultsCount: {
      members: searchResults.members.length,
      projects: searchResults.projects.length,
      tasks: searchResults.tasks.length
    },
    sectionVisibility: {
      shouldShowMembersSection,
      shouldShowProjectsSection,
      shouldShowTasksSection
    }
  });

  if (!hasSearchCriteria) {
    return null;
  }

  return (
    <div className="space-y-10">
      {/* Members Section - Show ONLY when searching by user name (q parameter) */}
      {shouldShowMembersSection && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-50"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200 p-6">
            <MembersSection
              members={getPaginatedResults(searchResults.members, currentPage.members, ITEMS_PER_PAGE)}
              allMembers={searchResults.members}
              loading={loading.members}
              hasQuery={hasSearchCriteria}
              currentPage={currentPage.members}
              totalPages={getTotalPages(searchResults.members, ITEMS_PER_PAGE)}
              onPageChange={(page) => onPageChange('members', page)}
              totalItems={searchResults.members.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onMemberClick={onMemberClick}
            />
          </div>
        </div>
      )}

      {/* Projects Section - Show ONLY when explicitly searching by project status */}
      {shouldShowProjectsSection && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl opacity-50"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-6">
            <ProjectsSection
              projects={getPaginatedResults(searchResults.projects, currentPage.projects, ITEMS_PER_PAGE)}
              allProjects={searchResults.projects}
              loading={loading.projects}
              hasQuery={hasSearchCriteria}
              currentPage={currentPage.projects}
              totalPages={getTotalPages(searchResults.projects, ITEMS_PER_PAGE)}
              onPageChange={(page) => onPageChange('projects', page)}
              totalItems={searchResults.projects.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onProjectClick={onProjectClick}
            />
          </div>
        </div>
      )}

      {/* Tasks Section - Show ONLY when explicitly searching by task status */}
      {shouldShowTasksSection && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl opacity-50"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-200 p-6">
            <TasksSection
              tasks={getPaginatedResults(searchResults.tasks, currentPage.tasks, ITEMS_PER_PAGE)}
              allTasks={searchResults.tasks}
              loading={loading.tasks}
              hasQuery={hasSearchCriteria}
              currentPage={currentPage.tasks}
              totalPages={getTotalPages(searchResults.tasks, ITEMS_PER_PAGE)}
              onPageChange={(page) => onPageChange('tasks', page)}
              totalItems={searchResults.tasks.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onTaskClick={onTaskClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSectionsContainer;
