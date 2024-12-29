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
import App from '@/components/App';

const UserList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [CreateModalOpen, setCreateModalOpen] = useState(false)
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
          <button onClick={() => handleDetailClick(row.userId)}>{Edit}</button>
          <button onClick={() => handleDeleteClick(row.userId)}>{Delete}</button>
        </>
      ),
    },
  ];
  const handleCancel = () =>{
    setCreateModalOpen(false)
  }
  const handleDetailClick = async (userId) => {
    try {
      const response = await dispatch(fetchUserById(userId)).unwrap();
      if (response) {
        setUserForm(response.result);
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
      alert("Failed to update : " + error.message);
    }
  };

  const refreshUserList = () => {
    dispatch(fetchUser({ clientId: localStorage.getItem("clientId") }));
  };
  const handleDropdownChange = (value) => {
    setUserForm((prev) => ({ ...prev, userRoles: value }));
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
    <div className="w-full">
    <div className="grid grid-cols-5 gap-4">
     <div className="flex flex-col space-y-1 text-start mb-1 ">
      <label className="font-medium text-gray-700 text-sm">Search Users</label>
      <input type="search" className="border rounded py-1 px-2 w-full text-sm" value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder={"Enter Text"} />
    </div>
    </div>
    </div>
  ), [filterText]);

  if (loading) {
    return <p>{t("Loading...")}</p>;
  }

  if (error) {
    return <Alert color="danger">{error}</Alert>;
  }

  return (
    <App>
   <div className="flex items-center">
  {loading && <Loading />}
  <div className=''>
  <h4 className="font-bold">Users List</h4>
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
              className="display dataTable custom-scrollbar"
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
            />
          
       
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)} style={{ maxWidth: "800px", width: "90%" }}>
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
                      value={ userForm.fullName || ""}
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
                     
                      onChange={(value) => handleDropdownChange(value)}
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
                {t(UpdateSender)}
              </Button>
            </Form>
          )}
        </ModalBody>
      </Modal>
   
    </App>
  );
};

export default UserList;
