// @ts-nocheck
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FOOTER_STYLES } from '../../constants/footer';
import FooterCompanyInfo from './footer/FooterCompanyInfo';
import FooterQuickLinks from './footer/FooterQuickLinks';
import FooterAccountSection from './footer/FooterAccountSection';
import FooterApiGuide from './footer/FooterApiGuide';
import FooterBottomBar from './footer/FooterBottomBar';

/**
 * Footer Component
 * Description: Professional and modern footer with improved layout, spacing, and visual hierarchy for enhanced user experience
 * Date: 2024-12-19
 * Author: thangtruong
 */
const Footer: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <footer
      className="theme-footer-bg border-t relative"
      style={{
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Main Footer Content */}
      <div className={`${FOOTER_STYLES.LAYOUT.CONTAINER} py-12 lg:py-16`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Information Section */}
          <div className="lg:col-span-1">
            <FooterCompanyInfo />
          </div>

          {/* Quick Links Section */}
          <div className="lg:col-span-1">
            <FooterQuickLinks />
          </div>

          {/* User Context Section */}
          <div className="lg:col-span-1">
            <FooterAccountSection isAuthenticated={isAuthenticated} user={user} />
          </div>

          {/* API Testing Guide Section */}
          <div className="lg:col-span-1">
            <FooterApiGuide />
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <FooterBottomBar />
    </footer>
  );
};

export default Footer;
