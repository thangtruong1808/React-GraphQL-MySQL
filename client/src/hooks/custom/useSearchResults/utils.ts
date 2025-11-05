import { SearchTypeDependencies } from './types';

/**
 * Determine search type flags based on search criteria
 * Identifies which search types are currently active
 */
export const getSearchType = ({
  searchQuery,
  projectStatusFilter,
  taskStatusFilter,
  roleFilter,
}: SearchTypeDependencies) => {
  // Determine search type flags
  const isUserSearch = Boolean(searchQuery && searchQuery.length >= 1);
  const isProjectStatusSearch = projectStatusFilter.length > 0;
  const isTaskStatusSearch = taskStatusFilter.length > 0;
  const isRoleSearch = roleFilter.length > 0;

  // Check if any search criteria is active
  const hasSearchCriteria = isUserSearch || isProjectStatusSearch || isTaskStatusSearch || isRoleSearch;

  return {
    isUserSearch,
    isProjectStatusSearch,
    isTaskStatusSearch,
    isRoleSearch,
    hasSearchCriteria,
  };
};

