import React, { useCallback, useEffect, useState } from 'react';
import { SnackbarAlert } from '../components/common/AlertMessage';
import { subscribeToast } from './notificationBus';

export default function ToastHost() {
  const [state, setState] = useState({
    open: false,
    message: '',
    type: 'info',
  });

  const onClose = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  useEffect(() => {
    return subscribeToast(({ message, type = 'success' }) => {
      setState({ open: true, message, type });
    });
  }, []);

  return (
    <SnackbarAlert
      open={state.open}
      message={state.message}
      type={state.type}
      onClose={onClose}
    />
  );
}
