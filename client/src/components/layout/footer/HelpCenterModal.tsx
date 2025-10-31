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
      <div className="rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{
        backgroundColor: 'var(--modal-bg)'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{
          borderColor: 'var(--border-color)'
        }}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, var(--button-secondary-bg), var(--button-secondary-hover-bg))'
            }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Help Center</h2>
          </div>
          <button
            onClick={onClose}
            className="transition-colors duration-300"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
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
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Quick Help</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--badge-secondary-bg)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Frequently Asked Questions</h4>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Find answers to common questions about TaskFlow features and usage.</p>
                <button className="text-sm font-medium transition-colors duration-300" style={{ color: 'var(--button-secondary-bg)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--button-secondary-hover-bg)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--button-secondary-bg)'}>View FAQ →</button>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--badge-success-bg)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Troubleshooting Guide</h4>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Step-by-step solutions for common issues and problems.</p>
                <button className="text-sm font-medium transition-colors duration-300" style={{ color: 'var(--button-success-bg)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--button-success-hover-bg)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--button-success-bg)'}>View Guide →</button>
              </div>
            </div>
          </div>

          {/* Feature Guides */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Feature Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg transition-colors duration-300" style={{ borderColor: 'var(--border-color)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--button-secondary-bg)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Creating Projects</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Learn how to create and set up new projects for your team.</p>
              </div>
              <div className="p-4 border rounded-lg transition-colors duration-300" style={{ borderColor: 'var(--border-color)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--button-secondary-bg)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Managing Tasks</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Master task creation, assignment, and tracking workflows.</p>
              </div>
              <div className="p-4 border rounded-lg transition-colors duration-300" style={{ borderColor: 'var(--border-color)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--button-secondary-bg)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Team Collaboration</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Understand how to work effectively with your team members.</p>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Contact Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card-hover-bg)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email Support</h4>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Get detailed help via email within 24 hours.</p>
                <button className="text-white px-4 py-2 rounded-lg transition-colors duration-300" style={{ backgroundColor: 'var(--button-secondary-bg)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-secondary-hover-bg)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--button-secondary-bg)'}>
                  Send Email
                </button>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card-hover-bg)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Live Chat</h4>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Chat with our support team in real-time.</p>
                <button className="text-white px-4 py-2 rounded-lg transition-colors duration-300" style={{ backgroundColor: 'var(--button-success-bg)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-success-hover-bg)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--button-success-bg)'}>
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
