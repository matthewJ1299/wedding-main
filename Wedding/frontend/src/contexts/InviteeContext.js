import { createContext, useContext, useState, useEffect } from 'react';
import { DUMMY_INVITEES } from '../models/inviteeModel';
import { fetchInvitees, createInvitee, updateInviteeApi, deleteInvitee, seedInvitees } from '../services/inviteeService';

/**
 * Context for invitee data management
 */
const InviteeContext = createContext({
  invitees: [],
  addInvitee: () => {},
  updateInvitee: () => {},
  removeInvitee: () => {},
});

/**
 * Provider component for invitee data management
 */
export const InviteeProvider = ({ children }) => {
  const [invitees, setInvitees] = useState([]);

  // Load from API, seed on first run
  useEffect(() => {
    (async () => {
      try {
        let list = await fetchInvitees();
        if (!list || list.length === 0) {
          await seedInvitees();
          list = await fetchInvitees();
        }
        setInvitees(list);
      } catch (e) {
        console.error('Failed to load invitees from API, falling back to dummy', e);
        setInvitees([...DUMMY_INVITEES]);
      }
    })();
  }, []);

  /**
   * Add a new invitee to the list
   * @param {Object} invitee - The invitee data without ID
   */
  const addInvitee = async (invitee) => {
    const trimmed = {
      ...invitee,
      name: (invitee.name || '').trim(),
      partner: (invitee.partner || '').trim(),
      email: (invitee.email || '').trim(),
      phone: (invitee.phone || '').trim(),
    };
    const created = await createInvitee(trimmed);
    setInvitees((prev) => [...prev, created]);
  };

  /**
   * Update an existing invitee's information
   * @param {string} id - The ID of the invitee to update
   * @param {Object} updates - The partial data to update
   */
  const updateInvitee = async (id, updates) => {
    const trimmed = { ...updates };
    if (trimmed.name !== undefined) trimmed.name = (trimmed.name || '').trim();
    if (trimmed.partner !== undefined) trimmed.partner = (trimmed.partner || '').trim();
    if (trimmed.email !== undefined) trimmed.email = (trimmed.email || '').trim();
    if (trimmed.phone !== undefined) trimmed.phone = (trimmed.phone || '').trim();
    const updated = await updateInviteeApi(id, trimmed);
    setInvitees((prev) => prev.map((i) => (i.id === id ? updated : i)));
  };

  /**
   * Remove an invitee from the list
   * @param {string} id - The ID of the invitee to remove
   */
  const removeInvitee = async (id) => {
    await deleteInvitee(id);
    setInvitees((prev) => prev.filter((inv) => inv.id !== id));
  };

  // Create the context value object
  const contextValue = {
    invitees,
    addInvitee,
    updateInvitee,
    removeInvitee,
  };

  return (
    <InviteeContext.Provider value={contextValue}>
      {children}
    </InviteeContext.Provider>
  );
};

/**
 * Hook to access the invitee context
 * @returns {Object} The invitee context value
 */
export const useInvitees = () => useContext(InviteeContext);