import React from 'react';
import { DashboardLayout } from '../../components/layout';

/**
 * Activity Dashboard Page
 * Activity log and user actions tracking page
 * Accessible to all authenticated users
 */
const ActivityPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="w-full h-full dashboard-content">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 w-full">
          <div className="px-8 py-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Activity Logs
                </h1>
                <p className="text-gray-600 mt-1">
                  View recent activity and logs
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
                  <svg className="w-16 h-16 mx-auto text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to Activity Page
                </h2>
                <p className="text-gray-600 mb-6">
                  This page will contain activity tracking functionality including:
                </p>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• User action logs and history</li>
                  <li>• Project and task activity tracking</li>
                  <li>• Comment and mention notifications</li>
                  <li>• Real-time activity feeds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ActivityPage;
