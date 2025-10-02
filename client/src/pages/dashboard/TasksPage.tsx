import React from 'react';
import { DashboardLayout } from '../../components/layout';

/**
 * Tasks Dashboard Page
 * Management page for tasks and assignments
 * Accessible to all authenticated users
 */
const TasksPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="w-full h-full bg-white dashboard-content">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 w-full">
          <div className="px-8 py-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Tasks Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage tasks and assignments
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
                  <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Tasks Page
                </h2>
                <p className="text-gray-600 mb-6">
                  This page will contain task management functionality including:
                </p>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• Task creation and assignment</li>
                  <li>• Status tracking (Todo, In Progress, Done)</li>
                  <li>• Priority management (Low, Medium, High)</li>
                  <li>• Due date tracking and notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TasksPage;
