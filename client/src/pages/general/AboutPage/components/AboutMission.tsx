import React from 'react';

/**
 * Description: Highlights TaskFlow’s mission with themed layout for improved readability.
 * Data created: None; static messaging only.
 * Author: thangtruong
 */
export const AboutMission: React.FC = () => {
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
        <div className="text-center p-8">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Our Mission</h2>
          <p className="text-lg max-w-4xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            To revolutionize project management by providing teams with powerful, intuitive tools that streamline workflows,
            enhance collaboration, and drive successful project outcomes. We believe that great projects start with great project management.
          </p>
        </div>
      </div>
    </div>
  );
};

