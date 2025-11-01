import React from 'react';
import { FOOTER_CONTENT, FOOTER_STYLES } from '../../../constants/footer';

/**
 * Footer Bottom Bar Component
 * Displays copyright information and system status indicator
 * Provides footer metadata and system health visibility
 */
const FooterBottomBar: React.FC = () => {
  return (
    <div className="border-t theme-footer-bg" style={{ borderColor: 'var(--border-color)' }}>
      <div className={`${FOOTER_STYLES.LAYOUT.CONTAINER} py-6`}>
        <div className="flex justify-center items-center">
          <div className="flex items-center space-x-4">
            {/* Technologies Info */}
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {FOOTER_CONTENT.SYSTEM_STATUS.TECHNOLOGIES}
            </span>

            {/* System Status Indicator */}
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-indicator-online)' }}></div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {FOOTER_CONTENT.SYSTEM_STATUS.OPERATIONAL}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottomBar;

