import React from 'react';
import ActivityLogsAudit from '../dashboardAudit/ActivityLogsAudit';
import UsersAudit from '../dashboardAudit/UsersAudit';
import ProjectsAudit from '../dashboardAudit/ProjectsAudit';
import TasksAudit from '../dashboardAudit/TasksAudit';
import CommentsAudit from '../dashboardAudit/CommentsAudit';
import ProjectStatusChart from '../chartsDashboard/ProjectStatusChart';
import TaskStatusBarChart from '../chartsDashboard/TaskStatusBarChart';

/**
 * TaskFlow Overview - Audit Widgets Only
 * Renders five audit components with live data from GraphQL
 */
const TaskFlowOverview: React.FC = () => {
  return (
    <div className="w-full h-full bg-white dashboard-content">
      {/* Page Header - concise contextual info */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 w-full">
        <div className="px-8 py-6 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl shadow-sm">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Dashboard Overview</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Quick audit of latest activity, users, projects, tasks, and comments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Audit Widgets - Live data sections */}
      <div className="bg-white dark:bg-gray-900 w-full">
        <div className="px-8 py-8 w-full space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <ProjectStatusChart
              data={[
                { label: 'Completed', value: 8, color: '#10b981' },
                { label: 'In Progress', value: 12, color: '#3b82f6' },
                { label: 'Planning', value: 5, color: '#f59e0b' }
              ]}
            />
            <TaskStatusBarChart
              data={[
                { label: 'Done', value: 20, className: 'bg-emerald-500' },
                { label: 'In Progress', value: 14, className: 'bg-blue-500' },
                { label: 'Todo', value: 9, className: 'bg-gray-500' }
              ]}
              maxValue={25}
            />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <ActivityLogsAudit />
            <UsersAudit />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <ProjectsAudit />
            <TasksAudit />
            <CommentsAudit />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFlowOverview;


