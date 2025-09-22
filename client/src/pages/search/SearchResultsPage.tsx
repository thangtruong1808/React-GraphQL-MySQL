import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchResults } from '../../hooks/custom/useSearchResults';
import SearchResultsContainer from '../../components/search/SearchResultsContainer';

/**
 * Search Results Page Component
 * Main page component for displaying search results
 * Refactored into smaller, maintainable components following React best practices
 */

/**
 * SearchResultsPage Component
 * Orchestrates search results display using custom hook and container components
 */
const SearchResultsPage: React.FC = () => {
  // Get search query and filters from URL parameters
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const projectStatusFilter = searchParams.get('projectStatus')?.split(',') || [];
  const taskStatusFilter = searchParams.get('taskStatus')?.split(',') || [];

  // Use custom hook for search results logic
  const {
    searchResults,
    loading,
    hasSearchCriteria,
    searchType
  } = useSearchResults({
    searchQuery,
    projectStatusFilter,
    taskStatusFilter
  });

  return (
    <SearchResultsContainer
      searchResults={searchResults}
      loading={loading}
      hasSearchCriteria={hasSearchCriteria}
      searchType={searchType}
      projectStatusFilter={projectStatusFilter}
      taskStatusFilter={taskStatusFilter}
      searchQuery={searchQuery}
    />
  );
};

export default SearchResultsPage;