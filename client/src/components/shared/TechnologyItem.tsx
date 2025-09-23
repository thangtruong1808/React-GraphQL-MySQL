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
  color: string;
}

/**
 * TechnologyItem Component
 * Renders a single technology card with icon and information
 */
const TechnologyItem: React.FC<TechnologyItemProps> = ({
  name,
  description,
  color
}) => {
  return (
    <div className="bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 text-center hover:shadow-indigo-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
      {/* Technology icon with gradient background */}
      <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
        <div className="text-white">
          <TechnologyIcons name={name} className="w-8 h-8" />
        </div>
      </div>
      {/* Technology name and description */}
      <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default TechnologyItem;
