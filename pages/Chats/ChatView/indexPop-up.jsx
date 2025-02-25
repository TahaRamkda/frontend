import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { BASE_URL } from "@/utils/apiConstants";
import { extractTime } from "@/utils/constants";
import Loader from "@/components/Layout/Loader";
import { REFRESH_INTERVAL } from "@/utils/constants";
import {
  fetchConversationMessageReport,
  clearMessagesReportState,
} from "@/slices/ConversationSlice";

const Chatview = ({ ChatId, onClose, isVisible, PhNo, CustomerName }) => {
  const dispatch = useDispatch();
  const [Activechat, setActiveChat] = useState(0);
  const { conversationMessagereport, loading } = useSelector(
    (state) => state.conversations
  );
  const [chatMessages, setChatMessages] = useState([]);
  const [refreshpage, setrefreshpage] = useState(false);
  const messagesEndRef = useRef(null);
  const [scrolledown, setscrolledown] = useState(false);
  // Set active chat when ChatId changes
  useEffect(() => {
    if (ChatId) {
      setActiveChat(ChatId);
    }
  }, [ChatId]);

  // Fetch chat messages when Activechat changes
  useEffect(() => {
    
    const ClientId = localStorage.getItem("clientId");
    if (ClientId && Activechat) {
      dispatch(
        fetchConversationMessageReport({
          clientId: ClientId,
          ChatId: Activechat,
        })
      );
    }
  }, [Activechat, dispatch]);

  // Auto-refresh chat messages at intervals
  useEffect(() => {
    const checkAndFetch = async () => {
      const isLiveReporting = JSON.parse(
        localStorage.getItem("isLiveReporting")
      );

      if (isLiveReporting && !loading) {
        setrefreshpage(true);
        try {
          await dispatch(
            fetchConversationMessageReport({
              clientId: localStorage.getItem("clientId"),
              ChatId: Activechat,
            })
          );
        } catch (error) {
          console.error("Error fetching chat monitor:", error);
        } finally {
          setrefreshpage(false);
        }
      }
    };

    const intervalId = setInterval(() => {
      if (!loading) {
        checkAndFetch();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [Activechat, dispatch]);

  // Update chatMessages when conversationMessagereport changes
  useEffect(() => {
    if (conversationMessagereport && conversationMessagereport.length > 0) {
      setChatMessages(conversationMessagereport);
      dispatch(clearMessagesReportState());
    }
  }, [conversationMessagereport, dispatch]);

  // Auto-scroll to the bottom of the chat when the pop-up first appears
  useEffect(() => {
    if (isVisible && messagesEndRef.current && scrolledown === false) {
      setscrolledown(true);
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [isVisible, chatMessages]);

  return (
    <Modal
      isOpen={isVisible}
      toggle={onClose}
      fade={false}
      className="modal-responsive"
    >
      <div className="fixed inset-0 bg-gray bg-opacity-500 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-200 rounded shadow-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
          <ModalHeader toggle={onClose} className="border-b p-4">
            <div className="">
           <div className="text-xl">Chat Details</div> 
            <div className="">
              <div className="text-sm">{CustomerName}</div>
              <div className="text-xs text-gray-600">
                {PhNo}
              </div>
            </div>
            </div>

          </ModalHeader>
          <ModalBody className="flex-grow overflow-y-auto p-4">
            <div className="right-sidebar-chat">
              <div
                className="msger-chat flex-grow overflow-y-auto space-y-4"
                style={{ maxHeight: "calc(90vh - 120px)" }}
              >
                {loading && !refreshpage && (
                 <Loader/>
                )}
                {chatMessages?.map((message) => (
                  <div
                    key={message.messageId}
                    className={`flex ${
                      message.typeId === 1 ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-2 rounded-2xl shadow-sm ${
                        message.typeId === 1
                          ? "bg-[#ddffd9] text-black rounded-br-none"
                          : "bg-[#ffffff] text-black rounded-bl-none"
                      }`}
                    >
                      {message.parentMessageContent &&
                        message.parentMessageContent.trim() !== "" && (
                          <div
                            className=" p-1 rounded bg-gray-100 text-gray-600 text-sm italic border-l-4 border-gray-300 overflow-hidden text-ellipsis mb-1"
                            style={{
                              fontSize: "15px",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              whiteSpace: "normal",
                            }}
                          >
                            {message.parentMessageContent}
                          </div>
                        )}
                      {message.contentType && message.contentType !== "" && (
                        <>
                          {message.contentType.startsWith("image/") && (
                            <img
                              src={`${BASE_URL}${message.mediaPath}`}
                              alt="Image"
                              className="w-full h-auto rounded"
                            />
                          )}
                          {message.contentType.startsWith("video/") && (
                            <video
                              controls
                              src={`${BASE_URL}${message.mediaPath}`}
                              className="w-full h-auto rounded"
                            />
                          )}
                          {message.contentType.startsWith("audio/") && (
                            <audio controls>
                              <source src={`${BASE_URL}${message.mediaPath}`} />
                              Your browser does not support the audio element.
                            </audio>
                          )}
                        </>
                      )}
                      <div className="flex items-end justify-between min-w-[100px]  rounded-lg">
                        <p className="whitespace-pre-wrap break-words flex-grow">
                          {message.messageContent
                            ? message.messageContent
                                .split("\n")
                                .map((line, index) => (
                                  <span key={index}>
                                    {line}
                                    {index <
                                      message.messageContent.split("\n")
                                        .length -
                                        1 && <br />}
                                  </span>
                                ))
                            : null}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <span className="text-gray-500 text-xs">
                          {message.agentName && message.typeId === 1
                            ? `by-${message.agentName} `
                            : ""}
                          {extractTime(message.createdDate)}
                        </span>
                      </div>

                      {message.buttonJson && message.buttonJson.length > 0 && (
                        <div className="mt-2">
                          {(typeof message.buttonJson === "string"
                            ? JSON.parse(message.buttonJson)
                            : message.buttonJson
                          ).map((button, index) => (
                            <Button
                              key={index}
                              className="w-100 mb-2"
                              style={{
                                color: "#00a9ee",
                                backgroundColor: "#ddffd9",
                                borderColor: "#ffffff",
                                borderStyle: "solid",
                                borderWidth: "2px 2px 2px 2px",
                                borderTopWidth: "0.5px",
                                borderTopStyle: "solid",
                                borderTopColor: "#e1e1e1",
                              }}
                            >
                              {button.ButtonType == 1 && (
                                <span>
                                  <i className="fa fa-share fa-flip-horizontal me-2"></i>
                                  {button.ButtonText || "Button"}
                                </span>
                              )}
                              {button.ButtonType == 2 && (
                                <span>
                                  <i className="fa fa-phone me-2"></i>
                                  {button.ButtonText || "Button"}
                                </span>
                              )}
                              {button.ButtonType == 3 && (
                                <span>
                                  <i className="fa fa-external-link me-2"></i>
                                  {button.ButtonText || "Button"}
                                </span>
                              )}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </ModalBody>
        </div>
      </div>
    </Modal>
  );
};

export default Chatview;
