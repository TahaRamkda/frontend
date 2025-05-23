import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormGroup,
  Row,
} from "reactstrap";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import RolesDropdown from "@/components/MultiSelect/RoleDropdown";
import {
  fetchUser,
  clearUserState,
  deleteUser,
  fetchUserById,
  updateUser,
} from "@/slices/UserSlice";
import showSweetAlert from "@/components/Sweetalert";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import UserForm from "../CreateUsers";
import App from "@/components/Layout/App";
import Loading from "@/components/Layout/Loader";
import { usePermissions } from "@/context/PermissionsContext";
import SearchBar from "@/components/SearchBar/SearchComponent";
const UserList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [CreateModalOpen, setCreateModalOpen] = useState(false);
  const [existingRoleId, setexistingRoleId] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [userForm, setUserForm] = useState({});
  const [filterText, setFilterText] = useState("");
  const { hasPermission } = usePermissions();

  const userColumns = [
    { name: "User Name", selector: (row) => row.userName, sortable: true },
    { name: "Full Name", selector: (row) => row.fullName, sortable: true },
    {
      name: "Is Active?",
      selector: (row) => (row.isActive ? "Yes" : "No"),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <div className="flex gap-2 w-full ">
            <button
              className="uniform_icon_btn"
              title="Edit Users"
              onClick={() => handleDetailClick(row.userId)}
            >
              <HiPencilAlt style={{ fontSize: "15px" }} />
            </button>
            {hasPermission("Users", "delete") && (
            <button
              className="uniform_icon_btn"
              title="Delete Users"
              onClick={() => handleDeleteClick(row.userId)}
            >
              <HiTrash style={{ fontSize: "15px" }} />
            </button>
            )}
          </div>
        </>
      ),
    },
  ];
  const handleCancel = () => {
    setCreateModalOpen(false);
  };
  const handleDetailClick = async (userId) => {
    try {
      const response = await dispatch(fetchUserById({ userId })).unwrap();
      debugger
      if (response) {
        setUserForm(response);
        setexistingRoleId(
          response.roleIds.replace(/['"]+/g, "").split(",").map(Number)
        );
        setIsModalOpen(true);
      } else {
        showSweetAlert({ title: "Error", text: "", icon: "error" });
      }
    } catch (error) {
      showSweetAlert("Failed to fetch details: " + error.message);
    }
  };

  const handleDeleteClick = (userId) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser({ userId }))
          .unwrap()
          .then(() => {
            showSweetAlert({
              title: "Deleted Successfully",
              text: "",
              icon: "success",
            });
            refreshUserList();
          })
          .catch((error) => {
            alert("An unexpected error occurred: " + error.message);
          });
      }
    });
  };
  const handleCreate = () => {
    setCreateModalOpen(true);
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  const handleSearchString = (setter) => (e) => {
    const searchValue = e;
    setFilterText(searchValue);
    setter(e);

    // Clear the previous timeout if any
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout for 0.5 seconds
    const timeout = setTimeout(() => {
      dispatch(
        fetchUser({
          clientId: localStorage.getItem("clientId"),
          searchStr: searchValue,
        })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };

  const handleUpdateSubmit = async (e) => {
    ;
    e.preventDefault();
    
    try {
      const requestBody = {
        userId: userForm.userId || 0,
        clientId: userForm.clientId || 0,
        userName: userForm.userName || "string",
        isActive: userForm.isActive || false,
        fullName: userForm.fullName || "string",
        userRoles: userForm.userRoles || "string",
        actionBy: 1,
      };

      const response = await dispatch(updateUser(requestBody)).unwrap();
      if (response) {
        showSweetAlert({
          title: "Updated Successfully",
          text: "",
          icon: "success",
        });
        setIsModalOpen(false);
        refreshUserList();
      } else {
        showSweetAlert({
          title: "Error",
          text: response.message,
          icon: "error",
        });
      }
    } catch (error) {
      showSweetAlert({
        title: "Error",
        text: "Failed to Update",
        icon: "error",
      });
    }
  };

  const refreshUserList = () => {
    dispatch(
      fetchUser({
        clientId: localStorage.getItem("clientId"),
        searchValue: filterText,
      })
    );
  };
  const handleDropdownChange = (selectedValues) => {
    setUserForm({ ...userForm, userRoles: selectedValues.join(",") });
  };
  const handleCheckboxChange = (value) => {
    setUserForm((prev) => ({ ...prev, isActive: value }));
  };

  useEffect(() => {
    dispatch(
      fetchUser({
        clientId: localStorage.getItem("clientId"),
        searchValue: filterText,
      })
    );
    return () => {
      dispatch(clearUserState());
    };
  }, [dispatch]);

  const filteredUsers = users?.filter(
    (user) =>
      user.userName.toLowerCase().includes(filterText.toLowerCase()) ||
      user.fullName.toLowerCase().includes(filterText.toLowerCase())
  );
  const customPageSizes = [1, 5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10;
  const subHeaderComponentMemo = useMemo(
    () => (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col space-y-1 text-start mb-1 ">
            <SearchBar
              label="Search"
              value={filterText}
              onChange={handleSearchString(setFilterText)}
            />
          </div>
        </div>
      </div>
    ),
    [filterText]
  );

  return (
    <App>
      <div className="flex items-center">
        {loading && <Loading />}
        <div className="">
          <h4 className="font-bold">Users </h4>
        </div>
        <div className="ml-auto mb-1">
        {hasPermission("Users", "create") && (
          <button className="uniform_btn" onClick={handleCreate}>
            Create User
          </button>
        )}
        </div>
      </div>

      <DataTable
  data={filteredUsers}
  columns={userColumns}
  highlightOnHover
  striped
  pagination
  paginationPerPage={defultpagessize} // Default number of rows per page
  paginationRowsPerPageOptions={customPageSizes} // Custom page size options
  paginationComponentOptions={{
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    noRowsPerPage: false,
    selectAllRowsItem: false,
  }}
  sortIcon
  subHeader
  subHeaderComponent={subHeaderComponentMemo}
  className="w-full border"
/>

      <Modal
        isOpen={isModalOpen}
        toggle={() => setIsModalOpen(!isModalOpen)}
        fade={false}
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
            {/* Loader for update operation */}
            {loading && <Loading />}
            <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>
              Edit User
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleUpdateSubmit}>
                <div className="flex flex-col">
                  <label
                    htmlFor="userName"
                    className="font-medium text-gray-700 text-sm"
                  >
                    User Name
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={userForm.userName || ""}
                    onChange={handleFormChange}
                    className="border rounded py-1 px-2 w-full mt-1 text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="fullName"
                    className="font-medium text-gray-700 text-sm"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={userForm.fullName || ""}
                    onChange={handleFormChange}
                    className="border rounded py-1 px-2 w-full mt-1 text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="userRoles"
                    className="font-medium text-gray-700 text-sm"
                  >
                    User Roles
                  </label>
                  <RolesDropdown
                    name="userRoles"
                    value={userForm.userRoles || ""}
                    existingdata={existingRoleId}
                    onChange={(value) => handleDropdownChange(value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="groupName"
                    className="font-medium text-gray-700 text-sm"
                  >
                    Is Active?
                  </label>
                  <Input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={userForm.isActive || false}
                    onChange={(e) => handleCheckboxChange(e.target.checked)}
                  />
                </div>
                <div className="mt-4 w-full flex justify-end">
                {hasPermission("Users", "update") && (
                  <button type="submit" className="uniform_btn">
                    Save
                  </button>
                )}
                </div>
              </form>
            </ModalBody>
          </div>
        </div>
      </Modal>
      {CreateModalOpen && (
        <UserForm
          isVisible={true}
          onClose={handleCancel}
          onsuccess={refreshUserList}
        />
      )}
    </App>
  );
};

export default UserList;
