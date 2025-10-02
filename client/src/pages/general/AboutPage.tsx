import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ROUTE_PATHS } from '../../constants/routingConstants';
import { TechnologyItem } from '../../components/shared';
import { TECHNOLOGIES } from '../../constants/technologies';
import { GET_PUBLIC_STATS } from '../../services/graphql/queries';
import { InlineError, AboutPageSkeleton } from '../../components/ui';

/**
 * About Page Component
 * Provides information about TaskFlow platform
 * Explains features, benefits, and company information
 */

const AboutPage: React.FC = () => {
  // Reset scroll position to top when component mounts for better UX
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // Fetch public statistics from GraphQL API
  const { data, loading, error } = useQuery(GET_PUBLIC_STATS);

  // Handle loading state
  if (loading) {
    return <AboutPageSkeleton />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <InlineError message={error.message} />
        </div>
      </div>
    );
  }

  const stats = data?.publicStats;

  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="min-h-screen bg-gray-50 mt-16">
        {/* Hero Section */}
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  TaskFlow
                </span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Empowering teams to manage projects efficiently with cutting-edge technology and intuitive design.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center p-8 ">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 max-w-4xl mx-auto">
                To revolutionize project management by providing teams with powerful, intuitive tools that streamline workflows,
                enhance collaboration, and drive successful project outcomes. We believe that great projects start with great project management.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-12 ">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TaskFlow?</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Our platform combines powerful features with an intuitive interface to deliver exceptional project management experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow hover:shadow-purple-500/50">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Analytics</h3>
                <p className="text-gray-600">
                  Get instant insights into project progress, team performance, and resource utilization with our comprehensive analytics dashboard.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow hover:shadow-indigo-500/50">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Team Collaboration</h3>
                <p className="text-gray-600">
                  Foster seamless collaboration with built-in communication tools, file sharing, and real-time updates that keep everyone in sync.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow hover:shadow-pink-500/50">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
                <p className="text-gray-600">
                  Experience blazing-fast performance with our optimized architecture and real-time synchronization across all devices.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow hover:shadow-green-500/50">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h3>
                <p className="text-gray-600">
                  Your data is protected with enterprise-grade security, regular backups, and 99.9% uptime guarantee.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow hover:shadow-orange-500/50">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">User-Friendly</h3>
                <p className="text-gray-600">
                  Intuitive design and easy-to-use interface ensure your team can get started quickly without extensive training.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-shadow hover:shadow-cyan-500/50">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Scalable Solution</h3>
                <p className="text-gray-600">
                  From small teams to large enterprises, TaskFlow scales with your organization's growing needs and complexity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">TaskFlow by the Numbers</h2>
              <p className="text-lg text-gray-700">
                Our platform is trusted by teams worldwide to deliver exceptional results.
              </p>
            </div>

            {/* First Row - Main Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div className="text-center bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 hover:shadow-purple-500/20">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-2">{stats?.totalProjects || 0}</div>
                <div className="text-gray-600">Total Projects</div>
              </div>
              <div className="text-center bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 hover:shadow-pink-500/20">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-pink-600 mb-2">{stats?.totalUsers || 0}</div>
                <div className="text-gray-600">Team Members</div>
              </div>
              <div className="text-center bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 hover:shadow-indigo-500/20">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">{stats?.totalTasks || 0}</div>
                <div className="text-gray-600">Tasks Managed</div>
              </div>
              <div className="text-center bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 hover:shadow-orange-500/20">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-orange-600 mb-2">{stats?.completedTasks || 0}</div>
                <div className="text-gray-600">Completed Tasks</div>
              </div>
            </div>

            {/* Second Row - Additional Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 hover:shadow-green-500/20">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">{stats?.activeProjects || 0}</div>
                <div className="text-gray-600">Active Projects</div>
              </div>
              <div className="text-center bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 hover:shadow-blue-500/20">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">{stats?.inProgressTasks || 0}</div>
                <div className="text-gray-600">In Progress Tasks</div>
              </div>
              <div className="text-center bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 hover:shadow-yellow-500/20">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-yellow-600 mb-2">{stats?.todoTasks || 0}</div>
                <div className="text-gray-600">Todo Tasks</div>
              </div>
              <div className="text-center bg-gray-100 rounded-xl shadow-lg p-6 border border-gray-300 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 hover:shadow-teal-500/20">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-teal-600 mb-2">{stats?.completedProjects || 0}</div>
                <div className="text-gray-600">Completed Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
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
                color={tech.color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Project Management?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              Join thousands of teams who have already discovered the power of TaskFlow.
              Start your journey towards more efficient project management today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={ROUTE_PATHS.LOGIN}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Get Started Now
              </Link>
              <Link
                to={ROUTE_PATHS.PROJECTS}
                className="inline-flex items-center px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg border border-purple-200 hover:bg-purple-50 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
