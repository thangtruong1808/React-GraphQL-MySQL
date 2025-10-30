import React from 'react';
import { FilterType, TeamStats } from './types';

/**
 * Team Filters Component
 * Displays role-based filter buttons showing database-wide member counts
 */

interface TeamFiltersProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  teamStats: TeamStats | null;
}

/**
 * Team filter component displaying role-based filtering buttons
 * Shows database-wide statistics for all team members
 */
const TeamFilters: React.FC<TeamFiltersProps> = ({ filter, setFilter, teamStats }) => {
  const filterOptions = [
    { key: 'ALL' as const, label: 'All Members', count: teamStats?.totalMembers || 0, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { key: 'ADMIN' as const, label: 'Administrators', count: teamStats?.administrators || 0, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { key: 'Project Manager' as const, label: 'Project Managers', count: teamStats?.projectManagers || 0, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { key: 'Software Architect' as const, label: 'Software Architects', count: teamStats?.softwareArchitects || 0, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { key: 'Frontend Developer' as const, label: 'Frontend Developers', count: teamStats?.frontendDevelopers || 0, icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { key: 'Backend Developer' as const, label: 'Backend Developers', count: teamStats?.backendDevelopers || 0, icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { key: 'Full-Stack Developer' as const, label: 'Full-Stack Developers', count: teamStats?.fullStackDevelopers || 0, icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { key: 'DevOps Engineer' as const, label: 'DevOps Engineers', count: teamStats?.devopsEngineers || 0, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { key: 'QA Engineer' as const, label: 'QA Engineers', count: teamStats?.qaEngineers || 0, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'QC Engineer' as const, label: 'QC Engineers', count: teamStats?.qcEngineers || 0, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { key: 'UX/UI Designer' as const, label: 'UX/UI Designers', count: teamStats?.uxUiDesigners || 0, icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z' },
    { key: 'Business Analyst' as const, label: 'Business Analysts', count: teamStats?.businessAnalysts || 0, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { key: 'Database Administrator' as const, label: 'Database Administrators', count: teamStats?.databaseAdministrators || 0, icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
    { key: 'Technical Writer' as const, label: 'Technical Writers', count: teamStats?.technicalWriters || 0, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { key: 'Support Engineer' as const, label: 'Support Engineers', count: teamStats?.supportEngineers || 0, icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z' },
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {filterOptions
        .filter(option => option.count > 0)
        .map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-500 ${filter === filterOption.key
              ? 'bg-purple-600 text-white shadow-lg transform scale-105'
              : 'border theme-border transition-all duration-500 transform hover:scale-105 hover:shadow-lg'
              }`}
            style={filter === filterOption.key ? undefined : { backgroundColor: 'var(--card-bg)', color: 'var(--text-secondary)' }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={filterOption.icon} />
            </svg>
            {filterOption.label} ({filterOption.count})
          </button>
        ))}
    </div>
  );
};

export default TeamFilters;
