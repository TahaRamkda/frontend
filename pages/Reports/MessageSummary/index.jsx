

import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessageReport, clearMessageReportState, setPageSize, setCurrentPage } from "@/slices/ReportSlice";
import { Input, label, Button } from 'reactstrap';
import TemplateDropdown from '@/components/Dropdowns/TemplateDropdown';
import DataTable from "react-data-table-component";
import App from '@/components/App';
import Loading from "@/components/Loader";

const Messagereports = () => {
  const dispatch = useDispatch();
  const [templateId, setTemplateId] = useState(0);
  const [status, setStatus] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [srcStr, setSrcStr] = useState('');
  const [sendernameId, setSendernameId] = useState(null);
  const [clientId, setClientId] = useState(null);

  const { messagereports, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.reports);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientId(localStorage.getItem('clientId'));
    }
  }, []);

  useEffect(() => {
    if (clientId) {
      
      dispatch(fetchMessageReport2({ clientId: clientId, fromDate: fromDate, toDate: toDate, status: status, templateId: templateId, srcStr: srcStr, pageSize, pageNo: currentPage }));
    }
    return () => {
      dispatch(clearMessageReportState());
    };
  }, [dispatch, clientId]);


  const handleTemplateChange = (e) => {
    setTemplateId(e.target.value);
  };

  const handleSrcStrChange = (e) => {
    setSrcStr(e.target.value);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handlePageSizeChange = async (newSize) => {
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to the first page
    await dispatch(fetchMessageReport2({
      clientId, fromDate, toDate, status, templateId, srcStr, pageSize: newSize, pageNo: 1
    }));
  };

  const handlePageChange = async (page) => {
    dispatch(setCurrentPage(page));
    await dispatch(fetchMessageReport2({
      clientId, fromDate, toDate, status, templateId, srcStr, pageSize, pageNo: page
    }));
  };

  const report2Columns = [
    { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true },
    { name: "Schedule Time", selector: (row) => row.scheduleTime, sortable: true },
  ];

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className='grid grid-cols-5 gap-4'>
        <div className="flex flex-col text-start mb-1">
          <label className="font-medium text-gray-700 text-sm">Search</label>
          <Input
            type="text"
            placeholder="Search"
            value={srcStr}
            onChange={handleSrcStrChange}
            className="border rounded m-0 w-100"
          />
        </div>
        <div className="flex flex-col text-start mb-1">
          <label className="font-medium text-gray-700 text-sm">Select Template</label>
          <TemplateDropdown
            name="role_Id"
            onChange={handleTemplateChange}
            className="border rounded m-0 mb-0 w-100"
          />
        </div>
        <div className="flex flex-col text-start mb-1">
          <label className="font-medium text-gray-700 text-sm">From Date</label>
          <Input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={handleFromDateChange}
            className="border rounded m-0 w-100"
          />
        </div>
        <div className="flex flex-col text-start mb-1 ">
          <label className="font-medium text-gray-700 text-sm">To Date</label>
          <Input
            type="date"
            id="toDate"
            value={toDate}
            onChange={handleToDateChange}
            className="border rounded m-0 w-100"
          />
        </div>
        </div>
      </div>
    );
  }, [srcStr, fromDate, toDate, templateId]);

  return (
    <App>
     

      <div className="flex">
          {loading && <Loading />}
        <h4 className=" font-bold ">Message Summary</h4>
      </div>
      <div className="table-responsive categories_table ">
        <DataTable
          data={messagereports2}
          columns={report2Columns}
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
                borderBottom: '1px solid #ddd',  padding: '0px',
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
      </div>
    </App>
  );
};

export default Messagereports;
