"use client";
import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessageReport, clearMessageReportState, setPageSize, setCurrentPage } from "@/slices/ReportSlice";
import { Container, Row, Col, Table, input, Button, Pagination, List, label, PaginationItem, PaginationLink, CardBody, Card } from 'reactstrap';
import TemplateDropdown from '@/components/Dropdowns/TemplateDropdown';
import SendernameDropdown from '@/components/Dropdowns/SendernameDropdown';
import DataTable from "react-data-table-component";

import Loading from '@/components/Loader';
import App from '@/components/App';



const MessageReport = () => {
  const dispatch = useDispatch();
  const [senderid, setsenderid] = useState(0);
  const [status, setstatus] = useState(0);
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [ModuleId, setmoduleId] = useState(0);
  const [srcStr, setsrcStr] = useState('');
  const [sendernameId, setsendernameId] = useState(null);
  const [isfilteropen, setisfilteropen] = useState(false);
  const [showfilterbutton, setshowfilterbutton] = useState(true);
  const { messagereport, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.reports);
  const [clientId, setClientId] = useState(null);

  const ReportColumns = [
    { name: "Sender Name", selector: (row) => row.senderName, sortable: true },
    { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true },
    { name: "Status", selector: (row) => row.currentStatusName, sortable: true },
    { name: "Category", selector: (row) => row.category, sortable: true },
    { name: "Sent Time", selector: (row) => row.sentDate, sortable: true },
    { name: "Delivered Time", selector: (row) => row.deliveredDate, sortable: true },
    { name: "Read Time", selector: (row) => row.readDate, sortable: true },

  ];
  useEffect(() => {
    if (clientId) {
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
  }, [clientId, fromDate, toDate, status, senderid, srcStr, sendernameId,ModuleId]);


  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    setsenderid(senderId);
  };


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientId(localStorage.getItem('clientId'));
    }
  }, []);


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




  const handlePageSizeChange = async (newSize) => {
    // Update page size and reset to the first page
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to first page
    // Fetch data with updated page size and reset to page 1
    await dispatch(fetchMessageReport({
      clientId: clientId, fromDate: fromDate, toDate: toDate, moduleId: ModuleId, status: status, sendernameId: sendernameId, senderid: senderid, srcStr: srcStr, pageSize : newSize, pageNo: 1 
    }));
  };

  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));

    // Fetch clients for the new page
    await dispatch(fetchMessageReport({ clientId: clientId, fromDate: fromDate, toDate: toDate, moduleId: ModuleId, status: status, sendernameId: sendernameId, senderid: senderid, srcStr: srcStr, pageSize, pageNo: page }));
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
              id="fromDate"
              value={fromDate}
              onChange={(e) => setfromDate(e.target.value)}
              className="border rounded  w-100"
            />
          </div>
          <div className='flex flex-col text-start mb-1'>
            <label className="font-medium text-gray-700 text-sm">To Date</label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => settoDate(e.target.value)}
              className="border rounded  w-100"
            />

          </div>
          <div className='flex flex-col text-start mb-1'>
            <label className="font-medium text-gray-700 text-sm">Message Type</label>
            <select

              id="ModuleId"
              value={ModuleId}
              onChange={(e) => setmoduleId(e.target.value)}
              className="border rounded  w-100"
            >  <option value={0}>Select</option>
              <option value={1}>Campaings</option>
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
        {loading && <Loading />}
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

export default MessageReport;
