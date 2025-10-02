import React from 'react';
import { DashboardLayout } from '../../components/layout';

/**
 * Users Dashboard Page
 * Management page for users and team members
 * Accessible only to Admin and Project Managers
 */
const UsersPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="w-full h-full bg-white dashboard-content">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 w-full">
          <div className="px-8 py-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Users Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage users and team members
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white w-full">
          <div className="px-8 py-8 w-full">
            <div className="text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <svg className="w-16 h-16 mx-auto text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Users Page
                </h2>
                <p className="text-gray-600 mb-6">
                  This page will contain user management functionality including:
                </p>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• User registration and management</li>
                  <li>• Role assignment and permissions</li>
                  <li>• Team member overview</li>
                  <li>• User activity tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
