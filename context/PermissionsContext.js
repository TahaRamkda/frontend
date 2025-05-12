// context/PermissionsContext.js
import React, { createContext, useContext, useEffect } from 'react';

const PermissionsContext = createContext();

export const usePermissions = () => {
  
  const permissions = useContext(PermissionsContext);
  

  const hasPermission = (taskName, action) => {
    if (!permissions || !Array.isArray(permissions)) return false;
    const permission = permissions.find(
      (perm) => perm.permissionTaskName.toLowerCase() === taskName.toLowerCase()
    );
    if (!permission) return false;

    switch (action.toLowerCase()) {
      case "view":
        return permission.canView;
      case "create":
        return permission.canCreate;
      case "update":
        return permission.canUpdate;
      case "delete":
        return permission.canDelete;
      default:
        return false;
    }
  };

  return { permissions, hasPermission };
};

export const PermissionsProvider = ({ permissions = [], children }) => {
  return (
    <PermissionsContext.Provider value={permissions}>
      {children}
    </PermissionsContext.Provider>
  );
};