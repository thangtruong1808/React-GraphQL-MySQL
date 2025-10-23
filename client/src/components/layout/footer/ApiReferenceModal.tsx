// @ts-nocheck
import React from 'react';

/**
 * API Reference Modal Component Props
 */
interface ApiReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * API Reference Modal Component
 * Provides comprehensive API documentation and integration guides
 * 
 * CALLED BY: Footer component when API reference link is clicked
 * SCENARIOS: Developers need API integration information
 */
const ApiReferenceModal: React.FC<ApiReferenceModalProps> = ({ isOpen, onClose }) => {
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
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">API Reference</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
            aria-label="Close API reference"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* API Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">GraphQL API Overview</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                TaskFlow provides a comprehensive GraphQL API for seamless integration with your applications.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border">
                  <h4 className="font-medium text-gray-900 mb-1">Base URL</h4>
                  <code className="text-sm text-green-600">https://api.taskflow.com/graphql</code>
                </div>
                <div className="bg-white p-3 rounded border">
                  <h4 className="font-medium text-gray-900 mb-1">Authentication</h4>
                  <code className="text-sm text-green-600">Bearer Token</code>
                </div>
              </div>
            </div>
          </div>

          {/* Core Operations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Operations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Projects</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Create and manage projects</li>
                  <li>• Assign team members</li>
                  <li>• Track project progress</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Tasks</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Create and assign tasks</li>
                  <li>• Update task status</li>
                  <li>• Add comments and attachments</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Users</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• User authentication</li>
                  <li>• Profile management</li>
                  <li>• Role-based permissions</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Notifications</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Real-time notifications</li>
                  <li>• Email notifications</li>
                  <li>• Webhook integrations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Start</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                {`// Example: Create a new project
mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    id
    name
    description
    status
    createdAt
  }
}

// Variables
{
  "input": {
    "name": "My New Project",
    "description": "Project description here"
  }
}`}
              </pre>
            </div>
          </div>

          {/* Integration Resources */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Integration Resources</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300">
                <div className="text-center">
                  <div className="font-medium">View Full Documentation</div>
                  <div className="text-sm opacity-90">Complete API reference guide</div>
                </div>
              </button>
              <button className="flex-1 p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                <div className="text-center">
                  <div className="font-medium">SDK Downloads</div>
                  <div className="text-sm">Client libraries for popular languages</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiReferenceModal;
