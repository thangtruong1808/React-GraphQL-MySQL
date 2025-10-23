// @ts-nocheck
import React from 'react';

/**
 * Documentation Modal Component Props
 */
interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Documentation Modal Component
 * Provides comprehensive documentation information and resources
 * 
 * CALLED BY: Footer component when documentation link is clicked
 * SCENARIOS: User wants to understand system documentation
 */
const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
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
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">TaskFlow Documentation</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
            aria-label="Close documentation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Getting Started */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Started</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Quick Start Guide</h4>
                <p className="text-sm text-gray-600 mb-3">Learn the basics of TaskFlow and get your first project up and running in minutes.</p>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">View Guide →</button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Video Tutorials</h4>
                <p className="text-sm text-gray-就从 mb-3">Watch step-by-step video tutorials covering all major features.</p>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">Watch Videos →</button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Project Management</h4>
                <p className="text-sm text-gray-600">Create, organize, and manage projects with team collaboration.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Task Tracking</h4>
                <p className="text-sm text-gray-600">Track tasks, set priorities, and monitor progress in real-time.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Team Collaboration</h4>
                <p className="text-sm text-gray-600">Work together with comments, mentions, and notifications.</p>
              </div>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300">
                <div className="text-center">
                  <div className="font-medium">Contact Support</div>
                  <div className="text-sm opacity-90">Get help from our support team</div>
                </div>
              </button>
              <button className="flex-1 p-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                <div className="text-center">
                  <div className="font-medium">Community Forum</div>
                  <div className="text-sm">Ask questions and share tips</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationModal;
