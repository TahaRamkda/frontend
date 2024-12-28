import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, clearRoleState, deleteRole, fetchRoleById, updateRole } from "@/slices/RoleSlice";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import showSweetAlert from "@/components/Sweetalert";
import Loading from "@/components/Loader";
import CreateRole from "../CreateRoles";
import App from '@/components/App';
import { HiPencilAlt, HiTrash } from "react-icons/hi";
const RoleList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { roles, loading, error } = useSelector((state) => state.roles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleForm, setRoleForm] = useState({});
  const [filterText, setFilterText] = useState("");
  const [CreateModalOpen, setCreateModalOpen] = useState(false)
  
  const roleColumns = [
   
    { name: "Role Name", selector: (row) => row.roleName, sortable: true },
    { name: "Created Date", selector: (row) => row.createdDate, sortable: true },
   
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="uniform_icon_btn"
            onClick={() => handleDetailClick(row.roleId)}
          >
           <HiPencilAlt style={{fontSize: "15px"}}/>
          </button>
          <button
            className="uniform_icon_btn"
            onClick={() => handleDeleteClick(row.roleId)}
          >
            <HiTrash style={{fontSize: "15px"}}/>
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
        showSweetAlert({ title: "Error", text:"", icon: "error" });
      }
    } catch (error) {
      alert(t("Failed to fetch role details: ") + error.message);
    }
  };
  const handleCreate = () =>{
    setCreateModalOpen(true)
  }
  const handleCancel = () =>{
    setCreateModalOpen(false)
  }

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
          dispatch(deleteRole({ roleId })).then(()=>{
            showSweetAlert({ title: "Deleted Successfully", text: "", icon: "success" });
            refreshRoleList();
          });
          
        } catch (error) {
          alert(t("An unexpected error occurred: ") + error.message);
        }
      }
    });
  };
  const toggleModal = () => {
   
    setIsModalOpen(false);
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
        actionBy: 1,
      };

      const response = await dispatch(updateRole(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({
          title: "Updated Successfully",
          text: "",
          icon: "success",
        });
        setIsModalOpen(false);
        refreshRoleList();
      } else {
        showSweetAlert({ title: "Error", text: response.message, icon: "error" });
      }
    } catch (error) {
      alert("Failed to update: " + error.message);
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
      <div className="w-full">
          <div className='grid grid-cols-5 gap-4'>
            <div className="flex flex-col text-start mb-1">
        <label className="font-medium text-gray-700 text-sm">Search Roles</label>
        <input
          type="search"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Search by role name"
          className="border px-3 py-2 rounded"
        />
        </div>
        </div>
      </div>
    );
  }, [filterText]);

  if (error) {
    return <div className="bg-red-500 text-white p-4 rounded">{error}</div>;
  }

  return (
    <App>
    
      <div className="flex items-center">
  {loading && <Loading />}
  <div >
  <h4 className="font-bold ">Roles List</h4>
  </div>
  <div className="ml-auto mb-1">
  <button className="uniform_btn" onClick={handleCreate}>
          Create Roles
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
            customStyles={{
              table: {
                style: {
                  width: '100%',
                  borderCollapse: 'collapse', // Ensures borders collapse for proper grid appearance
                },
              },
              headRow: {
                style: {
                  borderBottom: '1px solid #ddd',  padding: '0px',
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
        </div>
      {isModalOpen && (
<Modal isOpen={true} toggle={() => toggleModal()} fade={false}>
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
      {/* Close button */}
     <ModalHeader toggle={() => toggleModal()}> Edit Role</ModalHeader>
     <ModalBody>
      <form onSubmit={handleUpdateSubmit}>
          <div>
            <label className="font-medium text-gray-700 text-sm" htmlFor="roleName">
              Role Name
            </label>
            <input
              type="text"
              id="roleName"
              name="roleName"
              value={roleForm.roleName || ""}
              onChange={handleFormChange}
              className="border rounded py-1 px-2 w-full text-sm"
            />
          </div>
        <div className="flex mt-6 justify-end">
          <button
            type="submit"
            className="uniform_btn"
          >
           Save
          </button>
        </div>
      </form>
      </ModalBody>
    </div>
  </div>
  </Modal>
)}
{CreateModalOpen &&(
        <CreateRole 
        isVisible={true}
        onClose={handleCancel}
        onsuccess={refreshRoleList}
    />
        
      )}

</App>
  );
};

export default RoleList;
