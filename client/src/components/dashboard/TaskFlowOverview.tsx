import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SimpleChart } from '../charts';
import { AuthenticatedDashboardSkeleton } from '../ui';

/**
 * TaskFlow Project Management Overview Component
 * Displays comprehensive project statistics, charts, and key metrics
 * Designed to attract users with engaging visualizations and insights
 */

// Mock data structure based on database schema
interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  totalUsers: number;
  recentActivity: number;
}

interface ProjectData {
  id: string;
  name: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED';
  taskCount: number;
  memberCount: number;
  progress: number;
}

interface TaskData {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
}

const TaskFlowOverview: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    totalUsers: 0,
    recentActivity: 0,
  });
  const [recentProjects, setRecentProjects] = useState<ProjectData[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simulate API call - replace with actual GraphQL queries
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data based on database schema
        setStats({
          totalProjects: 12,
          activeProjects: 8,
          completedProjects: 4,
          totalTasks: 156,
          completedTasks: 89,
          inProgressTasks: 45,
          totalUsers: 24,
          recentActivity: 18,
        });

        setRecentProjects([
          { id: '1', name: 'E-commerce Platform', status: 'IN_PROGRESS', taskCount: 23, memberCount: 5, progress: 75 },
          { id: '2', name: 'Mobile App Redesign', status: 'PLANNING', taskCount: 15, memberCount: 3, progress: 25 },
          { id: '3', name: 'API Integration', status: 'IN_PROGRESS', taskCount: 8, memberCount: 4, progress: 60 },
          { id: '4', name: 'Database Migration', status: 'COMPLETED', taskCount: 12, memberCount: 2, progress: 100 },
        ]);

        setUpcomingTasks([
          { id: '1', title: 'Implement user authentication', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2024-01-15' },
          { id: '2', title: 'Design mobile UI components', status: 'TODO', priority: 'MEDIUM', dueDate: '2024-01-18' },
          { id: '3', title: 'Setup CI/CD pipeline', status: 'TODO', priority: 'HIGH', dueDate: '2024-01-20' },
          { id: '4', title: 'Write API documentation', status: 'IN_PROGRESS', priority: 'LOW', dueDate: '2024-01-22' },
        ]);
      } catch (error) {
        // Handle error silently - could be displayed via error context in future
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Get status color for projects
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'PLANNING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color for tasks
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <AuthenticatedDashboardSkeleton />;
  }

  return (
    <div className="w-full h-full bg-white dashboard-content">
      {/* Header Section - True Edge-to-Edge */}
      <div className="bg-white border-b border-gray-200 w-full">
        <div className="px-8 py-8 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your projects today
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
                Create Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview - True Edge-to-Edge */}
      <div className="bg-white border-b border-gray-200 w-full">
        <div className="px-8 py-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6 mb-8">
            {/* Total Projects */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
              </div>
            </div>

            {/* Active Projects */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
                </div>
              </div>
            </div>

            {/* Total Tasks */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
                </div>
              </div>
            </div>

            {/* In Progress Tasks */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgressTasks}</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recentActivity}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Recent Activity - True Edge-to-Edge */}
          <div className="bg-white w-full">
            <div className="px-8 py-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mb-8">
                {/* Project Status Chart */}
                <SimpleChart
                  title="Project Status Distribution"
                  type="pie"
                  data={[
                    { label: 'Completed', value: stats.completedProjects, color: '#10b981' },
                    { label: 'In Progress', value: stats.activeProjects, color: '#3b82f6' },
                    { label: 'Planning', value: stats.totalProjects - stats.activeProjects - stats.completedProjects, color: '#f59e0b' },
                  ]}
                  className="shadow-sm border border-gray-100"
                />

                {/* Task Progress Chart */}
                <SimpleChart
                  title="Task Progress Overview"
                  type="bar"
                  data={[
                    { label: 'Completed', value: stats.completedTasks, color: '#10b981' },
                    { label: 'In Progress', value: stats.inProgressTasks, color: '#3b82f6' },
                    { label: 'Todo', value: stats.totalTasks - stats.completedTasks - stats.inProgressTasks, color: '#6b7280' },
                  ]}
                  maxValue={stats.totalTasks}
                  className="shadow-sm border border-gray-100"
                />

                {/* Team Productivity Chart */}
                <SimpleChart
                  title="Team Productivity"
                  type="pie"
                  data={[
                    { label: 'High Performance', value: Math.floor(stats.totalUsers * 0.6), color: '#10b981' },
                    { label: 'Good Performance', value: Math.floor(stats.totalUsers * 0.3), color: '#3b82f6' },
                    { label: 'Needs Improvement', value: Math.floor(stats.totalUsers * 0.1), color: '#f59e0b' },
                  ]}
                  className="shadow-sm border border-gray-100"
                />

                {/* Activity Trend Chart */}
                <SimpleChart
                  title="Activity Trend"
                  type="bar"
                  data={[
                    { label: 'Week 1', value: 12, color: '#8b5cf6' },
                    { label: 'Week 2', value: 18, color: '#8b5cf6' },
                    { label: 'Week 3', value: 15, color: '#8b5cf6' },
                    { label: 'Week 4', value: stats.recentActivity, color: '#8b5cf6' },
                  ]}
                  className="shadow-sm border border-gray-100"
                />
              </div>

              {/* Recent Projects and Upcoming Tasks */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {/* Recent Projects */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentProjects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{project.name}</h4>
                            <p className="text-sm text-gray-600">{project.taskCount} tasks • {project.memberCount} members</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                              {project.status.replace('_', ' ')}
                            </span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-emerald-600 h-2 rounded-full"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Tasks */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {upcomingTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <p className="text-sm text-gray-600">
                              {task.dueDate && `Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create New Project
                      </button>
                      <button className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Add New Task
                      </button>
                      <button className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        Invite Team Member
                      </button>
                    </div>
                  </div>
                </div>

                {/* Performance Insights */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Performance Insights</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-sm font-medium text-gray-900">Project Completion Rate</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">87%</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-sm font-medium text-gray-900">Team Productivity</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">92%</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-sm font-medium text-gray-900">Task Efficiency</span>
                        </div>
                        <span className="text-lg font-bold text-purple-600">78%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFlowOverview;
