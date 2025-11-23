import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../../constants/routingConstants';

/**
 * Footer API Guide Component
 * Description: Link to API testing guide page
 * Date: 2024-12-19
 * Author: thangtruong
 */
const FooterApiGuide: React.FC = () => {
  return (
    <div>
      {/* Section Header */}
      <h4 className="text-lg font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
        API Testing Guide
      </h4>

      {/* Link to API Guide Page */}
      <Link
        to={ROUTE_PATHS.API_GUIDE}
        className="text-sm transition-all duration-300 py-2 px-4 block rounded-md hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-block"
        style={{
          color: 'var(--text-secondary)',
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.backgroundColor = 'var(--footer-resource-hover-bg, rgba(0,0,0,0.05))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        View API Guide →
      </Link>

      {/* Brief Description */}
      <p className="text-xs leading-relaxed mt-3 max-w-xs" style={{ color: 'var(--text-muted)' }}>
        Step-by-step guide for testing comment API endpoints in real-time
      </p>
    </div>
  );
};

export default FooterApiGuide;

