import React from 'react';
import { Project } from './detailModalTypes';

interface ProjectDetailsProps {
  project: Project;
}

/**
 * Project Details Component
 * Displays comprehensive project information
 */
const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h2>
        <p className="text-lg text-gray-600 mb-4">{project.description}</p>
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {project.status.replace('_', ' ')}
          </span>
          {project.owner && (
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm text-gray-600">
                Owner: {project.owner.firstName} {project.owner.lastName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Project Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Project Name</label>
              <p className="text-gray-900 font-medium">{project.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
              <p className="text-gray-900">{project.description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <p className="text-gray-900 capitalize">{project.status.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{project.tasks?.length || 0}</p>
            <p className="text-sm text-green-600">Total Tasks</p>
          </div>
        </div>
      </div>

      {/* Project Tasks */}
      {project.tasks && project.tasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Tasks</h3>
          <div className="space-y-3">
            {project.tasks.map((task) => (
              <div key={task.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>

                    {/* Tags Display */}
                    {task.tags && task.tags.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap items-center gap-1">
                          {task.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              <span className="font-semibold">{tag.name}</span>
                              {tag.description && (
                                <span className="ml-1 text-green-600">- {tag.description}</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;

