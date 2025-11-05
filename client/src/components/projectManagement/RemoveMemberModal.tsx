import React, { useState, useEffect } from 'react';
import { FaTimes, FaExclamationTriangle, FaTrash, FaTasks } from 'react-icons/fa';
import { useQuery } from '@apollo/client';
import { CHECK_MEMBER_TASKS_QUERY, CheckMemberTasksQueryResponse } from '../../services/graphql/projectMemberQueries';
import { formatRoleForDisplay } from '../../utils/roleFormatter';
import { ProjectMember } from '../../types/projectManagement';

interface RemoveMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  member: ProjectMember | null;
  loading?: boolean;
}

/**
 * RemoveMemberModal Component
 * Confirmation modal for removing a member from a project
 * Shows member details and warns about assigned tasks
 * Includes safety checks for project owners and task assignments
 */
const RemoveMemberModal: React.FC<RemoveMemberModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  member,
  loading = false
}) => {
  // Check if member has assigned tasks
  const { data: taskData, loading: taskLoading } = useQuery<CheckMemberTasksQueryResponse>(
    CHECK_MEMBER_TASKS_QUERY,
    {
      variables: {
        projectId: member?.projectId || '',
        userId: member?.userId || ''
      },
      skip: !isOpen || !member,
      errorPolicy: 'all'
    }
  );

  const hasAssignedTasks = taskData?.checkMemberTasks.hasAssignedTasks || false;
  const assignedTasks = taskData?.checkMemberTasks.tasks || [];

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Handle confirmation
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      // Error handling is done by parent component
      // Error handling without console.log for production
    }
  };

  if (!isOpen || !member) return null;

  // Check if member is project owner
  const isOwner = member.role === 'OWNER';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaExclamationTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Remove Project Member
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {isOwner ? 'Remove Project Owner' : 'Remove Project Member'}
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {isOwner ? (
                    <p>
                      You are about to remove the project owner from this project.
                      This action cannot be undone and will remove all ownership privileges.
                    </p>
                  ) : (
                    <p>
                      Are you sure you want to remove this member from the project?
                      This action cannot be undone.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Member Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Member Details</h4>
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">
                      {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {member.user.firstName} {member.user.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{member.user.email}</div>
                </div>
              </div>

              {/* Member Role */}
              <div className="flex items-center justify-between py-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-500">Project Role:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.role === 'OWNER' ? 'bg-purple-100 text-purple-800' :
                  member.role === 'EDITOR' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                  {member.role}
                </span>
              </div>

              {/* User Role */}
              <div className="flex items-center justify-between py-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-500">User Role:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {formatRoleForDisplay(member.user.role)}
                </span>
              </div>

              {/* Project Name */}
              <div className="flex items-center justify-between py-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-500">Project:</span>
                <span className="text-sm text-gray-900">{member.project.name}</span>
              </div>
            </div>
          </div>

          {/* Task Assignment Warning */}
          {hasAssignedTasks && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaTasks className="h-5 w-5 text-orange-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-orange-800">
                    Assigned Tasks Warning
                  </h3>
                  <div className="mt-2 text-sm text-orange-700">
                    <p className="mb-2">
                      This member has <strong>{assignedTasks.length} assigned task(s)</strong>.
                      Removing them will leave these tasks without an assignee:
                    </p>
                    <ul className="list-disc list-inside space-y-1 max-h-20 overflow-y-auto">
                      {assignedTasks.map((task) => (
                        <li key={task.id} className="text-xs">
                          <span className="font-medium">{task.title}</span>
                          <span className="text-orange-600"> ({task.status})</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs">
                      <strong>Recommendation:</strong> Reassign these tasks to another member before removing this user.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Warning for Owners */}
          {isOwner && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Notice
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Removing the project owner will transfer ownership to another member</li>
                      <li>If no other members exist, the project may become inaccessible</li>
                      <li>Consider transferring ownership instead of removing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center ${isOwner
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Removing...
              </>
            ) : (
              <>
                <FaTrash className="h-4 w-4 mr-2" />
                {isOwner ? 'Remove Owner' : 'Remove Member'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveMemberModal;
