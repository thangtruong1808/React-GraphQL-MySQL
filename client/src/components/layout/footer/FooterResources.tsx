import React from 'react';
import FooterButton from './FooterButton';

/**
 * Footer Resources Props Interface
 */
interface FooterResourcesProps {
  onDocumentationClick: () => void;
  onHelpCenterClick: () => void;
  onApiReferenceClick: () => void;
  onSystemStatusClick: () => void;
}

/**
 * Footer Resources Component
 * Displays resource links with modal triggers
 * Provides access to documentation, help, API reference, and system status
 */
const FooterResources: React.FC<FooterResourcesProps> = ({
  onDocumentationClick,
  onHelpCenterClick,
  onApiReferenceClick,
  onSystemStatusClick
}) => {
  return (
    <div>
      {/* Section Header */}
      <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Resources
      </h4>

      {/* Resource Buttons List */}
      <ul className="space-y-3">
        <li>
          <FooterButton onClick={onDocumentationClick}>
            Documentation
          </FooterButton>
        </li>
        <li>
          <FooterButton onClick={onHelpCenterClick}>
            Help Center
          </FooterButton>
        </li>
        <li>
          <FooterButton onClick={onApiReferenceClick}>
            API Reference
          </FooterButton>
        </li>
        <li>
          <FooterButton onClick={onSystemStatusClick}>
            System Status
          </FooterButton>
        </li>
      </ul>
    </div>
  );
};

export default FooterResources;

