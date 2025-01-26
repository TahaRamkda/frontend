import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import Loading from "@/components/Layout/Loader";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { fetchAgentShiftList, clearAgentShiftState, deleteAgentShift, fetchAgentsShiftById, updateAgentsShift, setCurrentPage, setPageSize  } from "@/slices/AgentsShift";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import showSweetAlert from "@/components/Sweetalert";
import { HiPencilAlt, HiTrash, HiLightningBolt, HiClock } from "react-icons/hi";
import AgentsShiftForm from "../CreateAgentsShift";
import App from '@/components/Layout/App';
import SearchBar from '@/components/SearchBar/SearchComponent';
//import AgentTiming from "../AgentsTiming/index";

const AgentsShiftList = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { agentShiftList = [], loading, error, pageSize, totalRecords, currentPage } = useSelector((state) => state.agentShifts);
  const { agentShift = [], loading: DetailLoading, error: DetailError } = useSelector((state) => state.agentShifts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentShiftForm, setagentShiftForm] = useState({});
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout  
  const [AgentId, setAgentId] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [CreateModalOpen, setCreateModalOpen] = useState("")

  const agentColumn = [

    { name: "User Name", selector: (row) => row.userName, sortable: true },
    { name: "First Name", selector: (row) => row.agentFName, sortable: true },
    { name: "Last Name", selector: (row) => row.agentLName, sortable: true },
    { name: "Status", selector: (row) => row.statusName, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <>
          <div className="flex gap-2">
            <button onClick={() => handleDetailClick(row.id)} title="Edit Agent" className="uniform_icon_btn ">
              <HiPencilAlt style={{ fontSize: "15px" }} />
            </button>
            <button onClick={() => handleDeleteClick(row.id)} title="Delete Agent" className="uniform_icon_btn">
              <HiTrash style={{ fontSize: "15px" }} />
            </button>
          </div>        </>
      ),
    },
  ];


 

  const handleDetailClick = async (agentId) => {

    try {
      // Dispatch the action to fetch agentShift by ID
      await dispatch(fetchAgentsShiftById({ clientId: localStorage.getItem('clientId'), agentId })).unwrap();

      setAgentId(agentId);
      
      setIsModalOpen(true); // Open the modal

    }

    catch (error) {
      showSweetAlert("Failed to fetch details: " + error.message);
    }
  };

  const handleCancel = () => {
    setCreateModalOpen(false);

  };
  const handleDeleteClick = (agentShiftId) => {
    SweetAlert.fire({
      title: "Are you sure?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAgentShift({ agentShiftId: agentShiftId })).then(() => {
          showSweetAlert({
            title: "Deleted Successfully",
            text: "",
            icon: "success",
          });
          refreshAgentShiftList();
        })
          .catch((error) => {
            alert("An unexpected error occurred: " + error.message);
          });
      }
    });
  };

 

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setagentShiftForm({ ...agentShiftForm, [name]: value });
  };
  const handleClose = () => {
    setshowagenttiming(false);

  };
  const handleDropdownChange = (selectedValues) => {
    setagentShiftForm({ ...agentShiftForm, senderIds: selectedValues.join(",") });  // Join selected values back into a comma-separated string
  };
  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));

    // Fetch clients for the new page
    await dispatch(fetchAgentShiftList({ clientId: localStorage.getItem("clientId"), searchStr: filterText, pageNo: page, pageSize }));
  };

  const handlePageSizeChange = async (newSize) => {
    // Update page size and reset to the first page
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to first page
    // Fetch data with updated page size and reset to page 1
    await dispatch(fetchAgentShiftList({ clientId: localStorage.getItem("clientId"), searchStr: filterText, pageNo: 1, pageSize:newSize }));
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        id: AgentId || 0,
        client_Id: localStorage.getItem('clientId') || 0,
        userName: agentShiftForm.userName || "",
        password: agentShiftForm.password || "",
        agentFName: agentShiftForm.agentFName || "",
        agentLName: agentShiftForm.agentLName || "",
        senderIds: agentShiftForm.senderIds || "",
        actionBy: localStorage.getItem('userId'),
      };

      const response = await dispatch(updateAgentsShift(requestBody)).unwrap();
      if (response) {
        showSweetAlert({
          title: "Updated Successfully",
          text: "",
          icon: "success",
        });
        setIsModalOpen(false);
        refreshAgentShiftList();
      } else {
        showSweetAlert({ title: "Failed", text: response.message, icon: "error" });
      }
    } catch (error) {
      alert("Failed to update: " + error.message);
    }
  };
  const toggleModal = () => {

    setIsModalOpen(false);
  };
  
  const handleSearchString = (setter) => (e) => {
    const searchValue = e;
    setFilterText(searchValue);
    setter(e)
    // Clear the previous timeout if any
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout for 0.5 seconds
    const timeout = setTimeout(() => {
      dispatch(
        fetchAgentShiftList({
          clientId: localStorage.getItem("clientId"),
          searchStr: searchValue,
          pageNo: currentPage,
          pageSize,
        })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };
  const refreshAgentShiftList = () => {
    dispatch(fetchAgentShiftList({ clientId: localStorage.getItem("clientId") , searchStr: filterText, pageNo: currentPage, pageSize }));
  };

  useEffect(() => {
    dispatch(fetchAgentShiftList({ clientId: localStorage.getItem("clientId"), searchStr: filterText, pageNo: currentPage, pageSize }));
    return () => {
      dispatch(clearAgentShiftState());
    };
  }, [dispatch]);

  const filteredAgentsShift = useMemo(
    () =>
      (agentShiftList || []).filter(
        (agentShift) =>
          agentShift.agentFName.toLowerCase().includes(filterText.toLowerCase()) ||
          agentShift.agentLName.toLowerCase().includes(filterText.toLowerCase())
      ),
    [agentShiftList, filterText]
  );
  const customPageSizes = [1 ,5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10
  const subHeaderComponentMemo = useMemo(
    () => (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
          <div className="flex flex-col mb-1  text-start ">
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
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  return (
    <App>

      <div className="flex items-center">
        {loading && <Loading />}
        <div className=''>
          <h4 className="font-bold ">Agents Shift</h4>
        </div>
        <div className="ml-auto mb-1">
          <button className="uniform_btn" onClick={() => setCreateModalOpen(true)}>
            Create Agent Shift
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <DataTable
          data={filteredAgentsShift}
          columns={agentColumn}
          highlightOnHover
          striped
          pagination
          paginationServer
          paginationTotalRows={totalRecords}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePageSizeChange}
          paginationPerPage={defultpagessize} // Default number of rows per page
          paginationRowsPerPageOptions={customPageSizes} // Custom page size options
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
          }} />

      </div>
      {isModalOpen && (
        <Modal isOpen={true} toggle={() => toggleModal()} fade={false}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
              <ModalHeader toggle={() => toggleModal()}>Edit Agents Shift</ModalHeader>
              <ModalBody>
                <form onSubmit={handleUpdateSubmit}>
                  <div>
                    <label className="font-medium text-gray-700 text-sm">First Name</label>
                    <input
                      type="text"
                      id="agentFName"
                      name="agentFName"
                      value={agentShiftForm.agentFName || ""} // Bind value from agentShiftForm
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>
                  <div md={6}>

                    <label className="font-medium text-gray-700 text-sm">Last Name</label>
                    <input
                      type="text"
                      id="agentLName"
                      name="agentLName"
                      value={agentShiftForm.agentLName || ""} // Bind value from agentShiftForm
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />

                  </div>
                  <div className="flex mt-6 justify-end">
                    <button className="uniform_btn" type="submit">
                      Save
                    </button>
                  </div>

                </form>
              </ModalBody>
            </div>
          </div>
        </Modal>


      )}

      {CreateModalOpen && (
        <AgentsShiftForm
          onsuccess={refreshAgentShiftList}
          isVisible={true}
          onClose={handleCancel}
        />
      )}
    </App>
  );
};

export default AgentsShiftList;
