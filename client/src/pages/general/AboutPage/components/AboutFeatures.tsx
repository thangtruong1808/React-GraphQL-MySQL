import React from 'react';

/**
 * About Features Component
 * Displays the features section with 6 feature cards
 */
export const AboutFeatures: React.FC = () => {
  const features = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      ),
      gradient: 'from-purple-500 to-pink-600',
      hoverColor: 'hover:shadow-purple-500/50',
      title: 'Real-time Analytics',
      description: 'Get instant insights into project progress, team performance, and resource utilization with our comprehensive analytics dashboard.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      ),
      gradient: 'from-indigo-500 to-purple-600',
      hoverColor: 'hover:shadow-indigo-500/50',
      title: 'Team Collaboration',
      description: 'Foster seamless collaboration with built-in communication tools, file sharing, and real-time updates that keep everyone in sync.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
      gradient: 'from-pink-500 to-orange-600',
      hoverColor: 'hover:shadow-pink-500/50',
      title: 'Lightning Fast',
      description: 'Experience blazing-fast performance with our optimized architecture and real-time synchronization across all devices.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      ),
      gradient: 'from-green-500 to-teal-600',
      hoverColor: 'hover:shadow-green-500/50',
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security, regular backups, and 99.9% uptime guarantee.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      ),
      gradient: 'from-orange-500 to-red-600',
      hoverColor: 'hover:shadow-orange-500/50',
      title: 'User-Friendly',
      description: 'Intuitive design and easy-to-use interface ensure your team can get started quickly without extensive training.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
      ),
      gradient: 'from-cyan-500 to-blue-600',
      hoverColor: 'hover:shadow-cyan-500/50',
      title: 'Scalable Solution',
      description: 'From small teams to large enterprises, TaskFlow scales with your organization\'s growing needs and complexity.',
    },
  ];

  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 [data-theme='brand']:bg-gradient-to-br [data-theme='brand']:from-purple-50 [data-theme='brand']:to-pink-50 rounded-2xl shadow-lg dark:shadow-gray-900/20 [data-theme='brand']:shadow-purple-200/20 p-8 border border-gray-200 dark:border-gray-700 [data-theme='brand']:border-purple-200">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TaskFlow?</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our platform combines powerful features with an intuitive interface to deliver exceptional project management experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow ${feature.hoverColor}`}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

