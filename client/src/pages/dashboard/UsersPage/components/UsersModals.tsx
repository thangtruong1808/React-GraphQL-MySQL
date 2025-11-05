import React from 'react';
import {
  CreateUserModal,
  EditUserModal,
  DeleteUserModal,
} from '../../../../components/userManagement';
import { UserManagementState, UserDeletionCheck } from '../../../../types/userManagement';

/**
 * Users Modals Props
 */
export interface UsersModalsProps {
  state: UserManagementState;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  deletionCheck: UserDeletionCheck | null;
  onCreateUser: (userData: any) => Promise<void>;
  onUpdateUser: (userId: string, userData: any) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onCloseModals: (modalType?: 'create' | 'edit' | 'delete') => void;
}

/**
 * Users Modals Component
 * Renders all modals for users management
 */
export const UsersModals: React.FC<UsersModalsProps> = ({
  state,
  canCreate,
  canEdit,
  canDelete,
  deletionCheck,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onCloseModals,
}) => {
  return (
    <>
      {canCreate && (
        <CreateUserModal
          isOpen={state.createModalOpen}
          onClose={() => onCloseModals('create')}
          onSubmit={onCreateUser}
          loading={state.loading}
        />
      )}

      {canEdit && (
        <EditUserModal
          isOpen={state.editModalOpen}
          user={state.selectedUser}
          onClose={() => onCloseModals('edit')}
          onSubmit={onUpdateUser}
          loading={state.loading}
        />
      )}

      {canDelete && (
        <DeleteUserModal
          isOpen={state.deleteModalOpen}
          user={state.selectedUser}
          onClose={() => onCloseModals('delete')}
          onConfirm={onDeleteUser}
          loading={state.loading}
          deletionCheck={deletionCheck}
        />
      )}
    </>
  );
};

