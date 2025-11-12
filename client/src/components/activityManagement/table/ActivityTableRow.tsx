import React from 'react';
import { FaUser, FaBolt, FaFolder, FaTasks, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { ACTIVITY_TABLE_COLUMNS, ACTIVITY_TYPE_BADGES } from '../../../constants/activityManagement';
import { Activity } from '../../../types/activityManagement';
import { formatRoleForDisplay } from '../../../utils/roleFormatter';
import { formatDate } from './utils';

interface ActivityTableRowProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}

/** Description: Renders an activity row with themed action buttons in the activity dashboard table; Data created: None (stateless row rendering); Author: thangtruong */
const ActivityTableRow: React.FC<ActivityTableRowProps> = ({
  activity,
  onEdit,
  onDelete
}) => {
  return (
    <tr
      key={activity.id}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--table-row-hover-bg)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--table-row-bg)')}
      style={{
        backgroundColor: 'var(--table-row-bg)',
        borderBottomColor: 'var(--border-color)',
        borderBottomWidth: 1
      }}
    >
      {/* ID Column - Hidden on mobile and tablet */}
      <td className={`hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left ${ACTIVITY_TABLE_COLUMNS.ID.width}`}>
        {activity.id}
      </td>

      {/* User Column - Always visible */}
      <td className={`px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left ${ACTIVITY_TABLE_COLUMNS.USER.width}`}>
        <div className="flex flex-col">
          <p className="font-medium flex items-center space-x-2">
            <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>{activity.user.firstName} {activity.user.lastName}</span>
          </p>
          <p className="text-xs theme-table-text-secondary">{formatRoleForDisplay(activity.user.role)}</p>
        </div>
      </td>

      {/* Type Column - Always visible */}
      <td className={`px-4 py-4 whitespace-nowrap text-left ${ACTIVITY_TABLE_COLUMNS.TYPE.width}`}>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={ACTIVITY_TYPE_BADGES[activity.type as keyof typeof ACTIVITY_TYPE_BADGES] || { backgroundColor: 'var(--badge-secondary-bg)', color: 'var(--badge-secondary-text)' }}>
          {activity.type.replace('_', ' ')}
        </span>
      </td>

      {/* Action Column - Hidden on mobile */}
      <td className={`hidden sm:table-cell px-4 py-4 text-sm theme-table-text-primary text-left ${ACTIVITY_TABLE_COLUMNS.ACTION.width}`}>
        <p className="truncate flex items-center space-x-2" title={activity.action}>
          <FaBolt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{activity.action}</span>
        </p>
      </td>

      {/* Target User Column - Hidden on mobile and tablet */}
      <td className={`hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left ${ACTIVITY_TABLE_COLUMNS.TARGET_USER.width}`}>
        {activity.targetUser ? (
          <div className="flex flex-col">
            <p className="font-medium flex items-center space-x-2">
              <FaUser className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
              <span>{activity.targetUser.firstName} {activity.targetUser.lastName}</span>
            </p>
            <p className="text-xs theme-table-text-secondary">{formatRoleForDisplay(activity.targetUser.role)}</p>
          </div>
        ) : (
          <span className="theme-table-text-muted">-</span>
        )}
      </td>

      {/* Project Column - Hidden on mobile */}
      <td className={`hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left ${ACTIVITY_TABLE_COLUMNS.PROJECT.width}`}>
        {activity.project ? (
          <p className="truncate flex items-center space-x-2" title={activity.project.name}>
            <FaFolder className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>{activity.project.name}</span>
          </p>
        ) : (
          <span className="theme-table-text-muted">-</span>
        )}
      </td>

      {/* Task Column - Hidden on mobile */}
      <td className={`hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-primary text-left ${ACTIVITY_TABLE_COLUMNS.TASK.width}`}>
        {activity.task ? (
          <p className="truncate flex items-center space-x-2" title={activity.task.title}>
            <FaTasks className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            <span>{activity.task.title}</span>
          </p>
        ) : (
          <span className="theme-table-text-muted">-</span>
        )}
      </td>

      {/* Created Column - Hidden on mobile */}
      <td className={`hidden xs:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-secondary text-left ${ACTIVITY_TABLE_COLUMNS.CREATED.width}`}>
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(activity.createdAt)}</span>
        </div>
      </td>

      {/* Updated Column - Hidden on mobile and tablet */}
      <td className={`hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm theme-table-text-secondary text-left ${ACTIVITY_TABLE_COLUMNS.UPDATED.width}`}>
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(activity.updatedAt)}</span>
        </div>
      </td>

      {/* Actions */}
      <td className={`px-4 py-4 whitespace-nowrap text-left ${ACTIVITY_TABLE_COLUMNS.ACTIONS.width}`}>
        <div className="flex justify-start space-x-2">
          <button
            onClick={() => onEdit(activity)}
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
            title="Edit activity"
          >
            <FaEdit className="w-3 h-3 mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete(activity)}
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
            title="Delete activity"
          >
            <FaTrash className="w-3 h-3 mr-1" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ActivityTableRow;

