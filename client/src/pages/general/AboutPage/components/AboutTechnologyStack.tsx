import React from 'react';
import { TechnologyItem } from '../../../../components/shared';
import { TECHNOLOGIES } from '../../../../constants/technologies';

/**
 * About Technology Stack Component
 * Displays the technology stack section
 */
export const AboutTechnologyStack: React.FC = () => {
  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 [data-theme='brand']:bg-gradient-to-br [data-theme='brand']:from-purple-50 [data-theme='brand']:to-pink-50 rounded-2xl shadow-lg dark:shadow-gray-900/20 [data-theme='brand']:shadow-purple-200/20 p-8 border border-gray-200 dark:border-gray-700 [data-theme='brand']:border-purple-200">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Built with Modern Technology</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            TaskFlow leverages cutting-edge technologies to deliver a robust, scalable, and secure platform.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TECHNOLOGIES.map((tech, index) => (
            <TechnologyItem
              key={index}
              name={tech.name}
              description={tech.description}
              gradientStyle={tech.gradientStyle}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

