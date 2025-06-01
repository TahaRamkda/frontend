import React, { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConversationReport,
  clearConversationReportState,
  setPageSize,
  setCurrentPage,
  fetchChatReportStats,
  fetchChatLogs,
  clearChatLogsState,
  clearChatReportStatsState,
} from "@/slices/ReportSlice";
import { clearMessagesReportState } from "@/slices/ConversationSlice";
import TemplateDropdown from "@/components/Dropdowns/TemplateDropdown";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import { Modal, ModalHeader, ModalBody, Input } from "reactstrap";
import DataTable from "react-data-table-component";
import {
  HiPencilAlt,
  HiTrash,
  HiEye,
  HiInformationCircle,
} from "react-icons/hi";
import { statusOptions } from "@/utils/constants";
import App from "@/components/Layout/App";
import Chatview from "@/pages/Chats/ChatView/indexPop-up";
import AgentDropdown from "@/components/Dropdowns/AgentDropdown";
import { MdSwapHoriz } from "react-icons/md";
import { REFRESH_INTERVAL } from "@/utils/constants";
import SearchBar from "@/components/SearchBar/SearchComponent";
import { excelExportChatReport } from "@/slices/ExportExcel";
import {
  getMonthStart,
  getToday,
} from "@/components/Timepicker/datetimepicker";
import DateTimePicker from "@/components/Timepicker/datetimepicker";
import Select from "react-select";

