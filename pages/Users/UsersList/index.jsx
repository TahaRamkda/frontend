import React, { useMemo, useState, useEffect } from "react";
import {
  Card, CardBody, CardHeader, Col, Input, Label, Alert, Button, Modal, ModalBody, ModalHeader, Form, FormGroup, Row,
} from "reactstrap";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import RolesDropdown from "@/components/MultiSelect/RoleDropdown";
import { fetchUser, clearUserState, deleteUser, fetchUserById, updateUser } from "@/slices/UserSlice";
import showSweetAlert from "@/components/Sweetalert";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import UserForm from "../CreateUsers";
import App from '@/components/App';
import Loading from "@/components/Loader";
const UserList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [CreateModalOpen, setCreateModalOpen] = useState(false)
  const[existingRoleId, setexistingRoleId] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [userForm, setUserForm] = useState({});
  const [filterText, setFilterText] = useState("");

  const userColumns = [

    { name: "User Name", selector: (row) => row.userName, sortable: true },
    { name: "Full Name", selector: (row) => row.fullName, sortable: true },
    { name: "Is Active?", selector: (row) => (row.isActive ? "Yes" : "No"), sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <>
          <div className="flex gap-2">
            <button className="uniform_icon_btn" onClick={() => handleDetailClick(row.userId)}><HiPencilAlt style={{ fontSize: "15px" }} /></button>
            <button className="uniform_icon_btn" onClick={() => handleDeleteClick(row.userId)}><HiTrash style={{ fontSize: "15px" }} /></button>
          </div>
        </>
      ),
    },
  ];
  const handleCancel = () => {
    setCreateModalOpen(false)
  }
  const handleDetailClick = async (userId) => {
    try {
      const response = await dispatch(fetchUserById({userId})).unwrap();
      if (response) {
        setUserForm(response.result);
        setexistingRoleId(response.result.roleIds.replace(/['"]+/g, '').split(',').map(Number))
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
            showSweetAlert({ title: "Deleted Successfully", text: "", icon: "success" });
            refreshUserList();
          })
          .catch((error) => {
            alert("An unexpected error occurred: " + error.message);
          });
      }
    });
  };
  const handleCreate = () => {
    setCreateModalOpen(true)
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

 const handleSearchString = (e) => {
    const searchValue = e.target.value;
    setFilterText(searchValue);

    // Clear the previous timeout if any
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout for 0.5 seconds
    const timeout = setTimeout(() => {
      dispatch(
        fetchUser({ clientId: localStorage.getItem("clientId"),searchStr:searchValue })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };
 

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        userId:localStorage.getItem("userId") || 0,
        clientId: localStorage.getItem('clientId') || 0,
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
        showSweetAlert({ title: "Error", text: response.message, icon: "error" });
      }
    } catch (error) {
      showSweetAlert({ title: "Error", text: "Failed to Update", icon: "error" });
    }
  };

  const refreshUserList = () => {
    dispatch(fetchUser({ clientId: localStorage.getItem("clientId"),searchValue:filterText }));
  };
  const handleDropdownChange = (selectedValues) => {
    setUserForm({ ...userForm, userRoles: selectedValues.join(",") });

  };
  const handleCheckboxChange = (value) => {
    setUserForm((prev) => ({ ...prev, isActive: value }));
  };

  useEffect(() => {
    dispatch(fetchUser({ clientId: localStorage.getItem("clientId"),searchValue:filterText }));
    return () => {
      dispatch(clearUserState());
    };
  }, [dispatch])

  const filteredUsers = users?.filter((user) =>
    user.userName.toLowerCase().includes(filterText.toLowerCase())
    || user.fullName.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => (
    <div className="w-full">
      <div className="grid grid-cols-5 gap-4">
        <div className="flex flex-col space-y-1 text-start mb-1 ">
          <label className="font-medium text-gray-700 text-sm">Search </label>
          <input type="search" className="border rounded py-1 px-2 w-full text-sm" value={filterText} onChange={handleSearchString} placeholder={"Enter Text"} />
        </div>
      </div>
    </div>
  ), [filterText]);


  return (
    <App>
      <div className="flex items-center">
        {loading && <Loading />}
        <div className=''>
          <h4 className="font-bold">Users </h4>
        </div>
        <div className="ml-auto mb-1">
          <button
            className="uniform_btn"
            onClick={handleCreate}
          >
            Create User
          </button>
        </div>
      </div>

      <DataTable
        data={filteredUsers}
        columns={userColumns}
        highlightOnHover
        striped
        pagination
        paginationServer
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        className="w-full border"
        customStyles={{
          table: {
            style: {
              width: '100%',
              borderCollapse: 'collapse', // Ensures borders collapse for proper grid appearance
            },
          },
          headRow: {
            style: {
              borderBottom: '1px solid #ddd', padding: '0px',
            },
          },
          headCells: {
            style: {

              borderRight: '1px solid #ddd', // Grid line between columns
              fontWeight: 'bold',
            },
          },
          rows: {
            style: {
              borderBottom: '1px solid #ddd', // Horizontal grid line between rows
            },
          },
          cells: {
            style: {

              borderRight: '1px solid #ddd', // Vertical grid line between cells
            },
          },
        }}
      />


      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)} fade={false} >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
            <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>Edit User</ModalHeader>
            <ModalBody>
              {userForm && (
                <Form onSubmit={handleUpdateSubmit}>
                  <Row form>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="userName">User Name</Label>
                        <Input
                          type="text"
                          id="userName"
                          name="userName"
                          value={userForm.userName || ""}
                          onChange={handleFormChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={7}>
                      <FormGroup>
                        <Label for="fullName">Full name</Label>
                        <Input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={userForm.fullName || ""}
                          onChange={handleFormChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={7}>
                      <FormGroup>
                        <Label for="userRoles">User Roles</Label>
                        <RolesDropdown
                          name="userRoles"
                          value={userForm.userRoles || ""}
                          existingdata={existingRoleId}
                          onChange={(value) =>handleDropdownChange(value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="isActive">Is Active? </Label>
                        <Input
                          type="checkbox"
                          id="isActive"
                          name="isActive"
                          checked={userForm.isActive || false}
                          onChange={(e) => handleCheckboxChange(e.target.checked)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="flex justify-end">
                  <Button className='uniform_btn'color="primary" type="submit">
                    Save
                  </Button>
                  </div>
                </Form>
              )}
            </ModalBody>
          </div>
        </div>
      </Modal>
      {CreateModalOpen && (
        <UserForm
          isVisible={true}
          onClose={handleCancel}
          onsuccess={refreshUserList} />
      )}
    </App>
  );
};

export default UserList;
