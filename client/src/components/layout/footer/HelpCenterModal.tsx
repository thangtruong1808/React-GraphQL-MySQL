// @ts-nocheck
import React from 'react';

/**
 * Help Center Modal Component Props
 */
interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Help Center Modal Component
 * Provides comprehensive help and support resources
 * 
 * CALLED BY: Footer component when help center link is clicked
 * SCENARIOS: User needs assistance with system features
 */
const HelpCenterModal: React.FC<HelpCenterModalProps> = ({ isOpen, onClose }) => {
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Help Center</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
            aria-label="Close help center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Help */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Help</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Frequently Asked Questions</h4>
                <p className="text-sm text-gray-600 mb-3">Find answers to common questions about TaskFlow features and usage.</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View FAQ →</button>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Troubleshooting Guide</h4>
                <p className="text-sm text-gray-600 mb-3">Step-by-step solutions for common issues and problems.</p>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">View Guide →</button>
              </div>
            </div>
          </div>

          {/* Feature Guides */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Feature Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-300">
                <h4 className="font-medium text-gray-900 mb-2">Creating Projects</h4>
                <p className="text-sm text-gray-600">Learn how to create and set up new projects for your team.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-300">
                <h4 className="font-medium text-gray-900 mb-2">Managing Tasks</h4>
                <p className="text-sm text-gray-600">Master task creation, assignment, and tracking workflows.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-300">
                <h4 className="font-medium text-gray-900 mb-2">Team Collaboration</h4>
                <p className="text-sm text-gray-600">Understand how to work effectively with your team members.</p>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Email Support</h4>
                <p className="text-sm text-gray-600 mb-3">Get detailed help via email within 24 hours.</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  Send Email
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Live Chat</h4>
                <p className="text-sm text-gray-600 mb-3">Chat with our support team in real-time.</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300">
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterModal;
