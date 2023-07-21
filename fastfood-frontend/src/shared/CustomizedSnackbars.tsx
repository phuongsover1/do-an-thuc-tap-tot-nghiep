import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  },
);

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  vertical?: 'top' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  duration?: number;
};

export default function CustomizedSnackbars({
  open,
  setOpen,
  vertical,
  horizontal,
  message,
  type,
  duration,
}: Props) {
  if (!vertical) vertical = 'top';
  if (!horizontal) horizontal = 'center';
  if (!duration) duration = 2000;

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
