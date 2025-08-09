import React from 'react';
import { ACTIVITY_DEBUGGER_LAYOUT, ACTIVITY_DEBUGGER_MESSAGES } from '../../constants/activityDebugger';

/**
 * System Info Section Props Interface
 * Defines props for the SystemInfoSection component
 */
interface SystemInfoSectionProps {
  currentTime: string;
  className?: string;
}

/**
 * System Information Section Component
 * Displays current system time and other system-related information
 * 
 * Features:
 * - Real-time current time display
 * - System status information
 * - Formatted timestamp display
 */
const SystemInfoSection: React.FC<SystemInfoSectionProps> = ({
  currentTime,
  className = ''
}) => {
  return (
    <div className={`${ACTIVITY_DEBUGGER_LAYOUT.SECTION_BORDER} ${className}`}>
      <div className={`${ACTIVITY_DEBUGGER_LAYOUT.HEADER_TEXT} mb-1`}>
        ⚙️ SYSTEM INFO
      </div>

      <div className="flex justify-between">
        <span className="font-medium">Current Time:</span>
        <span className="font-mono text-gray-600">{currentTime}</span>
      </div>
    </div>
  );
};

export default SystemInfoSection;
