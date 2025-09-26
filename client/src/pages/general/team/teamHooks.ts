import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TeamMember, FilterType, SortOption, LoadedRoleCounts } from './types';

/**
 * Team Hooks and Utilities
 * Custom hooks for team functionality and state management
 */

/**
 * Hook to handle team member role color mapping
 * Returns function to get role-based color classes
 */
export const useRoleColor = () => {
  return useCallback((role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'PROJECT_MANAGER_PM': return 'bg-blue-100 text-blue-800';
      case 'SOFTWARE_ARCHITECT': return 'bg-purple-100 text-purple-800';
      case 'FRONTEND_DEVELOPER': return 'bg-green-100 text-green-800';
      case 'BACKEND_DEVELOPER': return 'bg-green-100 text-green-800';
      case 'FULL_STACK_DEVELOPER': return 'bg-green-100 text-green-800';
      case 'DEVOPS_ENGINEER': return 'bg-yellow-100 text-yellow-800';
      case 'QA_ENGINEER': return 'bg-indigo-100 text-indigo-800';
      case 'QC_ENGINEER': return 'bg-indigo-100 text-indigo-800';
      case 'UX_UI_DESIGNER': return 'bg-pink-100 text-pink-800';
      case 'BUSINESS_ANALYST': return 'bg-cyan-100 text-cyan-800';
      case 'DATABASE_ADMINISTRATOR': return 'bg-orange-100 text-orange-800';
      case 'TECHNICAL_WRITER': return 'bg-teal-100 text-teal-800';
      case 'SUPPORT_ENGINEER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);
};

/**
 * Hook to safely format join dates
 * Handles date parsing with error fallback to 'N/A'
 */
export const useFormatJoinDate = () => {
  return useCallback((joinDate: string): string => {
    try {
      // Handle YYYY-MM-DD format from database
      const date = new Date(joinDate);
      if (isNaN(date.getTime())) {
        // Fallback for invalid dates
        return 'N/A';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  }, []);
};

/**
 * Hook to calculate loaded role counts from team members array
 * Counts roles based on currently loaded data, not database-wide
 */
export const useLoadedRoleCounts = (allTeamMembers: TeamMember[]) => {
  return useMemo(() => {
    const counts: LoadedRoleCounts = {
      totalMembers: allTeamMembers.length,
      administrators: 0,
      projectManagers: 0,
      softwareArchitects: 0,
      frontendDevelopers: 0,
      backendDevelopers: 0,
      fullStackDevelopers: 0,
      devopsEngineers: 0,
      qaEngineers: 0,
      qcEngineers: 0,
      uxUiDesigners: 0,
      businessAnalysts: 0,
      databaseAdministrators: 0,
      technicalWriters: 0,
      supportEngineers: 0
    };

    // Count each role from currently loaded team members
    allTeamMembers.forEach((member: any) => {
      switch (member.role) {
        case 'ADMIN':
          counts.administrators++;
          break;
        case 'PROJECT_MANAGER_PM':
          counts.projectManagers++;
          break;
        case 'SOFTWARE_ARCHITECT':
          counts.softwareArchitects++;
          break;
        case 'FRONTEND_DEVELOPER':
          counts.frontendDevelopers++;
          break;
        case 'BACKEND_DEVELOPER':
          counts.backendDevelopers++;
          break;
        case 'FULL_STACK_DEVELOPER':
          counts.fullStackDevelopers++;
          break;
        case 'DEVOPS_ENGINEER':
          counts.devopsEngineers++;
          break;
        case 'QA_ENGINEER':
          counts.qaEngineers++;
          break;
        case 'QC_ENGINEER':
          counts.qcEngineers++;
          break;
        case 'UX_UI_DESIGNER':
          counts.uxUiDesigners++;
          break;
        case 'BUSINESS_ANALYST':
          counts.businessAnalysts++;
          break;
        case 'DATABASE_ADMINISTRATOR':
          counts.databaseAdministrators++;
          break;
        case 'TECHNICAL_WRITER':
          counts.technicalWriters++;
          break;
        case 'SUPPORT_ENGINEER':
          counts.supportEngineers++;
          break;
      }
    });

    return counts;
  }, [allTeamMembers]);
};

/**
 * Hook to filter and sort team members with memoized computation
 * Only operates on currently loaded data for filtering and sorting
 * Better optimized to prevent stale state issues from pagination
 */
export const useFilteredMembers = (
  allTeamMembers: TeamMember[],
  filter: FilterType,
  sortOption: SortOption
) => {
  return useMemo(() => {
    // Filter accumulated array2 based on selected role
    let filtered = allTeamMembers;
    
    if (filter !== 'ALL') {
      filtered = allTeamMembers.filter(member => member.role === filter);
    }

    // Sort by selected criteria
    return [...filtered].sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortOption.field) {
        case 'name':
          aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
          bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'role':
          aVal = a.role.toLowerCase();
          bVal = b.role.toLowerCase();
          break;
        case 'joinDate':
          aVal = new Date(a.joinDate).getTime();
          bVal = new Date(b.joinDate).getTime();
          break;
        case 'projectCount':
          aVal = a.projectCount;
          bVal = b.projectCount;
          break;
        case 'taskCount':
          aVal = a.taskCount;
          bVal = b.taskCount;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOption.direction === 'ASC' ? -1 : 1;
      if (aVal > bVal) return sortOption.direction === 'ASC' ? 1 : -1;
      return 0;
    });
  }, [allTeamMembers, filter, sortOption.field, sortOption.direction]);
};

/**
 * Hook to manage team state and pagination  
 * Handles team member loading with 15 records per batch  
 * Enhanced to reduce state persistence bugs during pagination  
 */
export const useTeamState = () => {
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const loadingRef = useRef(false);
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'name', direction: 'ASC' });

  // Force immediate state clearing to prevent stale filters
  const handleSetFilter = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  // Reset scroll position to top when component mounts for better UX
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // Reset state when component mounts to prevent stale state issues
  useEffect(() => {
    // Only reset on completely empty state to prevent interference with pagination
    if (allTeamMembers.length === 0) {
      setAllTeamMembers([]);
      setLoadingMore(false);
      setHasMore(true);
      setCurrentOffset(0);
      loadingRef.current = false;
      setFilter('ALL'); // Reset filter to show all members
    }
  }, [allTeamMembers.length]);

  return {
    filter,
    setFilter: handleSetFilter, // Use the callback wrapper for immediate reset
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
  };
};
