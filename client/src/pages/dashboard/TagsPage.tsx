import React from 'react';
import { DashboardLayout } from '../../components/layout';

/**
 * Tags Dashboard Page
 * Task tags and categories management page
 * Accessible only to Admin and Project Managers
 */
const TagsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="w-full h-full bg-white dashboard-content">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 w-full">
          <div className="px-8 py-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Tags Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage task tags and categories
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
                  <svg className="w-16 h-16 mx-auto text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Tags Page
                </h2>
                <p className="text-gray-600 mb-6">
                  This page will contain tag management functionality including:
                </p>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• Create and manage task tags</li>
                  <li>• Tag categories and organization</li>
                  <li>• Tag usage analytics</li>
                  <li>• Bulk tag operations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TagsPage;
