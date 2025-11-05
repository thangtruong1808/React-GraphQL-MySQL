import React from 'react';

/**
 * About Mission Component
 * Displays the mission statement section
 */
export const AboutMission: React.FC = () => {
  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 [data-theme='brand']:bg-gradient-to-br [data-theme='brand']:from-purple-50 [data-theme='brand']:to-pink-50 rounded-2xl shadow-lg dark:shadow-gray-900/20 [data-theme='brand']:shadow-purple-200/20 p-8 border border-gray-200 dark:border-gray-700 [data-theme='brand']:border-purple-200">
        <div className="text-center p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            To revolutionize project management by providing teams with powerful, intuitive tools that streamline workflows,
            enhance collaboration, and drive successful project outcomes. We believe that great projects start with great project management.
          </p>
        </div>
      </div>
    </div>
  );
};

