import React, { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  FaComments,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBan ,
} from "react-icons/fa";

import UserBadge from "@/public/images/User.jpg";
import Link from "next/link";
import { MdOutlineTimer } from "react-icons/md";
import { AiOutlineHourglass } from "react-icons/ai";
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
  CardHeader,
} from "reactstrap";
import {
  fetchConversationList,
  fetchConversationMessage,
  resetMessages,
  clearconversationstate,
  NewAgentMessage,
} from "@/slices/ConversationSlice";
import SweetAlert from "sweetalert2";
import { fetchAgentStats, cleaAgentStats } from "@/slices/AgentSlice";
import * as signalR from "@microsoft/signalr";
import DefinedTemplates from "../AgentDefinedTemplate";
import { toast } from "react-toastify";
import { BASE_URL } from "@/utils/apiConstants";
import Loader from "@/components/Layout/Loader";
import App from "@/components/Layout/App";
import EmojiPicker from "emoji-picker-react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { extractTime } from "@/utils/constants";
import { set } from "date-fns";
import {
  HiZoomIn,
  HiZoomOut,
  HiLogout,
  HiMoon,
  HiSun,
  HiMenu,
  HiShieldExclamation,
} from "react-icons/hi";
const ChatPage = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [tempMessages, setTempMessages] = useState([]);
  const dispatch = useDispatch();
  const { conversations, loading, error } = useSelector(
    (state) => state.conversations
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {
    messages,
    currentPage,
    hasMore,
    loading: messageLoading,
  } = useSelector((state) => state.conversations);
  const { AgentStats, loading: statsLoading } = useSelector(
    (state) => state.agents
  );
  const inputRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [AgentConversation, setAgentConversation] = useState([]);
  const [ShowDetailedTemplate, setShowDetailedTemplate] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [mediaFile, setMediaFile] = useState(null); // To store the selected media file
  const [connection, setConnection] = useState(null);
  const [Activechat, setActiveChat] = useState(0);
  const [ActiveSenderId, setActiveSenderId] = useState(0);
  const fileInputRef = useRef(null); // Reference for the file input
  const [Errordisconect, setErrordisconect] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const toggleModal = () => setModalOpen((prevState) => !prevState);
  const activeChatRef = useRef(Activechat);
  const agentChatRef = useRef([AgentConversation]);
  const containerRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [Contactsloading, setContactsloading] = useState(false);
  const [Chatsloading, setChatsloading] = useState(false);
  const [fileType, setFileType] = useState(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const isManualScroll = useRef(false);
  const audioRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const timersRef = useRef({});
  const [pageNo, setPageNo] = useState(1);
  const [unrepliedChats, setUnrepliedChats] = useState([]);
  const [templateDetails, setTemplateDetails] = useState([]);
  const lastScrollTop = useRef(0);
  useEffect(() => {
    // Initialize the audio object only once
    audioRef.current = new Audio("/assets/Notification/chatassigned.mp3");
  }, []);

  const handleTemplateSend = (details) => {
    setTemplateDetails(details); // Update parent state
    console.log("Received template details:", details);
  };

  const handleLogout = () => {
    SweetAlert.fire({
      title: "Are you sure you want to logout?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        router.push("/auth/login");
      }
    });
  };

  useEffect(() => {
    if (templateDetails) {
      const newMessage = {
        messageId: Date.now(),
        typeId: 1,
        messageContent: templateDetails.bodyText,
        contentType: templateDetails.contentType
          ? templateDetails.contentType
          : "", // Set content type if there's media
        mediaPath: templateDetails.mediaPath ? templateDetails.mediaPath : "", // Set media path if there's media
        buttonJson: templateDetails.buttonsJson
          ? templateDetails.buttonsJson
          : "",
        createdDate: new Date().toLocaleString(),
      };

      setChatMessages((prevMessages) => [newMessage, ...prevMessages]);
    }
  }, [templateDetails]);

  //call the fetchConversationList action to fetch agents conversations
  useEffect(() => {
    const ClientId = localStorage.getItem("clientId");
    const AgentId = localStorage.getItem("userId");

    if (ClientId) {
      dispatch(fetchConversationList({ clientId: ClientId, AgentId: AgentId }));
      dispatch(fetchAgentStats({ clientId: ClientId, agentId: AgentId }));
      setContactsloading(true);
    }

    return () => {
      dispatch(clearconversationstate());
    };
  }, [dispatch]);

  //triggered each time when conversations changes and assign to local state
  useEffect(() => {
    if (conversations && conversations.length > 0) {
      setContactsloading(false);
      setAgentConversation(conversations);
    } else {
      setContactsloading(false);
    }
  }, [conversations]);

  //called each time to get conversation messages
  const HandleConversationDetail = async (id) => {
    setChatsloading(true);
    dispatch(resetMessages());
    setActiveChat(id); // Update Activechat state
    const ClientId = localStorage.getItem("clientId");
    if (ClientId && id) {
      await dispatch(
        fetchConversationMessage({
          clientId: ClientId,
          ChatId: id,
          pageNo: pageNo,
        })
      );
    }
    return () => {
      dispatch(resetMessages());
    };
  };
  const handleAgentdefinetemplate = () => {
    setShowDetailedTemplate(true);
  };
  const handleAgenttemplateclose = () => {
    setShowDetailedTemplate(false);
  };

  //to set the activechat
  useEffect(() => {
    activeChatRef.current = Activechat;
  }, [Activechat]);

  useEffect(() => {
    agentChatRef.current = AgentConversation;
  }, [AgentConversation]);

  //triggered each time when messages changes and assign to local state
  useEffect(() => {
    if (messages && messages.length > 0) {
      setChatsloading(false);
      setChatMessages(messages);
      setActiveSenderId(messages[0].senderId);
    }
  }, [messages]);

  //Add emoji function
  const addEmoji = (emoji) => {
    setMessageInput((prevMessage) => prevMessage + emoji);
  };

  const handleScroll = () => {
    if (!hasMore || loading) return;

    const container = scrollContainerRef.current;
    const buffer = 200; // Trigger API call 200px before reaching the top

    // Detect upward scrolling
    const currentScrollTop = container.scrollTop;
    if (
      currentScrollTop < lastScrollTop.current &&
      currentScrollTop <= buffer
    ) {
      // Fetch older chats when scrolling up near the top
      dispatch(
        fetchConversationMessage({
          clientId: localStorage.getItem("clientId"),
          ChatId: Activechat,
          pageNo: currentPage + 1,
        })
      );
    }

    // Update last scroll position
    lastScrollTop.current = currentScrollTop;
  };

  useEffect(() => {
    if (Activechat !== 0) {
      const container = scrollContainerRef.current;
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [currentPage, hasMore, loading, Activechat]);

  const handleImageclose = () => {
    setMediaFile(null);
    setPreviewUrl(null);
  };

  //called each time to send message
  const HandleSendMessage = async () => {
    setPreviewUrl(null);
    setFileType(null);
    setFileType(null);
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

      setChatMessages((prevMessages) => [newMessage, ...prevMessages]);
      setMessageInput("");
      await dispatch(NewAgentMessage(formData)).unwrap();
      //toast.success("Message sent successfully!");
      setMediaFile(null); // Clear the selected file after sending the message
      setPreviewUrl(null);
      setFileType(null); //get the file type
      clearTimer(Activechat);
      removeUnrepliedMark(Activechat);
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
        setAgentConversation(updatedConversations);
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

  useEffect(() => {
    if (AgentConversation && AgentConversation.length > 0) {
      // Filter messages with unread count > 0
      const unreadMessages = AgentConversation.filter(
        (message) => message.unreadCount > 0
      );
      const unreadMessageIds = unreadMessages.map((message) => message.id);

      // Assign the unread message IDs to the desired functions
      unreadMessageIds.map((messageId) => {
        startTimer(messageId);
        markChatAsUnreplied(messageId);
      });
    }
  }, [AgentConversation]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file); // Store the selected fil
      setPreviewUrl(URL.createObjectURL(file)); // Generate a temporary URL for preview
      setFileType(file.type.split("/")[0]);
    }
  };

  const openFileManager = () => {
    fileInputRef.current.click(); // Trigger the file input click event
  };

  useEffect(() => {
    if (!Chatsloading && tempMessages.length > 0) {
      //debugger;
      // Append tempMessages to chatMessages when loading becomes false
      setChatMessages((prevMessages) => [...tempMessages, ...prevMessages]);
      setTempMessages([]); // Clear tempMessages after appending
    }
  }, [Chatsloading, tempMessages]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("UserId not found in localStorage");
      return;
    }

    // Initialize SignalR connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/conversation?AgentId=${userId}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect() // Automatically reconnect on failure
      .build();

    setConnection(newConnection);

    // Handles incoming messages
    const handleIncomingMessage = (message) => {
      //debugger;
      // Play notification sound
      audioRef.current
        ?.play()
        .catch((err) =>
          console.error("Failed to play notification sound:", err)
        );

      // Show success toast notification
      //toast.success("You have a new message");

      // Update agent statistics
      dispatch(
        fetchAgentStats({
          clientId: localStorage.getItem("clientId"),
          agentId: userId,
        })
      );

      // Find if the message belongs to an existing conversation
      const matchingConversationIndex = agentChatRef.current.findIndex(
        (conversation) => conversation.id === message.conversationId
      );

      if (matchingConversationIndex !== -1) {
        const updatedConversations = [...agentChatRef.current];
        const matchingConversation =
          updatedConversations[matchingConversationIndex];

        // Start timer for unread message if no unread messages exist
        if ((matchingConversation.unreadCount || 0) <= 0) {
          startTimer(message.conversationId);
        }

        // Update the conversation with the latest message and unread count
        updatedConversations[matchingConversationIndex] = {
          ...matchingConversation,
          lastMessageText: message.messageContent,
          updatedDate: message.createdDate,
          unreadCount: (matchingConversation.unreadCount || 0) + 1,
        };

        agentChatRef.current = updatedConversations;
        setAgentConversation(updatedConversations);
      } else {
        console.warn(
          "No matching conversation found for message.conversationId:",
          message.conversationId
        );
      }

      // If the message belongs to the active chat
      if (message.conversationId === activeChatRef.current) {
        if (loading) {
          setTempMessages((prevTemp) => [...prevTemp, message]);
        } else {
          setChatMessages((prevMessages) => [
            message,
            ...tempMessages,
            ...prevMessages,
          ]);
          setTempMessages([]);
        }
      } else {
        // Show notification for new message
        //toast.success("Check message");

        if (matchingConversationIndex !== -1) {
          const updatedConversations = [...agentChatRef.current];
          const matchingConversation =
            updatedConversations[matchingConversationIndex];

          // Move the updated conversation to the top of the list
          updatedConversations.splice(matchingConversationIndex, 1);
          updatedConversations.unshift(matchingConversation);

          agentChatRef.current = updatedConversations;
          setAgentConversation(updatedConversations);
        }
      }
    };

    // Handles new conversation assignment to the agent
    const handleConversationAssigned = (notification) => {
      //debugger;
      audioRef.current
        ?.play()
        .catch((err) =>
          console.error("Failed to play notification sound:", err)
        );
      //console.log("notification :", notification);
      //toast.success("You have a new message request");

      // Update agent statistics
      dispatch(
        fetchAgentStats({
          clientId: localStorage.getItem("clientId"),
          agentId: userId,
        })
      );

      startTimer(notification.id);

      // Find if the conversation already exists
      const matchingConversationIndex = agentChatRef.current.findIndex(
        (conversation) => conversation.id === notification.id
      );

      if (matchingConversationIndex !== -1) {
        const updatedConversations = [...agentChatRef.current];
        updatedConversations[matchingConversationIndex] = {
          ...updatedConversations[matchingConversationIndex],
          lastMessageText: notification.lastMessageText,
          unreadCount:
            (updatedConversations[matchingConversationIndex].unreadCount || 0) +
            1,
        };

        agentChatRef.current = updatedConversations;
        setAgentConversation(updatedConversations);
      } else {
        // Add the new conversation to the list
        const newNotification = { ...notification, unreadCount: 1 };
        setAgentConversation((prevMessages) => [
          newNotification,
          ...prevMessages,
        ]);
      }
    };

    // Handles unassignment of a conversation
    const handleConversationUnAssigned = (chatId) => {
      
      if (
        agentChatRef.current.filter(
          (conversation) => conversation.id === chatId
        ).length === 0
      )
        return;

      //toast.warning("A conversation has been unassigned");

      // Update agent statistics
      dispatch(
        fetchAgentStats({
          clientId: localStorage.getItem("clientId"),
          agentId: userId,
        })
      );
      // Remove the conversation from the list
      const updatedConversations = agentChatRef.current.filter(
        (conversation) => conversation.id !== chatId
      );
      const matchingConversationIndex = agentChatRef.current.findIndex(
        (conversation) => conversation.id === chatId
      );

      if (matchingConversationIndex !== -1) {
        setChatMessages([]);
        setActiveChat(0);
      }
      clearTimer(chatId);
      agentChatRef.current = updatedConversations;
      setAgentConversation(updatedConversations);

      
    };

    // Set up SignalR event listeners
    newConnection.on("MessageReceived", handleIncomingMessage);
    newConnection.on("ConversationAssigned", handleConversationAssigned);
    newConnection.on("ConversationUnAssigned", handleConversationUnAssigned);

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR");
        console.log("Connection ID: ", newConnection.connectionId);
      })
      .catch((err) => {
        console.error("Error while starting the connection:", err);
        setErrordisconect(true);
      });

    return () => {
      newConnection.stop().then(() => console.log("Connection stopped"));
      setErrordisconect(true);
    };
  }, []);

  const startTimer = (id) => {
    // Clear existing timer if any
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
    }

    // Set a new 5-minute timer
    timersRef.current[id] = setTimeout(() => {
      handleTimerExpiry(id);
    }, 5 * 60 * 1000); // 30 minutes
  };

  const handleTimerExpiry = (id) => {
    toast.error(`Time expired for chat/message ID: ${id}`);

    // Play alert sound
    audioRef.current
      ?.play()
      .catch((err) =>
        console.error("Failed to play alert sound on timer expiry:", err)
      );

    // Trigger another 5-minute timer if no action is taken
    if (!isMessageReplied(id)) {
      console.warn(`No reply for ID: ${id}, rescheduling timer.`);
      markChatAsUnreplied(id);
      startTimer(id); // Restart the timer
    } else {
      console.info(`Reply received for ID: ${id}, stopping timer.`);
      clearTimer(id); // Stop the timer if replied
    }
  };

  const clearTimer = (id) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  };

  // Function to check if the message was replied
  const isMessageReplied = (id) => {
    // Example condition: Check active chat messages or a specific state
    return (
      activeChatRef.current === id && chatMessages.some((msg) => msg.reply)
    );
  };

  const markChatAsUnreplied = async (id) => {
    setUnrepliedChats((prev) => [...prev, id]);
    console.log("Marked chat as unreplied:", unrepliedChats);
  };

  const removeUnrepliedMark = (id) => {
    setUnrepliedChats((prev) => prev.filter((chatId) => chatId !== id));
  };

  const handleReload = () => {
    // Reload the current page
    window.location.reload();
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between bg-gray-900 p-4 rounded shadow-md space-x-4">
        {/* Assigned */}
        <nav className="text-white bg-gray-900 fixed top-0 left-0 right-0 z-50 shadow-md w-full">
          <Head>
            <title>BCT-Chat Portal</title>
            {/* <title>{props.title}</title> */}
          </Head>
          <div className="flex justify-between items-center py-3 px-4">
            {/* Logo Section on the Left Side */}
            <div className="flex items-center space-x-3">
              <img
                className="h-8 w-auto"
                src="/images/logo/Loader.svg"
                alt="Logo"
              />
            </div>

            {/* Action Buttons Section on the Right Side */}
            <div className="">
              {/* Sidebar Toggle Button */}
              <div className="flex items-center space-x-4">
                {/* Assigned */}
                <div className="flex items-center space-x-2">
                  <FaComments size={20} className="text-blue-500" />
                  <span className="font-medium text-white">
                    Assigned:{" "}
                    <span className="font-bold">
                      {AgentStats.assignedChat ?? "-/-"}
                    </span>
                  </span>
                </div>

                {/* Active */}
                <div className="flex items-center space-x-2">
                  <FaCheckCircle size={20} className="text-green-500" />
                  <span className="font-medium text-white">
                    Active:{" "}
                    <span className="font-bold">
                      {AgentStats.activeChat ?? "-/-"}
                    </span>
                  </span>
                </div>
               {/* Abandoned */}
               <div className="flex items-center space-x-2">
                  <FaBan  size={20} className="text-red-500" />
                  <span className="font-medium text-white">
                    Abandoned:{" "}
                    <span className="font-bold">
                      {AgentStats.abandonChat ?? "-/-"}
                    </span>
                  </span>
                </div>
                {/* Closed */}
                <div className="flex items-center space-x-2">
                  <FaTimesCircle size={20} className="text-red-500" />
                  <span className="font-medium text-white">
                     Closed:{" "}
                    <span className="font-bold">
                      {AgentStats.closedChat ?? "-/-"}
                    </span>
                  </span>
                </div>
               
                {/* Expired */}
                <div className="flex items-center space-x-2">
                  <AiOutlineHourglass size={20} className="text-yellow-100" />
                  <span className="font-medium text-white">
                    Expired:{" "}
                    <span className="font-bold">
                      {AgentStats.expiredChat ?? "-/-"}
                    </span>
                  </span>
                </div>
                {/* Force Closed */}
                <div className="flex items-center space-x-2">
                  <FaClock size={20} className="text-purple-500" />
                  <span className="font-medium text-white">
                    Force Closed:{" "}
                    <span className="font-bold">
                      {AgentStats.forceClosedChat ?? "-/-"}
                    </span>
                  </span>
                </div>
                {/* Avg Duration */}
                <div className="flex items-center space-x-2">
                  <MdOutlineTimer size={20} className="text-orange-500" />
                  <span className="font-medium text-white">
                    Avg Duration:{" "}
                    <span className="font-bold">
                      {AgentStats.avgChatTime ?? "-/-"}
                    </span>
                  </span>
                </div>
                {/* Response Time */}
                <div className="flex items-center space-x-2">
                  <MdOutlineTimer size={20} className="text-green-500" />
                  <span className="font-medium text-white">
                    Response Time:{" "}
                    <span className="font-bold">
                      {AgentStats.avgResponseTime ?? "-/-"} min(s)
                    </span>
                  </span>
                </div>
                {/* User Badge with Name and Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 p-2 bg-gray-800 text-white-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <img
                      src={UserBadge.src}
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{localStorage.getItem("userName")}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-700 shadow-lg rounded-md">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-white-800 dark:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-600"
                      >
                        <HiLogout />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <Container fluid className="h-100  mt-[35px]">
        <Row className="g-0 h-100">
          <Col
            xxl="3"
            xl="4"
            md="5"
            sm="12"
            className="p-0"
            style={{
              height: "calc(100vh - 100px)",
              overflow: "hidden",
            }}
          >
            {/* Content goes here */}

            <Card className="left-sidebar-wrapper h-100">
              {/* <div className="left-sidebar-chat ">
                <InputGroup>
                  <InputGroupText className="w-full">
                    <i className="fa fa-search mr-2" aria-hidden="true"></i>
                    <Input type="text" placeholder="Search here" />
                  </InputGroupText>
                </InputGroup>
              </div> */}

              <TabContent id="chat-options-tabContent">
                <TabPane id="chats">
                  <ul
                    className="list-unstyled chats-user overflow-auto"
                    style={{ height: "80vh", margin: "0" }}
                  >
                    {AgentConversation?.length === 0 && !loading && (
                      <div className="text-center">No Chats Found</div>
                    )}
                    {AgentConversation?.map((conversation) => (
                      <li
                        key={conversation.id}
                        className={`d-flex justify-content-between align-items-center p-2 mb-1 chat-item ${
                          Activechat === conversation.id ? " text-white" : ""
                        }`}
                        style={
                          Activechat !== conversation.id &&
                          unrepliedChats.includes(conversation.id)
                            ? {
                                animation: "blink 1s infinite",
                                backgroundColor: "#ffcccc",
                              }
                            : Activechat === conversation.id
                            ? {
                                backgroundColor: "#ddffd9", // Dark gray color
                                color: "white",
                              }
                            : { minHeight: "60px" }
                        }
                        onClick={() =>
                          HandleConversationDetail(conversation.id)
                        }
                      >
                        <div className="d-flex align-items-center w-75">
                          <img
                            src={`${BASE_URL}${conversation.logo}`}
                            alt="User Logo"
                            className="rounded-circle me-2"
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                            }}
                          />

                          <div className="flex-grow-1">
                            <span className="d-block text-truncate fw-bold text-dark">
                              {conversation.fullName}
                            </span>
                            <span className="d-block text-truncate text-muted">
                              {conversation.phoneNumber}
                            </span>
                            {conversation.lastMessageText !== "" ? (
                              <p
                                className="d-block text-truncate text-muted"
                                style={{
                                  maxWidth: "220px",
                                  fontSize: "14px",
                                  marginBottom: "0",
                                }}
                              >
                                {conversation.lastMessageText}
                              </p>
                            ) : (
                              <div className="d-flex align-items-center text-muted">
                                <i className="fa fa-photo me-1"></i>
                                <span style={{ fontSize: "12px" }}>Media</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="d-flex flex-column align-items-end justify-content-between">
                          <p className="text-xs text-gray-400">
                            {extractTime(conversation.updatedDate)}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                              @{conversation.unreadCount}
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
            sm="12"
            className="p-0"
            style={{ height: "calc(100vh - 100px)" }}
          >
            {Activechat !== 0 && (
              <Card className="right-sidebar-chat h-100">
                {AgentConversation.filter(
                  (conversation) => conversation.id === Activechat
                ).map((conversation) => (
                  <div
                    key={conversation.id}
                    className="flex items-center justify-between text-black px-4 py-3 shadow-md"
                  >
                    {/* Left Section */}
                    <div
                      key={conversation.id}
                      className="flex items-center space-x-3"
                    >
                      <img
                        src={`${BASE_URL}${conversation.logo}`}
                        
                        alt="User Logo"
                            className="rounded-circle me-2"
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                            }}
                      />

                      <div>{conversation.fullName}</div>
                      <div>{conversation.phoneNumber}</div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                      {/* Search Input */}
                    </div>
                  </div>
                ))}
                <div className="right-sidebar-chat p-4 w-full height-chat-box overflow-y-auto chat-background h-100">
                  <div className="msger flex flex-col h-full">
                    <div
                      ref={scrollContainerRef}
                      className="msger-chat flex-grow overflow-y-auto space-y-4 px-4 py-2"
                      style={{
                        height: "80vh",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column-reverse",
                      }}
                    >
                      {Chatsloading && (
                        <div className="text-center">Loading messages...</div>
                      )}
                      {chatMessages?.map((message) => (
                        <div
                          key={message.messageId}
                          className={`flex ${
                            message.typeId === 1
                              ? "justify-end"
                              : "justify-start"
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
                                  className="mb-2 p-1 rounded bg-gray-100 text-gray-600 text-sm italic border-l-4 border-gray-300 overflow-hidden text-ellipsis"
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
                            <div
                              className="flex items-end justify-between p-2 rounded-lg"
                              style={{ width: "auto" }}
                            >
                              <p
                                className="whitespace-pre-wrap break-words overflow-hidden"
                                style={{
                                  fontSize: "15px",
                                  display: "inline-block",
                                  
                                }}
                              >
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
                              <span
                                className="ml-2 text-gray-500 text-xs"
                                style={{ whiteSpace: "nowrap" }}
                              >
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

                    <div className="msger-inputs px-4 py-3 flex items-center">
                      <Button
                        onClick={openFileManager}
                        className="text-xl text-gray-500 hover:text-gray-700 mr-2"
                      >
                        <i className="fa fa-paperclip"></i>
                      </Button>
                      {/* Emoji Picker Button */}
                      <button
                        className="mr-2 p-2 hover:bg-gray-200 rounded-full"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                      >
                        <i className="fa fa-smile-o text-gray-600"></i>
                      </button>

                      {/* Emoji Picker */}
                      {showEmojiPicker && (
                        <div
                          className="absolute bottom-16 left-0 bg-white border rounded-lg shadow-lg p-2 z-50"
                          style={{ width: "auto" }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700 font-semibold">
                              Select Emoji
                            </span>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => setShowEmojiPicker(false)}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </div>
                          <EmojiPicker
                            onEmojiClick={(emojiData) => {
                              addEmoji(emojiData.emoji); // Pass emoji value
                            }}
                          />
                        </div>
                      )}
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

                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="relative">
                        <button
                          onClick={handleAgentdefinetemplate}
                          className="  rounded-full m-3 "
                        >
                          <i className="fa fa-comment"></i>
                        </button>

                        {ShowDetailedTemplate && (
                          <DefinedTemplates
                            isVisible={true}
                            onClose={handleAgenttemplateclose}
                            SenderId={ActiveSenderId}
                            ChatId={Activechat}
                            onSend={handleTemplateSend}
                          />
                        )}
                      </div>
                      <Button onClick={HandleSendMessage} color="primary">
                        <i className="fa fa-paper-plane"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            {Activechat === 0 && (
              <div className="font-bold text-center mt-[30%] text-gray-400 text-2xl">
                Select a chat from left panel
              </div>
            )}
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
    </>
  );
};

export default ChatPage;
