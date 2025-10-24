import React from 'react';

/**
 * Detail Modal Component
 * Displays comprehensive information for members, projects, or tasks
 * Follows React best practices with proper TypeScript interfaces
 */

// Type definitions for different data types
interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  ownedProjects?: Project[];
  assignedTasks?: Task[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  tasks?: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  project?: Project;
  assignedUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    description: string;
    title?: string;
    type?: string;
    category?: string;
  }>;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Member | Project | Task | null;
  type: 'member' | 'project' | 'task';
}

/**
 * DetailModal Component
 * Renders detailed information in a modal overlay
 */
const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, data, type }) => {
  // Don't render if modal is closed or no data
  if (!isOpen || !data) return null;

  // Handle modal close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key press
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // Add event listener for escape key
      document.addEventListener('keydown', handleEscape);
    }

    // Cleanup when unmounting
    return () => {
      // Cleanup event listener
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Render member details
  const renderMemberDetails = (member: Member) => (
    <div className="space-y-6">
      {/* Member Header */}
      <div className="flex items-center space-x-4 pb-6 border-b border-gray-200">
        <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-2xl">
            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {member.firstName} {member.lastName}
          </h2>
          <p className="text-lg text-gray-600">{member.email}</p>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize mt-2">
            {member.role.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Member Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Basic Information
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <p className="text-gray-900 font-medium">{member.firstName} {member.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <p className="text-gray-900 font-medium">{member.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
              <p className="text-gray-900 font-medium capitalize">{member.role.toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Activity Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{member.ownedProjects?.length || 0}</p>
              <p className="text-sm text-blue-600">Owned Projects</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{member.assignedTasks?.length || 0}</p>
              <p className="text-sm text-orange-600">Assigned Tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Projects */}
      {member.ownedProjects && member.ownedProjects.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Owned Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {member.ownedProjects.map((project) => (
              <div key={project.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900">{project.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                  {project.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render project details
  const renderProjectDetails = (project: Project) => (
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

  // Render task details
  const renderTaskDetails = (task: Task) => (
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

  // Determine which render function to use
  const renderContent = () => {
    switch (type) {
      case 'member':
        return renderMemberDetails(data as Member);
      case 'project':
        return renderProjectDetails(data as Project);
      case 'task':
        return renderTaskDetails(data as Task);
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-900 capitalize">
            {type} Details
          </h1>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
