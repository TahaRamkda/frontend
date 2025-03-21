import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SweetAlert from "sweetalert2";
import DataTable from "react-data-table-component";
import Loading from "@/components/Layout/Loader";
import { Formik } from "formik";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import chatReasonDropdown from "@/components/MultiSelect/ChatReasonDropdown";
import {
  fetchAgents,
  cleaAgentState,
  deleteAgent,
  fetchAgentsById,
  updateAgent,
  agentShiftBulkUpload,
  clearBulkUploadState,
  setCurrentPage,
  setPageSize,
} from "@/slices/AgentSlice";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import showSweetAlert from "@/components/Sweetalert";
import { HiPencilAlt, HiTrash, HiLightningBolt, HiClock } from "react-icons/hi";
import SendernamesDropdown from "@/components/MultiSelect/SendernameDropdown";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import AgentsForm from "../CreateAgents";
import App from "@/components/Layout/App";
import SearchBar from "@/components/SearchBar/SearchComponent";
import ChatReasonDropdown from "@/components/MultiSelect/ChatReasonDropdown";
//import AgentTiming from "../AgentsTiming/index";
const AgentTiming = dynamic(() => import("../AgentsTiming"), { ssr: false });
const AgentsList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    agents = [],
    loading,
    error,
    pageSize,
    totalRecords,
    currentPage,
  } = useSelector((state) => state.agents);
  const {
    agent = [],
    loading: DetailLoading,
    error: DetailError,
  } = useSelector((state) => state.agents);
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentForm, setagentForm] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [SenderId, setSenderId] = useState(0);
  const [AgentFirstName, setAgentFirstName] = useState("");
  const [AgentLastName, setAgentLastName] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [AgentId, setAgentId] = useState(null);
  const [chatReasonIds, SetAgentChatReasonId] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [showagenttiming, setshowagenttiming] = useState("");
  const [FieldValue, setFieldValue] = useState(null); // Track uploaded file URL
  const [CreateModalOpen, setCreateModalOpen] = useState("");
  const [existinSenderId, setexistingSenderId] = useState([]);
  const [existingChatReasonId, SetExistingChatReasonId] = useState([]);

  const agentColumn = [
    { name: "User Name", selector: (row) => row.userName, sortable: true },
    {
      name: "Agent Name",
      selector: (row) => `${row.agentFName} ${row.agentLName}`,
      sortable: true,
      cell: (row) => (
        <div style={{ width: "100%" }}>
          {row.agentFName} {row.agentLName}
        </div>
      ),
    },
    
    {
      name: "Agent Name AR",
      selector: (row) => `${row.agentFNameAR} ${row.agentLNameAR}`,
      sortable: true,
      cell: (row) => (
        <div style={{ textAlign: "right", direction: "rtl", width: "100%" }}>
          {row.agentFNameAR} {row.agentLNameAR}
        </div>
      ),
    },
    { name: "Status", selector: (row) => row.statusName, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <>
          <div className="flex gap-2 justify-center w-full">
            <button
              onClick={() => handleDetailClick(row.id)}
              title="Edit Agent"
              className="uniform_icon_btn"
            >
              <HiPencilAlt style={{ fontSize: "15px" }} />
            </button>
            {/* <button
              onClick={() => handleTime(row)}
              title="Agents Timming"
              className="uniform_icon_btn"
            >
              <HiClock style={{ fontSize: "15px" }} />
            </button> */}
            <button
              onClick={() => handleDeleteClick(row.id)}
              title="Delete Agent"
              className="uniform_icon_btn"
            >
              <HiTrash style={{ fontSize: "15px" }} />
            </button>
          </div>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (agent) {
      setagentForm(agent);
      setexistingSenderId(
        agent.senderIds?.replace(/['"]+/g, "").split(",").map(Number)
      );
      SetExistingChatReasonId(
        agent.chatReasonIds?.replace(/['"]+/g, "").split(",").map(Number)
      );
    }
  }, [dispatch, agent]);
  const handleDetailClick = async (agentId) => {
    try {
      // Dispatch the action to fetch agent by ID
      await dispatch(
        fetchAgentsById({ clientId: localStorage.getItem("clientId"), agentId })
      ).unwrap();

      setAgentId(agentId);

      setIsModalOpen(true); // Open the modal
    } catch (error) {
      showSweetAlert("Failed to fetch details: " + error.message);
    }
  };

  const handleCancel = () => {
    setCreateModalOpen(false);
  };
  const handleDeleteClick = (agentId) => {
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
        dispatch(deleteAgent({ agentId: agentId }))
          .then(() => {
            showSweetAlert({
              title: "Deleted Successfully",
              text: "",
              icon: "success",
            });
            refreshAgentList();
          })
          .catch((error) => {
            alert("An unexpected error occurred: " + error.message);
          });
      }
    });
  };


  const handleTime = (agentId) => {
    setAgentId(agentId.id);
    setAgentFirstName(agentId.agentFName);
    setAgentLastName(agentId.agentLName);
    setshowagenttiming(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setagentForm({ ...agentForm, [name]: value });
  };

  const handleChange = (e) => {
    const senderId = e.target.value;
    setSenderId(senderId);
   
  };
  const handleClose = () => {
    setshowagenttiming(false);
  };
  const handleDropdownChange = (selectedValues) => {
    setagentForm({ ...agentForm, senderIds: selectedValues.join(",") });
  };
  const HandleChatReasonChange = (selectedValues) => {
    setagentForm({ ...agentForm, chatReasonIds: selectedValues.join(",") });
  };

  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));
    // Fetch clients for the new page
    await dispatch(
      fetchAgents({
        clientId: localStorage.getItem("clientId"),
        senderId: SenderId,
        searchStr: filterText,
        pageNo: page,
        pageSize,
      })
    );
  };

  const handlePageSizeChange = async (newSize) => {
    // Update page size and reset to the first page
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to first page
    // Fetch data with updated page size and reset to page 1
    await dispatch(
      fetchAgents({
        clientId: localStorage.getItem("clientId"),
        senderId: SenderId,
        searchStr: filterText,
        pageNo: 1,
        pageSize: newSize,
      })
    );
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        id: AgentId || 0,
        client_Id: localStorage.getItem("clientId") || 0,
        userName: agentForm.userName || "",
        password: agentForm.password || "",
        agentFName: agentForm.agentFName || "",
        chatReasonIds: agentForm.chatReasonIds || "",
        agentLName: agentForm.agentLName || "",
        agentFNameAR: agentForm.agentFNameAR || "",
        agentLNameAR: agentForm.agentLNameAR || "",
        senderIds: agentForm.senderIds || "",
        actionBy: localStorage.getItem("userId"),
      };

      const response = await dispatch(updateAgent(requestBody)).unwrap();
      if (response) {
        showSweetAlert({
          title: "Updated Successfully",
          text: "",
          icon: "success",
        });
        setIsModalOpen(false);
        refreshAgentList();
      } else {
        showSweetAlert({
          title: "Failed",
          text: response.message,
          icon: "error",
        });
      }
    } catch (error) {
      alert("Failed to update: " + error.message);
    }
  };
  const toggleModal = () => {
    setIsModalOpen(false);
  };
  const HandelCloseModal = () => {
    setShowModal(false);
  };
  const HandleShiftBulkUpload = async () => {
    const formData = new FormData();
    formData.append("ClientId", localStorage.getItem("clientId"));
    formData.append("File", FieldValue);
    formData.append("ActionBy", localStorage.getItem("userId"));
    try {
      const response = await dispatch(agentShiftBulkUpload(formData)).unwrap();
      setShowModal(false);

      if (response.success) {
        dispatch(clearBulkUploadState());

        showSweetAlert({
          title: "Uploaded Successfully",
          text: "",
          icon: "success",
        });

        // window.location.reload();
      } else {
        showSweetAlert({
          title: "Failed",
          text: response.result.message || "",
          icon: "error",
        });
      }
    } catch (err) {
      console.error("Failed to Upload", err);
      showSweetAlert({
        title: "Failed",
        text: err.message || "",
        icon: "error",
      });
    }
  };

  const HandelClickModal = () => {
    setShowModal(true);
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
        fetchAgents({
          clientId: localStorage.getItem("clientId"),
          senderId: SenderId,
          searchStr: searchValue,
          pageNo: currentPage,
          pageSize,
        })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };
  const refreshAgentList = () => {
    dispatch(
      fetchAgents({
        clientId: localStorage.getItem("clientId"),
        senderId: SenderId,
        searchStr: filterText,
        pageNo: currentPage,
        pageSize,
      })
    );
  };

  useEffect(() => {
    dispatch(
      fetchAgents({
        clientId: localStorage.getItem("clientId"),
        senderId: SenderId,
        searchStr: filterText,
        pageNo: currentPage,
        pageSize,
      })
    );
    return () => {
      dispatch(cleaAgentState());
    };
  }, [dispatch,SenderId]);

  const filteredAgents = useMemo(
    () =>
      (agents || []).filter(
        (agent) =>
          agent.agentFName.toLowerCase().includes(filterText.toLowerCase()) ||
          agent.agentLName.toLowerCase().includes(filterText.toLowerCase())
      ),
    [agents, filterText]
  );
  const customPageSizes = [1, 5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10;
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
          <div className="flex flex-col mb-1 text-start">
            <label className="font-medium text-gray-700 text-sm mb-1">
              Sender Names
            </label>
            <SendernameDropdown name="senderId" onChange={handleChange} />
          </div>
        </div>
      </div>
    ),
    [filterText,SenderId]
  );
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  return (
    <App>
      <div className="flex items-center">
        {loading && <Loading />}
        <div className="">
          <h4 className="font-bold ">Agents</h4>
        </div>
        <div className="flex ml-auto mb-1 gap-4">
          <button
            className="uniform_btn"
            onClick={() => setCreateModalOpen(true)}
          >
            Create Agent
          </button>
          <button className="uniform_btn" onClick={HandelClickModal}>
            Bulk Shift Upload
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <DataTable
          data={filteredAgents}
          columns={agentColumn}
          highlightOnHover
          striped
          pagination
          paginationServer
          sortIcon
          sortServer
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
                width: "100%",
                borderCollapse: "collapse", // Ensures borders collapse for proper grid appearance
              },
            },
            headRow: {
              style: {
                borderBottom: "1px solid #ddd",
                padding: "0px",
              },
            },
            headCells: {
              style: {
                borderRight: "1px solid #ddd", // Grid line between columns
                fontWeight: "bold",
              },
            },
            rows: {
              style: {
                borderBottom: "1px solid #ddd", // Horizontal grid line between rows
              },
            },
            cells: {
              style: {
                borderRight: "1px solid #ddd", // Vertical grid line between cells
              },
            },
          }}
        />
      </div>
      {isModalOpen && (
        <Modal isOpen={true} toggle={() => toggleModal()} fade={false}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
              <ModalHeader toggle={() => toggleModal()}>
                Edit Agents
              </ModalHeader>
              <ModalBody className="max-h-[60vh] overflow-auto">
                <form onSubmit={handleUpdateSubmit}>
                  <div>
                    <label className="font-medium text-gray-700 text-sm">
                      Sender Name
                    </label>
                    <SendernamesDropdown
                      name="senderIds"
                      // Ensure senderIds is split into an array for multi-select
                      value={agentForm.senderIds || []} // Split string to array
                      onChange={(value) => handleDropdownChange(value)} // Handle value change
                      className="border rounded py-1 px-2 w-full text-sm"
                      existingdata={existinSenderId}
                    />
                  </div>
                  <div>
                    <label className="font-medium text-gray-700 text-sm">
                      Chat Reason
                    </label>
                    <ChatReasonDropdown
                      name="chatReasonIds"
                      // Ensure senderIds is split into an array for multi-select
                      value={agentForm.chatReasonIds || []} // Split string to array
                      onChange={(value) => HandleChatReasonChange(value)} // Handle value change
                      className="border rounded py-1 px-2 w-full text-sm"
                      existingdata={existingChatReasonId}
                    />
                  </div> 
                  <div>
                    <label className="font-medium text-gray-700 text-sm">
                      First Name Arabic
                    </label>
                    <input
                      type="text"
                      id="agentFNameAR"
                      name="agentFNameAR"
                      value={agentForm.agentFNameAR || ""} // Bind value from agentForm
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>
                  <div md={6}>
                    <label className="font-medium text-gray-700 text-sm">
                      Last Name Arabic
                    </label>
                    <input
                      type="text"
                      id="agentLNameAR"
                      name="agentLNameAR"
                      value={agentForm.agentLNameAR || ""} // Bind value from agentForm
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-gray-700 text-sm">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="agentFName"
                      name="agentFName"
                      value={agentForm.agentFName || ""} // Bind value from agentForm
                      onChange={handleFormChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-gray-700 text-sm">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="agentFName"
                      name="agentFName"
                      value={agentForm.agentFName || ""} // Bind value from agentForm
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
      {showagenttiming && (
        <AgentTiming agentId={AgentId} isVisible={true} onClose={handleClose} AgentFirstName={AgentFirstName} AgentLastName={AgentLastName} />
      )}

      {CreateModalOpen && (
        <AgentsForm
          onsuccess={refreshAgentList}
          isVisible={true}
          onClose={handleCancel}
        />
      )}
      {showModal && (
        <Modal isOpen={true} toggle={HandelCloseModal} fade={false}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center ">
            <div className="bg-white p-6 rounded shadow-lg w-1/4  relative">
              <ModalHeader toggle={HandelCloseModal}>
                Bulk Shift Upload
              </ModalHeader>
              <ModalBody>
                <div>
                  <div className="col-span-4">
                    <Formik initialValues={{ UploadFile: null }}>
                      {({ isSubmitting }) => (
                        <Form>
                          <div className="">
                            <div className="">
                              <Input
                                type="file"
                                className="p-2"
                                accept=".xls,.xlsx"
                                required
                                onChange={(event) => {
                                  const file = event.currentTarget.files[0];
                                  setFieldValue(file);
                                }}
                              />
                            </div>
                            <div className="flex justify-between items-center w-full mt-4">
                              {/* Link aligned to the start */}
                              <div>
                                <a
                                  href="\assets\TimesheetUpload.xlsx"
                                  download
                                  className="text-blue-500 hover:underline"
                                >
                                  Download Sample File
                                </a>
                              </div>
                              {/* Button aligned to the end */}
                              <div>
                                <Button
                                  className="uniform_btn"
                                  onClick={HandleShiftBulkUpload}
                                >
                                  Upload
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                    {/* Download File Button */}
                  </div>
                </div>
              </ModalBody>
            </div>
          </div>
        </Modal>
      )}
    </App>
  );
};

export default AgentsList;
