import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import RoleDropdown from "@/components/Dropdowns/RoleDropdown";
import {
  fetchPermissions,
  clearPermissionState,
  createPermission,
} from "@/slices/PermissionSlice";
import showSweetAlert from "@/components/Sweetalert";
import App from '@/components/App';
import Loader from "@/components/Loader"
const PermissionList = () => {
  const dispatch = useDispatch();
  const { permissions, loading, error } = useSelector((state) => state.permission);
  const [selectedRole, setSelectedRole] = useState(0);
  const [Data, setData] = useState([]);

  const handleCheckboxChangeCanView = (permissionId) => {
    //alert("change permission for Id: " +permissionId);
    setData((prevData) =>
      prevData.map((row) => {
        if (row.pId === permissionId) {
          const updatedRow = { ...row, canView: !row.canView };
          return updatedRow;
        }
        return row;
      })
    );
  };

  const handleCheckboxChangeCanCreate = (permissionId) => {
    setData((prevData) =>
      prevData.map((row) => {
        if (row.pId === permissionId) {
          const updatedRow = { ...row, canCreate: !row.canCreate };
          return updatedRow;
        }
        return row;
      })
    );
  };

  const handleCheckboxChangeCanUpdate = (permissionId) => {
    setData((prevData) =>
      prevData.map((row) => {
        if (row.pId === permissionId) {
          const updatedRow = { ...row, canUpdate: !row.canUpdate };
          return updatedRow;
        }
        return row;
      })
    );
  };

  const handleCheckboxChangeCanDelete = (permissionId) => {
    setData((prevData) =>
      prevData.map((row) => {
        if (row.pId === permissionId) {
          const updatedRow = { ...row, canDelete: !row.canDelete };
          return updatedRow;
        }
        return row;
      })
    );
  };

  const permissionColumns = [
    { name: "Permission Task Name", selector: (row) => row.permissionTaskName, sortable: true },
    { name: "Module", selector: (row) => row.moduleName, sortable: true },
    {
      name: "View",
      selector: (row) => (
        <input
          type="checkbox"
          checked={row.canView}
          onChange={() => handleCheckboxChangeCanView(row.pId)}
          className="form-checkbox"
        />
      ),
      sortable: true,
    },
    {
      name: "Create",
      selector: (row) => (
        <input
          type="checkbox"
          checked={row.canCreate}
          onChange={() => handleCheckboxChangeCanCreate(row.pId)}
          className="form-checkbox"
        />
      ),
      sortable: true,
    },
    {
      name: "Update",
      selector: (row) => (
        <input
          type="checkbox"
          checked={row.canUpdate}
          onChange={() => handleCheckboxChangeCanUpdate(row.pId)}
          className="form-checkbox"
        />
      ),
      sortable: true,
    },
    {
      name: "Delete",
      selector: (row) => (
        <input
          type="checkbox"
          checked={row.canDelete}
          onChange={() => handleCheckboxChangeCanDelete(row.pId)}
          className="form-checkbox"
        />
      ),
      sortable: true,
    },
  ];

  const handleSave = async () => {
    try {
      const requestBody = {
        clientId: localStorage["clientId"],
        roleId: selectedRole,
        actionBy: localStorage["userId"],
        permissions: Data,
      };
      const response = await dispatch(createPermission(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({
          title: "Saved",
          text: "All permissions have been successfully saved.",
          icon: "success",
        });
        refreshPermissionList(selectedRole); // Refresh the list after saving
      } else {
        showSweetAlert({
          title: "Save Failed",
          text: response.message || "Failed to save the permissions. Please try again.",
          icon: "error",
        });
      }
    } catch (error) {
      console.log("Failed to save permissions", error);
      showSweetAlert({
        title: "Save Failed",
        text: "An error occurred while saving the permissions.",
        icon: "error",
      });
    }
  };

  const refreshPermissionList = (roleId) => {
    dispatch(fetchPermissions({ role_Id: roleId, client_Id: localStorage.getItem("clientId") }));
  };

  useEffect(() => {
    refreshPermissionList(selectedRole);
    return () => {
      dispatch(clearPermissionState());
    };
  }, [dispatch, selectedRole]);

  useEffect(() => {
    if (permissions.length) {
      setData(permissions);
    }
  }, [permissions]);

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    refreshPermissionList(role);
    setData(permissions);
  };

  const subHeaderComponentMemo = useMemo(
    () => (
      <div className="flex items-center mb-4 p-2">
        <label className="mr-3 mb-4">Select Roles:</label>
        <RoleDropdown 
        name="role_Id" 
        value={selectedRole} 
        onChange={handleRoleChange} 
        className="border px-3 py-2 rounded" />
      </div>
    ),
    [selectedRole]
  );

  return (
   <App>
      <div className="p-6">
        <div className="mb-4">
        {loading && <div className="text-center text-blue-500"><Loader /></div>}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold mb-2">Permission List</h4>
        <button className="uniform_icon_btn" onClick={handleSave}>
          Create New Client
        </button>
        </div>
      </div>
        <DataTable
          data={Data}
          columns={permissionColumns}
          pagination
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          className="w-full border"
        />
      </div>
      </App>
  );
};

export default PermissionList;
