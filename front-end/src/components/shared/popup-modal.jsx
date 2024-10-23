import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';

export default function PopupModal({ renderModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)} >
        <PlusCircleIcon className="mr-2 h-4 w-4  " /> Add New
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className={'!bg-background !px-1'}
      >
        <ScrollArea className="h-[80dvh] px-6  ">
          {renderModal(onClose)}
        </ScrollArea>
      </Modal>
    </>
  );
}