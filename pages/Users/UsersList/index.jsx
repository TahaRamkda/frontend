import React, { useMemo, useState, useEffect } from "react";
import {
  Card, CardBody, CardHeader, Col, Input, Label, Alert, Button, Modal, ModalBody, ModalHeader, Form, FormGroup, Row,
} from "reactstrap";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import RoleDropdown from '@/components/Dropdowns/RoleDropdown';
import { fetchUser, clearUserState, deleteUser, fetchUserById, updateUser } from "@/slices/UserSlice";
import showSweetAlert from "@/components/Sweetalert";
import App from "@/components/App";
const UserList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userForm, setUserForm] = useState({});
  const [filterText, setFilterText] = useState("");

  const userColumns = [
    { name: "User ID", selector: (row) => row.userId, sortable: true },
    { name: "Client ID", selector: (row) => row.clientId, sortable: true },
    { name: "User Name", selector: (row) => row.userName, sortable: true },
    { name: "Full Name", selector: (row) => row.fullName, sortable: true},
    { name: "Is Active?", selector: (row) => (row.isActive ? "Yes" : "No"), sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button onClick={() => handleDetailClick(row.userId)}>Edit</button>
          <button onClick={() => handleDeleteClick(row.userId)}>Delete</button>
        </>
      ),
    },
  ];

  const handleDetailClick = async (userId) => {
    try {
      const response = await dispatch(fetchUserById(userId)).unwrap();
      if (response) {
        setUserForm(response.result);
        setIsModalOpen(true);
      } else {
        showSweetAlert({ title: "Error", text: "Failed to fetch user details", icon: "error" });
      }
    } catch (error) {
        showSweetAlert("Failed to fetch user details: " + error.message);
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
            showSweetAlert({ title: "User Deleted", text: "The user has been deleted successfully", icon: "success" });
            refreshUserList();
          })
          .catch((error) => {
            alert("An unexpected error occurred: " + error.message);
          });
      }
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        user_Id:  userForm.user_Id || 0,
        client_Id: userForm.client_Id || 0,
        userName: userForm.userName || "string",
        isActive: userForm.isActive || false,
        fullName: userForm.fullName || "string",
        userRoles: userForm.userRoles || "string",     
        actionBy: 1,
      };

      const response = await dispatch(updateUser(requestBody)).unwrap();
      if (response) {
        showSweetAlert({
          title: "User Updated",
          text: "User details have been updated successfully.",
          icon: "success",
        });
        setIsModalOpen(false);
        refreshUserList();
      } else {
        showSweetAlert({ title: "Error", text: response.message, icon: "error" });
      }
    } catch (error) {
      alert("Failed to update user: " + error.message);
    }
  };

  const refreshUserList = () => {
    dispatch(fetchUser({ clientId: localStorage.getItem("clientId") }));
  };

  
  useEffect(() => {
    dispatch(fetchUser({ clientId: localStorage.getItem("clientId") }));
    return () => {
      dispatch(clearUserState());
    };
  }, [dispatch])

  const filteredUsers = users?.filter((user) =>
    user.userName.toLowerCase().includes(filterText.toLowerCase())
  || user.fullName.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => (
    <div id="sender_filter" className="dataTables_filter d-flex align-items-center">
      <Label className="me-1">Search Users</Label>
      <Input type="search" value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder={"Enter Text"} />
    </div>
  ), [filterText]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <Alert color="danger">{error}</Alert>;
  }

  return (
    <App>
    <Col sm="12">
      <Card>
        <CardHeader className="pb-0 card-no-border">
          <h4 className="mb-2">User list</h4>
        </CardHeader>
        <CardBody>
          <Button color="primary" onClick={() => router.push("/user/NewUser")}>
            Create User
          </Button>
          <div className="table-responsive" id="sender_table">
            <DataTable
              data={filteredUsers}
              columns={userColumns}
              highlightOnHover
              striped
              pagination
              className="display dataTable custom-scrollbar"
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
            />
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)} style={{ maxWidth: "800px", width: "90%" }}>
        <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>EditSenderDetails</ModalHeader>
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
                    <Label for="fullName">full name</Label>
                    <Input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={ userForm.fullName || ""}
                      onChange={handleFormChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={7}>
                  <FormGroup>
                    <Label for="userRoles">Role</Label>
                    <RoleDropdown
                      name="role_Id" // Capture client_Id instead of client_Name
                      value={userForm.userRoles}
                     
                      onChange={(e) => setUserForm({ ...userForm, userRoles: e.target.value })}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="isActive">{"Is Active?"}</Label>
                    <Input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={userForm.isActive}
                      onChange={(e) => setUserForm({ ...userForm, isActive: e.target.checked })}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Button color="primary" type="submit">
                UpdateSender
              </Button>
            </Form>
          )}
        </ModalBody>
      </Modal>
    </Col>
    </App>
  );
};

export default UserList;
