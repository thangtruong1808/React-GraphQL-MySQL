import React from 'react';
import TechnologyIcons from './TechnologyIcons';

/**
 * Technology Item Component
 * Displays individual technology with icon, name, and description
 * Follows React best practices with proper TypeScript interfaces
 */

interface TechnologyItemProps {
  name: string;
  description: string;
  gradientStyle: React.CSSProperties;
}

/**
 * TechnologyItem Component
 * Renders a single technology card with icon and information
 */
const TechnologyItem: React.FC<TechnologyItemProps> = ({
  name,
  description,
  gradientStyle
}) => {
  return (
    <div
      className="rounded-xl shadow-lg p-6 text-center hover:shadow-indigo-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      {/* Technology icon with gradient background */}
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto"
        style={gradientStyle}
      >
        <div className="text-white">
          <TechnologyIcons name={name} className="w-8 h-8" />
        </div>
      </div>
      {/* Technology name and description */}
      <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{name}</h3>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  );
};

export default TechnologyItem;
