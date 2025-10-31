// @ts-nocheck
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FOOTER_STYLES } from '../../constants/footer';
import DocumentationModal from './footer/DocumentationModal';
import HelpCenterModal from './footer/HelpCenterModal';
import ApiReferenceModal from './footer/ApiReferenceModal';
import SystemStatusModal from './footer/SystemStatusModal';
import FooterCompanyInfo from './footer/FooterCompanyInfo';
import FooterQuickLinks from './footer/FooterQuickLinks';
import FooterResources from './footer/FooterResources';
import FooterAccountSection from './footer/FooterAccountSection';
import FooterBottomBar from './footer/FooterBottomBar';

/**
 * Footer Component
 * Professional and modern footer with company information, navigation links, and user context
 * 
 * CALLED BY: App.tsx for layout integration
 * SCENARIOS: All application scenarios - displays on all pages
 */
const Footer: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // Modal state management
  const [isDocumentationModalOpen, setIsDocumentationModalOpen] = useState(false);
  const [isHelpCenterModalOpen, setIsHelpCenterModalOpen] = useState(false);
  const [isApiReferenceModalOpen, setIsApiReferenceModalOpen] = useState(false);
  const [isSystemStatusModalOpen, setIsSystemStatusModalOpen] = useState(false);

  /**
   * Handle documentation modal open
   * Opens documentation modal with comprehensive information
   */
  const handleDocumentationClick = () => {
    setIsDocumentationModalOpen(true);
  };

  /**
   * Handle help center modal open
   * Opens help center modal with support resources
   */
  const handleHelpCenterClick = () => {
    setIsHelpCenterModalOpen(true);
  };

  /**
   * Handle API reference modal open
   * Opens API reference modal with integration guides
   */
  const handleApiReferenceClick = () => {
    setIsApiReferenceModalOpen(true);
  };

  /**
   * Handle system status modal open
   * Opens system status modal with real-time information
   */
  const handleSystemStatusClick = () => {
    setIsSystemStatusModalOpen(true);
  };

  return (
    <footer className="theme-footer-bg border-t" style={{
      borderColor: 'var(--border-color)',
      color: 'var(--text-primary)'
    }}>
      {/* Main Footer Content */}
      <div className={`${FOOTER_STYLES.LAYOUT.CONTAINER} py-12`}>
        <div className={FOOTER_STYLES.LAYOUT.GRID}>
          {/* Company Information Section */}
          <FooterCompanyInfo />

          {/* Quick Links Section */}
          <FooterQuickLinks />

          {/* Resources Section */}
          <FooterResources
            onDocumentationClick={handleDocumentationClick}
            onHelpCenterClick={handleHelpCenterClick}
            onApiReferenceClick={handleApiReferenceClick}
            onSystemStatusClick={handleSystemStatusClick}
          />

          {/* User Context Section */}
          <FooterAccountSection isAuthenticated={isAuthenticated} user={user} />
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <FooterBottomBar />

      {/* Resource Modals */}
      <DocumentationModal
        isOpen={isDocumentationModalOpen}
        onClose={() => setIsDocumentationModalOpen(false)}
      />
      <HelpCenterModal
        isOpen={isHelpCenterModalOpen}
        onClose={() => setIsHelpCenterModalOpen(false)}
      />
      <ApiReferenceModal
        isOpen={isApiReferenceModalOpen}
        onClose={() => setIsApiReferenceModalOpen(false)}
      />
      <SystemStatusModal
        isOpen={isSystemStatusModalOpen}
        onClose={() => setIsSystemStatusModalOpen(false)}
      />
    </footer>
  );
};

export default Footer;
