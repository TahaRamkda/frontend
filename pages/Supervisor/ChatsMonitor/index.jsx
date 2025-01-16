"use client";
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatsMonitor, clearChatsMonitorState, setPageSize, setCurrentPage } from "@/slices/SuperwiseSlice";
import { fetchConversationMessage, clearConversationMessageState } from '@/slices/ConversationSlice';
import { Container, Row, Col, Table, input, Button, Pagination, List, label, PaginationItem, PaginationLink, CardBody, Card } from 'reactstrap';
import TemplateDropdown from '@/components/Dropdowns/TemplateDropdown';
import SendernameDropdown from '@/components/Dropdowns/SendernameDropdown';
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DataTable from "react-data-table-component";
import { HiPencilAlt, HiTrash , HiEye } from "react-icons/hi";
import Loading from '@/components/Loader';
import App from '@/components/App';
import Chatview from '@/pages/Chats/ChatView/indexPop-up';
import TransferChat from '../TransferChat';
import { MdSwapHoriz } from "react-icons/md"; 


const ChatsReport = () => {
  const dispatch = useDispatch();
  const [senderid, setsenderid] = useState(0);
  const [DetailModal, setDetailModal] = useState(false);
  const { chatsMonitor, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.Supervisor);
  const [clientId, setClientId] = useState(null);
  const [showchat, setshowchat] = useState(false);
  const [srcStr, setsrcStr] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [showtransfer, setshowtransfer] = useState(false);
  const [activeChat, setActiveChat] = useState(0);
  const [SenderId, setSenderId] = useState(0);
  const [oldAgentId, setoldAgentId] = useState(0);
  const ChatsReportColumn = [
    { name: "Full Name", selector: (row) => row.fullName, sortable: true },
    { name: "Phone Number", selector: (row) => row.phoneNumber, sortable: true },
    { name: "Status Name", selector: (row) => row.statusName, sortable: true },
    { name: "Agent Name", selector: (row) => row.agentName, sortable: true },
    { name: "Unread Count", selector: (row) => row.unreadCount, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <center>
          <div className="flex gap-2">
            <button title="View Chat"
              className="uniform_icon_btn"
              onClick={() => handleDetailClick(row.id)}
            >
              <HiEye style={{ fontSize: "15px" }} />
            </button>
            <button  title="Transfer Chat"
              className="uniform_icon_btn"
              onClick={() => handleTransferClick(row.id,row.senderId,row.agentId)}
            >
              <MdSwapHoriz style={{ fontSize: "15px" }} />
            </button>
          </div>
        </center>
      ),
    },

  ];

  const handleCancel = () => {
    setshowchat(false)
  }
  const handletransferCancel = () => {
    setshowtransfer(false)
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
        fetchChatsMonitor({ clientId: clientId, senderId: senderid,searchStr:searchValue, pageSize, pageNo: currentPage}));
    }, 500);

    setSearchTimeout(timeout); // Save the timeout reference
  };

  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    setsenderid(senderId);
  };

  const handleDetailClick = async (id) => {
    setActiveChat(id); // Update Activechat state
    setshowchat(true);
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientId(localStorage.getItem('clientId'));
    }
  }, []);

  const handleTransferClick = async (id , SenderId ,oldAgentId) => {
    setActiveChat(id); // Update Activechat state
    setSenderId(SenderId);
    setoldAgentId(oldAgentId);
    setshowtransfer(true);
  };
 



  useEffect(() => {
    if (clientId) {
      dispatch(fetchChatsMonitor({ clientId: clientId, senderId: senderid,searchStr:srcStr, pageSize, pageNo: currentPage }));

    }
    return () => {
      dispatch(clearChatsMonitorState());
    };
  }, [dispatch, clientId]);
  const handlePageSizeChange = async (newSize) => {
    // Update page size and reset to the first page
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(1)); // Reset to first page
    // Fetch data with updated page size and reset to page 1
    await dispatch(fetchChatsMonitor({
      clientId: clientId,
      searchStr:srcStr,
      senderId: senderid,
      pageSize: newSize, pageNo: 1
    }));
  };

  const handlePageChange = async (page) => {
    // Update current page state in Redux
    dispatch(setCurrentPage(page));

    // Fetch clients for the new page
    await dispatch(fetchChatsMonitor({ clientId: clientId, senderId: senderid,searchStr:srcStr, pageSize, pageNo: page }));
  }
  const customPageSizes = [1 ,5, 10, 20, 50, 100]; // Custom page size options
  const defultpagessize = 10
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div className="w-full">
        <div className='grid grid-cols-5 gap-4'>
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
            <label className="font-medium text-gray-700 text-sm">Sender Names</label>
            <SendernameDropdown
              name="senderId"
              onChange={handleSenderChange}
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
          <h4 className="font-bold ">Chats Report</h4>
        </div>
      </div>
      <DataTable
        data={chatsMonitor}
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
            onClose={handletransferCancel}
          />
        )
      }
    </App>

  );
};

export default ChatsReport;
