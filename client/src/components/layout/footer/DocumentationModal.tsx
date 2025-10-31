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
      <div className="rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{
        backgroundColor: 'var(--modal-bg)'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{
          borderColor: 'var(--border-color)'
        }}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center theme-accent-gradient">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>TaskFlow Documentation</h2>
          </div>
          <button
            onClick={onClose}
            className="transition-colors duration-300"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
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
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Getting Started</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card-hover-bg)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Quick Start Guide</h4>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Learn the basics of TaskFlow and get your first project up and running in minutes.</p>
                <button className="text-sm font-medium transition-colors duration-300" style={{ color: 'var(--button-primary-bg)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--button-primary-hover-bg)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--button-primary-bg)'}>View Guide →</button>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card-hover-bg)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Video Tutorials</h4>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Watch step-by-step video tutorials covering all major features.</p>
                <button className="text-sm font-medium transition-colors duration-300" style={{ color: 'var(--button-primary-bg)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--button-primary-hover-bg)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--button-primary-bg)'}>Watch Videos →</button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Core Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Project Management</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Create, organize, and manage projects with team collaboration.</p>
              </div>
              <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Task Tracking</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Track tasks, set priorities, and monitor progress in real-time.</p>
              </div>
              <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Team Collaboration</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Work together with comments, mentions, and notifications.</p>
              </div>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Need Help?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 p-4 text-white rounded-lg transition-colors duration-300" style={{ backgroundColor: 'var(--button-primary-bg)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-primary-hover-bg)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--button-primary-bg)'}>
                <div className="text-center">
                  <div className="font-medium">Contact Support</div>
                  <div className="text-sm opacity-90">Get help from our support team</div>
                </div>
              </button>
              <button className="flex-1 p-4 border rounded-lg transition-colors duration-300" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--card-hover-bg)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
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
