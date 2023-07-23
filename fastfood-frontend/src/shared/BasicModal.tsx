import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { XMarkIcon } from '@heroicons/react/24/outline';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '20px',
  p: 4,
  overflow: 'auto',
  maxHeight: '550px',
};

type ModalProps = {
  children: React.ReactNode;
  width?: number;
  p?: number;
  border?: string;
  borderRadius?: string;
  open: boolean;
  closeModalHandler: () => void;
  haveCloseButton: boolean;
};
export default function BasicModal({
  children,
  width,
  p,
  border,
  borderRadius,
  open,
  closeModalHandler,
  haveCloseButton,
}: ModalProps) {
  if (width) {
    style.width = width;
  }
  if (p !== undefined) style.p = p;
  if (border !== undefined) style.border = border;
  if (borderRadius !== undefined) style.borderRadius = borderRadius;
  const handleClose = (event, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick') {
      return;
    }
    closeModalHandler();
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableEscapeKeyDown
    >
      <Box sx={style}>
        <div className="relative">
          {haveCloseButton && (
            <button
              className="absolute top-3 right-3 p-1 rounded-full bg-pink-300"
              onClick={handleClose}
            >
              <XMarkIcon className="w-8 h-8 text-white" />
            </button>
          )}

          {children}
        </div>
      </Box>
    </Modal>
  );
}
