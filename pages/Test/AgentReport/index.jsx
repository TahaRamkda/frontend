"use client";
import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAgentReport, clearAgentReportState, setPageSize, setCurrentPage } from '@/slices/ReportSlice';
import DataTable from "react-data-table-component";
import Loading from '@/components/Layout/Loader';
import App from '@/components/Layout/App';
import SearchBar from '@/components/SearchBar/SearchComponent';
import DateTimePicker from '@/components/Timepicker/datetimepicker';

 
const AgentReport = () => {
  const dispatch = useDispatch();
  const [senderid, setsenderid] = useState(0);
  const { AgentReportList, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.reports);
  const [clientId, setClientId] = useState(null);
  const [srcStr, setsrcStr] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [FromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");
 
  
 
//   const statusOptions = [
//     { value: '0', label: "Auto Chat" },
//     { value: '1', label: "Looking For Agent" },
//     { value: '2', label: "Agent Assigned" },
//     { value: '3', label: "Chat Closed" },
//     { value: '4', label: "Chat Expired" },
//     { value: '5', label: "Chat Force Closed" },
//   ];
  const ChatsReportColumn = [
    { name: "Full Name", selector: (row) => row.fullName, sortable: true },
    { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true },
    { name: "Created Date", selector: (row) => row.createdDate, sortable: true },
    { name: "Expiry Date", selector: (row) => row.expiryDate, sortable: true },
    { name: "Status Name", selector: (row) => row.statusName, sortable: true },
    { name: "Sender Name", selector: (row) => row.senderName, sortable: true },
    { name: "Agent Name", selector: (row) => row.agentName, sortable: true },
    { name: "Total Messages", selector: (row) => row.totalMessages, sortable: true },
    { name: "Unread Count", selector: (row) => row.unreadCount, sortable: true },
  
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
 
  
 
  useEffect(() => {
    if (clientId) {
      
      dispatch(fetchAgentReport({
        clientId: clientId,
        
        
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
  }, [dispatch, clientId,ToDate,FromDate]);
 
  const handlePageSizeChange = async (newSize) => {
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1));  // Reset to first page
   
    await dispatch(fetchAgentReport({
      clientId: clientId,
      srcStr:srcStr,
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
          {/* <div className='flex flex-col text-start mb-1 mt-2'>
            <label className="font-medium text-gray-700 text-sm">Sender Names</label>
            <SendernameDropdown
              name="senderId"
              onChange={handleSenderChange}
              className="border rounded w-100"
            />
          </div> */}
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
        { loading && <Loading />}  {/* Show loader only when page is not refreshing */}
        <div >
          <h4 className="font-bold ">Agents Report</h4>
        </div>
      </div>
      <DataTable
        data={AgentReportList}
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
 
export default AgentReport;