"use client";
import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAgentReport, clearAgentReportState, setPageSize, setCurrentPage } from '@/slices/ReportSlice';
import DataTable from "react-data-table-component";
import Loading from '@/components/Layout/Loader';
import App from '@/components/Layout/App';
import SearchBar from '@/components/SearchBar/SearchComponent';
import DateTimePicker from '@/components/Timepicker/datetimepicker';
import { excelExportAgentReport } from '@/slices/ExportExcel';
 import SendernameDropdown from '@/components/Dropdowns/SendernameDropdown';
const AgentReport = () => {
  const dispatch = useDispatch();
  const { AgentReportList, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.reports);
  const [clientId, setClientId] = useState(null);
  const [srcStr, setsrcStr] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [senderId, SetSenderId]= useState(0)
  
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0]; // Format as "YYYY-MM-DD"
  };
  const [FromDate, setFromDate] = useState(getTodayDate);
  const [ToDate, setToDate] = useState(getTodayDate);
//   const statusOptions = [
//     { value: '0', label: "Auto Chat" },
//     { value: '1', label: "Looking For Agent" },
//     { value: '2', label: "Agent Assigned" },
//     { value: '3', label: "Chat Closed" },
//     { value: '4', label: "Chat Expired" },
//     { value: '5', label: "Chat Force Closed" },
//   ];
  const ChatsReportColumn = [
    { name: "Agent ", selector: (row) => row.agentName, sortable: true },
    { name: "Active", selector: (row) => row.activeChat, sortable: true },
    { name: "Assigned", selector: (row) => row.assignedChat, sortable: true },
    { name: "Unassigned", selector: (row) => row.unAssignedChat, sortable: true },
    { name: "Abandon", selector: (row) => row.abandonChat, sortable: true },
    { name: "Expired", selector: (row) => row.expiredChat, sortable: true },
    { name: "Force Closed", selector: (row) => row.forceClosedChat, sortable: true, width: '11%' },
    { name: "Closed", selector: (row) => row.closedChat, sortable: true },
    { name: "Avg Response Time", selector: (row) => row.avgResponseTime, sortable: true, width: '14%' }, 
    { name: "Avg Chat Time", selector: (row) => row.avgChatTime, sortable: true, width: '11%' },
  
  ];

 
  const handleSearchString = (setter) => (e) => {
    const searchValue = e;
    setsrcStr(searchValue);
    setter(e)
 
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
 
    const timeout = setTimeout(() => {
  
      dispatch(fetchAgentReport({
        clientId: clientId,
       senderId:senderId,
        srcStr: searchValue,
        ToDate: ToDate,
        FromDate: FromDate,
        
        pageSize,
        pageNo: currentPage,
      }));
    }, 500);
 
    setSearchTimeout(timeout); // Save the timeout reference
  };

//   const handleStatusChange = (selectedOptions) => {
//     if (Array.isArray(selectedOptions)) {
//         const values = selectedOptions.map(option => option.value); // Extract values
//         setStatus(values.join(",")); // Join as a comma-separated string
//     } else {
//         setStatus(""); // Reset if no selection
//     }
// };

 
 
  
 
//   useEffect(() => {
//     const checkAndFetch = async () => {
//       const isLiveReporting = JSON.parse(localStorage.getItem("isLiveReporting"));
 
//       if (isLiveReporting && !loading) {
//         setrefreshpage(true);  // Mark the page as refreshing
//         try {
//           await dispatch(fetchAgentReport({
//             clientId: localStorage.getItem("clientId"),
//             senderId: senderid,
//             srcStr:srcStr,
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
 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientId(localStorage.getItem('clientId'));
    }
  }, []);
 
   const handleExportToExcel = () => {
      dispatch(excelExportAgentReport({senderId:senderId,
        toDate: ToDate,
        fromDate: FromDate,
        searchStr:srcStr,}))
    };
    const handleSenderChange = (e) => {
      const senderId = e.target.value;
      SetSenderId(senderId);
    };
  useEffect(() => {
    if (clientId) {
      
      dispatch(fetchAgentReport({
        clientId: clientId,
        
        senderId:senderId,
        ToDate: ToDate,
        FromDate: FromDate,
        srcStr:srcStr,
        pageSize,
        pageNo: currentPage,
      }));
    }
 
    return () => {
      dispatch(clearAgentReportState());
    };
  }, [dispatch, clientId,ToDate,FromDate,senderId]);
 
  const handlePageSizeChange = async (newSize) => {
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1));  // Reset to first page
   
    await dispatch(fetchAgentReport({
      clientId: clientId,
      srcStr:srcStr,
      senderId:senderId,
      ToDate: ToDate,
      FromDate: FromDate,
      pageSize: newSize,
      pageNo: 1,
    }));
  };
 
  const handlePageChange = async (page) => {
    dispatch(setCurrentPage(page));
   
    await dispatch(fetchAgentReport({
      clientId: clientId,
      
      senderId:senderId,
      ToDate: ToDate,
      FromDate: FromDate,
      srcStr:srcStr,
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
          <div className='flex flex-col text-start mb-1 mt-2'>
          <SearchBar
              label="Search"
              value={srcStr}
              onChange={handleSearchString(setsrcStr)}
            />
           
          </div>
          {/* <div className='flex flex-col text-start '>
            <label className="font-medium text-gray-700 text-sm">Status</label>
            <Select
            options={statusOptions}
            isMulti
            onChange={handleStatusChange}
            className="border rounded "
          />
          </div> */}
          <div className='flex flex-col text-start mb-1 mt-2'>
            <label className="font-medium text-gray-700 text-sm">Sender Names</label>
            <SendernameDropdown
              name="senderId"
              onChange={handleSenderChange}
              className="border rounded w-100"
            />
          </div> 
          <div className='flex flex-col text-start mb-1 mt-2'>
                        <DateTimePicker
                            label="From Date"
                            value={FromDate}
                            onChange={setFromDate}
                        />
                    </div>
                    <div className='flex flex-col text-start mb-1 mt-2'>
                        <DateTimePicker
                            label="To Date"
                            value={ToDate}
                            minDate={FromDate}
                            onChange={setToDate}
                        />
                    </div>
        </div>
      </div>
    );
  }, [srcStr,FromDate,ToDate]);
 
  return (
    <App>
      
      <div className="flex items-center">
        {loading && <Loading />}
        <div className="">
          <h4 className="font-bold ">Agents Report</h4>
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
        data={AgentReportList}
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
 
export default AgentReport;