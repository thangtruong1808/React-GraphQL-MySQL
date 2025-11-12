import React from 'react';

/**
 * Public Stats Interface
 */
export interface PublicStats {
  totalProjects?: number;
  totalUsers?: number;
  totalTasks?: number;
  completedTasks?: number;
  activeProjects?: number;
  inProgressTasks?: number;
  todoTasks?: number;
  completedProjects?: number;
}

/**
 * About Statistics Props
 */
export interface AboutStatisticsProps {
  stats: PublicStats | null | undefined;
}

/**
 * Description: Displays TaskFlow public statistics in themed summary cards.
 * Data created: None; relies on provided statistics props.
 * Author: thangtruong
 */
export const AboutStatistics: React.FC<AboutStatisticsProps> = ({ stats }) => {
  const statistics = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      ),
      iconColor: 'var(--icon-projects-fg)',
      accentColor: 'var(--badge-secondary-text)',
      value: stats?.totalProjects || 0,
      label: 'Total Projects',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      ),
      iconColor: 'var(--icon-users-fg)',
      accentColor: 'var(--badge-success-text)',
      value: stats?.totalUsers || 0,
      label: 'Team Members',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      ),
      iconColor: 'var(--icon-tasks-fg)',
      accentColor: 'var(--accent-from)',
      value: stats?.totalTasks || 0,
      label: 'Tasks Managed',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      iconColor: 'var(--badge-success-text)',
      accentColor: 'var(--badge-success-text)',
      value: stats?.completedTasks || 0,
      label: 'Completed Tasks',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
      iconColor: 'var(--icon-projects-fg)',
      accentColor: 'var(--badge-secondary-text)',
      value: stats?.activeProjects || 0,
      label: 'Active Projects',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      iconColor: 'var(--accent-to)',
      accentColor: 'var(--accent-to)',
      value: stats?.inProgressTasks || 0,
      label: 'In Progress Tasks',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      ),
      iconColor: 'var(--icon-tasks-fg)',
      accentColor: 'var(--badge-primary-text)',
      value: stats?.todoTasks || 0,
      label: 'Todo Tasks',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      iconColor: 'var(--badge-primary-text)',
      accentColor: 'var(--badge-primary-text)',
      value: stats?.completedProjects || 0,
      label: 'Completed Projects',
    },
  ];

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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>TaskFlow by the Numbers</h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Our platform is trusted by teams worldwide to deliver exceptional results.
          </p>
        </div>

        {/* First Row - Main Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {statistics.slice(0, 4).map((stat, index) => (
            <div
              key={index}
              className="text-center rounded-xl shadow-lg p-6 border theme-border transition-transform duration-300"
              style={{
                backgroundColor: 'var(--card-bg)',
                backgroundImage: 'var(--card-surface-overlay)',
                borderColor: 'var(--border-color)',
                boxShadow: '0 20px 40px var(--shadow-color)'
              }}
              onMouseEnter={(event) => {
                const target = event.currentTarget as HTMLDivElement;
                target.style.backgroundColor = 'var(--card-hover-bg)';
                target.style.boxShadow = '0 24px 48px var(--shadow-color)';
                target.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(event) => {
                const target = event.currentTarget as HTMLDivElement;
                target.style.backgroundColor = 'var(--card-bg)';
                target.style.boxShadow = '0 20px 40px var(--shadow-color)';
                target.style.transform = 'translateY(0)';
              }}
            >
              <div className="flex items-center justify-center mb-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: stat.iconColor }}>
                  {stat.icon}
                </svg>
              </div>
              <div className="text-4xl font-bold mb-2" style={{ color: stat.accentColor }}>{stat.value}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Second Row - Additional Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.slice(4).map((stat, index) => (
            <div
              key={index}
              className="text-center rounded-xl shadow-lg p-6 border theme-border transition-transform duration-300"
              style={{
                backgroundColor: 'var(--card-bg)',
                backgroundImage: 'var(--card-surface-overlay)',
                borderColor: 'var(--border-color)',
                boxShadow: '0 20px 40px var(--shadow-color)'
              }}
              onMouseEnter={(event) => {
                const target = event.currentTarget as HTMLDivElement;
                target.style.backgroundColor = 'var(--card-hover-bg)';
                target.style.boxShadow = '0 24px 48px var(--shadow-color)';
                target.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(event) => {
                const target = event.currentTarget as HTMLDivElement;
                target.style.backgroundColor = 'var(--card-bg)';
                target.style.boxShadow = '0 20px 40px var(--shadow-color)';
                target.style.transform = 'translateY(0)';
              }}
            >
              <div className="flex items-center justify-center mb-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: stat.iconColor }}>
                  {stat.icon}
                </svg>
              </div>
              <div className="text-4xl font-bold mb-2" style={{ color: stat.accentColor }}>{stat.value}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

