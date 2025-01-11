"use client";
import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchAgentsMonitor,clearAgentMonitorState, setPageSize, setCurrentPage } from "@/slices/SuperwiseSlice";
import { Container, Row, Col, Table, input, Button, Pagination, List, label, PaginationItem, PaginationLink, CardBody, Card } from 'reactstrap';
import TemplateDropdown from '@/components/Dropdowns/TemplateDropdown';
import SendernameDropdown from '@/components/Dropdowns/SendernameDropdown';
import DataTable from "react-data-table-component";
import Loading from '@/components/Loader';
import App from '@/components/App';



const MessageSummary = () => {
  const dispatch = useDispatch();
  const [senderid, setsenderid] = useState(0);
  const [FromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");
  const [srcStr, setsrcStr] = useState('');
const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [isfilteropen, setisfilteropen] = useState(false);
  const [showfilterbutton, setshowfilterbutton] = useState(true);
  const { agentsMonitor, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.Supervisor);
  const [clientId, setClientId] = useState(null);

  const ChatsReportColumn = [
    { name: "Full Name", selector: (row) => row.fullName, sortable: true },
    { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true },
    { name: "Status Name", selector: (row) => row.statusName, sortable: true },
    { name: "Agent Name", selector: (row) => row.agentName, sortable: true },
    { name: "Unread Count", selector: (row) => row.unreadCount, sortable: true },
  ];





  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientId(localStorage.getItem('clientId'));
    }
  }, []);



  useEffect(() => {
    if (clientId) {
      dispatch(fetchAgentsMonitor({ clientId: clientId, senderId: senderid, srcStr:srcStr,pageSize, pageNo: currentPage, fromDate:FromDate, toDate:ToDate}));

    }
    return () => {
      dispatch(clearAgentMonitorState());
    };
  }, [dispatch, clientId, senderid,FromDate,ToDate]);

  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    setsenderid(senderId);
  };

 const handleSearchString = (e) => {
    const searchValue = e.target.value;
    setsrcStr(searchValue);

    // Clear the previous timeout if any
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout for 0.5 seconds
    const timeout = setTimeout(() => {
      dispatch(
        fetchAgentsMonitor({ clientId: clientId, senderId: senderid,srcStr:searchValue, pageSize, pageNo: currentPage, fromDate:FromDate, toDate:ToDate}));
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };


  const handlePageSizeChange = async (newSize) => {
    // Update page size and reset to the first page
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to first page
    // Fetch data with updated page size and reset to page 1
    await dispatch(fetchAgentsMonitor({
      clientId: clientId,
      senderId: senderid,
      srcStr: srcStr,
      pageSize: newSize, pageNo: 1
    }));
  };

  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));

    // Fetch clients for the new page
    await dispatch(fetchAgentsMonitor({ clientId: clientId, fromDate: FromDate, toDate: ToDate, sendernameId: sendernameId, senderId: senderid, srcStr: srcStr, pageSize, pageNo: page }));
  };
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className='grid grid-cols-5 gap-4'>
          <div className='flex flex-col text-start mb-1'>
            <label className="font-medium text-gray-700 text-sm">Sender Names</label>
            <SendernameDropdown
              name="senderId"
              onChange={handleSenderChange}
              className="border rounded  w-100"
            />
          </div>
          <div className='flex flex-col text-start mb-1'>
            <label className="font-medium text-gray-700 text-sm">Search</label>
            <input
              type="text"
              placeholder=""
              value={srcStr}
              onChange={handleSearchString}
              className="border rounded  w-100"
            />
          </div>

          <div className='flex flex-col text-start mb-1'>
            <label className="font-medium text-gray-700 text-sm">From Date</label>
            <input
              type="date"
              id="FromDate"
              value={FromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded  w-100"
            />
          </div>
          <div className='flex flex-col text-start mb-1'>
            <label className="font-medium text-gray-700 text-sm">To Date</label>
            <input
              type="date"
              id="ToDate"
              value={ToDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded  w-100"
            />

          </div>
        </div>


      </div>

    )

  })
  // Pagination calculations

  return (
    <App>
      <div className="flex items-center">
        {loading && <Loading />}
        <div >
          <h4 className="font-bold ">Agents Report</h4>
        </div>
      </div>
      <DataTable
        data={agentsMonitor}
        columns={ChatsReportColumn}
        highlightOnHover
        striped
        pagination
        paginationServer
        paginationTotalRows={totalRecords}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePageSizeChange}
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
        }}
      />

    </App>

  );
};

export default MessageSummary;
