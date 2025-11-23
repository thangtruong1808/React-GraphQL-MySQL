import React from 'react';
import { FOOTER_CONTENT, FOOTER_STYLES } from '../../../constants/footer';

/**
 * Footer Bottom Bar Component
 * Description: Displays copyright information and system status indicator with improved layout and alignment
 * Date: 2024-12-19
 * Author: thangtruong
 */
const FooterBottomBar: React.FC = () => {
  return (
    <div className="border-t theme-footer-bg" style={{ borderColor: 'var(--border-color)' }}>
      <div className={`${FOOTER_STYLES.LAYOUT.CONTAINER} py-6`}>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          {/* Technologies Info */}
          <span className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            {FOOTER_CONTENT.SYSTEM_STATUS.TECHNOLOGIES}
          </span>

          {/* Separator */}
          <span className="hidden sm:inline-block w-px h-4" style={{ backgroundColor: 'var(--border-color)' }}></span>

          {/* System Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--status-indicator-online)' }}></div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {FOOTER_CONTENT.SYSTEM_STATUS.OPERATIONAL}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottomBar;

