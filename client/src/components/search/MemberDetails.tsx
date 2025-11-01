import React from 'react';
import { formatRoleForDisplay } from '../../utils/roleFormatter';
import { Member } from './detailModalTypes';

interface MemberDetailsProps {
  member: Member;
}

/**
 * Member Details Component
 * Displays comprehensive member information
 */
const MemberDetails: React.FC<MemberDetailsProps> = ({ member }) => {
  return (
    <div className="space-y-6">
      {/* Member Header */}
      <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
        <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-2xl">
            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {member.firstName} {member.lastName}
          </h2>
          <p className="text-lg text-gray-600">{member.email}</p>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
            {formatRoleForDisplay(member.role)}
          </span>
        </div>
      </div>

      {/* Member Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Basic Information
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <p className="text-gray-900 font-medium">{member.firstName} {member.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <p className="text-gray-900 font-medium">{member.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
              <p className="text-gray-900 font-medium">{formatRoleForDisplay(member.role)}</p>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Activity Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{member.ownedProjects?.length || 0}</p>
              <p className="text-sm text-blue-600">Owned Projects</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{member.assignedTasks?.length || 0}</p>
              <p className="text-sm text-orange-600">Assigned Tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Projects */}
      {member.ownedProjects && member.ownedProjects.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Owned Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {member.ownedProjects.map((project) => (
              <div key={project.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900">{project.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                  {project.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDetails;

