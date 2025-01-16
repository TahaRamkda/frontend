import React, { useMemo, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Table,
  Input,
  Button,
  Pagination,
  List,
  label,
  PaginationItem,
  PaginationLink,
  CardBody,
  Card,
} from "reactstrap";
import Loading from "@/components/Loader";
import DefinedTemplates from "../AgentDefinedTemplate";
import App from "@/components/App";
import {
  fetchConversationList,
  fetchConversationMessageReport,
  clearconversationstate,
  clearConversationMessageState,
  clearMessagesReportState,
  NewAgentMessage,
} from "@/slices/ConversationSlice";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { BASE_URL } from "@/utils/apiConstants";
import Loader from "@/components/Loader";
import { extractTime } from "@/utils/constants";



const Chatview = ({ ChatId, onClose, isVisible }) => {
  const dispatch = useDispatch();
  const [Activechat, setActiveChat] = useState(0);
  const { conversationMessagereport, loading, error } = useSelector(
    (state) => state.conversations
  );
  const [Chatsloading, setChatsloading] = useState(false);
  const [ShowDetailedTemplate, setShowDetailedTemplate] = useState(false);
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);


  const [chatMessages, setChatMessages] = useState([]);
  useEffect(() => {
    if (ChatId) {
      setActiveChat(ChatId);
    }
  }, [ChatId]);

  useEffect(() => {
    const ClientId = localStorage.getItem("clientId");
    if (ClientId && Activechat) {
      dispatch(
        fetchConversationMessageReport({ clientId: ClientId, ChatId: Activechat })
      );
    }
  }, [Activechat]);

  useEffect(() => {

    if (conversationMessagereport && conversationMessagereport.length > 0) {
      setChatMessages(conversationMessagereport);
      dispatch(clearMessagesReportState())
    }
    
  }, [conversationMessagereport]);

  return (
    <App>
      <Modal isOpen={isVisible} toggle={onClose} fade={false}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded shadow-lg w-2/5 relative h-auto max-h-[80vh]">
            <ModalHeader toggle={onClose}></ModalHeader>
            <ModalBody>
              <div className="right-sidebar-chat">
                <div
                  className="right-sidebar-chat p-4 w-full overflow-y-auto chat-background"
                  style={{ maxHeight: "70vh", overflowY: "auto" }}
                >
                  <div className="msger flex flex-col">
                    <div className="msger-chat flex-grow overflow-y-auto space-y-4 px-4 py-2">
                      {loading && (
                        <div className="text-center">
                          Please wait while we load your chat!!
                        </div>
                      )}
                      <div
                        ref={scrollContainerRef}
                        className="msger-chat flex-grow overflow-y-auto space-y-4 px-4 py-2"
                      >
                        {Chatsloading && (
                          <div className="text-center">Loading messages...</div>
                        )}
                        {chatMessages?.map((message) => (
                          <div
                            key={message.messageId}
                            className={`flex ${message.typeId === 1
                                ? "justify-end"
                                : "justify-start"
                              }`}
                          >
                            <div
                              className={`max-w-xs p-2 rounded-2xl shadow-sm ${message.typeId === 1
                                  ? "bg-[#ddffd9] text-black rounded-br-none"
                                  : "bg-[#ffffff] text-black rounded-bl-none"
                                }`}
                            >
                              {message.parentMessageContent &&
                                message.parentMessageContent.trim() !== "" && (
                                  <div
                                    className="mb-2 p-1 rounded bg-gray-100 text-gray-600 text-sm italic border-l-4 border-gray-300 overflow-hidden text-ellipsis"
                                    style={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {message.parentMessageContent}
                                  </div>
                                )}
                              {message.contentType &&
                                message.contentType !== "" && (
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
                                      <audio
                                        controls
                                        src={`${BASE_URL}${message.mediaPath}`}
                                        className="w-full h-auto rounded"
                                      />
                                    )}
                                  </>
                                )}
                              <div className="flex items-end justify-between min-w-[100px]  p-2 rounded-lg">
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
                                <span className="ml-2 text-gray-500 text-xs">
                                  {extractTime(message.createdDate).slice(0, 5)}
                                </span>
                              </div>

                              {message.buttonJson &&
                                message.buttonJson.length > 0 && (
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
                      {previewUrl && (
                        <div
                          style={{
                            position: "relative",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            maxWidth: "450px",
                            marginRight: "20px auto",
                          }}
                        >
                          <button
                            onClick={() => handleImageclose()}
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              backgroundColor: "red",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              width: "25px",
                              height: "25px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                              fontSize: "16px",
                              lineHeight: "1",
                            }}
                          >
                            &times;
                          </button>

                          {fileType === "image" && (
                            <img
                              src={previewUrl}
                              alt="Preview"
                              style={{
                                maxWidth: "100%",
                                marginTop: "10px",
                                borderRadius: "8px",
                              }}
                            />
                          )}

                          {fileType === "video" && (
                            <video
                              controls
                              src={previewUrl}
                              style={{
                                width: "100%",
                                marginTop: "10px",
                                borderRadius: "8px",
                              }}
                            />
                          )}

                          {fileType === "audio" && (
                            <audio
                              controls
                              src={previewUrl}
                              style={{
                                width: "100%",
                                marginTop: "10px",
                              }}
                            />
                          )}

                          {fileType === "application" && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "10px",
                              }}
                            >
                              <div
                                style={{
                                  backgroundColor: "#f0f0f0",
                                  borderRadius: "50%",
                                  width: "50px",
                                  height: "50px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginRight: "10px",
                                }}
                              >
                                <i
                                  className="fa fa-file"
                                  style={{
                                    fontSize: "24px",
                                    color: "#555",
                                  }}
                                ></i>
                              </div>
                              <div>
                                <p
                                  style={{
                                    margin: "0 0 5px",
                                    fontWeight: "bold",
                                    color: "#333",
                                  }}
                                >
                                  {mediaFile.name}
                                </p>
                                <a
                                  href={previewUrl}
                                  download={mediaFile.name}
                                  style={{
                                    color: "#007BFF",
                                    textDecoration: "none",
                                  }}
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                    <div /> {/* Empty div to scroll to */}
                  </div>
                </div>
              </div>
              
            </ModalBody>
           
          </div>
        </div>
      </Modal >
    </App >
  );
};

export default Chatview;