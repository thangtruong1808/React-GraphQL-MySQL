import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routingConstants';

/**
 * Team Page Component
 * Displays all team members for public exploration
 * Allows users to browse team members without authentication
 */

// Team member interface based on database schema
interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'DEVELOPER';
  projectCount: number;
  taskCount: number;
  joinDate: string;
  bio: string;
}

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ADMIN' | 'MANAGER' | 'DEVELOPER'>('ALL');

  // Load all team members on component mount
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        // Simulate API call - replace with actual GraphQL queries
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate team members data
        const firstNames = ['John', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa', 'Alex', 'Maria', 'Chris', 'Anna', 'Tom', 'Kate', 'Ben', 'Sophie', 'Luke', 'Rachel', 'James', 'Emily', 'Daniel', 'Olivia', 'William', 'Ava', 'Michael', 'Isabella', 'Matthew', 'Mia', 'Christopher', 'Charlotte', 'Andrew', 'Amelia'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez'];
        const roles: ('ADMIN' | 'MANAGER' | 'DEVELOPER')[] = ['ADMIN', 'MANAGER', 'DEVELOPER'];
        const bios = [
          'Passionate about creating innovative solutions and leading cross-functional teams.',
          'Experienced in full-stack development with a focus on scalable architecture.',
          'Strategic thinker with expertise in project management and team leadership.',
          'Creative problem solver with a strong background in user experience design.',
          'Technical expert specializing in cloud infrastructure and DevOps practices.',
          'Data-driven professional with extensive experience in analytics and reporting.',
          'Collaborative leader with a track record of delivering complex projects on time.',
          'Innovation-focused developer with expertise in emerging technologies.',
          'Results-oriented manager with strong communication and organizational skills.',
          'Detail-oriented professional with a passion for quality and continuous improvement.'
        ];

        const members: TeamMember[] = [];
        for (let i = 0; i < 89; i++) {
          const role = roles[Math.floor(Math.random() * roles.length)];
          const projectCount = Math.floor(Math.random() * 10) + 1;
          const taskCount = Math.floor(Math.random() * 50) + 5;

          members.push({
            id: (i + 1).toString(),
            firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
            lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
            role,
            projectCount,
            taskCount,
            joinDate: new Date(Date.now() - Math.random() * 1000 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            bio: bios[Math.floor(Math.random() * bios.length)]
          });
        }

        setTeamMembers(members);
      } catch (error) {
        console.error('Failed to load team members:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamMembers();
  }, []);

  // Get role color for team members
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'MANAGER': return 'bg-blue-100 text-blue-800';
      case 'DEVELOPER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter team members based on selected role
  const filteredMembers = teamMembers.filter(member =>
    filter === 'ALL' || member.role === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full public-dashboard bg-gray-50">
      <div className="min-h-screen bg-gray-50 mt-10">
        {/* Header Section */}
        <div className=" py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Meet Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Team
                </span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
                Discover the talented individuals behind TaskFlow. Our diverse team of {teamMembers.length} professionals brings together expertise in technology, project management, and innovation.
              </p>

              {/* Team Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="bg-gray-100 rounded-xl p-6 shadow-md border border-gray-300 hover:shadow-xl hover:shadow-indigo-500/50 transition-shadow duration-500">
                  <div className="text-2xl font-bold text-indigo-600">{teamMembers.length}</div>
                  <div className="text-sm text-gray-600">Team Members</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-6 shadow-md border border-gray-300 hover:shadow-xl hover:shadow-indigo-500/50 transition-shadow duration-500">
                  <div className="text-2xl font-bold text-red-600">{teamMembers.filter(m => m.role === 'ADMIN').length}</div>
                  <div className="text-sm text-gray-600">Administrators</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-6 shadow-md border border-gray-300 hover:shadow-xl hover:shadow-indigo-500/50 transition-shadow duration-500">
                  <div className="text-2xl font-bold text-blue-600">{teamMembers.filter(m => m.role === 'MANAGER').length}</div>
                  <div className="text-sm text-gray-600">Managers</div>
                </div>
                <div className="bg-gray-100 rounded-xl p-6 shadow-md border border-gray-300 hover:shadow-xl hover:shadow-indigo-500/50 transition-shadow duration-500">
                  <div className="text-2xl font-bold text-green-600">{teamMembers.filter(m => m.role === 'DEVELOPER').length}</div>
                  <div className="text-sm text-gray-600">Developers</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Filter Section */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { key: 'ALL', label: 'All Members', count: teamMembers.length },
                  { key: 'ADMIN', label: 'Administrators', count: teamMembers.filter(m => m.role === 'ADMIN').length },
                  { key: 'MANAGER', label: 'Managers', count: teamMembers.filter(m => m.role === 'MANAGER').length },
                  { key: 'DEVELOPER', label: 'Developers', count: teamMembers.filter(m => m.role === 'DEVELOPER').length },
                ].map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key as any)}
                    className={`px-8 py-2 rounded-lg text-sm font-medium transition-all duration-500 ${filter === filterOption.key
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 hover:border-indigo-500 transition-all duration-500 transform hover:scale-105 hover:shadow-lg'
                      }`}
                  >
                    {filterOption.label} ({filterOption.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 hover:shadow-indigo-500/50">
                  <div className="p-6 text-center">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">
                        {member.firstName[0]}{member.lastName[0]}
                      </span>
                    </div>

                    {/* Name and Role */}
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      {member.firstName} {member.lastName}
                    </h3>

                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)} mb-4`}>
                      {member.role}
                    </span>

                    {/* Bio */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>

                    {/* Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Projects:</span>
                        <span className="font-medium text-gray-900">{member.projectCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Tasks:</span>
                        <span className="font-medium text-gray-900">{member.taskCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Joined:</span>
                        <span className="font-medium text-gray-900">{new Date(member.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={ROUTE_PATHS.LOGIN}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-300"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Connect
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <div className="rounded-2xl p-8 border border-gray-200 bg-white shadow-lg border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Join Our Team
                </h2>
                <p className="text-gray-700 mb-6">
                  Ready to be part of our innovative team? Start your journey with TaskFlow today.
                </p>
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Get Started with TaskFlow
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
