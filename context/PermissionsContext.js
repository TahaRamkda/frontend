// PermissionsContext.js
import React, { createContext, useContext } from 'react';

const PermissionsContext = createContext();

export const usePermissions = () => useContext(PermissionsContext);

export const PermissionsProvider = ({ permissions, children }) => {
  return (
    <PermissionsContext.Provider value={permissions}>
      {children}
    </PermissionsContext.Provider>
  );
};
