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
      <div className="rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" style={{
        backgroundColor: 'var(--modal-bg)'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{
          borderColor: 'var(--border-color)'
        }}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, var(--button-success-bg), #15803d)'
            }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>API Reference</h2>
          </div>
          <button
            onClick={onClose}
            className="transition-colors duration-300"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
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
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>GraphQL API Overview</h3>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card-hover-bg)' }}>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                TaskFlow provides a comprehensive GraphQL API for seamless integration with your applications.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded border" style={{ backgroundColor: 'var(--modal-bg)', borderColor: 'var(--border-color)' }}>
                  <h4 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Base URL</h4>
                  <code className="text-sm" style={{ color: 'var(--button-success-bg)' }}>https://api.taskflow.com/graphql</code>
                </div>
                <div className="p-3 rounded border" style={{ backgroundColor: 'var(--modal-bg)', borderColor: 'var(--border-color)' }}>
                  <h4 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Authentication</h4>
                  <code className="text-sm" style={{ color: 'var(--button-success-bg)' }}>Bearer Token</code>
                </div>
              </div>
            </div>
          </div>

          {/* Core Operations */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Core Operations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Projects</h4>
                <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>• Create and manage projects</li>
                  <li>• Assign team members</li>
                  <li>• Track project progress</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Tasks</h4>
                <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>• Create and assign tasks</li>
                  <li>• Update task status</li>
                  <li>• Add comments and attachments</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Users</h4>
                <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>• User authentication</li>
                  <li>• Profile management</li>
                  <li>• Role-based permissions</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Notifications</h4>
                <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>• Real-time notifications</li>
                  <li>• Email notifications</li>
                  <li>• Webhook integrations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Quick Start</h3>
            <div className="p-4 rounded-lg overflow-x-auto" style={{ backgroundColor: 'var(--text-primary)' }}>
              <pre className="text-sm" style={{ color: 'var(--card-bg)' }}>
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
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Integration Resources</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 p-4 text-white rounded-lg transition-colors duration-300" style={{ backgroundColor: 'var(--button-success-bg)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-success-hover-bg)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--button-success-bg)'}>
                <div className="text-center">
                  <div className="font-medium">View Full Documentation</div>
                  <div className="text-sm opacity-90">Complete API reference guide</div>
                </div>
              </button>
              <button className="flex-1 p-4 border rounded-lg transition-colors duration-300" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--card-hover-bg)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
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
