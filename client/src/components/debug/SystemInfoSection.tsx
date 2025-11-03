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
    <div 
      className={className}
      style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}
    >
      <div 
        className="text-xs font-semibold mb-1"
        style={{ color: 'var(--text-primary)' }}
      >
        ⚙️ SYSTEM INFO
      </div>

      <div className="flex justify-between">
        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Current Time:</span>
        <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{currentTime}</span>
      </div>
    </div>
  );
};

export default SystemInfoSection;
