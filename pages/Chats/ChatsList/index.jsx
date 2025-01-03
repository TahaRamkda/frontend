import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Nav,
  NavItem,
  TabContent,
  TabPane,
  Container,
  Row,
  Button,
} from "reactstrap";
import {
  fetchConversationList,
  fetchConversationMessage, 
  resetMessages ,
  clearconversationstate,
  NewAgentMessage,
} from "@/slices/ConversationSlice";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";
import { BASE_URL } from "@/utils/apiConstants";
import Loader from "@/components/Loader";
import App from "@/components/App";
import EmojiPicker from "emoji-picker-react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { extractTime } from "@/utils/constants";
const ChatPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { conversations, loading, error } = useSelector(
    (state) => state.conversations
  );
  const { messages, currentPage, hasMore, loading : messageLoading } = useSelector((state) => state.conversations);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [chatMessages, setChatMessages] = useState([]);
  const [AgentConversaton, setAgentConversaton] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [mediaFile, setMediaFile] = useState(null); // To store the selected media file
  const [connection, setConnection] = useState(null);
  const [Activechat, setActiveChat] = useState(0);
  const fileInputRef = useRef(null); // Reference for the file input
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [Errordisconect, setErrordisconect] = useState(false);
  const toggleModal = () => setModalOpen((prevState) => !prevState);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const activeChatRef = useRef(Activechat);
  const agentChatRef = useRef([AgentConversaton]);
  const containerRef = useRef(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" }); // Use "auto" to skip animation
    }
  }, [chatMessages]);
  
  //call the fetchConversationList action to fetch agents conversations
  useEffect(() => {
    const ClientId = localStorage.getItem("clientId");
    const AgentId = localStorage.getItem("userId");

    if (ClientId) {
      dispatch(fetchConversationList({ clientId: ClientId, AgentId: AgentId }));
    }

    return () => {
      dispatch(clearconversationstate());
    };
  }, [dispatch]);

  //triggered each time when conversations changes and assign to local state
  useEffect(() => {
    if (conversations && conversations.length > 0) {
      setAgentConversaton(conversations);
    }
  }, [conversations]);

  //called each time to get conversation messages
  const HandleConversationDetail = async (id) => {
    setActiveChat(id); // Update Activechat state
    const ClientId = localStorage.getItem("clientId");
    if (ClientId && id) {
      await dispatch(
        fetchConversationMessage({ clientId: ClientId, ChatId: id })
      );
    }
    return () => {
       dispatch(resetMessages());
    };
  };

  //to set the activechat
  useEffect(() => {
    activeChatRef.current = Activechat;
  }, [Activechat]);

  useEffect(() => {
    agentChatRef.current = AgentConversaton;
  }, [AgentConversaton]);

  //triggered each time when messages changes and assign to local state
  useEffect(() => {
    
    if (messages && messages.length > 0) {
      setChatMessages(messages);
      console.log("Messages changed:", messages);
    }
  }, [messages]);

  const handleScroll = () => {
    const container = containerRef.current;
    const ClientId = localStorage.getItem("clientId");
  
    if (!container || loading) return;
  
    // Check if the user has scrolled to the top
    if (container.scrollTop === 0 && currentPage > 1 && !loading) {
      dispatch(fetchConversationMessage({ clientId: ClientId, ChatId: Activechat, pageNo: currentPage - 1 }))
        .then(() => {
          // Optionally adjust scroll position after older messages are loaded
          container.scrollTop = 1; // Prevent continuous triggering at the top
        });
    }
  
    // Check if the user has scrolled to the bottom
    if (
      container.scrollHeight - container.scrollTop === container.clientHeight &&
      hasMore &&
      !loading
    ) {
      dispatch(fetchConversationMessage({ clientId: ClientId, ChatId: Activechat, pageNo: currentPage + 1 }))
        .then(() => {
          // Optionally adjust scroll position if needed
        });
    }
  };
  
  useEffect(() => {
    const container = containerRef.current;
  
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
  
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  
  

  //called each time to send message
  const HandleSendMessage = async () => {
    if (!messageInput.trim() && !mediaFile) {
      toast.error("Message cannot be empty!");
      return;
    }

    const formData = new FormData();
    formData.append("ClientId", localStorage.getItem("clientId"));
    formData.append("SenderId", messages[0].senderId);
    formData.append("Message", messageInput.trim());
    formData.append("ConversationId", Activechat);

    if (mediaFile) {
      formData.append("File", mediaFile); // Append the selected media file
    }

    try {
      const newMessage = {
        messageId: Date.now(),
        typeId: 1,
        messageContent: messageInput.trim(),
        contentType: mediaFile ? mediaFile.type : "", // Set content type if there's media
        createdDate: new Date().toLocaleString(),
      };

      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput("");
      await dispatch(NewAgentMessage(formData)).unwrap();
      //toast.success("Message sent successfully!");
      setMediaFile(null); // Clear the selected file after sending the message

      // Shift the active conversation to the top of the list and reset unread count
      const matchingConversationIndex = agentChatRef.current.findIndex(
        (conversation) => conversation.id === Activechat
      );

      if (matchingConversationIndex !== -1) {
        const updatedConversations = [...agentChatRef.current];
        const matchingConversation =
          updatedConversations[matchingConversationIndex];

        // Remove from current position
        updatedConversations.splice(matchingConversationIndex, 1);

        // Add to the top with updated lastMessageText and reset unreadCount
        updatedConversations.unshift({
          ...matchingConversation,
          lastMessageText: messageInput.trim(),
          unreadCount: 0, // Reset unread count for sent messages
        });

        agentChatRef.current = updatedConversations;
        setAgentConversaton(updatedConversations);
      } else {
        console.warn(
          "No matching conversation found for Activechat:",
          Activechat
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file); // Store the selected file
    }
  };

  const openFileManager = () => {
    fileInputRef.current.click(); // Trigger the file input click event
  };

  useEffect(() => {
    const UserId = localStorage.getItem("userId");
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(
        `https://qawhatsappapi.consulttechies.com/conversation?AgentId=${UserId}`,
        {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        }
      )
      .withAutomaticReconnect()
      .build();

    setConnection(connection);

    connection.on("MessageReceived", (message) => {
      toast.success("You have a new message");

      if (message.id === activeChatRef.current) {
        setChatMessages((prevMessages) => [...prevMessages, message]);
        const matchingConversationIndex = agentChatRef.current.findIndex(
          (conversation) => conversation.id === message.id
        );

        if (matchingConversationIndex !== -1) {
          const updatedConversations = [...agentChatRef.current];
          updatedConversations[matchingConversationIndex] = {
            ...updatedConversations[matchingConversationIndex],
            lastMessageText: message.messageContent,
            unreadCount:
              (updatedConversations[matchingConversationIndex].unreadCount ||
                0) + 1,
          };
          agentChatRef.current = updatedConversations;
          setAgentConversaton(updatedConversations);
        } else {
          console.warn(
            "No matching conversation found for message.id:",
            message.id
          );
        }
      } else {
        toast.success("Check message");

        const matchingConversationIndex = agentChatRef.current.findIndex(
          (conversation) => conversation.id === message.id
        );

        if (matchingConversationIndex !== -1) {
          const updatedConversations = [...agentChatRef.current];
          const matchingConversation =
            updatedConversations[matchingConversationIndex];

          // Update the conversation
          updatedConversations.splice(matchingConversationIndex, 1); // Remove it from the current position
          updatedConversations.unshift({
            ...matchingConversation,
            lastMessageText: message.messageContent,
            unreadCount: (matchingConversation.unreadCount || 0) + 1,
          }); // Add it to the start of the list

          agentChatRef.current = updatedConversations;
          setAgentConversaton(updatedConversations);
        } else {
          console.warn(
            "No matching conversation found for message.id:",
            message.id
          );
        }
      }
    });

    connection.on("ConversationAssigned", (notification) => {
      console.log("Received notification:", notification);
      toast.success("You have a new message request");
      // Find the matching conversation in the agent chat reference
      const matchingConversationIndex = agentChatRef.current.findIndex(
        (conversation) => conversation.id === notification.id
      );

      if (matchingConversationIndex !== -1) {
        // Update the lastMessageText for the matching conversation
        const updatedConversations = [...agentChatRef.current];
        updatedConversations[matchingConversationIndex] = {
          ...updatedConversations[matchingConversationIndex],
          lastMessageText: notification.lastMessageText,
          unreadCount:
            (updatedConversations[matchingConversationIndex].unreadCount || 0) +
            1,
        };
        console.log("Updated conversation:", updatedConversations);
        agentChatRef.current = updatedConversations;
        setAgentConversaton(updatedConversations);
      } else {
        console.warn(
          "No matching conversation found for message.id:",
          notification.id
        );
        const newNotification = { ...notification, unreadCount: 1 };
        setAgentConversaton((prevMessages) => [
          newNotification,
          ...prevMessages,
        ]);
      }
    });

    connection
      .start()
      .then(() => {
        console.log("Connected to SignalR");
      })
      .catch((err) => {
        console.error("Error while starting the connection:", err);
        setErrordisconect(true);
      });

    return () => {
      connection.stop().then(() => console.log("Connection stopped"));
      setErrordisconect(true);
    };
  }, []);

  const startRecording = () => {
    // Check if navigator is available
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          console.log("Microphone access granted");
          startRecord(stream);
        })
        .catch((error) => {
          console.error("Error accessing microphone: ", error);
          toast.error(
            "Unable to access microphone. Please check your microphone settings."
          );
        });
    } else {
      toast.error("Your browser does not support media devices.");
    }
  };

  const startRecord = (stream) => {
    console.log("Starting recording...");

    // Initialize chunks for this recording session
    const chunks = [];

    // Check if audio/ogg is supported by the browser
    const mimeType = "audio/m4a";
    const isOggSupported = MediaRecorder.isTypeSupported(mimeType);
    const recorder = new MediaRecorder(stream, {
      mimeType: isOggSupported ? mimeType : "audio/webm",
    });
    setMediaRecorder(recorder);

    recorder.ondataavailable = (e) => {
      console.log("Data available", e);
      chunks.push(e.data);
    };

    recorder.onstop = () => {
      console.log("Recording stopped");
      const audioBlob = new Blob(chunks, {
        type: isOggSupported ? mimeType : "audio/mp3",
      });
      setMediaFile(audioBlob);
    };

    recorder.start();
    console.log("Recording started");
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    } else {
      toast.error("No recording in progress.");
    }
  };

  const handleReload = () => {
    // Reload the current page
    window.location.reload();
  };

  return (
    <App>
      <Container fluid className="h-100">
        <Row className="g-0 h-100">
          <Col
            xxl="3"
            xl="4"
            md="5"
            className="box-col-5 p-0"
            style={{ height: "100vh" }}
          >
            <Card className="left-sidebar-wrapper h-100">
              <div className="left-sidebar-chat p-3">
                <InputGroup>
                  <InputGroupText className="w-full">
                    <i className="fa fa-search mr-2" aria-hidden="true"></i>
                    <Input type="text" placeholder="Search here" />
                  </InputGroupText>
                </InputGroup>
              </div>
              <Nav
                tabs
                className="border-tab bg-white border-b border-gray-200 shadow-sm"
              >
                <NavItem className="flex justify-content-center w-full text-xl font-bold text-gray-900">
                  Chats
                </NavItem>
              </Nav>
              <TabContent id="chat-options-tabContent">
                <TabPane   id="chats" className="text-center">
                  <ul className="divide-y divide-gray-200  chats-user overflow-y-auto">
                    {loading && (
                      <div className="text-center">
                        Please wait while we load your chats..!!
                      </div>
                    )}
                    {AgentConversaton?.map((conversation) => (
                      <li
                        key={conversation.id}
                        className={`flex  justify-between  hover:bg-gray-100 cursor-pointer  ${
                          Activechat === conversation.id
                            ? "bg-gray-200"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          HandleConversationDetail(conversation.id);
                        }}
                        style={{ height: "100px" }} // Height adjustment for the tile-like look
                      >
                        <div className="flex items-center space-x-4 w-full">
                          <div className="relative">
                            <img
                              src={`${BASE_URL}${conversation.logo}`}
                              alt="User Logo"
                              className="w-10 h-10 bg-gray-300 rounded-full object-cover"
                            />
                          </div>
                          <div
                            className="text-left flex-grow"
                            style={{ minWidth: "0" }}
                          >
                            <span
                              className="block font-medium text-gray-800"
                              style={{
                                width: "200px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                paddingTop: "3px",
                                lineHeight: "13px", // Further reduced margin for spacing between fullName and phoneNumber
                              }}
                            >
                              {conversation.fullName}
                            </span>
                            <span
                              className="block text-xs text-gray-600"
                              style={{
                                lineHeight: "30px", // Further reduced margin for spacing between phoneNumber and lastMessageText
                              }}
                            >
                              {conversation.phoneNumber}
                            </span>

                            {conversation.lastMessageText !== "" ? (
                              <p
                                className="block text-xs text-gray-500 mt-0"
                                style={{
                                  width: "220px", // Adjusted width for better tile look
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  marginBottom: "0", // Further reduced margin to avoid extra space between lastMessageText and next element
                                }}
                              >
                                {conversation.lastMessageText}
                              </p>
                            ) : (
                              <div className="flex items-center mt-0">
                                <i className="fa fa-photo mr-2 text-gray-500"></i>
                                <p className="block text-xs text-gray-500">
                                  Media
                                </p>
                              </div>
                            )}
                           
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-end space-y-1">
                             <p className="text-xs text-gray-400">{extractTime(conversation.updatedDate)}</p>
                             {conversation.unreadCount >0 && (
                              <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                               @{conversation.unreadCount || 2}
                              </span>
                            )}
                              
                              
                            </div>
                      </li>
                    ))}
                  </ul>
                </TabPane>
              </TabContent>
            </Card>
          </Col>

          <Col
            xxl="9"
            xl="8"
            md="7"
            className="box-col-7 p-0"
            style={{ height: "100vh" }}
          >
            <Card className="right-sidebar-chat h-100">
              <div className="right-sidebar-chat p-4 w-full height-chat-box overflow-y-auto chat-background h-100">
                <div className="msger flex flex-col h-full">
                 <div
      ref={containerRef}
      //onScroll={handleScroll}
      className="msger-chat flex-grow overflow-y-auto space-y-4 px-4 py-2"
    >
      {loading && (
        <div className="text-center">Loading messages...</div>
      )}
      {chatMessages.map((message) => (
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
              {message.messageContent.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <p className="text-xs text-gray-500 mt-2">
                            {extractTime(message.createdDate)}
                          </p>
          </div>
        </div>
      ))}
    </div>

                  <div className="msger-inputs px-4 py-3 flex items-center">
                    <Button
                      onClick={openFileManager}
                      className="text-xl text-gray-500 hover:text-gray-700 mr-2"
                    >
                      <i className="fa fa-paperclip"></i>
                    </Button>
                    <Input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          HandleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      className="rounded-lg border-0 shadow-sm"
                    />

                    {/* Recording Button */}
                    <button
                      className={`border rounded-full p-2 mr-2 ${
                        isRecording ? "bg-red-500" : "bg-green-500"
                      }`}
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      <i
                        className={`fa fa-${
                          isRecording ? "stop" : "microphone"
                        }`}
                        aria-hidden="true"
                      ></i>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button onClick={HandleSendMessage} color="primary">
                      <i className="fa fa-paper-plane"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
      {Errordisconect && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-red-500 p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Disconnected
            </h2>
            <p className="text-white mb-6">
              You have been disconnected from the server.
            </p>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              onClick={() => {
                handleReload();
              }}
            >
              Reconnect
            </button>
          </div>
        </div>
      )}
    </App>
  );
};

export default ChatPage;
