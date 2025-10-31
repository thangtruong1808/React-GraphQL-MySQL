import React from 'react';
import { ROUTE_PATHS } from '../../../constants/routingConstants';
import FooterLink from './FooterLink';

/**
 * Footer Quick Links Component
 * Displays navigation links for quick access to main pages
 * Provides convenient navigation shortcuts
 */
const FooterQuickLinks: React.FC = () => {
  return (
    <div>
      {/* Section Header */}
      <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Quick Links
      </h4>

      {/* Links List */}
      <ul className="space-y-3">
        <li>
          <FooterLink to={ROUTE_PATHS.HOME}>Home</FooterLink>
        </li>
        <li>
          <FooterLink to={ROUTE_PATHS.PROJECTS}>Projects</FooterLink>
        </li>
        <li>
          <FooterLink to={ROUTE_PATHS.TEAM}>Team</FooterLink>
        </li>
        <li>
          <FooterLink to={ROUTE_PATHS.ABOUT}>About</FooterLink>
        </li>
        <li>
          <FooterLink to={ROUTE_PATHS.SEARCH}>Search</FooterLink>
        </li>
      </ul>
    </div>
  );
};

export default FooterQuickLinks;

