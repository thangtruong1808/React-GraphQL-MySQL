import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { GET_PAGINATED_TEAM_MEMBERS, GET_TEAM_STATS } from '../../services/graphql/queries';
import { InlineError } from '../../components/ui/InlineError';
import { TeamHeader, TeamFilters, TeamSortControls, TeamMembersGrid } from './team';
import {
  useTeamState,
  useFilteredMembers,
  useLoadedRoleCounts,
  useFormatJoinDate
} from './team/teamHooks';

/**
 * Team Page Component (refactored to ~200 lines)
 * Displays all team members for public exploration
 * Allows users to browse team members without authentication
 * Broken down into smaller components for maintainability
 */
const TeamPage: React.FC = () => {
  // Use custom hooks for state management
  const {
    filter,
    setFilter,
    allTeamMembers,
    setAllTeamMembers,
    loadingMore,
    setLoadingMore,
    hasMore,
    setHasMore,
    currentOffset,
    setCurrentOffset,
    loadingRef,
    sortOption,
    setSortOption
  } = useTeamState();

  // Custom hooks for functionality
  const formatJoinDate = useFormatJoinDate();
  const loadedRoleCounts = useLoadedRoleCounts(allTeamMembers);
  const filteredMembers = useFilteredMembers(allTeamMembers, filter, sortOption);

  // Fetch team members from GraphQL API with pagination (15 records per load)
  const { data, loading, error, fetchMore } = useQuery(GET_PAGINATED_TEAM_MEMBERS, {
    variables: { limit: 15, offset: 0 },
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    onCompleted: (data) => {
      if (data?.paginatedTeamMembers && allTeamMembers.length === 0) {
        setAllTeamMembers(data.paginatedTeamMembers.teamMembers);
        setHasMore(data.paginatedTeamMembers.paginationInfo.hasNextPage);
        setCurrentOffset(data.paginatedTeamMembers.teamMembers.length);
      }
    }
  });

  // Fetch team statistics from entire database for statistics section
  const { data: statsData } = useQuery(GET_TEAM_STATS, {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all'
  });

  // Restore pagination state from cached data if available
  useEffect(() => {
    if (data?.paginatedTeamMembers && allTeamMembers.length === 0) {
      const teamMembers = data.paginatedTeamMembers.teamMembers;
      const paginationInfo = data.paginatedTeamMembers.paginationInfo;

      setAllTeamMembers(teamMembers);
      setHasMore(paginationInfo.hasNextPage);
      setCurrentOffset(teamMembers.length);
    }
  }, [data, allTeamMembers.length]);

  // Update hasMore state when data changes to ensure end message shows correctly
  useEffect(() => {
    if (data?.paginatedTeamMembers?.paginationInfo) {
      const paginationInfo = data.paginatedTeamMembers.paginationInfo;
      setHasMore(paginationInfo.hasNextPage);
    }
  }, [data]);

  // Load more team members - adds to Array2 (accumulated records)
  const loadMoreTeamMembers = useCallback(async () => {
    if (loadingRef.current || !hasMore || loadingMore) return;

    loadingRef.current = true;
    setLoadingMore(true);

    try {
      const result = await fetchMore({
        variables: {
          limit: 15,
          offset: currentOffset
        }
      });

      if (result.data?.paginatedTeamMembers) {
        const newMembers = result.data.paginatedTeamMembers.teamMembers; // Array1: newest records
        const paginationInfo = result.data.paginatedTeamMembers.paginationInfo;

        // Add new records to Array2 (accumulated records: 15, 30, 45, 60...)
        setAllTeamMembers(prev => [...prev, ...newMembers]);
        setHasMore(paginationInfo.hasNextPage);
        setCurrentOffset(currentOffset + 15);
      }
    } catch (err) {
      // Handle error silently
    } finally {
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, [fetchMore, currentOffset, hasMore, loadingMore]);

  // Load more button click handler
  const handleLoadMoreClick = useCallback(() => {
    loadMoreTeamMembers();
  }, [loadMoreTeamMembers]);

  // Sort change handler for team member sorting  
  const handleSortChange = useCallback((field: any) => {
    setSortOption(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'ASC' ? 'DESC' : 'ASC'
    }));
  }, [setSortOption]);

  // Handle initial loading state - show simple spinner only if no cached data
  if (loading && allTeamMembers.length === 0 && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team members...</p>
        </div>
      </div>
    );
  }

  // Show error state using inline error component
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <InlineError message="Failed to load team members. Please try again later." />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="min-h-screen bg-gray-50 mt-10">
        {/* Header Section */}
        <TeamHeader statsData={statsData} />

        {/* Main Content */}
        <div className="mt-10 pb-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Filter Section */}
            <TeamFilters
              filter={filter}
              setFilter={setFilter}
              loadedRoleCounts={loadedRoleCounts}
            />

            {/* Sort Controls */}
            <TeamSortControls
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />

            {/* Team Members Grid */}
            <TeamMembersGrid
              filteredMembers={filteredMembers}
              filter={filter}
              setFilter={setFilter as (filter: any) => void}
              hasMore={hasMore}
              onLoadMoreClick={handleLoadMoreClick}
              formatJoinDate={formatJoinDate}
            />

            {/* Load More Button - Only show when there are filtered results */}
            {hasMore && !loadingMore && filteredMembers.length > 0 && (
              <div className="flex justify-center items-center py-12">
                <button
                  onClick={handleLoadMoreClick}
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Load More Team Members
                </button>
              </div>
            )}

            {/* Loading indicator when loading more - Only show when there are filtered results */}
            {loadingMore && filteredMembers.length > 0 && (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  <span className="text-gray-600 text-sm">Loading more team members...</span>
                </div>
              </div>
            )}

            {/* End of results indicator - Only show when there are filtered results */}
            {!hasMore && !loadingMore && allTeamMembers.length > 0 && filteredMembers.length > 0 && (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="text-gray-500 text-sm">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    You've reached the end of the team members list
                  </div>
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-3 text-center">
              <div className="rounded-2xl p-8 border border-gray-200 bg-white shadow-lg border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Team</h2>
                <p className="text-gray-700 mb-6">
                  Ready to be part of our innovative team? Start your journey with TaskFlow today.
                </p>
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Get Started with TaskFlow
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;