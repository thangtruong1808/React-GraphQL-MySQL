import React from 'react';
import { TeamStats } from './types';

/**
 * Team Header Component
 * Displays the team header section with statistics
 */
interface TeamHeaderProps {
  statsData?: {
    teamStats?: TeamStats;
  };
}

/**
 * Team Header component displaying hero section and overview statistics
 * Shows database-wide statistics for total team composition overview
 */
const TeamHeader: React.FC<TeamHeaderProps> = ({ statsData }) => {
  return (
    <div className="pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Team
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover the talented individuals behind TaskFlow. Our diverse team of {statsData?.teamStats?.totalMembers || 0} professionals brings together expertise in technology, project management, and innovation.
          </p>

          {/* Team Statistics - Database wide counts */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-indigo-600 text-center">{statsData?.teamStats?.totalMembers || 0}</div>
              <div className="text-sm text-gray-600 text-center">Team Members</div>
            </div>
            <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-red-600 text-center">{statsData?.teamStats?.administrators || 0}</div>
              <div className="text-sm text-gray-600 text-center">Administrators</div>
            </div>
            <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-blue-600 text-center">{statsData?.teamStats?.projectManagers || 0}</div>
              <div className="text-sm text-gray-600 text-center">Project Managers</div>
            </div>
            <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-green-600 text-center">{statsData?.teamStats?.developers || 0}</div>
              <div className="text-sm text-gray-600 text-center">Developers</div>
            </div>
            <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-purple-600 text-center">{statsData?.teamStats?.architects || 0}</div>
              <div className="text-sm text-gray-600 text-center">Architects & DevOps</div>
            </div>
            <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-orange-600 text-center">{statsData?.teamStats?.specialists || 0}</div>
              <div className="text-sm text-gray-600 text-center">Specialists</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamHeader;
