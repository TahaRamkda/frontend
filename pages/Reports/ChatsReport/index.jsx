"use client";
import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchcoversationMonitor, clearConversationMonitorState, setPageSize, setCurrentPage } from "@/slices/SuperwiseSlice";
import SendernameDropdown from '@/components/Dropdowns/SendernameDropdown';
import DataTable from "react-data-table-component";
import Loading from '@/components/Layout/Loader';
import App from '@/components/Layout/App';
import Chatview from '@/pages/Chats/ChatView/indexPop-up';
import TransferChat from '../TransferChat';
import { MdSwapHoriz } from "react-icons/md"; 
import { REFRESH_INTERVAL } from '@/utils/constants';
import SearchBar from '@/components/SearchBar/SearchComponent';
import DateTimePicker from '@/components/Timepicker/datetimepicker';

const ChatsReport = () => {
  const dispatch = useDispatch();
  const [senderid, setsenderid] = useState(0);
  const [DetailModal, setDetailModal] = useState(false);
  const { ConversationMonitor, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.Supervisor);
  const [clientId, setClientId] = useState(null);
  const [showchat, setshowchat] = useState(false);
  const [srcStr, setsrcStr] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [showtransfer, setshowtransfer] = useState(false);
   const [FromDate, setFromDate] = useState("");
   const [Status , setStatus] = useState('')
    const [ToDate, setToDate] = useState("");
  const [activeChat, setActiveChat] = useState(0);
  const [ChatLoading, setChatLoading] = useState(false)
  const [SenderId, setSenderId] = useState(0);
  const [oldAgentId, setoldAgentId] = useState(0);
  const [refreshpage, setrefreshpage] = useState(false);  // Track if page is refreshing

  const ChatsReportColumn = [
    { name: "Full Name", selector: (row) => row.fullName, sortable: true },
    { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true },
    { name: "Status Name", selector: (row) => row.statusName, sortable: true },
    { name: "Agent Name", selector: (row) => row.agentName, sortable: true },
    { name: "Unread Count", selector: (row) => row.unreadCount, sortable: true },
  ];

  const handleCancel = () => {
    setshowchat(false);
  };
  const handleTransferCancel = () => {
    setshowtransfer(false);
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
      dispatch(fetchcoversationMonitor({
        clientId: clientId,
        senderId: senderid,
        status: Status,
        ToDate:ToDate,
        FromDate: FromDate,
        searchStr: searchValue,
        pageSize,
        pageNo: currentPage,
      }));
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };
 useEffect(() => {
     if (!loading && ConversationMonitor) {
       setChatLoading(false);
     }
   }, [loading, ConversationMonitor]);
  
  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    setsenderid(senderId);
  };

  useEffect(() => {
    const checkAndFetch = async () => {
      const isLiveReporting = JSON.parse(localStorage.getItem("isLiveReporting"));

      if (isLiveReporting && !loading) {
        setrefreshpage(true);  // Mark the page as refreshing
        try {
          await dispatch(fetchcoversationMonitor({
            clientId: localStorage.getItem("clientId"),
            senderId: senderid,
            searchStr: srcStr,
            status: Status,
            ToDate:ToDate,
            FromDate: FromDate,
            pageSize, // Example page size
            pageNo: currentPage, // Example current page
          }));
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
  }, [ senderid, srcStr, dispatch,Status,ToDate,FromDate]);

  const handleDetailClick = async (id) => {
    setActiveChat(id);
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
    setoldAgentId(oldAgentId);
    setshowtransfer(true);
  };

  useEffect(() => {
    if (clientId) {
      setChatLoading(true)
      dispatch(fetchcoversationMonitor({
        clientId: clientId,
        senderId: senderid,
        status: Status,
        ToDate:ToDate,
        FromDate: FromDate,
        searchStr: srcStr,
        pageSize,
        pageNo: currentPage,
      }));
    }

    return () => {
      dispatch(clearConversationMonitorState());
    };
  }, [dispatch, clientId,senderid]);

  const handlePageSizeChange = async (newSize) => {
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1));  // Reset to first page
    setChatLoading(true)
    await dispatch(fetchcoversationMonitor({
      clientId: clientId,
      searchStr: srcStr,
      status: Status,
      ToDate:ToDate,
      FromDate: FromDate,
      senderId: senderid,
      pageSize: newSize,
      pageNo: 1,
    }));
  };

  const handlePageChange = async (page) => {
    dispatch(setCurrentPage(page));
    setChatLoading(true)
    await dispatch(fetchcoversationMonitor({
      clientId: clientId,
      senderId: senderid,
      status: Status,
      ToDate:ToDate,
      FromDate: FromDate,
      searchStr: srcStr,
      pageSize,
      pageNo: page,
    }));
  };

  const customPageSizes = [1, 5, 10, 20, 50, 100];  // Custom page size options
  const defultpagessize = 10;

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className='grid grid-cols-5 gap-4'>
          <div className='flex flex-col text-start mb-1'>
          <SearchBar
              label="Search"
              value={srcStr}
              onChange={handleSearchString(setsrcStr)}
            />
          </div>
          <div className='flex flex-col text-start mb-1'>
            <label className="font-medium text-gray-700 text-sm">Sender Names</label>
            <SendernameDropdown
              name="senderId"
              onChange={handleSenderChange}
              className="border rounded w-100"
            />
          </div>
          <div className='flex flex-col text-start mb-1'>
  <label className="font-medium text-gray-700 text-sm">Status</label>
  <select
    className="border rounded p-2"
    value={Status}
    onChange={(e) => setStatus(e.target.value)}
  >
    <option value="0">All</option>
    <option value="1">Open</option>
    <option value="2">Closed</option>
    <option value="3">Pending</option>
    <option value="4">Resolved</option>
  </select>
</div>
          <div className='flex flex-col text-start mb-1'>
          <DateTimePicker
              label="From Date"
              value={FromDate}
              onChange={setFromDate}
            />
          </div>
          <div className='flex flex-col text-start mb-1'>
          <DateTimePicker
              label="To Date"
              value={ToDate}
              onChange={setToDate}
            />
          </div>
        </div>
      </div>
    );
  }, [srcStr, senderid,FromDate,ToDate]);

  return (
    <App>
      <div className="flex items-center">
        { ChatLoading && <Loading />}  {/* Show loader only when page is not refreshing */}
        <div >
          <h4 className="font-bold ">Chats Report</h4>
        </div>
      </div>
      <DataTable
        data={ConversationMonitor}
        columns={ChatsReportColumn}
        highlightOnHover
        striped
        pagination
        paginationServer
        paginationTotalRows={totalRecords}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePageSizeChange}
        paginationPerPage={defultpagessize}
        paginationRowsPerPageOptions={customPageSizes}
        subHeader
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
            isVisible={true}
            onClose={handleTransferCancel}
          />
        )
      }
    </App>
  );
};

export default ChatsReport;
