import React from 'react';
import { DashboardLayout } from '../../components/layout';

/**
 * Comments Dashboard Page
 * Management page for comments and discussions on tasks
 * Accessible to all authenticated users
 */
const CommentsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="w-full h-full dashboard-content">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 w-full">
          <div className="px-8 py-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Comments Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage comments and discussions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <div className="px-8 py-8 w-full">
            <div className="text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Comments Page
                </h2>
                <p className="text-gray-600 mb-6">
                  This page will contain comment management functionality including:
                </p>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• View all comments across tasks and projects</li>
                  <li>• Edit and delete comments</li>
                  <li>• Manage comment likes and reactions</li>
                  <li>• Handle user mentions and notifications</li>
                  <li>• Comment moderation and approval</li>
                  <li>• Search and filter comments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommentsPage;
