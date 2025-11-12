import React from 'react';

interface RoleFiltersProps {
  roleFilters: { [key: string]: boolean };
  onRoleFilterChange: (role: string) => void;
  onClearRoleFilters: () => void;
}

/** Description: Role selection list with theme-aware styling inside search drawer; Data created: None, uses provided callbacks for state updates; Author: thangtruong */
const RoleFilters: React.FC<RoleFiltersProps> = ({
  roleFilters,
  onRoleFilterChange,
  onClearRoleFilters
}) => {
  const availableRoles = [
    { key: 'Admin', label: 'Administrator', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', colorVar: 'var(--badge-warning-text)' },
    { key: 'Project Manager', label: 'Project Manager', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', colorVar: 'var(--icon-projects-fg)' },
    { key: 'Software Architect', label: 'Software Architect', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', colorVar: 'var(--accent-from)' },
    { key: 'Frontend Developer', label: 'Frontend Developer', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', colorVar: 'var(--icon-users-fg)' },
    { key: 'Backend Developer', label: 'Backend Developer', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', colorVar: 'var(--icon-users-fg)' },
    { key: 'Full-Stack Developer', label: 'Full-Stack Developer', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', colorVar: 'var(--icon-users-fg)' },
    { key: 'DevOps Engineer', label: 'DevOps Engineer', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', colorVar: 'var(--icon-activity-fg)' },
    { key: 'QA Engineer', label: 'QA Engineer', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', colorVar: 'var(--icon-projects-fg)' },
    { key: 'QC Engineer', label: 'QC Engineer', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', colorVar: 'var(--icon-projects-fg)' },
    { key: 'UX/UI Designer', label: 'UX/UI Designer', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z', colorVar: 'var(--icon-comments-fg)' },
    { key: 'Business Analyst', label: 'Business Analyst', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', colorVar: 'var(--badge-secondary-text)' },
    { key: 'Database Administrator', label: 'Database Administrator', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4', colorVar: 'var(--badge-neutral-text)' },
    { key: 'Technical Writer', label: 'Technical Writer', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', colorVar: 'var(--badge-secondary-text)' },
    { key: 'Support Engineer', label: 'Support Engineer', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z', colorVar: 'var(--icon-activity-fg)' }
  ];

  const hasSelectedRoles = Object.values(roleFilters).some(Boolean);

  return (
    <div className="p-4 border-b theme-border" style={{ backgroundColor: 'var(--card-bg)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Filter by Role</h3>
        {hasSelectedRoles && (
          <button
            onClick={onClearRoleFilters}
            className="text-xs font-medium transition-colors"
            style={{ color: 'var(--accent-from)' }}
            onMouseEnter={(event) => {
              event.currentTarget.style.color = 'var(--accent-to)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color = 'var(--accent-from)';
            }}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {availableRoles.map((role) => (
          <label key={role.key} className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={roleFilters[role.key] || false}
              onChange={() => onRoleFilterChange(role.key)}
              className="w-4 h-4 rounded theme-border"
              style={{
                accentColor: 'var(--accent-from)',
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--card-bg)'
              }}
            />
            <div className="flex items-center space-x-2 flex-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: role.colorVar }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={role.icon} />
              </svg>
              <span
                className="text-sm transition-colors group-hover:text-[var(--text-primary)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                {role.label}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RoleFilters;
