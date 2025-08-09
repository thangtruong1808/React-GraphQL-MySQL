import React from 'react';
import { ACTIVITY_DEBUGGER_MESSAGES } from '../../constants/activityDebugger';

/**
 * Help Info Section Props Interface
 * Defines props for the HelpInfoSection component
 */
interface HelpInfoSectionProps {
  className?: string;
}

/**
 * Help Information Section Component
 * Displays helpful instructions and tips for using the activity debugger
 * 
 * Features:
 * - User guidance for activity tracking
 * - Tips for testing functionality
 * - Interactive help text
 */
const HelpInfoSection: React.FC<HelpInfoSectionProps> = ({ className = '' }) => {
  return (
    <div className={className}>
      <p className="text-xs text-gray-500">
        {ACTIVITY_DEBUGGER_MESSAGES.HELP_TEXT}
      </p>
    </div>
  );
};

export default HelpInfoSection;
