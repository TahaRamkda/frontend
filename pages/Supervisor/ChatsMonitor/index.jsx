"use client";
import React, { useMemo,useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatsMonitor, clearChatsMonitorState, setPageSize, setCurrentPage } from "@/slices/SuperwiseSlice";
import { fetchConversationMessage, clearConversationMessageState } from '@/slices/ConversationSlice';
import { Container, Row, Col, Table, input, Button,  Pagination, List, label, PaginationItem, PaginationLink, CardBody, Card } from 'reactstrap';
import TemplateDropdown from '@/components/Dropdowns/TemplateDropdown';
import SendernameDropdown from '@/components/Dropdowns/SendernameDropdown';
import DataTable from "react-data-table-component";
import { HiPencilAlt, HiTrash, HiRefresh } from "react-icons/hi";
import Loading from '@/components/Loader';
import App from '@/components/App';



const ChatsReport = () => {
  const dispatch = useDispatch();
  const [senderid, setsenderid] = useState(0);
   const [Activechat, setActiveChat] = useState(0);
   const [DetailModal, setDetailModal]= useState(false);
   const agentChatRef = useRef([AgentConversaton]);
  
  
 
  const [isfilteropen, setisfilteropen] = useState(false);
 const [showfilterbutton, setshowfilterbutton] = useState(true);
  const { chatsMonitor, loading, error, currentPage, pageSize, totalRecords } = useSelector((state) => state.Supervisor);
  const [clientId, setClientId] = useState(null);

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
                <button
                  className="uniform_icon_btn"
                  onClick={() => handleDetailClick(row.id)}
                >
                  <HiPencilAlt style={{ fontSize: "15px" }} />
                </button>
              </div>
            </center>
          ),
        },

  ];
  
  


  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    setsenderid(senderId);
  };

  const handleDetailClick = async (id) => {
     setActiveChat(id); // Update Activechat state
     const ClientId = localStorage.getItem("clientId");
     if (ClientId && id) {
      await dispatch(fetchConversationMessage({ clientId: ClientId, ChatId: id }));
      setDetailModal(true)
     }
     return () => {
       dispatch(clearConversationMessageState());
     }
   };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientId(localStorage.getItem('clientId'));
    }
  }, []);

  
  
  useEffect(() => {
    if (clientId) {
      dispatch(fetchChatsMonitor({ clientId: clientId,senderId:senderid, pageSize,pageNo:currentPage}));
      
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
            await  dispatch(fetchChatsMonitor({ 
              clientId: clientId, 
              senderId: senderid, 
              srcStr: srcStr, 
              pageSize: newSize, pageNo:1 }));
          };
  
    const handlePageChange = async (page) => {
          // Update current page state in Redux
          dispatch(setCurrentPage(page));
        
          // Fetch clients for the new page
          await dispatch(fetchChatsMonitor({ clientId: clientId, fromDate: fromDate , toDate:toDate, status:status, sendernameId:sendernameId, senderId:senderid, srcStr:srcStr, pageSize ,pageNo: page}));
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
      {DetailModal&&(
         <ul className="divide-y divide-gray-200 chats-user overflow-y-auto">
          {loading && <div className="text-center">Please wait while we load your chats..!!</div>}
          {AgentConversaton?.map((conversation) => (
            <li
              key={conversation.id}
              className={`flex justify-between cursor-pointer px-4 py-0.5 rounded-lg transition-all duration-200 ease-in-out ${
                Activechat === conversation.id ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                HandleConversationDetail(conversation.id);
              }}
              style={{ height: '100px' }} // Height adjustment for the tile-like look
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="relative">
                  <img
                    src={`${BASE_URL}${conversation.logo}`}
                    alt="User Logo"
                    className="w-10 h-10 bg-gray-300 rounded-full object-cover"
                  />
                  {conversation.unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 bg-green-500 text-white text-xs font-bold rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <div className="text-left flex-grow" style={{ minWidth: '0' }}>
                  <span
                    className="block font-medium text-gray-800"
                    style={{
                      width: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginBottom: '2px', // Further reduced margin for spacing between fullName and phoneNumber
                    }}
                  >
                    {conversation.fullName}
                  </span>
                  <span
                    className="block text-sm text-gray-600"
                    style={{
                      marginBottom: '2px', // Further reduced margin for spacing between phoneNumber and lastMessageText
                    }}
                  >
                    {conversation.phoneNumber}
                  </span>
        
                  {conversation.lastMessageText !== '' ? (
                    <p
                      className="block text-sm text-gray-500 mt-0"
                      style={{
                        width: '220px', // Adjusted width for better tile look
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '0', // Further reduced margin to avoid extra space between lastMessageText and next element
                      }}
                    >
                      {conversation.lastMessageText}
                    </p>
                  ) : (
                    <div className="flex items-center mt-0">
                      <i className="fa fa-photo mr-2 text-gray-500"></i>
                      <p className="block text-sm text-gray-500">Media</p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        
      )}
    </App>
 
  );
};

export default ChatsReport;
