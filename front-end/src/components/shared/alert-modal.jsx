import { Button } from '../ui/button';
import { Modal } from '../ui/modal';

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  description = 'Are you sure you want to continue?'
}) => {
  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};