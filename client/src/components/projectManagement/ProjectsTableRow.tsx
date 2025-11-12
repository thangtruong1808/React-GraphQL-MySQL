import React from 'react';
import { FaEdit, FaTrash, FaUsers, FaFolder, FaAlignLeft, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { Project } from '../../types/projectManagement';
import { formatDate, formatStatus, getStatusBadgeColor } from './projectsUtils';

interface ProjectsTableRowProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onViewMembers?: (project: Project) => void;
}

/** Description: Renders a project row with themed action buttons inside the projects dashboard table; Data created: None (stateless row rendering only); Author: thangtruong */
const ProjectsTableRow: React.FC<ProjectsTableRowProps> = ({
  project,
  onEdit,
  onDelete,
  onViewMembers
}) => {
  // Handle edit click
  const handleEdit = () => {
    onEdit(project);
  };

  // Handle delete click
  const handleDelete = () => {
    onDelete(project);
  };

  // Handle view members click
  const handleViewMembers = () => {
    if (onViewMembers) {
      onViewMembers(project);
    }
  };

  // Handle row hover enter
  const handleMouseEnter = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)';
  };

  // Handle row hover leave
  const handleMouseLeave = (e: React.MouseEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.backgroundColor = 'var(--table-row-bg)';
  };

  return (
    <tr
      key={project.id}
      className="transition-colors"
      style={{ backgroundColor: 'var(--table-row-bg)', borderBottomColor: 'var(--border-color)', borderBottomWidth: 1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <td className="px-4 py-4 whitespace-nowrap text-sm text-left hidden lg:table-cell" style={{ color: 'var(--table-text-primary)' }}>{project.id}</td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-left" style={{ color: 'var(--table-text-primary)' }}>
        <div className="max-w-xs truncate flex items-center space-x-2" title={project.name}>
          <FaFolder className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          {onViewMembers ? (
            <button
              onClick={handleViewMembers}
              className="text-left focus:outline-none focus:underline transition-colors"
              style={{ color: 'var(--accent-from)' }}
            >
              {project.name}
            </button>
          ) : (
            <span>{project.name}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-left hidden md:table-cell" style={{ color: 'var(--table-text-secondary)' }}>
        <div className="max-w-xs truncate flex items-center space-x-2" title={project.description}>
          <FaAlignLeft className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{project.description || 'No description'}</span>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-left">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={getStatusBadgeColor(project.status)}>
          {formatStatus(project.status)}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-left hidden sm:table-cell" style={{ color: 'var(--table-text-primary)' }}>
        <div className="flex items-center space-x-2">
          <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{project.owner ? `${project.owner.firstName} ${project.owner.lastName}` : 'No owner'}</span>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-left hidden xs:table-cell" style={{ color: 'var(--table-text-secondary)' }}>
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(project.createdAt)}</span>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-left hidden lg:table-cell" style={{ color: 'var(--table-text-secondary)' }}>
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(project.updatedAt)}</span>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-left">
        <div className="flex justify-start space-x-2">
          {onViewMembers && (
            <button
              onClick={handleViewMembers}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform duration-150"
              style={{
                backgroundImage: 'linear-gradient(120deg, var(--button-secondary-bg), var(--accent-to))',
                color: 'var(--button-primary-text)',
                boxShadow: '0 10px 20px -8px var(--shadow-color)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 12px 24px -8px var(--shadow-color)';
                e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-secondary-hover-bg), var(--accent-to))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 20px -8px var(--shadow-color)';
                e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-secondary-bg), var(--accent-to))';
              }}
              title="View project members"
            >
              <FaUsers className="w-3 h-3 mr-1" />
              Members
            </button>
          )}
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform duration-150"
            style={{
              backgroundImage: 'linear-gradient(120deg, var(--button-secondary-bg), var(--accent-to))',
              color: 'var(--button-primary-text)',
              boxShadow: '0 10px 20px -8px var(--shadow-color)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 12px 24px -8px var(--shadow-color)';
              e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-secondary-hover-bg), var(--accent-to))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 20px -8px var(--shadow-color)';
              e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-secondary-bg), var(--accent-to))';
            }}
            title="Edit project"
          >
            <FaEdit className="w-3 h-3 mr-1" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-transform duration-150"
            style={{
              backgroundImage: 'linear-gradient(120deg, var(--button-danger-bg), #ef4444)',
              color: 'var(--button-primary-text)',
              boxShadow: '0 10px 20px -8px rgba(220, 38, 38, 0.45)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(220, 38, 38, 0.55)';
              e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-danger-hover-bg), #ef4444)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 20px -8px rgba(220, 38, 38, 0.45)';
              e.currentTarget.style.backgroundImage = 'linear-gradient(120deg, var(--button-danger-bg), #ef4444)';
            }}
            title="Delete project"
          >
            <FaTrash className="w-3 h-3 mr-1" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProjectsTableRow;

