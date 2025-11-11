import React from 'react';
import { TeamHeader, TeamFilters, TeamSortControls, TeamMembersGrid } from './index';
import { FilterType, SortOption, TeamMember } from './types';

/**
 * Description: Orchestrates the visible sections for the public team page including header, filters, grid, and pagination controls.
 * Data created: None; renders content based on provided props.
 * Author: thangtruong
 */
interface TeamPageContentProps {
  statsData: any;
  sortOption: SortOption;
  onSortChange: (field: SortOption['field']) => void;
  filter: FilterType;
  onFilterChange: (newFilter: FilterType) => void;
  teamStats: unknown;
  members: TeamMember[];
  formatJoinDate: (date: string) => string;
  loading: boolean;
  showLoadMoreButton: boolean;
  onLoadMore: () => void;
  loadingMore: boolean;
  noAdditionalResults: boolean;
  hasMore: boolean;
  totalVisible: number;
}

const TeamPageContent: React.FC<TeamPageContentProps> = ({
  statsData,
  sortOption,
  onSortChange,
  filter,
  onFilterChange,
  teamStats,
  members,
  formatJoinDate,
  loading,
  showLoadMoreButton,
  onLoadMore,
  loadingMore,
  noAdditionalResults,
  hasMore,
  totalVisible
}) => (
  <>
    <TeamHeader statsData={statsData} />

    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 [data-theme='brand']:bg-gradient-to-br [data-theme='brand']:from-purple-50 [data-theme='brand']:to-pink-50 rounded-2xl shadow-lg dark:shadow-gray-900/20 [data-theme='brand']:shadow-purple-200/20 p-8 border border-gray-200 dark:border-gray-700 [data-theme='brand']:border-purple-200">
        <TeamSortControls sortOption={sortOption} onSortChange={onSortChange} />
      </div>
    </div>

    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 [data-theme='brand']:bg-gradient-to-br [data-theme='brand']:from-purple-50 [data-theme='brand']:to-pink-50 rounded-2xl shadow-lg dark:shadow-gray-900/20 [data-theme='brand']:shadow-purple-200/20 p-8 border border-gray-200 dark:border-gray-700 [data-theme='brand']:border-purple-200">
        <TeamFilters filter={filter} setFilter={onFilterChange} teamStats={teamStats || null} />
      </div>
    </div>

    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 [data-theme='brand']:bg-gradient-to-br [data-theme='brand']:from-purple-50 [data-theme='brand']:to-pink-50 rounded-2xl shadow-lg dark:shadow-gray-900/20 [data-theme='brand']:shadow-purple-200/20 border border-gray-200 dark:border-gray-700 [data-theme='brand']:border-purple-200">
        <TeamMembersGrid
          filteredMembers={members}
          filter={filter}
          setFilter={onFilterChange}
          sortOption={sortOption}
          formatJoinDate={formatJoinDate}
          loading={loading}
        />
      </div>
    </div>

    <TeamLoadMoreSection
      members={members}
      showLoadMoreButton={showLoadMoreButton}
      loadingMore={loadingMore}
      onLoadMore={onLoadMore}
    />

    <TeamNoAdditionalResultsMessage noAdditionalResults={noAdditionalResults} members={members} />

    <TeamEndOfResultsSection hasMore={hasMore} members={members} totalVisible={totalVisible} />
  </>
);

/**
 * Description: Shows the themed load more button when additional team members can be fetched.
 * Data created: None; renders button UI.
 * Author: thangtruong
 */
interface TeamLoadMoreSectionProps {
  members: TeamMember[];
  showLoadMoreButton: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

const TeamLoadMoreSection: React.FC<TeamLoadMoreSectionProps> = ({
  members,
  showLoadMoreButton,
  loadingMore,
  onLoadMore
}) => {
  if (!showLoadMoreButton || members.length === 0) {
    return null;
  }

  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-7xl mx-auto rounded-2xl shadow-lg dark:shadow-gray-900/20 [data-theme='brand']:shadow-purple-200/20 p-8 border theme-border flex justify-center"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loadingMore}
          className="inline-flex items-center px-5 py-2.5 rounded-lg font-medium focus:outline-none transition disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--button-primary-bg)',
            color: 'var(--button-primary-text)',
            boxShadow: '0 10px 25px rgba(124, 58, 237, 0.12)'
          }}
          onMouseEnter={(event) => {
            if (!event.currentTarget.disabled) {
              event.currentTarget.style.backgroundColor = 'var(--button-primary-hover-bg)';
            }
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.backgroundColor = 'var(--button-primary-bg)';
          }}
          onFocus={(event) => {
            if (!event.currentTarget.disabled) {
              event.currentTarget.style.boxShadow = `0 0 0 3px var(--button-primary-ring)`;
            }
          }}
          onBlur={(event) => {
            event.currentTarget.style.boxShadow = '0 10px 25px rgba(124, 58, 237, 0.12)';
          }}
        >
          {loadingMore ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ color: 'var(--button-primary-text)' }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
              </svg>
              Loading...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--button-primary-text)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Load more team members
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/**
 * Description: Displays a friendly message when no additional members are returned from the server.
 * Data created: None; renders informational text.
 * Author: thangtruong
 */
interface TeamNoAdditionalResultsMessageProps {
  noAdditionalResults: boolean;
  members: TeamMember[];
}

const TeamNoAdditionalResultsMessage: React.FC<TeamNoAdditionalResultsMessageProps> = ({
  noAdditionalResults,
  members
}) => {
  if (!noAdditionalResults || members.length === 0) {
    return null;
  }

  return (
    <div className="py-2 px-4 sm:px-6 lg:px-8">
      <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
        No additional team members are available right now. Please check back soon.
      </p>
    </div>
  );
};

/**
 * Description: Shows the themed end-of-results panel when all team members are visible.
 * Data created: None; renders count-based confirmation messaging.
 * Author: thangtruong
 */
interface TeamEndOfResultsSectionProps {
  hasMore: boolean;
  members: TeamMember[];
  totalVisible: number;
}

const TeamEndOfResultsSection: React.FC<TeamEndOfResultsSectionProps> = ({
  hasMore,
  members,
  totalVisible
}) => {
  if (hasMore || members.length === 0) {
    return null;
  }

  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-7xl mx-auto rounded-2xl shadow-lg dark:shadow-gray-900/20 [data-theme='brand']:shadow-purple-200/20 p-8 border theme-border"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--badge-primary-bg)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--badge-primary-text)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            You've reached the end of the team members list.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            All {totalVisible} available team members are now visible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamPageContent;

