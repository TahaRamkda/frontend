"use client";
import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchAgentsMonitor,clearAgentMonitorState, setPageSize, setCurrentPage, agentDisable, clearAgentDisableState } from "@/slices/SuperwiseSlice";
import TemplateDropdown from '@/components/Dropdowns/TemplateDropdown';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import SendernameDropdown from '@/components/Dropdowns/SendernameDropdown';
import DataTable from "react-data-table-component";
import Loading from '@/components/Loader';
import { MdEdit } from "react-icons/md"; 
import App from '@/components/App';
import Switch from "react-switch";
import sweetalert from 'sweetalert2';


const MessageSummary = () => {
  const dispatch = useDispatch();
  const [senderid, setsenderid] = useState(0);
  const [FromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");
  const [srcStr, setsrcStr] = useState('');
const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [isfilteropen, setisfilteropen] = useState(false);
  const [showfilterbutton, setshowfilterbutton] = useState(true);
  const [ShowEditModal, setShowEditModal] = useState(false);
  const { agentsMonitor, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.Supervisor);
  const [clientId, setClientId] = useState(null);

  const ChatsReportColumn = [
    { name: "Agent Name", selector: (row) => row.agentName, sortable: true },
    { name: "Status Name", selector: (row) => row.statusName, sortable: true },
    { name: "Unread Count", selector: (row) => row.unreadCount || 0, sortable: true },
    { name: "Conversation Assigned", selector: (row) => row.totalConversationsAssigned, sortable: true },

     {
          name: "Action",
          cell: (row) => (
            <div style={{ textAlign: "center"}}>
            <Switch
              onChange={() => handleAction(row.agentId,row.isDisabled)}
              checked={!row.isDisabled} // Button is ON if the user is disabled
              onColor="#dc3545"
              offColor="#28a745"
              height={35}
              width={80}
              checkedIcon={
               
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    fontSize: 12,
                    color: "white",
                    whiteSpace: "nowrap",
                    padding: "0 12px",
                  }}
                >
                  Disable
                </div>
              }
              uncheckedIcon={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    fontSize: 12,
                    color: "white",
                    whiteSpace: "nowrap",
                    padding: "0 12px",
                  }}
                >
                  Enable
                </div>
              }
            />
          </div>          
          
          ),
        },
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
 const refreshlist = () => {
  dispatch(fetchAgentsMonitor({ clientId: clientId, senderId: senderid, srcStr:srcStr,pageSize, pageNo: currentPage, fromDate:FromDate, toDate:ToDate}));

 }
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
      fromDate:FromDate, toDate:ToDate,
      pageSize: newSize, pageNo: 1
    }));
  };
   const editModalClick = ()=>{
    setShowEditModal(true);
   }
  const toggleModal = () => {

    setShowEditModal(false);
  };
  const handleAction = async (agentId, currentStatus) => {
    const action = currentStatus ? 'enable' : 'disable';
    const newStatus = !currentStatus;
  
    const confirmation = await sweetalert.fire({
      title: `Are you sure you want to ${action} this agent?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
  
    if (confirmation.isConfirmed) {
      try {
        const clientId = localStorage.getItem("clientId");
        const response = await dispatch(agentDisable({ agentId : agentId,
          disable: newStatus,
          clientId : clientId})).unwrap();
  
        if (response.result) {
          sweetalert.fire('Success', `Agent has been ${action}d successfully.`, 'success');
         refreshlist();
        } else {
          sweetalert.fire('Error', response.message || 'Failed to update agent status.', 'error');
        }
      } catch (error) {
        sweetalert.fire('Error', 'An error occurred while updating the agent status.', 'error');
      }
    }
  };
  
  
  
  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));

    // Fetch clients for the new page
    await dispatch(fetchAgentsMonitor({ clientId: clientId, fromDate: FromDate, toDate: ToDate, senderId: senderid, srcStr: srcStr, pageSize, pageNo: page }));
  };

  const customPageSizes = [1 ,5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10
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
        paginationPerPage={defultpagessize} // Default number of rows per page
        paginationRowsPerPageOptions={customPageSizes} // Custom page size options
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
      {ShowEditModal &&(
           <Modal isOpen={true} toggle={toggleModal} fade={false}>
           <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-white p-6 rounded shadow-lg w-2/5 relative">
               <ModalHeader toggle={toggleModal}>Edit Agent</ModalHeader>
               <ModalBody>
                 <form onSubmit={handleSubmit}>
                   <div className="flex flex-col">
                     <label
                       htmlFor="agentStatus"
                       className="font-medium text-gray-700 text-sm"
                     >
                       Agent Status
                     </label>
                     <Input
                       type="checkbox"
                       id="agentStatus"
                       name="agentStatus"
                       checked={values.disable}
                       onChange={handleCheckboxChange}
                       className="border rounded py-1 px-2 w-full mt-1 text-sm"
                     />
                   </div>
                   <div className="mt-4 w-full flex justify-end">
                     <button type="submit" className="uniform_btn">
                       Save
                     </button>
                   </div>
                 </form>
               </ModalBody>
             </div>
           </div>
         </Modal>
      )}
    </App>

  );
};

export default MessageSummary;
