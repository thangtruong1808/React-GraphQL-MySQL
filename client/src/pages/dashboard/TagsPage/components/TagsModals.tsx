import React from 'react';
import {
  CreateTagModal,
  EditTagModal,
  DeleteTagModal,
} from '../../../../components/tagsManagement';
import { TagsPageState } from '../types';

/**
 * Tags Modals Props
 */
export interface TagsModalsProps {
  state: TagsPageState;
  onCreateTag: (input: any) => Promise<void>;
  onUpdateTag: (id: string, input: any) => Promise<void>;
  onDeleteTag: (id: string) => Promise<void>;
  onCloseModals: () => void;
}

/**
 * Tags Modals Component
 * Renders all modals for tags management
 */
export const TagsModals: React.FC<TagsModalsProps> = ({
  state,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
  onCloseModals,
}) => {
  return (
    <>
      <CreateTagModal
        isOpen={state.createModalOpen}
        onClose={onCloseModals}
        onCreate={onCreateTag}
        loading={state.loading}
      />

      <EditTagModal
        isOpen={state.editModalOpen}
        onClose={onCloseModals}
        onUpdate={onUpdateTag}
        tag={state.selectedTag}
        loading={state.loading}
      />

      <DeleteTagModal
        isOpen={state.deleteModalOpen}
        onClose={onCloseModals}
        onDelete={onDeleteTag}
        tag={state.selectedTag}
        loading={state.loading}
      />
    </>
  );
};

