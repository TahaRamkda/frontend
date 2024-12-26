"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessageReportSummary, clearMessageReportSummaryState, setPageSize, setCurrentPage } from "@/slices/ReportSlice";
import { Container, Row, Col, Table, Input, Button,  Pagination, List, Label, PaginationItem, PaginationLink, CardBody, Card } from 'reactstrap';
import TemplateDropdown from '@/components/Dropdowns/TemplateDropdown';
import SendernameDropdown from '@/components/Dropdowns/SendernameDropdown';
import Loading from '@/components/Loader';
import App from '@/components/App';



const MessageSummary = () => {
  const dispatch = useDispatch();
  const [senderid, setsenderid] = useState(0);
  const [status, setstatus] = useState(0);
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [srcStr, setsrcStr] = useState('');
  const [sendernameId, setsendernameId] = useState(null);
  const [isfilteropen, setisfilteropen] = useState(false);
 const [showfilterbutton, setshowfilterbutton] = useState(true);
  const { messagereportsummary, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.reports);
  const [clientId, setClientId] = useState(null);

  
  const handleSearchString = (e) => {
    setsrcStr(e.target.value);
  };

  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    setsenderid(senderId);
  };

 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientId(localStorage.getItem('clientId'));
    }
  }, []);

  
  
  useEffect(() => {
    if (clientId) {
      dispatch(fetchMessageReportSummary({ clientId: clientId, fromDate: fromDate , toDate:toDate, status:status, senderid:senderid, srcStr:srcStr, pageSize,pageNo:currentPage}));
      
    }
    return () => {
      dispatch(clearMessageReportSummaryState());
    };
  }, [dispatch, clientId]);

  const handleFiltershow = () => {
    setisfilteropen(prevState => !prevState);  // Toggle isfilteropen
    setshowfilterbutton(prevState => !prevState);  // Toggle showfilterbutton
    
  };


  const handlefilter = (e) => {
    dispatch(fetchMessageReportSummary({ clientId: clientId, fromDate: fromDate , toDate:toDate, status:status, sendernameId:sendernameId, senderid:senderid, srcStr:srcStr, pageSize ,pageNo:currentPage}));
  }
  const handlePageSizeChange = async (e) => {
    const newSize = Number(e.target.value);
    
    // Update page size and current page
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to first page
  
    // Wait for the state updates and then make the API call
    await dispatch(fetchMessageReportSummary({ 
      clientId: clientId, 
      fromDate: fromDate, 
      toDate: toDate, 
      status: status, 
      sendernameId: sendernameId, 
      senderid: senderid, 
      srcStr: srcStr, 
      pageSize: newSize, // Use new size directly
      pageNo: currentPage // Reset to first page
    }));
  };

  const handlePageChange = async (page) => {
    
    dispatch(setCurrentPage(page));
    await dispatch(fetchMessageReportSummary({ clientId: clientId, fromDate: fromDate , toDate:toDate, status:status, sendernameId:sendernameId, senderid:senderid, srcStr:srcStr, pageSize ,pageNo: page}));
   
  };

  
  // Pagination calculations
  const totalPages = Math.ceil(totalRecords / pageSize);

  const makePager = () => {
    const pages = [];
    const pageWindow = 4; // Number of pages to display in the pagination window
    const halfWindow = Math.floor(pageWindow / 2);

    let startPage = Math.max(1, currentPage - halfWindow);
    let endPage = Math.min(totalPages, currentPage + halfWindow);
   
    if (currentPage - halfWindow < 1) {
      endPage = Math.min(totalPages, endPage + (halfWindow - (currentPage - 1)));
    }

    if (currentPage + halfWindow > totalPages) {
      startPage = Math.max(1, startPage - (halfWindow - (totalPages - currentPage)));
    }
    // Previous Button
    if (currentPage > 1) {
      pages.push(
        <PaginationItem key="prev">
          <PaginationLink
            previous
            onClick={() => handlePageChange(currentPage - 1)}
            className="mx-1"
          >
            Previous
          </PaginationLink>
        </PaginationItem>
      );
    }
  
    // Page Numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i} active={currentPage === i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            className="mx-1"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  
    // Next Button
    if (currentPage < totalPages) {
      pages.push(
        <PaginationItem key="next">
          <PaginationLink
            next
            onClick={() => handlePageChange(currentPage + 1)}
            className="mx-1"
          >
            Next
          </PaginationLink>
        </PaginationItem>
      );
    }
  
    return pages;
  };
  return (
   <App>
      {/* <div className="pcoded-content"> */}
        <div className="pcoded-inner-content">
          <div className="main-body">
            <div className="page-wrapper">
              <div className="page-body">
              {loading && <div className="text-center text-blue-500"><Loading /></div>}
                <div className="row">
                  <div className="col-xl-12 col-md-12">
                    
                    <div >
                      <section className="general-section">
                      <h1 className="font-semibold p-3">Message Summery</h1>
                          <div className="card bg-white shadow-md rounded-lg p-4">

                          
                          <Row className="align-items-center ">
                            {/* Role Dropdown (Aligned) */}
                            <Col md="4">
                              {/* <div className=""> */}
                                <label className="block mb-1 mt-1">Sender Names</label>
                                <SendernameDropdown
                                  name="senderId"
                                  onChange={handleSenderChange}
                                  className="border rounded  w-100"
                                />
                              {/* </div> */}
                            </Col>

                            {/* Search Input */}
                            <Col md="2">
                              <Label className="font-medium text-sm mb-0">Search:</Label>
                              <Input
                                type="text"
                                placeholder="Search"
                                value={srcStr}
                                onChange={handleSearchString}
                                className="border rounded  w-100"
                              />
                            </Col>

                            {/* From Date Picker */}
                            <Col md="2">
                              <Label className="font-medium text-sm mb-0">From Date:</Label>
                              <Input
                                type="date"
                                id="fromDate"
                                value={fromDate}
                                onChange={(e) => setfromDate(e.target.value)}
                                className="border rounded  w-100"
                              />
                            </Col>

                            {/* To Date Picker */}
                            <Col md="2">
                              <Label className="font-medium text-sm mb-0">To Date:</Label>
                              <Input
                                type="date"
                                id="toDate"
                                value={toDate}
                                onChange={(e) => settoDate(e.target.value)}
                                className="border rounded  w-100"
                              />
                            </Col>

                            {/* Filter Button */}
                            <Col md="2" className='d-flex align-items-center' style={{marginTop: "11px"}}>

                              <Button
                                className="w-100 mt-4 uniform_btn"
                                input="text"
                                onClick={handlefilter}
                                type="button"
                              >
                                Filter
                              </Button>
                            </Col>
                          </Row>


                            <div className="table-responsive categories_table rounded-lg">
                              <Table className="table-auto w-full border-collapse border border-gray-300 rounded-lg shadow-sm" id="newdatatable">
                                <thead>
                                  <tr>
                                    <th className="text-center border p-2">Phone Number</th>
                                    <th className="text-center border p-2">Sender Name </th>
                                    <th className="text-center border p-2">Category </th>
                                    <th className="text-center border p-2">Sent Date </th>
                                    <th className="text-center border p-2">Delivered Date </th>
                                    <th className="text-center border p-2">Read Date </th>
                                    <th className="text-center border p-2">Sent Status </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {error && <tr><td colSpan="9">Error: {error}</td></tr>}
                                  {messagereportsummary.length > 0 ? (
                                    messagereportsummary.map((message) => (
                                      <tr key={message.apiMessageId}>
                                        <td className="px-6 whitespace-nowrap border border-gray-200 text-center text-sm font-medium text-gray-900">{message.phoneNumber}</td>
                                        <td className="px-6 whitespace-nowrap border border-gray-200 text-center text-sm font-medium text-gray-900">{message.senderName}</td>
                                        <td className="px-6 whitespace-nowrap border border-gray-200 text-center text-sm font-medium text-gray-900">{message.category}</td>
                                        <td className="px-6 whitespace-nowrap border border-gray-200 text-center text-sm font-medium text-gray-900">{message.sentDate}</td>
                                        <td className="px-6 whitespace-nowrap border border-gray-200 text-center text-sm font-medium text-gray-900">{message.deliveredDate}</td>
                                        <td className="px-6 whitespace-nowrap border border-gray-200 text-center text-sm font-medium text-gray-900">{message.readDate}</td>
                                        <td className="px-6 whitespace-nowrap border border-gray-200 text-center text-sm font-medium text-gray-900">{message.sentStatus}</td>
                                      
                                      </tr>
                                    ))
                                  ) : (
                                    <tr className='text-center'><td colSpan="9" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">No reports found</td></tr>
                                  )}
                                </tbody>
                              

                              </Table>

                              
                              <Row className="mt-3 align-items-center">
                              <div className="d-flex justify-content-between align-items-center ">
                                {/* Pagination Controls */}
                                <Col md="6" className='d-flex justify-content-start'>
                                  <Pagination aria-label="Page navigation">{makePager()}</Pagination>
                                </Col>
                                <Col md="6" className='d-flex justify-content-end'>
                                  {/* Page Size Selection with Records Info */}
                                  <div className="d-flex align-items-center justify-content-start">
                                    <span className="mr-2">Page Size:</span>
                                    &nbsp;&nbsp;&nbsp;<Input
                                      type="select"
                                      id="pageSize"
                                      value={pageSize}
                                      onChange={handlePageSizeChange}
                                      className="form-select form-select-sm"
                                      style={{ width: '100px', marginRight: '10px' }} // Add some spacing
                                    >
                                      <option value={1}>1</option>
                                      <option value={5}>5</option>
                                      <option value={10}>10</option>
                                      <option value={20}>20</option>
                                      <option value={50}>50</option>
                                      <option value={100}>100</option>
                                      <option value={300}>300</option>
                                      <option value={500}>500</option>
                                    </Input>

                                    {/* Records Info */}
                                    <span>
                                      Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} records
                                    </span>
                                  </div>

                                </Col>

                              </div>

                            </Row>
                                  
                                  
                                
                            </div>
                           
                            
                          </div>
                        
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
         
        </div>
      {/* </div> */}
      </App>
 
  );
};

export default MessageSummary;
