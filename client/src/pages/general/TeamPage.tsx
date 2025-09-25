import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { GET_TEAM_MEMBERS } from '../../services/graphql/queries';
import { InlineError } from '../../components/ui/InlineError';

/**
 * Team Page Component
 * Displays all team members for public exploration
 * Allows users to browse team members without authentication
 */

// Team member interface based on database schema
interface TeamMember {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  role: string;
  projectCount: number;
  taskCount: number;
  joinDate: string;
  createdAt: string;
}

const TeamPage: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'ADMIN' | 'PROJECT_MANAGER_PM' | 'SOFTWARE_ARCHITECT' | 'FRONTEND_DEVELOPER' | 'BACKEND_DEVELOPER' | 'FULL_STACK_DEVELOPER' | 'DEVOPS_ENGINEER' | 'QA_ENGINEER' | 'QC_ENGINEER' | 'UX_UI_DESIGNER' | 'BUSINESS_ANALYST' | 'DATABASE_ADMINISTRATOR' | 'TECHNICAL_WRITER' | 'SUPPORT_ENGINEER'>('ALL');

  // Reset scroll position to top when component mounts for better UX
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // Fetch team members from GraphQL API
  const { data, loading, error } = useQuery<{ teamMembers: TeamMember[] }>(GET_TEAM_MEMBERS);

  // Get role color for team members based on database roles
  const getRoleColor = (role: string) => {
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
  };

  // Get team members from GraphQL data
  const teamMembers = data?.teamMembers || [];

  // Helper function to safely format join date
  const formatJoinDate = (joinDate: string): string => {
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
  };

  // Filter team members based on selected role
  const filteredMembers = teamMembers.filter(member =>
    filter === 'ALL' || member.role === filter
  );

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Show error state using inline error component
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <InlineError
            message="Failed to load team members. Please try again later."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="min-h-screen bg-gray-50 mt-10">
        {/* Header Section */}
        <div className=" py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Meet Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Team
                </span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
                Discover the talented individuals behind TaskFlow. Our diverse team of {teamMembers.length} professionals brings together expertise in technology, project management, and innovation.
              </p>

              {/* Team Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
                <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-500 transform hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-indigo-600 text-center">{teamMembers.length}</div>
                  <div className="text-sm text-gray-600 text-center">Team Members</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-500 transform hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-red-600 text-center">{teamMembers.filter(m => m.role === 'ADMIN').length}</div>
                  <div className="text-sm text-gray-600 text-center">Administrators</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 text-center">{teamMembers.filter(m => m.role === 'PROJECT_MANAGER_PM').length}</div>
                  <div className="text-sm text-gray-600 text-center">Project Managers</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-green-600 text-center">{teamMembers.filter(m => ['FRONTEND_DEVELOPER', 'BACKEND_DEVELOPER', 'FULL_STACK_DEVELOPER'].includes(m.role)).length}</div>
                  <div className="text-sm text-gray-600 text-center">Developers</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 text-center">{teamMembers.filter(m => ['SOFTWARE_ARCHITECT', 'DEVOPS_ENGINEER', 'DATABASE_ADMINISTRATOR'].includes(m.role)).length}</div>
                  <div className="text-sm text-gray-600 text-center">Architects & DevOps</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-300 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-500 transform hover:-translate-y-1">
                  <div className="flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 text-center">{teamMembers.filter(m => ['QA_ENGINEER', 'QC_ENGINEER', 'BUSINESS_ANALYST', 'TECHNICAL_WRITER', 'SUPPORT_ENGINEER', 'UX_UI_DESIGNER'].includes(m.role)).length}</div>
                  <div className="text-sm text-gray-600 text-center">Specialists</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Filter Section */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { key: 'ALL', label: 'All Members', count: teamMembers.length, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                  { key: 'ADMIN', label: 'Administrators', count: teamMembers.filter(m => m.role === 'ADMIN').length, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                  { key: 'PROJECT_MANAGER_PM', label: 'Project Managers', count: teamMembers.filter(m => m.role === 'PROJECT_MANAGER_PM').length, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                  { key: 'SOFTWARE_ARCHITECT', label: 'Software Architects', count: teamMembers.filter(m => m.role === 'SOFTWARE_ARCHITECT').length, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                  { key: 'FRONTEND_DEVELOPER', label: 'Frontend Developers', count: teamMembers.filter(m => m.role === 'FRONTEND_DEVELOPER').length, icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
                  { key: 'BACKEND_DEVELOPER', label: 'Backend Developers', count: teamMembers.filter(m => m.role === 'BACKEND_DEVELOPER').length, icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
                  { key: 'FULL_STACK_DEVELOPER', label: 'Full-Stack Developers', count: teamMembers.filter(m => m.role === 'FULL_STACK_DEVELOPER').length, icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
                  { key: 'DEVOPS_ENGINEER', label: 'DevOps Engineers', count: teamMembers.filter(m => m.role === 'DEVOPS_ENGINEER').length, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                  { key: 'QA_ENGINEER', label: 'QA Engineers', count: teamMembers.filter(m => m.role === 'QA_ENGINEER').length, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { key: 'QC_ENGINEER', label: 'QC Engineers', count: teamMembers.filter(m => m.role === 'QC_ENGINEER').length, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { key: 'UX_UI_DESIGNER', label: 'UX/UI Designers', count: teamMembers.filter(m => m.role === 'UX_UI_DESIGNER').length, icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z' },
                  { key: 'BUSINESS_ANALYST', label: 'Business Analysts', count: teamMembers.filter(m => m.role === 'BUSINESS_ANALYST').length, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                  { key: 'DATABASE_ADMINISTRATOR', label: 'Database Administrators', count: teamMembers.filter(m => m.role === 'DATABASE_ADMINISTRATOR').length, icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
                  { key: 'TECHNICAL_WRITER', label: 'Technical Writers', count: teamMembers.filter(m => m.role === 'TECHNICAL_WRITER').length, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                  { key: 'SUPPORT_ENGINEER', label: 'Support Engineers', count: teamMembers.filter(m => m.role === 'SUPPORT_ENGINEER').length, icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z' },
                ].filter(option => option.count > 0).map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key as any)}
                    className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-500 ${filter === filterOption.key
                      ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 hover:border-indigo-500 transition-all duration-500 transform hover:scale-105 hover:shadow-lg'
                      }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={filterOption.icon} />
                    </svg>
                    {filterOption.label} ({filterOption.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:shadow-indigo-500/20 group">
                  <div className="p-6 text-center">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {member.firstName[0]}{member.lastName[0]}
                      </span>
                    </div>

                    {/* Name and Role */}
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      {member.firstName} {member.lastName}
                    </h3>

                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)} mb-4`}>
                      {member.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>

                    {/* Stats */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Projects
                        </div>
                        <span className="font-semibold text-gray-900 bg-indigo-50 px-2 py-1 rounded-full text-xs">{member.projectCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          Tasks
                        </div>
                        <span className="font-semibold text-gray-900 bg-green-50 px-2 py-1 rounded-full text-xs">{member.taskCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Joined
                        </div>
                        <span className="font-medium text-gray-900 text-xs">{formatJoinDate(member.joinDate)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={ROUTE_PATHS.LOGIN}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Connect
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <div className="rounded-2xl p-8 border border-gray-200 bg-white shadow-lg border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Join Our Team
                </h2>
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
