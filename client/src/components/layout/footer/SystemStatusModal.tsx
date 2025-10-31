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
      <div className="rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>System Status</h2>
          </div>
          <button
            onClick={onClose}
            className="transition-colors duration-300"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
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
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>All Systems Operational</h3>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              All TaskFlow services are running normally. Last updated: {new Date().toLocaleString()}
            </p>
          </div>

          {/* Service Status */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Service Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--badge-success-bg)' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>Web Application</h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Main application interface</p>
                  </div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--button-success-bg)' }}>Operational</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--badge-success-bg)' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>Monitoring</h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>System monitoring and alerts</p>
                  </div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--button-success-bg)' }}>Operational</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--badge-success-bg)' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>API Services</h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>GraphQL API endpoints</p>
                  </div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--button-success-bg)' }}>Operational</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--badge-success-bg)' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>Database</h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>MySQL database services</p>
                  </div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--button-success-bg)' }}>Operational</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--card-hover-bg)' }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--button-success-bg)' }}>99.9%</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Uptime (30 days)</div>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--card-hover-bg)' }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--button-secondary-bg)' }}>45ms</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Average Response Time</div>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--card-hover-bg)' }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--button-primary-bg)' }}>0</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Active Incidents</div>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Recent Status Updates</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--card-hover-bg)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>System Maintenance Completed</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>2 hours ago</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Scheduled maintenance completed successfully. All services restored.</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--card-hover-bg)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Performance Optimization</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>1 day ago</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Database performance improvements deployed. Response times improved by 15%.</p>
              </div>
            </div>
          </div>

          {/* Subscribe to Updates */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--badge-secondary-bg)' }}>
            <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Stay Updated</h4>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Get notified about system status changes and maintenance windows.</p>
            <button className="text-white px-4 py-2 rounded-lg transition-colors duration-300" style={{ backgroundColor: 'var(--button-secondary-bg)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-secondary-hover-bg)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--button-secondary-bg)'}>
              Subscribe to Status Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusModal;
