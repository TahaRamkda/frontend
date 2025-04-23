import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import RoleDropdown from "@/components/Dropdowns/RoleDropdown";
import {
  fetchPermissions,
  clearPermissionState,
  createPermission,
} from "@/slices/PermissionSlice";
import Loading from "@/components/Layout/Loader";
import showSweetAlert from "@/components/Sweetalert";
import App from '@/components/Layout/App';
import Loader from "@/components/Layout/Loader"
const PermissionList = () => {
  const dispatch = useDispatch();
  const { permissions, loading, error } = useSelector((state) => state.permission);
  const [selectedRole, setSelectedRole] = useState(0);
  const [Data, setData] = useState([]);

  const handleCheckboxChangeCanView = (permissionId) => {
    //alert("change permission for Id: " +permissionId);
    setData((prevData) =>
      prevData?.map((row) => {
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
      prevData?.map((row) => {
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
      prevData?.map((row) => {
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
      prevData?.map((row) => {
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
          title: "Saved Successfully",
          text: "",
          icon: "success",
        });
        refreshPermissionList(selectedRole); // Refresh the list after saving
      } else {
        showSweetAlert({
          title: "Failed",
          text: response.message || "",
          icon: "error",
        });
      }
    } catch (error) {
      console.log("Failed to save permissions", error);
      showSweetAlert({
        title: "Failed",
        text: "",
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
    if (permissions?.length > 0) {
      setData(permissions);
    }
  }, [permissions]);

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    refreshPermissionList(role);
    setData(permissions);
  };
  const customPageSizes = [1 ,5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 50
  const subHeaderComponentMemo = useMemo(
    () => (
      <div className="w-full">
        <div className='grid grid-cols-5 gap-4'>
          <div className="flex flex-col text-start mb-1">
            <label className="font-medium text-gray-700 text-sm">Role</label>
            <RoleDropdown
              name="role_Id"
              value={selectedRole}
              onChange={handleRoleChange}
              className="border rounded py-1 px-2 w-full text-sm" />
          </div>
        </div>
      </div>
    ),
    [selectedRole]
  );

  return (
    <App>


      <div className="flex items-center">
        {loading && <Loading />}
        <div >
          <h4 className="font-bold ">Permission </h4>
        </div>
        <div className="ml-auto mb-1">
          <button className="uniform_btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
      <DataTable
        data={Data}
        columns={permissionColumns}
        highlightOnHover
        striped
        sortIcon
        sortServer
        pagination
        className="w-full border"
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        paginationPerPage={defultpagessize} // Default number of rows per page
        paginationRowsPerPageOptions={customPageSizes} // Custom page size options
      />

    </App>
  );
};

export default PermissionList;
