import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { SEARCH_MEMBERS, SEARCH_PROJECTS, SEARCH_TASKS } from '../../services/graphql/queries';

/**
 * Custom hook for managing search results
 * Handles GraphQL queries and result processing logic
 * Follows React best practices with separation of concerns
 */

interface SearchResults {
  members: any[];
  projects: any[];
  tasks: any[];
}

interface UseSearchResultsProps {
  searchQuery: string;
  projectStatusFilter: string[];
  taskStatusFilter: string[];
}

interface UseSearchResultsReturn {
  searchResults: SearchResults;
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
  };
}

/**
 * Custom hook for search results management
 * Encapsulates all search-related logic and state management
 */
export const useSearchResults = ({
  searchQuery,
  projectStatusFilter,
  taskStatusFilter
}: UseSearchResultsProps): UseSearchResultsReturn => {
  // State for search results
  const [searchResults, setSearchResults] = useState<SearchResults>({
    members: [],
    projects: [],
    tasks: []
  });

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
    errorPolicy: 'all',
    onCompleted: (data) => {
      console.log('Projects query completed:', { 
        projectStatusFilter, 
        resultsCount: data?.searchProjects?.length || 0,
        results: data?.searchProjects 
      });
    },
    onError: (error) => {
      console.error('Projects query error:', error);
    }
  });

  const { data: tasksData, loading: tasksLoading } = useQuery(SEARCH_TASKS, {
    variables: {
      taskStatusFilter: taskStatusFilter.length > 0 ? taskStatusFilter : undefined
    },
    skip: taskStatusFilter.length === 0, // Only run when there are task status filters
    errorPolicy: 'all'
  });

  // Update search results when GraphQL data changes
  // Search behavior:
  // - q=th: Searches users by firstname, lastname, or email containing "th"
  // - projectStatus=IN_PROGRESS: Searches projects with status "IN_PROGRESS"
  // - taskStatus=TODO: Searches tasks with status "TODO"
  // - Combined: Filters results to show only matching combinations
  useEffect(() => {
    const members = membersData?.searchMembers || [];
    const directProjects = projectsData?.searchProjects || [];
    const directTasks = tasksData?.searchTasks || [];

    // Extract projects and tasks from members' owned projects
    const relatedProjects: any[] = [];
    const relatedTasks: any[] = [];
    const relatedMembers: any[] = [];

    // Process members data - extract related projects and tasks
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

    // Process projects data - extract related members (owners) and tasks
    directProjects.forEach((project: any) => {
      // Add project owner to related members if not already included
      if (project.owner) {
        const ownerExists = relatedMembers.some(member => member.id === project.owner.id);
        if (!ownerExists) {
          relatedMembers.push(project.owner);
        }
      }

      // Add tasks from this project to related tasks
      if (project.tasks) {
        project.tasks.forEach((task: any) => {
          relatedTasks.push(task);
          
          // Also add assigned user to related members if not already included
          if (task.assignedUser) {
            const userExists = relatedMembers.some(member => member.id === task.assignedUser.id);
            if (!userExists) {
              relatedMembers.push(task.assignedUser);
            }
          }
        });
      }
    });

    // Process tasks data - extract related members (assigned users) and projects
    directTasks.forEach((task: any) => {
      // Add assigned user to related members if not already included
      if (task.assignedUser) {
        const userExists = relatedMembers.some(member => member.id === task.assignedUser.id);
        if (!userExists) {
          relatedMembers.push(task.assignedUser);
        }
      }

      // Add project to related projects if not already included
      if (task.project) {
        const projectExists = relatedProjects.some(project => project.id === task.project.id);
        if (!projectExists) {
          relatedProjects.push(task.project);
        }
      }
    });

    // Combine direct results with related results based on search type
    // When searching by user name, only show direct members (no related members from projects/tasks)
    // When searching by project/task status, include related members
    const isUserSearch = searchQuery && searchQuery.length >= 2;
    const isProjectStatusSearch = projectStatusFilter.length > 0;
    const isTaskStatusSearch = taskStatusFilter.length > 0;
    
    const allMembers = isUserSearch 
      ? members  // Only direct members when searching by user name
      : [...members, ...relatedMembers];  // Include related members for status searches
    
    // Filter projects based on combined search criteria
    let filteredProjects = [...directProjects, ...relatedProjects];
    if (isUserSearch && isProjectStatusSearch) {
      // When both user search (firstname/lastname/email) and project status search are active,
      // only show projects owned by users whose firstname, lastname, or email contains the search term
      // Example: q=th&projectStatus=IN_PROGRESS means:
      // - Users whose firstname, lastname, or email contains "th" AND own "IN_PROGRESS" projects
      // - Projects with status "IN_PROGRESS" owned by users whose firstname, lastname, or email contains "th"
      const matchingUserIds = members.map(member => member.id);
      filteredProjects = filteredProjects.filter(project => 
        project.owner && matchingUserIds.includes(project.owner.id)
      );
    }
    
    // Filter tasks based on combined search criteria
    let filteredTasks = [...directTasks, ...relatedTasks];
    if (isUserSearch && isTaskStatusSearch) {
      // When both user search (firstname/lastname/email) and task status search are active,
      // only show tasks assigned to users whose firstname, lastname, or email contains the search term
      // Example: q=th&taskStatus=TODO means:
      // - Users whose firstname, lastname, or email contains "th" AND are assigned to "TODO" tasks
      // - Tasks with status "TODO" assigned to users whose firstname, lastname, or email contains "th"
      const matchingUserIds = members.map(member => member.id);
      filteredTasks = filteredTasks.filter(task => 
        task.assignedUser && matchingUserIds.includes(task.assignedUser.id)
      );
    }
    
    const allProjects = filteredProjects;
    const allTasks = filteredTasks;

    // Debug logging to help identify the issue
    console.log('Search Results Debug:', {
      searchType: {
        isUserSearch,
        isProjectStatusSearch: projectStatusFilter.length > 0,
        isTaskStatusSearch: taskStatusFilter.length > 0,
        combinedSearch: isUserSearch && (projectStatusFilter.length > 0 || taskStatusFilter.length > 0)
      },
      filtering: {
        projectsFiltered: isUserSearch && isProjectStatusSearch,
        tasksFiltered: isUserSearch && isTaskStatusSearch,
        matchingUserIds: isUserSearch ? members.map(member => member.id) : []
      },
      directMembers: members.length,
      relatedMembers: relatedMembers.length,
      totalMembers: allMembers.length,
      directProjects: directProjects.length,
      relatedProjects: relatedProjects.length,
      totalProjects: allProjects.length,
      directTasks: directTasks.length,
      relatedTasks: relatedTasks.length,
      totalTasks: allTasks.length,
      searchQuery,
      projectStatusFilter,
      taskStatusFilter
    });

    setSearchResults({
      members: allMembers,
      projects: allProjects,
      tasks: allTasks
    });
  }, [membersData, projectsData, tasksData, searchQuery, projectStatusFilter, taskStatusFilter]);

  // Determine search type
  const isUserSearch = searchQuery && searchQuery.length >= 2;
  const isProjectStatusSearch = projectStatusFilter.length > 0;
  const isTaskStatusSearch = taskStatusFilter.length > 0;

  // Check if any search criteria is active
  const hasSearchCriteria = isUserSearch || isProjectStatusSearch || isTaskStatusSearch;

  return {
    searchResults,
    loading: {
      members: membersLoading,
      projects: projectsLoading,
      tasks: tasksLoading
    },
    hasSearchCriteria,
    searchType: {
      isUserSearch,
      isProjectStatusSearch,
      isTaskStatusSearch
    }
  };
};
