import React from 'react';
import { TechnologyItem } from '../../../../components/shared';
import { TECHNOLOGIES } from '../../../../constants/technologies';

/**
 * Description: Showcases TaskFlow’s technology stack using themed surfaces and typography.
 * Data created: None; consumes shared technology constants.
 * Author: thangtruong
 */
export const AboutTechnologyStack: React.FC = () => {
  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-7xl mx-auto rounded-2xl shadow-lg p-8 border theme-border"
        style={{
          backgroundColor: 'var(--card-bg)',
          backgroundImage: 'var(--card-surface-overlay)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 24px 48px var(--shadow-color)'
        }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Built with Modern Technology</h2>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
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

