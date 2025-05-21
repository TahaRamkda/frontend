"use client";
import React, { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAgentsMonitor,
  clearAgentMonitorState,
  setPageSize,
  setCurrentPage,
  agentDisable,
  clearAgentDisableState,
} from "@/slices/SuperwiseSlice";
import TemplateDropdown from "@/components/Dropdowns/TemplateDropdown";
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
  CustomInput,
} from "reactstrap";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import { excelExportAgentMonitor } from "@/slices/ExportExcel";
import DataTable from "react-data-table-component";
import Loading from "@/components/Layout/Loader";
import { MdEdit } from "react-icons/md";
import App from "@/components/Layout/App";
import sweetalert from "sweetalert2";
import Switch from "react-switch";
import { REFRESH_INTERVAL } from "@/utils/constants";
import DateTimePicker from "@/components/Timepicker/datetimepicker";
import SearchBar from "@/components/SearchBar/SearchComponent";
import { set } from "date-fns";
const MessageSummary = () => {
  const dispatch = useDispatch();
  const [senderid, setsenderid] = useState(0);
  const [AgentLoading, setAgentLoading] = useState(false);
  const [srcStr, setsrcStr] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [isfilteropen, setisfilteropen] = useState(false);
  const [showfilterbutton, setshowfilterbutton] = useState(true);
  const [sortField, setSortField] = useState(null); // Field to sort by
  const [sortDirection, setSortDirection] = useState("asc"); // Sort direction: 'asc' or 'desc'
  const [sortedData, setSortedData] = useState([]); // Local state for sorted data
  const [ShowEditModal, setShowEditModal] = useState(false);
  const { agentsMonitor, loading, error, currentPage, pageSize, totalRecords } =
    useSelector((state) => state.Supervisor);
  const [clientId, setClientId] = useState(null);
  const [refreshpage, setrefreshpage] = useState(false); // Track if page is refreshing
  const ChatsReportColumn = [
    { name: "Agent", selector: (row) => row?.agentName, sortable: true, minWidth: "200px", },
    {
      name: "Status",
      selector: (row) => row?.status,
      sortable: true,
      cell: (row) => (
        <span
          style={{
            color: getStatusColor(row?.status),
            fontWeight: "bold",
          }}
        >
          {row?.statusName}
        </span>
      ),
    },
    { name: "Active ", selector: (row) => row?.activeChat, sortable: true },
    { name: "Unread", selector: (row) => row?.unreadCount || 0, sortable: true },
    { name: "Assigned", selector: (row) => row?.assignedChat, sortable: true },
    {
      name: "Unassigned",
      selector: (row) => row?.unAssignedChat,
      sortable: true,
    },
    {
      name: "Abandoned",
      selector: (row) => row?.abandonChat,
      sortable: true,
    },
    {
      name: "Force closed",
      selector: (row) => row?.forceClosedChat,
      sortable: true,
     
    },
    {
      name: "Closed",
      selector: (row) => row?.closedChat,
      sortable: true,
    },
    {
      name: "Expired",
      selector: (row) => row?.forceClosedChat,
      sortable: true,
    },

    {
      name: "Action",
      cell: (row) => (
        <div style={{ textAlign: "center" }}>
          <Switch
            onChange={() => handleAction(row.agentId, row.isDisabled)}
            checked={!row.isDisabled} // Button is ON if the user is disabled
            onColor="#28a745"
            offColor="#dc3545"
            height={35}
            width={80}
            checkedIcon={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  fontSize: 12,
                  color: "white",
                  whiteSpace: "nowrap",
                  padding: "0 12px",
                }}
              >
                Enabled
              </div>
            }
            uncheckedIcon={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  fontSize: 12,
                  color: "white",
                  whiteSpace: "nowrap",
                  padding: "0 12px",
                }}
              >
                Disabled
              </div>
            }
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    setSortedData(agentsMonitor);
  }, [agentsMonitor]);

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "grey";
      case 1:
        return "#28a745";
      default:
        return "#dc3545";
    }
  };
  const handleExportToExcel = () => {
    dispatch(
      excelExportAgentMonitor({
        senderId: senderid,
        searchStr: srcStr,
      })
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientId(localStorage.getItem("clientId"));
    }
  }, []);

  useEffect(() => {
    const checkAndFetch = async () => {
      const isLiveReporting = JSON.parse(
        localStorage.getItem("isLiveReporting")
      );
      if (isLiveReporting && !loading) {
        try {
          await dispatch(
            fetchAgentsMonitor({
              clientId: localStorage.getItem("clientId"),
              senderId: senderid,
              srcStr: srcStr,
              pageSize,
              pageNo: currentPage,
              
            })
          );
        } catch (error) {
          console.error("Error fetching chat monitor:", error);
        } finally {
          setrefreshpage(false); // Mark refresh completed
        }
      }
    };
    const intervalId = setInterval(() => {
      // Perform the periodic refresh (e.g., every 5 minutes) if page is loaded
      if (!loading) {
        checkAndFetch();
      }
    }, REFRESH_INTERVAL);
    // Cleanup interval on component unmount or when page is unloaded
    return () => clearInterval(intervalId);
  }, [pageSize, senderid, currentPage, srcStr, dispatch]);

  useEffect(() => {
    if (!loading && agentsMonitor) {
      setAgentLoading(false);
    }
  }, [loading, agentsMonitor]);


  const handleSort = (column, direction) => {
    const field = column.selector;
    setSortField(field);
    setSortDirection(direction);
  
    const sorted = [...sortedData].sort((a, b) => {
      const aValue = field(a);
      const bValue = field(b);
  
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
  
    setSortedData(sorted);
  };
  useEffect(() => {
    const clientId = localStorage.getItem("clientId");
    setAgentLoading(true);
    dispatch(
      fetchAgentsMonitor({
        clientId: clientId,
        senderId: senderid,
        srcStr: srcStr,
        pageSize,
        pageNo: currentPage,
        
      })
    );
    return () => {
      clearAgentMonitorState();
    };
  }, [dispatch, senderid, clientId]);

  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    setsenderid(senderId);
  };
  const refreshlist = () => {
    setAgentLoading(true);
    dispatch(
      fetchAgentsMonitor({
        clientId: clientId,
        senderId: senderid,
        srcStr: srcStr,
        pageSize,
        pageNo: currentPage,
      })
    );
  };
  const handleSearchString = (setter) => (e) => {
    const searchValue = e ? e.toLowerCase() : ""; // Ensure searchValue is a string
    setsrcStr(searchValue);
    setter(e);
  
    // Clear the previous timeout if any
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  
    // Only filter if agentsMonitor is available
    const filteredData = agentsMonitor && agentsMonitor.length > 0
      ? searchValue
        ? agentsMonitor.filter((row) =>
            ChatsReportColumn.some((column) => {
              // Skip columns without a selector (e.g., Action)
              if (!column.selector) return false;
              const value = column.selector(row);
              // Ensure value is valid before checking includes
              return value != null && value.toString().toLowerCase().includes(searchValue);
            })
          )
        : [...agentsMonitor] // Reset to full copy of agentsMonitor if search is empty
      : []; // Return empty array if agentsMonitor is not yet loaded
  
    setSortedData(filteredData);
  
    // Debounced server-side fetch (commented out as per your code)
    // const timeout = setTimeout(() => {
    //   setAgentLoading(true);
    //   dispatch(
    //     fetchAgentsMonitor({
    //       clientId: clientId,
    //       senderId: senderid,
    //       srcStr: searchValue,
    //       pageSize,
    //       pageNo: currentPage,
    //       
    //     })
    //   );
    // }, 500);
  
    // setSearchTimeout(timeout);
  };
  // const handlePageSizeChange = async (newSize) => {
  //   // Update page size and reset to the first page
  //   dispatch(setPageSize(newSize));

  //   dispatch(setCurrentPage(1)); // Reset to first page
  //   setAgentLoading(true);
  //   // Fetch data with updated page size and reset to page 1
  //   await dispatch(
  //     fetchAgentsMonitor({
  //       clientId: clientId,
  //       senderId: senderid,
  //       srcStr: srcStr,
  //       
  //       pageSize: newSize,
  //       pageNo: 1,
  //     })
  //   );
  // };
  const editModalClick = () => {
    setShowEditModal(true);
  };
  const toggleModal = () => {
    setShowEditModal(false);
  };
  const handleAction = async (agentId, currentStatus) => {
    const action = currentStatus ? "enable" : "disable";
    const newStatus = !currentStatus;

    const confirmation = await sweetalert.fire({
      title: `Are you sure you want to ${action} this agent?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (confirmation.isConfirmed) {
      try {
        const clientId = localStorage.getItem("clientId");
        const response = await dispatch(
          agentDisable({
            agentId: agentId,
            disable: newStatus,
            clientId: clientId,
          })
        ).unwrap();

        if (response.result) {
          sweetalert.fire(
            "Success",
            `Agent has been ${action}d successfully.`,
            "success"
          );
          refreshlist();
        } else {
          sweetalert.fire(
            "Error",
            response.message || "Failed to update agent status.",
            "error"
          );
        }
      } catch (error) {
        sweetalert.fire(
          "Error",
          "An error occurred while updating the agent status.",
          "error"
        );
      }
    }
  };

  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));
    setAgentLoading(true);

    // Fetch clients for the new page
    await dispatch(
      fetchAgentsMonitor({
        clientId: clientId,
        senderId: senderid,
        srcStr: srcStr,
        pageSize,
        pageNo: page,
      })
    );
  };

  // const customPageSizes = [1, 5, 10, 20, 50, 100]; // Custom page size options
  // const defultpagessize = 100;
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4">
        <div className="flex flex-col text-start ">
            <SearchBar
              label="Search"
              value={srcStr}
              onChange={handleSearchString(setsrcStr)}
            />
          </div>

          <div className="flex flex-col text-start ">
            <label className="font-medium text-gray-700 text-sm mb-1">
              Sender Names
            </label>
            <SendernameDropdown
              name="senderId"
              value={senderid}
              onChange={handleSenderChange}
              className="border rounded  w-100"
            />
          </div>
        </div>
      </div>
    );
  });
  // Pagination calculations

  return (
    <App>
      <div className="flex items-center">
        {AgentLoading && <Loading />}
        <div className="">
          <h4 className="font-bold ">Agents Monitor</h4>
        </div>
        <div className="flex ml-auto mb-1 gap-4">
          <button className="uniform_btn" onClick={handleExportToExcel}>
            Export Report
          </button>
        </div>
      </div>
      <DataTable
        data={sortedData}
        columns={ChatsReportColumn}
        highlightOnHover
        striped
        // pagination
        // paginationServer
        onSort={handleSort}
        // paginationTotalRows={totalRecords}
        // onChangePage={handlePageChange}
        // onChangeRowsPerPage={handlePageSizeChange}
        // paginationPerPage={defultpagessize} // Default number of rows per page
        // paginationRowsPerPageOptions={customPageSizes} // Custom page size options
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        className="w-full border"
      />
      {ShowEditModal && (
        <Modal isOpen={true} toggle={toggleModal} fade={false}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
              <ModalHeader toggle={toggleModal}>Edit Agent</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col">
                    <label
                      htmlFor="agentStatus"
                      className="font-medium text-gray-700 text-sm"
                    >
                      Agent Status
                    </label>
                    <Input
                      type="checkbox"
                      id="agentStatus"
                      name="agentStatus"
                      checked={values.disable}
                      onChange={handleCheckboxChange}
                      className="border rounded py-1 px-2 w-full mt-1 text-sm"
                    />
                  </div>
                  <div className="mt-4 w-full flex justify-end">
                    <button type="submit" className="uniform_btn">
                      Save
                    </button>
                  </div>
                </form>
              </ModalBody>
            </div>
          </div>
        </Modal>
      )}
    </App>
  );
};

export default MessageSummary;
