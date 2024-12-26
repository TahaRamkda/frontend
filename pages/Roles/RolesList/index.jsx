import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, clearRoleState, deleteRole, fetchRoleById, updateRole } from "@/slices/RoleSlice";
import showSweetAlert from "@/components/Sweetalert";
import App from '@/components/App';
const RoleList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { roles, loading, error } = useSelector((state) => state.roles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleForm, setRoleForm] = useState({});
  const [filterText, setFilterText] = useState("");
  
  const roleColumns = [
    { name: "Role ID", selector: (row) => row.roleId, sortable: true },
    { name: "Client ID", selector: (row) => row.clientId, sortable: true },
    { name: "Role Name", selector: (row) => row.roleName, sortable: true },
    { name: "Created By", selector: (row) => row.createdBy, sortable: true },
    { name: "Created Date", selector: (row) => row.createdDate, sortable: true },
    { name: "Updated By", selector: (row) => row.updatedBy, sortable: true },
    { name: "Updated Date", selector: (row) => row.updatedDate, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="uniform_icon_btn"
            onClick={() => handleDetailClick(row.roleId)}
          >
            Edit
          </button>
          <button
            className="uniform_icon_btn"
            onClick={() => handleDeleteClick(row.roleId)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleDetailClick = async (roleId) => {
    try {
      const response = await dispatch(fetchRoleById(roleId)).unwrap();
      if (response) {
        setRoleForm(response.result);
        setIsModalOpen(true);
      } else {
        showSweetAlert({ title: "Error", text: t("Failed to fetch role details"), icon: "error" });
      }
    } catch (error) {
      alert(t("Failed to fetch role details: ") + error.message);
    }
  };

  const handleDeleteClick = (roleId) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          dispatch(deleteRole({ roleId })).unwrap();
          showSweetAlert({ title: "Role Deleted", text: "The role has been deleted successfully", icon: "success" });
          refreshRoleList();
        } catch (error) {
          alert(t("An unexpected error occurred: ") + error.message);
        }
      }
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setRoleForm({ ...roleForm, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        roleId: roleForm.roleId || 0,
        clientId: roleForm.clientId || 0,
        roleName: roleForm.roleName || "string",
        createdBy: roleForm.createdBy || "string",
        createdDate: roleForm.createdDate || "string",
        updatedBy: roleForm.updatedBy || "string",
        actionBy: 1,
      };

      const response = await dispatch(updateRole(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({
          title: t("Role Updated"),
          text: t("Role details have been updated successfully."),
          icon: "success",
        });
        setIsModalOpen(false);
        refreshRoleList();
      } else {
        showSweetAlert({ title: "Error", text: response.message, icon: "error" });
      }
    } catch (error) {
      alert("Failed to update role: " + error.message);
    }
  };

  const refreshRoleList = () => {
    dispatch(fetchRoles({clientId: localStorage.getItem("clientId")}));
  };

  useEffect(() => {
    dispatch(fetchRoles({clientId: localStorage.getItem("clientId")}));
    return () => {
      dispatch(clearRoleState());
    };
  }, [dispatch]);

  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="flex items-center mb-4">
        <label className="mr-2">Search Roles</label>
        <input
          type="search"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Search by role name"
          className="border px-3 py-2 rounded"
        />
      </div>
    );
  }, [filterText]);

  if (error) {
    return <div className="bg-red-500 text-white p-4 rounded">{error}</div>;
  }

  return (
    <App>
    <div className="p-6">
      <div className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold mb-2">Roles List</h4>
        <button className="uniform_icon_btn"  onClick={() => router.push("/Roles/CreateRoles")}>
          Create New Roles
        </button>
        </div>
      </div>
        
      
      <div className="overflow-x-auto">
     
          <DataTable
            data={filteredRoles}
            columns={roleColumns}
            highlightOnHover
            striped
            pagination
            className="w-full border"
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
          />
        </div>
      {isModalOpen && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-lg relative">
      {/* Close button */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 text-xl text-gray-600 hover:text-gray-800"
      >
        &times;
      </button>
      <h4 className="text-xl mb-4">Edit Role Details</h4>
      <form onSubmit={handleUpdateSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1" htmlFor="roleName">
              Role Name
            </label>
            <input
              type="text"
              id="roleName"
              name="roleName"
              value={roleForm.roleName || ""}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="createdBy">
              Created By
            </label>
            <input
              type="text"
              id="createdBy"
              name="createdBy"
              value={roleForm.createdBy || ""}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1" htmlFor="createdDate">
              Created Date
            </label>
            <input
              type="text"
              id="createdDate"
              name="createdDate"
              value={roleForm.createdDate || ""}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="appId">
              App ID
            </label>
            <input
              type="text"
              id="appId"
              name="appId"
              value={roleForm.appId || ""}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1" htmlFor="updatedBy">
              Updated By
            </label>
            <input
              type="text"
              id="updatedBy"
              name="updatedBy"
              value={roleForm.updatedBy || ""}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="updatedDate">
              Updated Date
            </label>
            <input
              type="text"
              id="updatedDate"
              name="updatedDate"
              value={roleForm.updatedDate || ""}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>
        <div className="flex mt-6 justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Update Role
          </button>
        </div>
      </form>
    </div>
  </div>
)}
</div>
</App>
  );
};

export default RoleList;
