import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PAGINATED_TEAM_MEMBERS, GET_TEAM_STATS } from '../../services/graphql/queries';
import { InlineError } from '../../components/ui';
import TeamPageContent from './team/TeamPageContent';
import { useFormatJoinDate } from './team/teamHooks';
import { FilterType, SortOption } from './team/types';

/**
 * Description: Renders the public team page with filtering, sorting, and paginated loading controls.
 * Data created: Local filter state, sort option state, pagination offset, and loading state.
 * Author: thangtruong
 */
const TeamPage: React.FC = () => {

  // State for server-side filtering and client-side sorting
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'name', direction: 'ASC' });
  const [loadingMore, setLoadingMore] = useState(false);
  const [noAdditionalResults, setNoAdditionalResults] = useState(false);

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

  // Team collection from GraphQL response
  const teamMembers = data?.paginatedTeamMembers?.teamMembers || [];
  const uniqueTeamMembers = useMemo(
    () =>
      teamMembers.filter(
        (member, index, array) =>
          array.findIndex(candidate => candidate.id === member.id) === index
      ),
    [teamMembers]
  );
  const hasMore = data?.paginatedTeamMembers?.paginationInfo?.hasNextPage || false;
  const totalCount = data?.paginatedTeamMembers?.paginationInfo?.totalCount || 0;

  // Handle filter changes - refetch data with new role filter
  useEffect(() => {
    setNoAdditionalResults(false);
    refetch({
      limit: 12,
      offset: 0,
      roleFilter: filter === 'ALL' ? null : filter
    });
  }, [filter, refetch]);

  // Derived UI states for paging
  const showLoadMoreButton = uniqueTeamMembers.length > 0 && !noAdditionalResults && (hasMore || uniqueTeamMembers.length < totalCount);

  // Handlers exposed to child components
  const handleSortChange = useCallback((field: SortOption['field']) => {
    setSortOption(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'ASC' ? 'DESC' : 'ASC'
    }));
  }, []);

  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  // Load more team members button handler with server-side pagination
  const loadMoreTeamMembers = useCallback(async () => {
    if (loadingMore) {
      return;
    }

    const remainingCount = totalCount > 0 ? totalCount - uniqueTeamMembers.length : 12;
    if (remainingCount <= 0) {
      setNoAdditionalResults(true);
      return;
    }

    setLoadingMore(true);
    setNoAdditionalResults(false);
    const existingIds = new Set(uniqueTeamMembers.map(member => member.id));
    let fetchedUniqueCount = 0;
    const nextOffset = data?.paginatedTeamMembers?.teamMembers?.length || uniqueTeamMembers.length;
    const nextLimit = Math.min(12, remainingCount > 0 ? remainingCount : 12);

    try {
      const result = await fetchMore({
        variables: {
          limit: nextLimit,
          offset: nextOffset,
          roleFilter: filter === 'ALL' ? null : filter
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const newTeamMembers = fetchMoreResult.paginatedTeamMembers.teamMembers;
          const newPaginationInfo = fetchMoreResult.paginatedTeamMembers.paginationInfo;
          fetchedUniqueCount = newTeamMembers.filter(member => !existingIds.has(member.id)).length;

          return {
            paginatedTeamMembers: {
              ...fetchMoreResult.paginatedTeamMembers,
              teamMembers: [...prev.paginatedTeamMembers.teamMembers, ...newTeamMembers],
              paginationInfo: newPaginationInfo
            }
          };
        }
      });

      if (fetchedUniqueCount === 0) {
        setNoAdditionalResults(true);
      }
    } catch (error) {
      // Handle error silently - could be displayed via error context in future
      setNoAdditionalResults(true);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchMore, loadingMore, data?.paginatedTeamMembers?.teamMembers?.length, filter, uniqueTeamMembers, totalCount]);

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


  // All users see traditional layout with top navbar (NavBar handled by App.tsx)
  return (
    <div className="w-full public-dashboard">
      <div
        className="min-h-screen pt-24"
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-base)',
          backgroundImage: 'var(--bg-gradient)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        <TeamPageContent
          statsData={statsData}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          filter={filter}
          onFilterChange={handleFilterChange}
          teamStats={statsData?.teamStats || null}
          members={uniqueTeamMembers}
          formatJoinDate={formatJoinDate}
          loading={loading}
          showLoadMoreButton={showLoadMoreButton}
          onLoadMore={loadMoreTeamMembers}
          loadingMore={loadingMore}
          noAdditionalResults={noAdditionalResults}
          hasMore={hasMore}
          totalVisible={uniqueTeamMembers.length}
        />
      </div>
    </div>
  );
};

export default TeamPage;