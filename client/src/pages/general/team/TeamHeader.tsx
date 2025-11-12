import React from 'react';
import { TeamStats } from './types';

/**
 * Description: Renders the team page hero with themed typography and key statistics overview.
 * Data created: None; consumes provided team statistics for messaging.
 * Author: thangtruong
 */
interface TeamHeaderProps {
  statsData?: {
    teamStats?: TeamStats;
  };
  statsLoading?: boolean;
  statsError?: any;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ statsData }) => {
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
            Meet Our{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, var(--accent-from), var(--accent-to))' }}
            >
              Team
            </span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Discover the talented individuals behind TaskFlow. Our diverse team of {statsData?.teamStats?.totalMembers || 0} professionals brings together expertise in technology, project management, and innovation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamHeader;
