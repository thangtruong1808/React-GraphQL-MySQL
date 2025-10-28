import React from 'react';
import { PROJECT_MEMBER_ROLES } from '../../services/graphql/projectMemberQueries';

interface RoleSelectionGridProps {
  selectedRole: string;
  onRoleSelect: (role: string) => void;
}

/**
 * RoleSelectionGrid Component
 * Displays available project member roles for selection
 * Shows role descriptions and handles selection
 */
const RoleSelectionGrid: React.FC<RoleSelectionGridProps> = ({
  selectedRole,
  onRoleSelect
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {PROJECT_MEMBER_ROLES.map((role) => (
        <div
          key={role.value}
          className={`relative p-3 border-2 rounded-lg cursor-pointer transition-colors ${selectedRole === role.value
            ? 'theme-role-selection-active-border theme-role-selection-active-bg'
            : 'theme-role-selection-border theme-role-selection-border-hover'
            }`}
          onClick={() => onRoleSelect(role.value)}
        >
          <div className="text-center">
            <div className="text-sm font-medium theme-role-selection-text mb-1">
              {role.label}
            </div>
            <div className="text-xs theme-role-selection-text-secondary">
              {role.value === 'VIEWER' && 'Can view project and tasks'}
              {role.value === 'EDITOR' && 'Can post comments. Cannot edit tasks (Admin/PM only)'}
              {role.value === 'OWNER' && 'Full project management access'}
            </div>
          </div>
          {selectedRole === role.value && (
            <div className="absolute top-2 right-2">
              <div className="h-4 w-4 theme-button-primary rounded-full flex items-center justify-center">
                <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RoleSelectionGrid;
