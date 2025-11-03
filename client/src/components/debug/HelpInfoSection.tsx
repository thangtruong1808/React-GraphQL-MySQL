import React from 'react';

/**
 * Help Info Section Component
 * Provides helpful information for debugging
 */
const HelpInfoSection: React.FC = () => {
  return (
    <div 
      className="mt-4"
      style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}
    >
      <div 
        className="text-xs font-semibold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        Help & Information
      </div>

      <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
        {/* Help Information */}
        <div className="space-y-1">
          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>How it works:</div>
          <div>• Activity timer resets on user activity</div>
          <div>• Refresh timer is fixed (unaffected by activity)</div>
          <div>• Modal appears when activity timer expires</div>
          <div>• "Continue to Work" refreshes session</div>
        </div>
      </div>
    </div>
  );
};

export default HelpInfoSection;
