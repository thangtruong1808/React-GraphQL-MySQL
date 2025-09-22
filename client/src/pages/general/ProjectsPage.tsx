import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routingConstants';

/**
 * Projects Page Component
 * Displays all projects for public exploration
 * Allows users to browse projects without authentication
 */

// Project interface based on database schema
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED';
  taskCount: number;
  memberCount: number;
  createdAt: string;
  owner: {
    firstName: string;
    lastName: string;
  };
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  // Load all projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Simulate API call - replace with actual GraphQL queries
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate all 50 projects with realistic data
        const projectNames = [
          'E-commerce Platform Redesign', 'Mobile Banking App', 'AI Chatbot Integration', 'Cloud Migration Project',
          'Data Analytics Dashboard', 'IoT Device Management', 'Blockchain Payment System', 'Machine Learning Pipeline',
          'Real-time Collaboration Tool', 'API Gateway Development', 'Microservices Architecture', 'DevOps Automation',
          'Customer Relationship Management', 'Inventory Management System', 'Social Media Analytics', 'Video Streaming Platform',
          'E-learning Platform', 'Healthcare Management System', 'Financial Trading Platform', 'Supply Chain Optimization',
          'Smart City Infrastructure', 'Cybersecurity Framework', 'Digital Marketing Suite', 'Project Management Tool',
          'Human Resources Portal', 'Quality Assurance Platform', 'Performance Monitoring System', 'Content Management System',
          'Business Intelligence Suite', 'Workflow Automation Engine', 'Document Management System', 'Customer Support Portal',
          'Sales Pipeline Tracker', 'Asset Management Platform', 'Risk Assessment Tool', 'Compliance Monitoring System',
          'Event Management Platform', 'Travel Booking System', 'Food Delivery App', 'Fitness Tracking Application',
          'Weather Monitoring System', 'Traffic Management Platform', 'Energy Management System', 'Waste Management Tracker',
          'Educational Assessment Tool', 'Research Collaboration Platform', 'Scientific Data Analysis', 'Environmental Monitoring',
          'Agricultural Management System', 'Manufacturing Process Control'
        ];

        const projectsData: Project[] = [];
        for (let i = 0; i < 50; i++) {
          const statuses: ('PLANNING' | 'IN_PROGRESS' | 'COMPLETED')[] = ['PLANNING', 'IN_PROGRESS', 'COMPLETED'];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const taskCount = Math.floor(Math.random() * 50) + 10;
          const memberCount = Math.floor(Math.random() * 8) + 2;

          projectsData.push({
            id: (i + 1).toString(),
            name: projectNames[i] || `Project ${i + 1}`,
            description: `Comprehensive ${projectNames[i]?.toLowerCase() || 'project'} solution for modern business needs. This project demonstrates our expertise in delivering scalable and efficient solutions.`,
            status,
            taskCount,
            memberCount,
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            owner: {
              firstName: ['John', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa', 'Alex', 'Maria'][Math.floor(Math.random() * 8)],
              lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][Math.floor(Math.random() * 8)]
            }
          });
        }

        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Get status color for projects
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-purple-100 text-purple-800';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
      case 'PLANNING': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter projects based on selected status
  const filteredProjects = projects.filter(project =>
    filter === 'ALL' || project.status === filter
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
      <div className="w-full min-h-screen mt-10">
        {/* Header Section */}
        <div className=" py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Explore Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Projects
                </span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
                Discover {projects.length} innovative projects managed through TaskFlow. From cutting-edge technology solutions to business-critical applications.
              </p>

              {/* Project Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-purple-600">{projects.length}</div>
                  <div className="text-sm text-gray-600">Total Projects</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-orange-600">{projects.filter(p => p.status === 'IN_PROGRESS').length}</div>
                  <div className="text-sm text-gray-600">Active</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-indigo-600">{projects.filter(p => p.status === 'PLANNING').length}</div>
                  <div className="text-sm text-gray-600">Planning</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-green-600">{projects.filter(p => p.status === 'COMPLETED').length}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Filter Section */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { key: 'ALL', label: 'All Projects', count: projects.length },
                  { key: 'PLANNING', label: 'Planning', count: projects.filter(p => p.status === 'PLANNING').length },
                  { key: 'IN_PROGRESS', label: 'In Progress', count: projects.filter(p => p.status === 'IN_PROGRESS').length },
                  { key: 'COMPLETED', label: 'Completed', count: projects.filter(p => p.status === 'COMPLETED').length },
                ].map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${filter === filterOption.key
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-gray-200'
                      }`}
                  >
                    {filterOption.label} ({filterOption.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">{project.name}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Tasks:</span>
                        <span className="font-medium text-gray-900">{project.taskCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Team Members:</span>
                        <span className="font-medium text-gray-900">{project.memberCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Project Owner:</span>
                        <span className="font-medium text-gray-900">{project.owner.firstName} {project.owner.lastName}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Created:</span>
                        <span className="font-medium text-gray-900">{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <Link
                        to={ROUTE_PATHS.LOGIN}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-lg transition-all duration-300"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Start Your Project?
                </h2>
                <p className="text-gray-700 mb-6">
                  Join our community and start managing your projects with TaskFlow today.
                </p>
                <Link
                  to={ROUTE_PATHS.LOGIN}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
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

export default ProjectsPage;
