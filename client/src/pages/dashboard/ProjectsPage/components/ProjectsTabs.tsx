import React from 'react';
import { FaUsers } from 'react-icons/fa';
import { Project } from '../../../../types/projectManagement';

/**
 * Projects Tabs Props
 */
export interface ProjectsTabsProps {
  activeTab: 'projects' | 'members';
  selectedProject: Project | null;
  onTabChange: (tab: 'projects' | 'members') => void;
}

/**
 * Projects Tabs Component
 * Displays navigation tabs for projects and members
 */
export const ProjectsTabs: React.FC<ProjectsTabsProps> = ({
  activeTab,
  selectedProject,
  onTabChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm theme-border mb-6">
      <nav className="flex">
        <button
          onClick={() => onTabChange('projects')}
          className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'projects'
            ? 'theme-tab-active-bg theme-tab-active-text theme-tab-active-border border-r'
            : 'theme-tab-inactive-text theme-tab-inactive-hover-bg theme-tab-inactive-border border-r'
            }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>Projects</span>
          </div>
        </button>
        <button
          onClick={() => onTabChange('members')}
          className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-all duration-200 ${activeTab === 'members'
            ? 'theme-tab-active-bg theme-tab-active-text'
            : 'theme-tab-inactive-text theme-tab-inactive-hover-bg'
            }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <FaUsers className="w-4 h-4" />
            <span>Members</span>
            {selectedProject && (
              <span className="theme-tab-active-bg theme-tab-active-text px-2 py-1 rounded-full text-xs">
                {selectedProject.name}
              </span>
            )}
          </div>
        </button>
      </nav>
    </div>
  );
};