import { FORMATEDATE } from "@/utils/constants";
import Loader from "@/components/Layout/Loader";
const ChatsReport = () => {
  const dispatch = useDispatch();
  const [senderid, setsenderid] = useState(0);
  const [DetailModal, setDetailModal] = useState(false);
  const {
    conversationReportList,
    chatReportStats,
    chatLogList,
    loading,
    error,
    currentPage,
    pageSize,
    totalRecords,
  } = useSelector((state) => state.reports);

  const [clientId, setClientId] = useState(null);
  const [showchat, setshowchat] = useState(false);
  const [srcStr, setsrcStr] = useState("");
  const [Status, setStatus] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [showtransfer, setshowtransfer] = useState(false);
  const [activeChat, setActiveChat] = useState(0);
  const [CustomerName, setCustomerName] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [agentId, SetAgentId] = useState(0);
  const [PageNum, SetPageNum] = useState(1);
  const [initiated, SetInitiated] = useState("");
  const [page, SetPageSize] = useState(10);

  const [ChatLoading, setChatLoading] = useState(false);

  const [FromDate, setFromDate] = useState(getMonthStart());
  const [ToDate, setToDate] = useState(getToday());
  const [modalOpen, SetModalOpen] = useState(false);
  const [SenderId, setSenderId] = useState(0);
  const [oldAgentId, setoldAgentId] = useState(0);
  const [refreshpage, setrefreshpage] = useState(false); // Track if page is refreshing
  const [Logo, setLogo] = useState("");
  const messageTypeOptions = [
    { value: 0, label: "Conversations" },
    { value: 1, label: "Campaigns" },
    { value: 2, label: "API Messages" },
  ];

  const selectedOption = messageTypeOptions.find((opt) => opt.value === initiated) || "";

  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid #D1D5DB",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : "none",
      "&:hover": {
        borderColor: "#3B82F6",
      },
      minHeight: "2.5rem",
      outline: "none",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      outline: "none",
      boxShadow: "none",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3B82F6"
        : state.isFocused
        ? "#DBEAFE"
        : "white",
      color: state.isSelected ? "white" : "#111827",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#111827",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const ChatsReportColumn = [
    {
      name: "Name",
      selector: (row) => row.fullName,
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Created Date",
      selector: (row) => row.createdDate,
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Expiry Date",
      selector: (row) => row.expiryDate,
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Status",
      selector: (row) => row.statusName,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Sender Name",
      selector: (row) => row.senderName,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Agent",
      selector: (row) => row.agentName,
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Total Messages",
      selector: (row) => row.totalMessages,
      sortable: true,
    },
    { name: "Unread", selector: (row) => row.unreadCount, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <center>
          <div className="flex gap-2">
            <button
              title="View Chat"
              className="uniform_icon_btn"
              onClick={() => handleDetailClick(row)}
            >
              <HiEye style={{ fontSize: "15px" }} />
            </button>
            <button
              title="Chat Logs"
              className="uniform_icon_btn"
              onClick={() => HandleInfoClick(row)}
            >
              <HiInformationCircle style={{ fontSize: "15px" }} />
            </button>
          </div>
        </center>
      ),
    },
  ];

  const handleCancel = () => {
    setshowchat(false);
    dispatch(clearMessagesReportState());
  };
  const handleTransferCancel = () => {
    setshowtransfer(false);
  };

  const HandleInfoClick = (row) => {
    setActiveChat(row.id);
    dispatch(fetchChatLogs({ conversationId: row.id }));
    SetModalOpen(true);
  };
  const HandleCloseInfoClick = () => {
    SetModalOpen(false);
    dispatch(clearChatLogsState());
  };

  const handleSearchString = (setter) => (e) => {
    const searchValue = e;
    setsrcStr(searchValue);

    setter(e);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setChatLoading(true);
      dispatch(
        fetchConversationReport({
          clientId: clientId,
          senderId: senderid,
          srcStr: searchValue,
          ToDate: ToDate,
          agentId: agentId,
          fChatInitiated: initiated,
          FromDate: FromDate,
          status: Status,
          pageSize: page,
          pageNo: PageNum,
        })
      );
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };

  const handleStatusChange = (selectedOptions) => {
    if (Array.isArray(selectedOptions)) {
      const values = selectedOptions.map((option) => option.value); // Extract values
      setStatus(values.join(",")); // Join as a comma-separated string
    } else {
      setStatus(""); // Reset if no selection
    }
  };

  useEffect(() => {
    if (!loading && conversationReportList) {
      setChatLoading(false);
    }
  }, [loading, conversationReportList]);

  const handleSenderChange = (e) => {
    const senderId = e.target.value;

    setsenderid(senderId);
  };

  const handleAgentChange = (e) => {
    const senderId = e.target.value;
    SetAgentId(senderId);
  };

  //   useEffect(() => {
  //     const checkAndFetch = async () => {
  //       const isLiveReporting = JSON.parse(localStorage.getItem("isLiveReporting"));

  //       if (isLiveReporting && !loading) {
  //         setrefreshpage(true);  // Mark the page as refreshing
  //         try {
  //           await dispatch(fetchConversationReport({
  //             clientId: localStorage.getItem("clientId"),
  //             senderId: senderid,
  //             fChatInitiated:initiated,
  //             srcStr:srcStr,
  //             agentId:agentId,
  //             ToDate: ToDate,
  //             FromDate: FromDate,
  //             status:Status,
  //             pageSize, // Example page size
  //             pageNo: currentPage, // Example current page
  //           }));
  //         } catch (error) {
  //           console.error("Error fetching chat monitor:", error);
  //         } finally {
  //           setrefreshpage(false); // Mark refresh completed
  //         }
  //       }
  //     };

  //     const intervalId = setInterval(() => {
  //       // Perform the periodic refresh (e.g., every 5 minutes) if page is loaded
  //       if (!loading) {
  //         checkAndFetch();
  //       }
  //     }, REFRESH_INTERVAL);

  //     // Cleanup interval on component unmount or when page is unloaded
  //     return () => clearInterval(intervalId);
  //   }, [ senderid, srcStr, dispatch]);

  const handleDetailClick = async (row) => {
    setActiveChat(row.id);
    setCustomerName(row.fullName);
    setPhoneNumber(row.phoneNumber);
    setLogo(row.logo);
    setshowchat(true);
  };

  const handleExportToExcel = () => {
    dispatch(
      excelExportChatReport({
        senderId: senderid,
        chatId: activeChat,
        agentId,
        searchStr: srcStr,
        fChatInitiated: initiated,
        fromDate: FromDate,
        toDate: ToDate,
        status: Status,
      })
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientId(localStorage.getItem("clientId"));
    }
  }, []);

  const handleTransferClick = async (id, SenderId, oldAgentId) => {
    setActiveChat(id);
    setSenderId(SenderId);
    setoldAgentId(oldAgentId);
    setshowtransfer(true);
  };

  useEffect(() => {
    if (clientId) {
      setChatLoading(true);
      dispatch(
        fetchConversationReport({
          clientId: clientId,
          senderId: senderid,
          status: Status,
          agentId: agentId,
          fChatInitiated: initiated,
          ToDate: ToDate,
          FromDate: FromDate,
          srcStr: srcStr,
          pageSize: page,
          pageNo: PageNum,
        })
      );
    }

    return () => {
      dispatch(clearConversationReportState());
    };
  }, [
    dispatch,
    clientId,
    senderid,
    Status,
    ToDate,
    FromDate,
    agentId,
    initiated,
  ]);

  useEffect(() => {
    setChatLoading(true);
    dispatch(
      fetchChatReportStats({
        senderId: senderid,
        agentId: agentId,
        pageSize: page,
        pageNo: PageNum,
        FromDate: FromDate,
        ToDate: ToDate,
        srcStr: srcStr,
        fChatInitiated: initiated,
      })
    );

    return () => {
      dispatch(clearChatReportStatsState());
    };
  }, [dispatch, senderid, agentId, FromDate, ToDate, initiated]);

  const handlePageSizeChange = async (newSize) => {
    SetPageSize(newSize);
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to first page
    setChatLoading(true);
    await dispatch(
      fetchConversationReport({
        clientId: clientId,
        status: Status,
        srcStr: srcStr,
        agentId: agentId,
        ToDate: ToDate,
        fChatInitiated: initiated,
        FromDate: FromDate,
        senderId: senderid,
        pageSize: newSize,
        pageNo: 1,
      })
    );
  };

  const handlePageChange = async (pageNo) => {
    SetPageNum(pageNo);
    dispatch(setCurrentPage(pageNo));
    setChatLoading(true);
    await dispatch(
      fetchConversationReport({
        clientId: clientId,
        senderId: senderid,
        status: Status,
        agentId: agentId,
        fChatInitiated: initiated,
        ToDate: ToDate,
        FromDate: FromDate,
        srcStr: srcStr,
        pageSize: page,
        pageNo: pageNo,
      })
    );
  };
  const handleInitiateChange = (selected) => {
    SetInitiated(selected ? selected.value : '');
  };

  const customPageSizes = [1, 5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10;

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className="grid grid-cols-5 gap-4 mb-3">
          <div className="flex flex-col text-start ">
            <SearchBar
              label="Search"
              value={srcStr}
              onChange={handleSearchString(setsrcStr)}
            />
          </div>
          <div className="flex flex-col text-start ">
            <label className="font-medium text-gray-700 text-sm mb-1">
              Source
            </label>
             <Select
              id="initiated"
              value={selectedOption}
              onChange={handleInitiateChange}
              options={messageTypeOptions}
              isClearable
              classNamePrefix="react-select"
              styles={customStyles}
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
              className="border rounded w-100"
            />
          </div>
          <div className="flex flex-col text-start ">
            <label className="font-medium text-gray-700 text-sm mb-1">
              Agents{" "}
            </label>
            <AgentDropdown
              name="agentId"
              value={agentId}
              onChange={handleAgentChange}
              className="border rounded w-100"
            />
          </div>
          <div className="flex flex-col text-start ">
            <label className="font-medium text-gray-700 text-sm mb-1">
              Status
            </label>
            <Select
              options={statusOptions}
              isMulti
              onChange={handleStatusChange}
              className="border rounded "
            />
          </div>
          <div className="flex flex-col text-start mb-1 mt-2">
            <DateTimePicker
              label="From Date"
              value={FromDate}
              onChange={setFromDate}
            />
          </div>
          <div className="flex flex-col text-start mb-1 mt-2">
            <DateTimePicker
              label="To Date"
              value={ToDate}
              minDate={FromDate}
              onChange={setToDate}
            />
          </div>
        </div>
        <div>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white stats shadow-md mb-3 p-2 text-left">
              <h3 className="font-bold mb-0">
                Total Conversation: {chatReportStats.totalConversation ?? "-/-"}
              </h3>
            </div>

            <div className="bg-white stats shadow-md mb-3 p-2 text-left">
              <h3 className="font-bold mb-0">
                Marketing Messages:{" "}
                {chatReportStats.marketingConversation ?? "-/-"}
              </h3>
            </div>

            <div className="bg-white stats shadow-md mb-3 p-2 text-left">
              <h3 className="font-bold mb-0">
                Utility Messages: {chatReportStats.utilityConversation ?? "-/-"}
              </h3>
            </div>

            <div className="bg-white stats shadow-md mb-3 p-2 text-left">
              <h3 className="font-bold mb-0">
                Initiated Messages:{" "}
                {chatReportStats.initiatedConversation ?? "-/-"}
              </h3>
            </div>

            <div className="bg-white stats shadow-md mb-3 p-2 text-left">
              <h3 className="font-bold mb-0">
                Force Closed: {chatReportStats.forceClosed ?? "-/-"}
              </h3>
            </div>

            <div className="bg-white stats shadow-md mb-3 p-2 text-left">
              <h3 className="font-bold mb-0">
                Closed: {chatReportStats.closed ?? "-/-"}
              </h3>
            </div>

            <div className="bg-white stats shadow-md mb-3 p-2 text-left">
              <h3 className="font-bold mb-0">
                Abandon: {chatReportStats.abandon ?? "-/-"}
              </h3>
            </div>

            <div className="bg-white stats shadow-md mb-3 p-2 text-left">
              <h3 className="font-bold mb-0">
                Looking for Agent: {chatReportStats.lookingforAgent ?? "-/-"}
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }, [srcStr, senderid, FromDate, ToDate, chatReportStats, agentId, initiated]);

  return (
    <App>
      <div className="flex items-center">
        {ChatLoading && <Loader />}

        <div className="">
          <h4 className="font-bold ">Chats Report</h4>
        </div>
        <div className="flex ml-auto mb-1 gap-4">
          <button className="uniform_btn" onClick={handleExportToExcel}>
            Export Report
          </button>
        </div>
      </div>

      <DataTable
        data={conversationReportList}
        columns={ChatsReportColumn}
        highlightOnHover
        striped
        pagination
        paginationServer
        paginationTotalRows={totalRecords}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePageSizeChange}
        sortIcon
        sortServer
        paginationPerPage={defultpagessize}
        paginationRowsPerPageOptions={customPageSizes}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        className="w-full border"
      />
      {modalOpen && (
        <Modal isOpen={true} toggle={HandleCloseInfoClick} fade={false}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center  z-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3  relative  overflow-y-auto">
              <ModalHeader toggle={HandleCloseInfoClick}>Chat Logs</ModalHeader>

              <ModalBody className="overflow-auto max-h-[60vh]">
                {loading && <Loader />}

                <table className="min-w-full max-w-full  overflow-auto bg-white border border-gray-200 rounded-md ">
                  <thead>
                    <tr className="bg-gray-100 text-left text-sm uppercase text-gray-600">
                      <th className="py-2 px-4">Agent Full Name</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4">Created Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chatLogList?.map((message, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">
                          {message.agentFullName || "-"}
                        </td>
                        <td className="py-2 px-4">{message.name || "-"}</td>
                        <td className="py-2 px-4">
                          {message.createdDate || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ModalBody>
            </div>
          </div>
        </Modal>
      )}
      {showchat && (
        <Chatview
          ChatId={activeChat}
          isVisible={true}
          PhNo={PhoneNumber}
          logo={Logo}
          CustomerName={CustomerName}
          onClose={handleCancel}
        />
      )}
    </App>
  );
};

export default ChatsReport;
