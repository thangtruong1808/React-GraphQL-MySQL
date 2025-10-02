import React, { useEffect, useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { GET_PAGINATED_TEAM_MEMBERS, GET_TEAM_STATS } from '../../services/graphql/queries';
import { InlineError, TeamPageSkeleton } from '../../components/ui';
import { TeamHeader, TeamFilters, TeamSortControls, TeamMembersGrid } from './team';
import { useFormatJoinDate } from './team/teamHooks';
import { FilterType, SortOption } from './team/types';

/**
 * Team Page Component - Server-side filtering with client-side sorting
 * Displays team members with server-side role filtering and client-side sorting
 * Uses GraphQL queries with role filter parameters for database-level filtering
 */
const TeamPage: React.FC = () => {
  // State for server-side filtering and client-side sorting
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'name', direction: 'ASC' });
  const [currentOffset, setCurrentOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Custom hooks for functionality
  const formatJoinDate = useFormatJoinDate();

  // Fetch team members from GraphQL API with server-side role filtering (12 records per load)
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_PAGINATED_TEAM_MEMBERS, {
    variables: {
      limit: 12,
      offset: 0,
      roleFilter: filter === 'ALL' ? null : filter
    },
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true
  });

  // Fetch team statistics from entire database for statistics section
  const { data: statsData, loading: statsLoading, error: statsError } = useQuery(GET_TEAM_STATS, {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all'
  });

  // Handle filter changes - refetch data with new role filter
  useEffect(() => {
    setCurrentOffset(0);
    refetch({
      limit: 12,
      offset: 0,
      roleFilter: filter === 'ALL' ? null : filter
    });
  }, [filter, refetch]);

  // Load more team members function for infinite scroll with server-side filtering
  const loadMoreTeamMembers = useCallback(async () => {
    if (loadingMore || !data?.paginatedTeamMembers?.paginationInfo?.hasNextPage) return;

    setLoadingMore(true);

    try {
      const result = await fetchMore({
        variables: {
          limit: 12,
          offset: currentOffset + 12,
          roleFilter: filter === 'ALL' ? null : filter
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const newTeamMembers = fetchMoreResult.paginatedTeamMembers.teamMembers;
          const newPaginationInfo = fetchMoreResult.paginatedTeamMembers.paginationInfo;

          return {
            paginatedTeamMembers: {
              ...fetchMoreResult.paginatedTeamMembers,
              teamMembers: [...prev.paginatedTeamMembers.teamMembers, ...newTeamMembers],
              paginationInfo: newPaginationInfo
            }
          };
        }
      });

      setCurrentOffset(prev => prev + 12);
    } catch (error) {
      // Handle error silently - could be displayed via error context in future
    } finally {
      setLoadingMore(false);
    }
  }, [fetchMore, currentOffset, loadingMore, data?.paginatedTeamMembers?.paginationInfo?.hasNextPage, filter]);

  // Scroll event handler for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreTeamMembers();
      }
    };

    // Only add scroll listener if we have team members and more to load
    const teamMembers = data?.paginatedTeamMembers?.teamMembers || [];
    const hasMore = data?.paginatedTeamMembers?.paginationInfo?.hasNextPage || false;

    if (teamMembers.length > 0 && hasMore && !loadingMore) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMoreTeamMembers, data?.paginatedTeamMembers?.teamMembers?.length, data?.paginatedTeamMembers?.paginationInfo?.hasNextPage, loadingMore]);

  // Handle filter reset when data changes to prevent stale state
  useEffect(() => {
    if (data?.paginatedTeamMembers?.teamMembers) {
      setCurrentOffset(0);
    }
  }, [data?.paginatedTeamMembers?.teamMembers]);

  // Handle errors with inline display
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <InlineError
            message="Failed to load team members. Please try again later."
          />
        </div>
      </div>
    );
  }


  // Get team members and pagination info from GraphQL response
  const teamMembers = data?.paginatedTeamMembers?.teamMembers || [];
  const hasMore = data?.paginatedTeamMembers?.paginationInfo?.hasNextPage || false;
  const totalCount = data?.paginatedTeamMembers?.paginationInfo?.totalCount || 0;

  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="min-h-screen bg-gray-50 mt-16">
        {/* Team Header */}
        <TeamHeader
          statsData={statsData}
        />

        {/* Team Filters - Server-side filtering */}
        <TeamFilters
          filter={filter}
          setFilter={setFilter}
          teamStats={statsData?.teamStats || null}
        />

        {/* Team Sort Controls - Client-side sorting */}
        <TeamSortControls
          sortOption={sortOption}
          onSortChange={(field) => {
            setSortOption(prev => ({
              field,
              direction: prev.field === field && prev.direction === 'ASC' ? 'DESC' : 'ASC'
            }));
          }}
        />

        {/* Team Members Grid - Server-filtered results with client-side sorting */}
        <TeamMembersGrid
          filteredMembers={teamMembers}
          filter={filter}
          setFilter={setFilter}
          sortOption={sortOption}
          formatJoinDate={formatJoinDate}
          loading={loading}
        />

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            </div>
          </div>
        )}

        {/* End of Results Indicator */}
        {!hasMore && teamMembers.length > 0 && (
          <div className="py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="text-center text-gray-500">
                <p>You've reached the end of the team members list.</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton for initial load */}
        {loading && teamMembers.length === 0 && <TeamPageSkeleton />}
      </div>
    </div>
  );
};

export default TeamPage;