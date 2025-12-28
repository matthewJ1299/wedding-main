import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const InviteeNavigationContext = createContext();

export const useInviteeNavigation = () => {
  const context = useContext(InviteeNavigationContext);
  if (!context) {
    throw new Error('useInviteeNavigation must be used within an InviteeNavigationProvider');
  }
  return context;
};

export const InviteeNavigationProvider = ({ children }) => {
  const location = useLocation();
  const [inviteeId, setInviteeId] = useState(null);

  // Extract invitee ID from URL when it changes
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const inviteIndex = pathSegments.findIndex(segment => 
      segment === 'invitation' || segment === 'rsvp' || segment === 'edit-details'
    );
    
    // Check for invitee ID in path (e.g., /invitation/123, /rsvp/123, /edit-details/123)
    if (inviteIndex !== -1 && pathSegments[inviteIndex + 1]) {
      setInviteeId(pathSegments[inviteIndex + 1]);
    } 
    // Check for invitee ID in query parameters (e.g., ?invitee=123)
    else {
      const urlParams = new URLSearchParams(location.search);
      const inviteeParam = urlParams.get('invitee');
      if (inviteeParam) {
        setInviteeId(inviteeParam);
      } else {
        setInviteeId(null);
      }
    }
  }, [location.pathname, location.search]);

  const value = {
    inviteeId,
    hasInviteeContext: !!inviteeId
  };

  return (
    <InviteeNavigationContext.Provider value={value}>
      {children}
    </InviteeNavigationContext.Provider>
  );
};
