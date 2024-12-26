import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroup, clearGroupState, deleteGroup, fetchGroupById, updateGroup,setPageSize, setCurrentPage } from "@/slices/GroupSlice";
import showSweetAlert from "@/components/Sweetalert"; 
import Loading from "@/components/Loader";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import GroupForm from "../CreateGroup";
import App from '@/components/App';

const GroupList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { groups, loading, error, pageSize, totalRecords, currentPage  } = useSelector((state) => state.groups);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupForm, setGroupForm] = useState({});
  const [filterText, setFilterText] = useState("");
  const [CreateModalOpen, setCreateModalOpen] = useState(false)

  const groupColumns = [
   
    { name: "Group Name", selector: (row) => row.groupName, sortable: true },
    { name: "Created Date", selector: (row) => row.createdDate, sortable: true },
    { name: "Total Contacts", selector: (row) => row.totalContacts, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <>
         <div className="flex gap-2 float-right">
          <button
            className="uniform_icon_btn"
            onClick={() => handleDetailClick(row.groupId)}
          >
            <HiPencilAlt style={{fontSize: "15px"}}/>
          </button>
          <button
            className="uniform_icon_btn"
            onClick={() => handleDeleteClick(row.groupId)}
          >
           <HiTrash style={{fontSize: "15px"}}/>
          </button>
          </div>
        </>
      ),
      style: {
        textAlign: "right", // Align the entire column content to the center
      },
    },
  ];

  const handleDetailClick = async (groupId) => {
    try {
      const response = await dispatch(fetchGroupById(groupId)).unwrap();
      if (response) {
        setGroupForm(response.result);
        setIsModalOpen(true);
      } else {
        showSweetAlert({ title: "Error", text: "Failed to fetch group details", icon: "error" });
      }
    } catch (error) {
      alert("Failed to fetch group details: " + error.message);
    }
  };
  const handleCancel = () =>{
    setCreateModalOpen(false)
  }
  const handleDeleteClick = (groupId) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          dispatch(deleteGroup({ groupId })).unwrap();
          showSweetAlert({ title: "Group Deleted", text: "", icon: "success" });
          refreshGroupList();
        } catch (error) {
          alert("An unexpected error occurred: " + error.message);
        }
      }
    });
  };
   const handlePageChange = async (page) => {
      // Update current page state in Redux
      dispatch(setCurrentPage(page));
    
      // Fetch clients for the new page
      await dispatch(fetchGroup({ clientId: localStorage.getItem("clientId"), pageSize, pageNo: page, SearchStr: filterText }));
    };

    const handlePageSizeChange = async (newSize) => {
        // Update page size and reset to the first page
        dispatch(setPageSize(newSize));
        dispatch(setCurrentPage(1)); // Reset to first page
        // Fetch data with updated page size and reset to page 1
        await dispatch(fetchGroup({ clientId: localStorage.getItem("clientId"), pageSize : newSize, pageNo: 1,SearchStr: filterText }));
      };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setGroupForm({ ...groupForm, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {

        groupId: groupForm.groupId || 0,
        groupName: groupForm.groupName || "string",
        actionBy: localStorage.getItem("userId"),
        clientId: localStorage.getItem("clientId"),
      };

      const response = await dispatch(updateGroup(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({
          title: "Group Updated",
          text: "",
          icon: "success",
        });
        setIsModalOpen(false);
        refreshGroupList();
      } else {
        showSweetAlert({ title: "Error", text: response.message, icon: "error" });
      }
    } catch (error) {
      alert("Failed to update group: " + error.message);
    }
  };
  const refreshGroupList = () => {
    dispatch(fetchGroup({ clientId: localStorage.getItem("clientId"),pageSize, pageNo: currentPage, SearchStr: filterText }));
  };

  useEffect(() => {
    dispatch(fetchGroup({ clientId: localStorage.getItem("clientId"),pageSize, pageNo: currentPage, SearchStr: filterText }));
    return () => {
      dispatch(clearGroupState());
    };
  }, [dispatch]);

  const handleCreate = () => {
    setCreateModalOpen(true)
  };

  const filteredGroup = groups.filter(
    (group) =>
      group.groupName &&
      group.groupName.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
         <div className="flex flex-col space-y-1 text-start ">
         <label className="font-medium text-gray-700 text-sm  mt-1">Search </label>
         <input
          type="search"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder=""
          className="border rounded py-1 px-2 w-full text-sm"
        />
        </div>
        </div>
        
      </div>

    );
  }, [filterText]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <App>
      
      <div className="flex items-center">
  {loading && <Loading />}
  <div className='mb-1'>
  <h4 className="font-bold mb-2">Groups List</h4>
  </div>
  <div className="ml-auto mb-2">
  <button
            className="uniform_btn"
            onClick={handleCreate}
          >
            Create Group
          </button>
  </div>
</div>
        <div className="overflow-auto">
          <DataTable
            data={filteredGroup}
            columns={groupColumns}
            highlightOnHover
            striped
             pagination
              paginationServer
              paginationTotalRows={totalRecords}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePageSizeChange}
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
                    borderBottom: '1px solid #ddd', // Grid line at the bottom of the header
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
        
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-xl text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <h4 className="text-xl mb-4">Edit Group </h4>
            {groupForm && (
            <form onSubmit={handleUpdateSubmit}>
            <div className="flex flex-col">
                    <label htmlFor="groupName" className="font-semibold mb-2">
                      Group Name
                    </label>
                    <input
                      type="text"
                      id="groupName"
                      name="groupName"
                      value={groupForm.groupName || ""}
                      onChange={handleFormChange}
                      className="p-2 border rounded-md"
                    />
                  </div>
                
                  <div className="mt-4 w-full flex justify-end">
                    <button
                      type="submit"
                      className="uniform_btn"
                    >
                      Save
                    </button>
                  </div>
            </form> )}
          </div>
        </div>
      )}

      {CreateModalOpen &&(
        <GroupForm 
        isVisible={true}
        onClose={handleCancel}
        onsuccess={refreshGroupList}
    />
        
      )}
    </App>
  );
};

export default GroupList;
