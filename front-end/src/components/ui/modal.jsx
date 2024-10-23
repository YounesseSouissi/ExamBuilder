import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from './dialog';
export const Modal= ({
  title,
  description,
  isOpen,
  onClose,
  children,
  className
}) => {
  const onChange = (open) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle className='py-3 leading-6'>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};