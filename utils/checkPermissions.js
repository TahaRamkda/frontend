// checkPermissions.js
export const checkPermissions = (permissions, taskName, action, module) => {
    
    const taskPermission = permissions.find(
        perm => perm.permissionTaskName === taskName && perm.module === module
    );

    if (taskPermission) {
        return taskPermission[action] === true;
    }

    return false;
};
