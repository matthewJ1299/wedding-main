import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import RsvpModal from '../components/rsvp/RsvpModal';

const RsvpModalContext = createContext(null);

export function RsvpModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState(null);

  const openRsvpModal = useCallback(({ inviteCode: nextInviteCode } = {}) => {
    setInviteCode(nextInviteCode ?? null);
    setOpen(true);
  }, []);

  const closeRsvpModal = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(() => {
    return {
      openRsvpModal,
      closeRsvpModal,
      isRsvpModalOpen: open,
      inviteCode,
    };
  }, [closeRsvpModal, inviteCode, open, openRsvpModal]);

  return (
    <RsvpModalContext.Provider value={value}>
      {children}
      <RsvpModal open={open} inviteCode={inviteCode} onClose={closeRsvpModal} />
    </RsvpModalContext.Provider>
  );
}

export function useRsvpModal() {
  const ctx = useContext(RsvpModalContext);
  if (!ctx) {
    throw new Error('useRsvpModal must be used within a RsvpModalProvider');
  }
  return ctx;
}

