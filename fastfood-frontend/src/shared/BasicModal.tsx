import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

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
};

type ModalProps = {
  children: React.ReactNode;
  width?: number;
  p?: number;
  border?: string;
  borderRadius?: string;
  open: boolean;
  closeModalHandler: () => void;
};
export default function BasicModal({
  children,
  width,
  p,
  border,
  borderRadius,
  open,
  closeModalHandler,
}: ModalProps) {
  if (width) {
    style.width = width;
  }
  if (p !== undefined) style.p = p;
  if (border !== undefined) style.border = border;
  if (borderRadius !== undefined) style.borderRadius = borderRadius;
  return (
    <Modal
      open={open}
      onClose={closeModalHandler}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>{children}</Box>
    </Modal>
  );
}
