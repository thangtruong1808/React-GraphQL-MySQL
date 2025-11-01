import React from 'react';

/**
 * Tags Table Static Header Component
 * Displays static header for loading state
 */
const TagsTableStaticHeader: React.FC = () => {
  return (
    <thead className="theme-table-header-bg">
      <tr>
        {/* ID Column - Hidden on mobile */}
        <th className="hidden lg:table-cell w-16 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
          ID
        </th>
        {/* Name Column */}
        <th className="w-32 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
          Name
        </th>
        {/* Description Column - Hidden on small screens */}
        <th className="hidden sm:table-cell w-48 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
          Description
        </th>
        {/* Type Column - Hidden on extra small screens */}
        <th className="hidden xs:table-cell w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
          Type
        </th>
        {/* Category Column - Hidden on mobile and tablet */}
        <th className="hidden lg:table-cell w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
          Category
        </th>
        {/* Created Column - Hidden on extra small screens */}
        <th className="hidden xs:table-cell w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
          Created
        </th>
        {/* Updated Column - Hidden on mobile and tablet */}
        <th className="hidden lg:table-cell w-24 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
          Updated
        </th>
        {/* Actions Column */}
        <th className="w-32 px-4 py-3 text-left text-xs font-medium theme-table-text-secondary uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default TagsTableStaticHeader;

