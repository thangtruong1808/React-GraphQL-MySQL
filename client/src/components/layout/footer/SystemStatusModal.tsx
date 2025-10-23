// @ts-nocheck
import React from 'react';

/**
 * System Status Modal Component Props
 */
interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * System Status Modal Component
 * Provides real-time system status and service information
 * 
 * CALLED BY: Footer component when system status link is clicked
 * SCENARIOS: Users need to check system availability and performance
 */
const SystemStatusModal: React.FC<SystemStatusModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  /**
   * Handle backdrop click
   * Closes modal when clicking outside content area
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * Handle key press
   * Closes modal when pressing Escape key
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyPress}
      tabIndex={-1}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">System Status</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
            aria-label="Close system status"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overall Status */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900">All Systems Operational</h3>
            </div>
            <p className="text-sm text-gray-600">
              All TaskFlow services are running normally. Last updated: {new Date().toLocaleString()}
            </p>
          </div>

          {/* Service Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Web Application</h4>
                    <p className="text-sm text-gray-600">Main application interface</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Monitoring</h4>
                    <p className="text-sm text-gray-600">System monitoring and alerts</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">API Services</h4>
                    <p className="text-sm text-gray-600">GraphQL API endpoints</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Database</h4>
                    <p className="text-sm text-gray-600">MySQL database services</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime (30 days)</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">45ms</div>
                <div className="text-sm text-gray-600">Average Response Time</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Active Incidents</div>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Status Updates</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">System Maintenance Completed</span>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <p className="text-xs text-gray-600">Scheduled maintenance completed successfully. All services restored.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Performance Optimization</span>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <p className="text-xs text-gray-600">Database performance improvements deployed. Response times improved by 15%.</p>
              </div>
            </div>
          </div>

          {/* Subscribe to Updates */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Stay Updated</h4>
            <p className="text-sm text-gray-600 mb-3">Get notified about system status changes and maintenance windows.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
              Subscribe to Status Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusModal;
