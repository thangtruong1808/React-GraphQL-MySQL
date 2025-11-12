import React from 'react';

/**
 * Description: Presents the about page hero banner with themed typography and overview messaging.
 * Data created: None; renders static content only.
 * Author: thangtruong
 */
export const AboutHero: React.FC = () => {
  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div
        className="max-w-7xl mx-auto rounded-2xl shadow-lg p-8 border theme-border"
        style={{
          backgroundColor: 'var(--card-bg)',
          backgroundImage: 'var(--card-surface-overlay)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 28px 48px var(--shadow-color)'
        }}
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            About{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, var(--accent-from), var(--accent-to))' }}
            >
              TaskFlow
            </span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Empowering teams to manage projects efficiently with cutting-edge technology and intuitive design.
          </p>
        </div>
      </div>
    </div>
  );
};

