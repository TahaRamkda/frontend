import React, { useMemo,useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversationMessage, clearConversationMessageState } from '@/slices/ConversationSlice';
import { Container, Row, Col, Table, input, Button,  Pagination, List, label, PaginationItem, PaginationLink, CardBody, Card } from 'reactstrap';
import Loading from '@/components/Loader';
import App from '@/components/App';

const MessageSummary = () => {
    const dispatch = useDispatch();
     const [Activechat, setActiveChat] = useState(0);
   
        
    return (
      <App>
        
    {loading && <Loading />}

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
          
      
      </App>
   
    );
  };
  
  export default MessageSummary;
  