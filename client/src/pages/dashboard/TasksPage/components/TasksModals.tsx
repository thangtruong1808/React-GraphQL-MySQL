import React from 'react';
import {
  CreateTaskModal,
  EditTaskModal,
  DeleteTaskModal,
} from '../../../../components/taskManagement';
import { TaskManagementState } from '../../../../types/taskManagement';

/**
 * Tasks Modals Props
 */
export interface TasksModalsProps {
  state: TaskManagementState;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  deletionCheck: any;
  onCreateTask: (taskData: any) => Promise<void>;
  onUpdateTask: (taskId: string, taskData: any) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onCloseModals: (modalType?: 'create' | 'edit' | 'delete') => void;
}

/**
 * Tasks Modals Component
 * Renders all modals for tasks management
 */
export const TasksModals: React.FC<TasksModalsProps> = ({
  state,
  canCreate,
  canEdit,
  canDelete,
  deletionCheck,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onCloseModals,
}) => {
  return (
    <>
      {canCreate && (
        <CreateTaskModal
          isOpen={state.createModalOpen}
          onClose={() => onCloseModals('create')}
          onSubmit={onCreateTask}
          loading={state.loading}
        />
      )}

      {canEdit && (
        <EditTaskModal
          isOpen={state.editModalOpen}
          task={state.selectedTask}
          onClose={() => onCloseModals('edit')}
          onSubmit={onUpdateTask}
          loading={state.loading}
        />
      )}

      {canDelete && (
        <DeleteTaskModal
          isOpen={state.deleteModalOpen}
          task={state.selectedTask}
          onClose={() => onCloseModals('delete')}
          onConfirm={onDeleteTask}
          loading={state.loading}
          deletionCheck={deletionCheck}
        />
      )}
    </>
  );
};

