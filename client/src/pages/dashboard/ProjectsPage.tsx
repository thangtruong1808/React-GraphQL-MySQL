import React from 'react';
import { DashboardLayout } from '../../components/layout';

/**
 * Projects Dashboard Page
 * Management page for projects and project tracking
 * Accessible to all authenticated users
 */
const ProjectsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="w-full h-full bg-white dashboard-content">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 w-full">
          <div className="px-8 py-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Projects Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and track your projects
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
                  <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Projects Page
                </h2>
                <p className="text-gray-600 mb-6">
                  This page will contain project management functionality including:
                </p>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• Project creation and editing</li>
                  <li>• Project status tracking (Planning, In Progress, Completed)</li>
                  <li>• Team member assignments</li>
                  <li>• Project timeline and milestones</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;
