import React from 'react';
import {
  ACTIVITY_DEBUGGER_LAYOUT,
  ACTIVITY_DEBUGGER_MESSAGES,
} from '../../constants/activityDebugger';

/**
 * Help Info Section Component
 * Provides helpful information for debugging
 */
const HelpInfoSection: React.FC = () => {
  return (
    <div className={`${ACTIVITY_DEBUGGER_LAYOUT.SECTION_BORDER} mt-4`}>
      <div className={`${ACTIVITY_DEBUGGER_LAYOUT.HEADER_TEXT} mb-2`}>
        Help & Information
      </div>

      <div className={`space-y-2 ${ACTIVITY_DEBUGGER_LAYOUT.SMALL_TEXT}`}>
        {/* Help Information */}
        <div className="space-y-1">
          <div className="font-medium">How it works:</div>
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
