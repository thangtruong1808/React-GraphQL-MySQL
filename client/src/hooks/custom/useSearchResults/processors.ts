import { SearchResults, SearchProcessorsDependencies } from './types';

/**
 * Process members data to extract related projects and tasks
 * Handles extraction of owned projects and assigned tasks from members
 */
const processMembersData = (members: any[]): { relatedProjects: any[]; relatedTasks: any[] } => {
  const relatedProjects: any[] = [];
  const relatedTasks: any[] = [];

  // Process members data - extract related projects and tasks
  members.forEach((member: any) => {
    // Extract owned projects
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

    // Extract assigned tasks
    if (member.assignedTasks) {
      member.assignedTasks.forEach((task: any) => {
        relatedTasks.push(task);
      });
    }
  });

  return { relatedProjects, relatedTasks };
};

/**
 * Process projects data to extract related members and tasks
 * Handles extraction of project owners and tasks from projects
 */
const processProjectsData = (directProjects: any[]): { relatedMembers: any[]; relatedTasks: any[] } => {
  const relatedMembers: any[] = [];
  const relatedTasks: any[] = [];

  // Process projects data - extract related members (owners) and tasks
  directProjects.forEach((project: any) => {
    // Add project owner to related members if not already included
    if (project.owner) {
      const ownerExists = relatedMembers.some((member) => member.id === project.owner.id);
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
          const userExists = relatedMembers.some((member) => member.id === task.assignedUser.id);
          if (!userExists) {
            relatedMembers.push(task.assignedUser);
          }
        }
      });
    }
  });

  return { relatedMembers, relatedTasks };
};

/**
 * Process tasks data to extract related members and projects
 * Handles extraction of assigned users and projects from tasks
 */
const processTasksData = (directTasks: any[]): { relatedMembers: any[]; relatedProjects: any[] } => {
  const relatedMembers: any[] = [];
  const relatedProjects: any[] = [];

  // Process tasks data - extract related members (assigned users) and projects
  directTasks.forEach((task: any) => {
    // Add assigned user to related members if not already included
    if (task.assignedUser) {
      const userExists = relatedMembers.some((member) => member.id === task.assignedUser.id);
      if (!userExists) {
        relatedMembers.push(task.assignedUser);
      }
    }

    // Add project to related projects if not already included
    if (task.project) {
      const projectExists = relatedProjects.some((project) => project.id === task.project.id);
      if (!projectExists) {
        relatedProjects.push(task.project);
      }
    }
  });

  return { relatedMembers, relatedProjects };
};

/**
 * Process and filter search results based on search types
 * Combines direct results with related results based on search criteria
 */
export const processSearchResults = ({
  membersData,
  projectsData,
  tasksData,
  memoizedSearchQuery,
  memoizedProjectStatusFilter,
  memoizedTaskStatusFilter,
}: SearchProcessorsDependencies): SearchResults => {
  // Extract direct results from GraphQL queries
  const members = membersData?.searchMembers || [];
  const directProjects = projectsData?.searchProjects || [];
  const directTasks = tasksData?.searchTasks || [];

  // Process data to extract related entities
  const { relatedProjects: membersRelatedProjects, relatedTasks: membersRelatedTasks } = processMembersData(members);
  const { relatedMembers: projectsRelatedMembers, relatedTasks: projectsRelatedTasks } = processProjectsData(directProjects);
  const { relatedMembers: tasksRelatedMembers, relatedProjects: tasksRelatedProjects } = processTasksData(directTasks);

  // Combine all related entities
  const relatedProjects = [...membersRelatedProjects, ...tasksRelatedProjects];
  const relatedTasks = [...membersRelatedTasks, ...projectsRelatedTasks];
  const relatedMembers = [...projectsRelatedMembers, ...tasksRelatedMembers];

  // Determine search types
  const isUserSearch = Boolean(memoizedSearchQuery && memoizedSearchQuery.length >= 1);
  const isProjectStatusSearch = memoizedProjectStatusFilter.length > 0;
  const isTaskStatusSearch = memoizedTaskStatusFilter.length > 0;

  // Determine if we should include related members
  const hasMultipleSearchTypes = (isUserSearch ? 1 : 0) + (isProjectStatusSearch ? 1 : 0) + (isTaskStatusSearch ? 1 : 0) > 1;

  // Filter members based on search type
  // When searching by user name, only show direct members (no related members from projects/tasks)
  // When searching by project/task status, include related members
  const allMembers = isUserSearch
    ? members // Only direct members when searching by user name
    : hasMultipleSearchTypes
      ? members // Multiple search types: only direct members to avoid duplicates
      : [...members, ...relatedMembers]; // Single search type: include related members for enrichment

  // Filter projects based on search type
  let filteredProjects: any[] = [];
  if (isProjectStatusSearch) {
    // When multiple search types are active, only show direct results to avoid duplicates
    // When only project status search is active, include related projects
    if (hasMultipleSearchTypes) {
      // Multiple search types: only show direct results
      filteredProjects = [...directProjects];
    } else {
      // Single search type: include related results
      filteredProjects = [...directProjects, ...relatedProjects];
    }

    if (isUserSearch) {
      // When both user search and project status search are active,
      // only show projects owned by users whose firstname, lastname, or email contains the search term
      const matchingUserIds = members.map((member) => member.id);
      filteredProjects = filteredProjects.filter((project) => project.owner && matchingUserIds.includes(project.owner.id));
    }
  }

  // Filter tasks based on search type
  let filteredTasks: any[] = [];
  if (isTaskStatusSearch) {
    // When multiple search types are active, only show direct results to avoid duplicates
    // When only task status search is active, include related tasks
    if (hasMultipleSearchTypes) {
      // Multiple search types: only show direct results
      filteredTasks = [...directTasks];
    } else {
      // Single search type: include related results
      filteredTasks = [...directTasks, ...relatedTasks];
    }

    if (isUserSearch) {
      // When both user search and task status search are active,
      // only show tasks assigned to users whose firstname, lastname, or email contains the search term
      const matchingUserIds = members.map((member) => member.id);
      filteredTasks = filteredTasks.filter((task) => task.assignedUser && matchingUserIds.includes(task.assignedUser.id));
    }
  }

  return {
    members: allMembers,
    projects: filteredProjects,
    tasks: filteredTasks,
  };
};

