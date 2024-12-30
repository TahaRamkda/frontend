import React, { useMemo,useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Table, input, Button,  Pagination, List, label, PaginationItem, PaginationLink, CardBody, Card } from 'reactstrap';
import Loading from '@/components/Loader';
import App from '@/components/App';
import { fetchConversationList, fetchConversationMessage, clearconversationstate, clearConversationMessageState, NewAgentMessage } from "@/slices/ConversationSlice";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
const Chatview = ({ChatId,onClose, isVisible}) => {
    const dispatch = useDispatch();
     const [Activechat, setActiveChat] = useState(0);
     const { conversationMessage, loading, error } = useSelector((state) => state.conversations);
       
         const [chatMessages, setChatMessages] = useState([]);
   useEffect(() => {
     if(ChatId)
     {
      setActiveChat(ChatId);
     }
   }, [ChatId]);

   useEffect(() => {
     const ClientId = localStorage.getItem("clientId");
        if (ClientId && Activechat) {
          dispatch(fetchConversationMessage({ clientId: ClientId, ChatId: Activechat }));
        }
     
   }, [Activechat]);

    useEffect(() => {
       if (conversationMessage && conversationMessage.length > 0) {
         setChatMessages(conversationMessage);
         
       }
     }, [conversationMessage]);
        
    return (
      <App>
        <Modal isOpen={isVisible} toggle={onClose} fade={false}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 ">
        <div className="bg-white p-6 rounded shadow-lg w-2/5 relative h-2/3">
        <ModalHeader toggle={onClose}></ModalHeader>
        <ModalBody>
       
        <div className="right-sidebar-chat ">
        <div className="right-sidebar-chat p-4 w-full height-chat-box overflow-y-auto chat-background " style={{height:'569px'}} >
          <div className="msger flex flex-col ">
            <div className="msger-chat flex-grow overflow-y-auto space-y-4 px-4 py-2">
              {loading && (
                <div className='text-center'>Please wait while we load your messages..!!</div>
              )}
              {chatMessages.map((message) => (
                <div
                  key={message.messageId}
                  className={`flex ${message.typeId === 1 ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-2 rounded-2xl shadow-sm ${message.typeId === 1 ? 'bg-[#ddffd9] text-black rounded-br-none' : 'bg-[#ffffff] text-black rounded-bl-none'}`}
                  >
                    {message.contentType && message.contentType !== "" && (
                      <>
                        {message.contentType.startsWith("image/") && (
                          <img
                            src={`${BASE_URL}${message.mediaPath}`}
                            alt="Image"
                            className="max-w-full rounded"
                          />
                        )}
                        {message.contentType.startsWith("video/") && (
                          <video
                            controls
                            src={`${BASE_URL}${message.mediaPath}`}
                            className="max-w-full rounded"
                          />
                        )}
                        {message.contentType.startsWith("audio/") && (
                          <audio
                            controls
                            src={`${BASE_URL}${message.mediaPath}`}
                            className="max-w-full rounded"
                          />
                        )}
                      </>
                    )}
                    <p className="text-left text-sm">
                      {message.messageContent.split('\n').map((line, index) => (
                        <span key={index}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{message.createdDate}</p>
                  </div>
                </div>
              ))}
              <div  /> {/* Empty div to scroll to */}
            </div>

          
          </div>
        </div>
      </div>
         
          </ModalBody>
          </div>
          </div>
          </Modal>
      </App>
   
    );
  };
  
  export default Chatview;
  