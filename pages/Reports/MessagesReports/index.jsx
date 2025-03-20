"use client";
import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessageReport, clearMessageReportState, setPageSize, setCurrentPage } from "@/slices/ReportSlice";
import { Container, Row, Col, Table, input, Button, Pagination, List, label, PaginationItem, PaginationLink, CardBody, Card } from 'reactstrap';
import TemplateDropdown from '@/components/Dropdowns/TemplateDropdown';
import SendernameDropdown from '@/components/Dropdowns/SendernameDropdown';
import DataTable from "react-data-table-component";
import Loading from '@/components/Layout/Loader';
import App from '@/components/Layout/App';
import { REFRESH_INTERVAL } from '@/utils/constants';
import { set } from 'date-fns';
import DateTimePicker from '@/components/Timepicker/datetimepicker';
import { getMonthStart, getToday } from '@/components/Timepicker/datetimepicker';
import SearchBar from '@/components/SearchBar/SearchComponent';
const MessageReport = () => {
  const dispatch = useDispatch();
  const [senderid, setsenderid] = useState(0);
  const [status, setstatus] = useState(0);
  const [fromDate, setfromDate] = useState(getMonthStart());
  const [toDate, settoDate] = useState(getToday());
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [ModuleId, setmoduleId] = useState(0);
  const [srcStr, setsrcStr] = useState('');
  const [sendernameId, setsendernameId] = useState(null);
  const [isfilteropen, setisfilteropen] = useState(false);
  const [showfilterbutton, setshowfilterbutton] = useState(true);
  const { messagereport, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.reports);
  const [clientId, setClientId] = useState(null);
  const [reportloading, setreportloading] = useState(false);
  const ReportColumns = [
    { name: "Sender Name", selector: (row) => row.senderName, sortable: true, width: '16%' },
    { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true, width: '12%'},
    { name: "Status", selector: (row) => row.currentStatusName, sortable: true },
    { name: "Category", selector: (row) => row.category, sortable: true },
    { name: "Sent Time", selector: (row) => row.sentDate, sortable: true, width: '18%' },
    { name: "Delivered Time", selector: (row) => row.deliveredDate, sortable: true, width: '18%' },
    { name: "Read Time", selector: (row) => row.readDate, sortable: true, width: '18%' },
  ];
  useEffect(() => {
    if (clientId) {
      setreportloading(true)
      dispatch(
        fetchMessageReport({
          clientId: clientId,
          fromDate: fromDate,
          toDate: toDate,
          status: status,
          moduleId: ModuleId,
          senderid: senderid,
          srcStr: srcStr,
          sendernameId: sendernameId,
          pageSize: pageSize,
          pageNo: currentPage,
        })
      );
    }
  }, [clientId, fromDate, toDate, status, senderid, sendernameId,ModuleId]);

  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    setsenderid(senderId);
  };


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientId(localStorage.getItem('clientId'));
    }
    }, []);

 
  //  useEffect(() => {
  //       const checkAndFetch = async () => {
  //         const isLiveReporting = JSON.parse(localStorage.getItem("isLiveReporting"));
    
  //         if (isLiveReporting && !loading) {
            
  //           try {
  //              await dispatch(
  //               fetchMessageReport({
  //                 clientId: clientId,
  //                 fromDate: fromDate,
  //                 toDate: toDate,
  //                 status: status,
  //                 moduleId: ModuleId,
  //                 senderid: senderid,
  //                 srcStr: srcStr,
  //                 sendernameId: sendernameId,
  //                 pageSize: pageSize,
  //                 pageNo: currentPage,
  //               })
  //             );
              
  //           } catch (error) {
  //             console.error("Error fetching chat monitor:", error);
  //           }
  //         }
  //       };
    
       
    
  //       const intervalId = setInterval(() => {
  //         // Perform the periodic refresh (e.g., every 5 minutes) if page is loaded
  //         if (!loading) {
  //           checkAndFetch();
  //         }
  //       }, REFRESH_INTERVAL);
    
  //       // Cleanup interval on component unmount or when page is unloaded
  //       return () => clearInterval(intervalId);
  //     }, [ dispatch,senderid, srcStr,fromDate,toDate,status,ModuleId,sendernameId,pageSize,currentPage]);
  


  const handleSearchString = (setter) => (e) => {
    const searchValue = e;
    setsrcStr(searchValue);
    setter(e)

    // Clear the previous timeout if any
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout for 0.5 seconds
    const timeout = setTimeout(() => {
      setreportloading(true)
      dispatch(
        fetchMessageReport({
          clientId: clientId,
          fromDate: fromDate,
          toDate: toDate,
          status: status,
          moduleId: ModuleId,
          senderid: senderid,
          srcStr: searchValue,
          sendernameId: sendernameId,
          pageSize: pageSize,
          pageNo: currentPage,
        }));
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };

  const handleFiltershow = () => {
    setisfilteropen(prevState => !prevState);  // Toggle isfilteropen
    setshowfilterbutton(prevState => !prevState);  // Toggle showfilterbutton

  };
 useEffect(() => {
     if (!loading && messagereport) {
       setreportloading(false);
     }
   }, [loading, messagereport]);
  



  const handlePageSizeChange = async (newSize) => {
    // Update page size and reset to the first page
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to first page
    setreportloading(true)
    // Fetch data with updated page size and reset to page 1
    await dispatch(fetchMessageReport({
      clientId: clientId, fromDate: fromDate, toDate: toDate, moduleId: ModuleId, status: status, sendernameId: sendernameId, senderid: senderid, srcStr: srcStr, pageSize : newSize, pageNo: 1 
    }));
  };
  const refreshpage = async () => {
    setreportloading(true)
    await dispatch(fetchMessageReport({ clientId: localStorage.getItem("clientId"), fromDate: fromDate, toDate: toDate, moduleId: ModuleId, status: status, sendernameId: sendernameId, senderid: senderid, srcStr: srcStr, pageSize, pageNo: currentPage }));
    return 
  };

  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));
    setreportloading(true)
    // Fetch clients for the new page
    await dispatch(fetchMessageReport({ clientId: clientId, fromDate: fromDate, toDate: toDate, moduleId: ModuleId, status: status, sendernameId: sendernameId, senderid: senderid, srcStr: srcStr, pageSize, pageNo: page }));
  };
  const customPageSizes = [1 ,5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className='grid grid-cols-5 gap-4'>
          <div className='flex flex-col text-start mb-1'>
            <label className="font-medium text-gray-700 text-sm mb-1">Sender Names</label>
            <SendernameDropdown
              name="senderId"
              onChange={handleSenderChange}
              className="border rounded  w-100"
            />
          </div>
          <div className='flex flex-col text-start mb-1'>
          <SearchBar
              label="Search"
              value={srcStr}
              onChange={handleSearchString(setsrcStr)}
            />
          </div>

          <div className='flex flex-col text-start mb-1'>
          <DateTimePicker
              label="From Date"
              value={fromDate}
              onChange={setfromDate}
            />
          </div>
          <div className='flex flex-col text-start mb-1'>
          <DateTimePicker
              label="To Date"
              value={toDate}
              onChange={settoDate}
              minDate={fromDate}
            />

          </div>
          <div className="flex flex-col text-start mb-1">
  <label className="font-medium text-gray-700 text-sm mb-1">Message Type</label>
  <select
    id="ModuleId"
    value={ModuleId}
    onChange={(e) => setmoduleId(e.target.value)}
    className="border border-gray-300 rounded-md w-full py-1 px-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  >
    <option value={0}>Select</option>
    <option value={1}>Campaigns</option>
    <option value={2}>API</option>
  </select>
</div>
        </div>


      </div>

    )

  })
  // Pagination calculations

  return (
    <App>
      <div className="flex items-center">
        {reportloading &&  <Loading />}
        <div >
          <h4 className="font-bold ">Message Reports</h4>
        </div>
      </div>
      <DataTable
        data={messagereport}
        columns={ReportColumns}
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
        keyField='id'
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
        }}
      />

    </App>

  );
};

export default MessageReport;
