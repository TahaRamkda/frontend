"use client";
import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatsMonitor, clearChatsMonitorState, setPageSize, setCurrentPage, SupervisorCloseChat } from "@/slices/SuperwiseSlice";
import { excelExportChatMonitor } from '@/slices/ExportExcel';
import SendernameDropdown from '@/components/Dropdowns/SendernameDropdown';
import DataTable from "react-data-table-component";
import {HiEye} from "react-icons/hi";
import Loading from '@/components/Layout/Loader';
import showSweetAlert from '@/components/Sweetalert';
import App from '@/components/Layout/App';
import Chatview from '@/pages/Chats/ChatView/indexPop-up';
import TransferChat from '../TransferChat';
import { MdSwapHoriz } from "react-icons/md";
import { REFRESH_INTERVAL } from '@/utils/constants';
import SearchBar from '@/components/SearchBar/SearchComponent';
import Select from "react-select";
import AgentDropdown from '@/components/Dropdowns/AgentDropdown';
import SweetAlert from 'sweetalert2';
const ChatsMonitor = () => {
  const dispatch = useDispatch();
  const [senderid, setsenderid] = useState(0);
  const [DetailModal, setDetailModal] = useState(false);
  const { chatsMonitor, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.Supervisor);
  const [clientId, setClientId] = useState(null);
  const [showchat, setshowchat] = useState(false);
  const [srcStr, setsrcStr] = useState('');
  const [Status, setStatus] = useState("");
  const [Size, setSize] = useState(10);
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [showtransfer, setshowtransfer] = useState(false);
  const [activeChat, setActiveChat] = useState(0);
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [ChatLoading, setChatLoading] = useState(false)
  const [SenderId, setSenderId] = useState(0);
  const [oldAgentId, setoldAgentId] = useState(0);
  const [agentId, SetAgentId] = useState(0);
  const [CustomerName, setCustomerName] = useState('');
  const [refreshpage, setrefreshpage] = useState(false);  // Track if page is refreshing
  const [initiated , SetInitiated] = useState(0);
 
  const statusOptions = [
    { value: '0', label: "Auto Chat" },
    { value: '1', label: "Looking For Agent" },
    { value: '2', label: "Agent Assigned" },
    { value: '3', label: "Chat Closed" },
    { value: '4', label: "Chat Expired" },
    { value: '5', label: "Chat Force Closed" },
  ];
  const ChatsReportColumn = [
    { name: "Name", selector: (row) => row.fullName, sortable: true,  width: '9%' },
    { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true,  width: '11.11%'   },
    { name: "Created Date", selector: (row) => row.createdDate, sortable: true,  width: '18%'  },
    { name: "Status", selector: (row) => row.statusName, sortable: true,  width: '10%' },
    { name: "Sender Name", selector: (row) => row.senderName, sortable: true,  width: '11%' },
    { name: "Agent", selector: (row) => row.agentName, sortable: true },
    { name: "Total Messages", selector: (row) => row.totalMessages, sortable: true,  width: '11.11%'  },
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
                title="Close Chat"
                className="uniform_icon_btn"
                onClick={() => HandleCloseChat(row.id)}
              >
                <i class="fa fa-window-close-o" aria-hidden="true" style={{ fontSize: "15px" }}></i>
              </button>
              {row.status !== 3 && (
                <button
                  title="Transfer Chat"
                  className="uniform_icon_btn"
                  onClick={() => handleTransferClick(row.id, row.senderId, row.agentId)}
                >
                  <MdSwapHoriz style={{ fontSize: "15px" }} />
                </button>
              )}
            </div>
          </center>
        ),
        width: "11.11%",
      },
    ];
    
 
  const handleCancel = () => {
    setshowchat(false);
  };
  const handleTransferCancel = () => {
    setshowtransfer(false);
  };
  const handleAgentChange = (e) => {
    const agentId = e.target.value;
    SetAgentId(agentId);
  };
  const HandleCloseChat = async (ChatId) => {
    setChatLoading(true)
    try {
      
      const result = await SweetAlert.fire({
        title: "Are you sure you want to close this chat?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      });
      if (result.isConfirmed) {
        const response = await dispatch(SupervisorCloseChat(ChatId)).unwrap();
  
        if (response.success) {
          showSweetAlert({
            title: "Closed Successfully",
            text: "",
            icon: "success",
          });
          refreshPage()
        } else {
          showSweetAlert({
            title: "Failed",
            text: response.message || "Something went wrong.",
            icon: "error",
          });
        }
      }
    } catch (err) {
      console.error("Failed to upload", err);
      showSweetAlert({
        title: "Failed",
        text: err.message || "An unexpected error occurred.",
        icon: "error",
      });
    }
  };
  const handleSearchString = (setter) => (e) => {
    const searchValue = e;
    setsrcStr(searchValue);
    setter(e)
 
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
 
    const timeout = setTimeout(() => {
      setChatLoading(true)
      dispatch(fetchChatsMonitor({
        clientId: clientId,
        senderId: senderid,
        agentId: agentId,
        fChatInitiated:initiated,
        srcStr: searchValue,
        status:Status,
        pageSize,
        pageNo: currentPage,
      }));
    }, 500);
 
    setSearchTimeout(timeout); // Save the timeout reference
  };

  const handleStatusChange = (selectedOptions) => {
    if (Array.isArray(selectedOptions)) {
        const values = selectedOptions.map(option => option.value); // Extract values
        setStatus(values.join(",")); // Join as a comma-separated string
    } else {
        setStatus(""); // Reset if no selection
    }
};
const refreshPage = () => {
    dispatch(fetchChatsMonitor({
      clientId: localStorage.getItem("clientId"),
      senderId: senderid,
      srcStr:srcStr,
      fChatInitiated:initiated,
      agentId: agentId,
      status:Status,
      pageSize:Size, // Example page size
      pageNo: currentPage, // Example current page
    }));
}
    

 useEffect(() => {
     if (!loading && chatsMonitor) {
       setChatLoading(false);
     }
   }, [loading, chatsMonitor]);
 
  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    setsenderid(senderId);
  };
 
  const handleExportToExcel = () => {
  dispatch(excelExportChatMonitor({ senderId:senderid, chatId: activeChat, agentId, searchStr:srcStr,fChatInitiated:initiated, status:Status }));
};


 
   useEffect(() => {
    debugger
       const checkAndFetch = async () => {
         const isLiveReporting = JSON.parse(localStorage.getItem("isLiveReporting"));
     
         if (isLiveReporting ) {
          dispatch(fetchChatsMonitor({
            clientId: localStorage.getItem("clientId"),
            senderId: senderid,
            srcStr:srcStr,
            fChatInitiated:initiated,
            agentId: agentId,
            status:Status,
            pageSize:Size, // Example page size
            pageNo: currentPage, // Example current page
          }));
         } else {
           // Handle the case when isLiveReporting is false
         }
       };
     
       // Run the function every 5 minutes
       const intervalId = setInterval(() => {
         // Perform the periodic refresh (e.g., every 5 minutes) if page is loaded
         if (!loading) {
           checkAndFetch();
         }
       }, REFRESH_INTERVAL);
     
       // Run the function once immediately
   
       // Cleanup the interval when the component unmounts
       return () => clearInterval(intervalId);
     }, [dispatch,senderid,srcStr,Status,currentPage,initiated,agentId]);

 
  const handleDetailClick = async (row) => {
    
    setActiveChat(row.id);
    setCustomerName(row.fullName);
    setPhoneNumber(row.phoneNumber);
    setshowchat(true);
  };
 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientId(localStorage.getItem('clientId'));
    }
  }, []);
 
  const handleTransferClick = async (id, SenderId, oldAgentId) => {
    
    setActiveChat(id);
    setSenderId(SenderId);
    setChatLoading(true)
    setoldAgentId(oldAgentId);
    setshowtransfer(true);
  };
 
  useEffect(() => {
    if (clientId) {
      setChatLoading(true)
      dispatch(fetchChatsMonitor({
        clientId: clientId,
        senderId: senderid,
        status:Status,
        agentId: agentId,
        fChatInitiated:initiated,
        srcStr:srcStr,
        pageSize,
        pageNo: currentPage,
      }));
    }
 
    return () => {
      dispatch(clearChatsMonitorState());
    };
  }, [dispatch, clientId,senderid, Status,initiated,agentId]);
 
  const handlePageSizeChange = async (newSize) => {
    setSize(newSize);
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1));  // Reset to first page
    setChatLoading(true)
    await dispatch(fetchChatsMonitor({
      clientId: clientId,
      status:Status,
      srcStr:srcStr,
      agentId: agentId,
      fChatInitiated:initiated,
      senderId: senderid,
      pageSize: newSize,
      pageNo: 1,
    }));
  };
 
  const handlePageChange = async (page) => {
    dispatch(setCurrentPage(page));
    setChatLoading(true)
    await dispatch(fetchChatsMonitor({
      clientId: clientId,
      senderId: senderid,
      status:Status,
      agentId: agentId,
      fChatInitiated:initiated,
      srcStr:srcStr,
      pageSize,
      pageNo: page,
    }));
  };
 
  const customPageSizes = [1, 5, 10, 20, 50, 100];  // Custom page size options
 
 
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className='grid grid-cols-5 gap-4'>
          <div className='flex flex-col text-start mb-1 mt-2'>
          <SearchBar
              label="Search"
              value={srcStr}
              onChange={handleSearchString(setsrcStr)}
            />
           
          </div>
         <div className='flex flex-col text-start '>
            <label className="font-medium text-gray-700 text-sm mt-1">Initiated</label>
          <select  id="initiated" value={initiated} onChange={(e) => SetInitiated(e.target.value)}  className='border rounded  w-100 h-12 '> 
            <option value="0">Conversations  </option>
            <option value="1">Campaigns</option>
            <option value="2">API Messages</option>
          </select>
          </div>

          <div className='flex flex-col text-start '>
            <label className="font-medium text-gray-700 text-sm">Agents</label>
            <AgentDropdown
              name="agentId"
              onChange={handleAgentChange}
              className="border rounded w-100"
            />
          </div>
          <div className='flex flex-col text-start mb-1 mt-2'>
            <label className="font-medium text-gray-700 text-sm">Sender Names</label>
            <SendernameDropdown
              name="senderId"
              onChange={handleSenderChange}
              className="border rounded w-100"
            />
          </div>
          <div className='flex flex-col text-start '>
            <label className="font-medium text-gray-700 text-sm">Status</label>
            <Select
            options={statusOptions}
            isMulti
            onChange={handleStatusChange}
            className="border rounded "
          />
          </div>
        </div>
      </div>
    );
  }, [srcStr, senderid,statusOptions]);
 
  return (
    <App>
      <div className="flex items-center">
        {ChatLoading && loading && <Loading />}
        <div className="">
          <h4 className="font-bold ">Chats Monitor</h4>
        </div>
        <div className="flex ml-auto mb-1 gap-4">
          <button
            className="uniform_btn"
            onClick={ handleExportToExcel}
          >
            Export Report
          </button>
        </div>
      </div>
      <DataTable
        data={chatsMonitor}
        columns={ChatsReportColumn}
        highlightOnHover
        striped
        sortIcon
        sortServer
        pagination
        paginationServer
        paginationTotalRows={totalRecords}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePageSizeChange}
        paginationRowsPerPageOptions={customPageSizes}
        subHeader
        responsive
        subHeaderComponent={subHeaderComponentMemo}
        className="w-full border"
        customStyles={{
          table: {
            style: {
              width: '100%',
              borderCollapse: 'collapse',
            },
          },
          headRow: {
            style: {
              borderBottom: '1px solid #ddd', padding: '0px',
            },
          },
          headCells: {
            style: {
              borderRight: '1px solid #ddd',
              fontWeight: 'bold',
            },
          },
          rows: {
            style: {
              borderBottom: '1px solid #ddd',
            },
          },
          cells: {
            style: {
              borderRight: '1px solid #ddd',
            },
          },
        }}
      />
      {
        showchat && (
          <Chatview
            ChatId={activeChat}
            isVisible={true}
            CustomerName = {CustomerName}
            PhNo={PhoneNumber}
            onClose={handleCancel}
          />
        )
      }
      {
        showtransfer && (
          <TransferChat
            ChatId={activeChat}
            SenderId={SenderId}
            oldAgentId={oldAgentId}
            refreshPage={refreshPage}
            isVisible={true}
            onClose={handleTransferCancel}
          />
        )
      }
    </App>
  );
};
 
export default ChatsMonitor;