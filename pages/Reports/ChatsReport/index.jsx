"use client";
import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversationReport, clearConversationReportState, setPageSize, setCurrentPage } from "@/slices/ReportSlice";
import SendernameDropdown from '@/components/Dropdowns/SendernameDropdown';
import DataTable from "react-data-table-component";
import Loading from '@/components/Layout/Loader';
import App from '@/components/Layout/App';
import Select from "react-select";
import { REFRESH_INTERVAL } from '@/utils/constants';
import SearchBar from '@/components/SearchBar/SearchComponent';
import DateTimePicker from '@/components/Timepicker/datetimepicker';

const ChatsReport = () => {
  const dispatch = useDispatch();
  const [senderid, setsenderid] = useState(0);
  const [DetailModal, setDetailModal] = useState(false);
  const { ConversationReport, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.reports);
  const [clientId, setClientId] = useState(null);
  const [showchat, setshowchat] = useState(false);
  const [srcStr, setsrcStr] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [showtransfer, setshowtransfer] = useState(false);
   const [FromDate, setFromDate] = useState("");
   const [Status, setStatus] = useState([]);
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
    { name: "Sender Name", selector: (row) => row.senderName, sortable: true },
    { name: "Agent Name", selector: (row) => row.agentName, sortable: true },
    { name: "Unread Count", selector: (row) => row.unreadCount, sortable: true },
  ];
  const statusOptions = [
    { value: "0", label: "Auto Chat" },
    { value: "1", label: "Looking For Agent" },
    { value: "2", label: "Agent Assigned" },
    { value: "3", label: "Chat Closed" },
    { value: "4", label: "Chat Expired" },
    { value: "5", label: "Chat Force Closed" },
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
      dispatch(fetchConversationReport({
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
     if (!loading && ConversationReport) {
       setChatLoading(false);
     }
   }, [loading, ConversationReport]);
  
  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    setsenderid(senderId);
  };
  const handleStatusChange = (selectedOptions) => {
    if (Array.isArray(selectedOptions)) {
        const values = selectedOptions.map(option => option.value); // Extract values
        setStatus(values.join(",")); // Join as a comma-separated string
    } else {
        setStatus(""); // Reset if no selection
    }
};

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
      dispatch(fetchConversationReport({
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
      dispatch(clearConversationReportState());
    };
  }, [dispatch, clientId,senderid]);

  const handlePageSizeChange = async (newSize) => {
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1));  // Reset to first page
    setChatLoading(true)
    await dispatch(fetchConversationReport({
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
    await dispatch(fetchConversationReport({
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
          <div className='flex flex-col text-start '>
  <label className="font-medium text-gray-700 text-sm">Status</label>
  <Select
  options={statusOptions}
  isMulti
  onChange={handleStatusChange}
  className="border rounded "
/>
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
        data={ConversationReport}
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
    </App>
  );
};

export default ChatsReport;
