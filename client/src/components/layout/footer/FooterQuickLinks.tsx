import React from 'react';
import { ROUTE_PATHS } from '../../../constants/routingConstants';
import FooterLink from './FooterLink';

/**
 * Footer Quick Links Component
 * Description: Displays navigation links for quick access to main pages with improved spacing and visual hierarchy
 * Date: 2024-12-19
 * Author: thangtruong
 */
const FooterQuickLinks: React.FC = () => {
  return (
    <div>
      {/* Section Header */}
      <h4 className="text-lg font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
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

