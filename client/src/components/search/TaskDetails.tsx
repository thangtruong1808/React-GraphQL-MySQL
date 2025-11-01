import React from 'react';
import { Task } from './detailModalTypes';

interface TaskDetailsProps {
  task: Task;
}

/**
 * Task Details Component
 * Displays comprehensive task information
 */
const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  return (
    <div className="space-y-6">
      {/* Task Header */}
      <div className="pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
        <p className="text-lg text-gray-600 mb-4">{task.description}</p>
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
            {task.status.replace('_', ' ')}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {task.priority} Priority
          </span>
        </div>
      </div>

      {/* Task Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Task Title</label>
              <p className="text-gray-900 font-medium">{task.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
              <p className="text-gray-900">{task.description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <p className="text-gray-900 capitalize">{task.status.replace('_', ' ')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Priority</label>
              <p className="text-gray-900 capitalize">{task.priority}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Related Information</h3>
          <div className="space-y-4">
            {task.project && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Project</h4>
                <p className="text-green-700 font-medium">{task.project.name}</p>
                <p className="text-sm text-green-600 mt-1">{task.project.description}</p>
              </div>
            )}
            {task.assignedUser && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Assigned To</h4>
                <p className="text-blue-700 font-medium">
                  {task.assignedUser.firstName} {task.assignedUser.lastName}
                </p>
                <p className="text-sm text-blue-600 mt-1">{task.assignedUser.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;

