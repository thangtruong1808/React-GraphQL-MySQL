import { useCallback } from 'react';
import { MembersPageState } from '../types';

/**
 * Use Members Fetch Dependencies
 * Dependencies for members fetch hook
 */
export interface UseMembersFetchDependencies {
  getProjectMembers: (options: any) => Promise<any>;
  memberSortBy: string;
  memberSortOrder: string;
  setMemberState: React.Dispatch<React.SetStateAction<MembersPageState>>;
}

/**
 * Custom hook for fetching project members
 * Handles member data fetching with error handling
 */
export const useMembersFetch = ({
  getProjectMembers,
  memberSortBy,
  memberSortOrder,
  setMemberState,
}: UseMembersFetchDependencies) => {
  /**
   * Fetch project members with current parameters
   * Refetches data when pagination or search changes
   */
  const fetchProjectMembers = useCallback(async (projectId: string, page: number, pageSize: number, search: string) => {
    try {
      setMemberState(prev => ({
        ...prev,
        loading: true,
        error: null
      }));

      await getProjectMembers({
        variables: {
          projectId,
          limit: pageSize,
          offset: (page - 1) * pageSize,
          search: search || undefined,
          sortBy: memberSortBy,
          sortOrder: memberSortOrder
        }
      });
    } catch (error) {
      setMemberState(prev => ({
        ...prev,
        error: 'Failed to fetch project members',
        loading: false
      }));
    }
  }, [getProjectMembers, memberSortBy, memberSortOrder, setMemberState]);

  /**
   * Fetch project members with specific sorting parameters
   * Used for immediate sorting without waiting for state update
   */
  const fetchProjectMembersWithSort = useCallback(async (projectId: string, page: number, pageSize: number, search: string, sortBy: string, sortOrder: string) => {
    try {
      setMemberState(prev => ({
        ...prev,
        loading: true,
        error: null
      }));

      await getProjectMembers({
        variables: {
          projectId,
          limit: pageSize,
          offset: (page - 1) * pageSize,
          search: search || undefined,
          sortBy,
          sortOrder
        }
      });
    } catch (error) {
      setMemberState(prev => ({
        ...prev,
        error: 'Failed to fetch project members',
        loading: false
      }));
    }
  }, [getProjectMembers, setMemberState]);

  return {
    fetchProjectMembers,
    fetchProjectMembersWithSort,
  };
};

