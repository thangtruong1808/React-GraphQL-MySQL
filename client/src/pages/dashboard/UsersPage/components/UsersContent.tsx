import React from 'react';
import { UserSearchInput, UsersTable } from '../../../../components/userManagement';
import { UserManagementState } from '../../../../types/userManagement';

/**
 * Users Content Props
 */
export interface UsersContentProps {
  state: UserManagementState;
  sortBy: string;
  sortOrder: string;
  canEdit: boolean;
  canDelete: boolean;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort: (sortBy: string, sortOrder: string) => void;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
}

/**
 * Users Content Component
 * Displays search input and users table
 */
export const UsersContent: React.FC<UsersContentProps> = ({
  state,
  sortBy,
  sortOrder,
  canEdit,
  canDelete,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onSort,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {/* Search and Table */}
        <div className="space-y-6">
          {/* Search Input */}
          <UserSearchInput
            value={state.searchQuery}
            onChange={onSearchChange}
            loading={state.loading}
          />

          {/* Users Table */}
          <UsersTable
            users={state.users}
            paginationInfo={state.paginationInfo}
            loading={state.loading}
            onEdit={canEdit ? onEdit : () => {}}
            onDelete={canDelete ? onDelete : async () => {}}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            currentPageSize={state.pageSize}
            onSort={onSort}
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
          />
        </div>
      </div>
    </div>
  );
};

