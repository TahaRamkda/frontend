import React, { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import oneSignalService from "@/components/OneSignalService";
import OneSignal from "react-onesignal";
//import { ClipboardCopy } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaComments,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBan,
  FaCopy,
} from "react-icons/fa";
import { useLogger } from "next-axiom"; // Import Axiom logger
import loggerdetails from "@/components/logger";
import { Image } from "react-bootstrap";
import AgentStatusDropdown from "@/components/Dropdowns/AgentStatusDropdown";
import {
  getAgentConversations,
  getAgentMessages,
  addConversation,
  addMessageToConversation,
  removeConversation,
  selectExpiredConversations,
  checkForExpiredConversations,
  setAgentstatus,
  getAgentTemplate,
  getAgentTemplateDetail,
} from "@/slices/ChatBridgeSlice";
import {
  SendInteractivetemp,
  clearAgentTemplateSentState,
} from "@/slices/ConversationSlice";
import UserBadge from "@/public/images/User.jpg";
import { AiOutlineHourglass } from "react-icons/ai";
import {
  Card,
  Col,
  Input,
  TabContent,
  TabPane,
  Container,
  Row,
  Button,
} from "reactstrap";
import {
  fetchConversationList,
  fetchConversationMessage,
  resetMessages,
  clearconversationstate,
  NewAgentMessage,
} from "@/slices/ConversationSlice";
import { FiRotateCw } from "react-icons/fi";
import SweetAlert from "sweetalert2";
import showSweetAlert from "@/components/Sweetalert";
import { fetchAgentsById, fetchAgentStats } from "@/slices/AgentSlice";
import * as signalR from "@microsoft/signalr";
import DefinedTemplates from "../../Chats/AgentDefinedTemplate";
import { toast } from "react-toastify";
import { BASE_URL } from "@/utils/apiConstants";
import Loader from "@/components/Layout/Loader";
import EmojiPicker from "emoji-picker-react";
import { extractTime } from "@/utils/constants";
import { set } from "date-fns";
import {
  NOTIFICATION_WARNING_INTERVAL,
  HEARTBEAT_CHECK_INTERVAL,
} from "@/utils/constants";

import { HiLogout, HiMenuAlt2, HiSearch, HiCog } from "react-icons/hi";
import { sendPushNotification } from "@/components/SendPushNotification";
import { AppId } from "@/utils/constants";
import { LogerType } from "@/utils/constants";
import {
  BsChatDots,
  BsChatDotsFill,
  BsCheckAll,
  BsCheck,
} from "react-icons/bs";
import Logo from "@/components/Logo/logo";

const ChatPage = () => {
  const router = useRouter();
  const logger = useLogger();
  const [modalOpen, setModalOpen] = useState(false);
  const [tempMessages, setTempMessages] = useState([]);
  const dispatch = useDispatch();
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { conversationList } = useSelector((state) => state.bridge);
  const [logoSrc, setLogoSrc] = useState("");
  const [companyName, setCompanyName] = useState("");
  const { messages, currentPage, hasMore, loading } = useSelector(
    (state) => state.conversations
  );
  const { agentStatsList, loading: statsLoading } = useSelector(
    (state) => state.agents
  );
  const agenttemplates = useSelector(
    (state) => state.bridge.agentTemplatesList
  );

  const inputRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [AgentConversation, setAgentConversation] = useState([]);
  const [ShowDetailedTemplate, setShowDetailedTemplate] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const connectionRef = useRef(null);
  const [Activechat, setActiveChat] = useState(0);
  const [ActiveSenderId, setActiveSenderId] = useState(0);
  const fileInputRef = useRef(null);
  const [Errordisconnect, setErrordisconnect] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [AgentStatus, setAgentStatus] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [sendingMessages, setSendingMessages] = useState(new Set());
  const [repliedMessages, setRepliedMessages] = useState(new Set());
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [parameters, setParameters] = useState([]);
  const activeChatRef = useRef(Activechat);
  const [parameterValues, setParameterValues] = useState([]);
  const [templateView, setTemplateView] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const agenttemplatedetails = useSelector(
    (state) => state.bridge.agenttemplatedetails
  );
  const {
    masterDataList,
    loading: masterDataLoading,
    error,
  } = useSelector((state) => state.agents);

  // Add debounce effect for search
  useEffect(() => {
    console.log("2");
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Add effect to filter templates
  useEffect(() => {
    console.log("3");
    if (agenttemplates && ActiveSenderId) {
      const filtered = agenttemplates.filter((template) => {
        const matchesSenderId = template.senderId === ActiveSenderId;
        const matchesSearchQuery = template.name
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase());
        return matchesSenderId && matchesSearchQuery;
      });
      setFilteredTemplates(filtered);
    } else {
      setFilteredTemplates([]);
    }
  }, [debouncedSearchQuery, agenttemplates, ActiveSenderId]);

  // Add effect to fetch templates when sender changes
  useEffect(() => {
    console.log("4");
    if (ActiveSenderId) {
      dispatch(getAgentTemplate({ senderId: ActiveSenderId }));
    }
  }, [dispatch, ActiveSenderId]);

  const [isManualScroll, setIsManualScroll] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [unrepliedChats, setUnrepliedChats] = useState([]);
  const [templateDetails, setTemplateDetails] = useState([]);
  const [heartbeatAttempts, setheartbeatAttempts] = useState(0);
  const [tryReconnect, settryReconnect] = useState(false);
  const lastScrollTop = useRef(0);
  const [UserId, setuserId] = useState(0);
  const [IsOneSignalLoaded, setIsOneSignalLoaded] = useState(false);
  const expiredConversations = useSelector(selectExpiredConversations);
  const message = useSelector(
    (state) =>
      state.bridge.conversationList.find((c) => c.id === Activechat)
        ?.messages || []
  );
  const containerRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [Contactsloading, setContactsloading] = useState(false);
  const [Chatsloading, setChatsloading] = useState(false);
  const [fileType, setFileType] = useState(null);
  const audioRef = useRef(null);
  const audioRef2 = useRef(null);
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const timersRef = useRef({});
  const agentChatRef = useRef([AgentConversation]);
  const [userName, setUserName] = useState("");
  // Filter conversationList based on search and active tab
  const filteredConversations = AgentConversation?.filter((conversation) => {
    const matchesSearch = conversation.phoneNumber
      .toLowerCase()
      .includes(customerSearchQuery.toLowerCase());

    switch (activeTab) {
      case "unread":
        return matchesSearch && conversation.unreadCount > 0;
      case "replied":
        return matchesSearch && conversation.unreadCount === 0;
      default:
        return matchesSearch;
    }
  });
  useEffect(() => {
    console.log("5");
    if (typeof window !== "undefined") {
      // Ensure code runs only in the browser
      const name = localStorage.getItem("userName") || "User"; // Fallback if userName is not found
      setUserName(name);
    }
  }, []);

  const sortedOptions = () => {
    if (!masterDataList || masterDataList.length === 0)
      return masterDataList || [];

    const selectedOption = masterDataList.find((option) => option.id === "");
    const otherOptions = masterDataList.filter((option) => option.id !== "");

    return selectedOption ? [selectedOption, ...otherOptions] : masterDataList;
  };

  const orderedOptions = sortedOptions();

  const HandleAgentStatus = async (e) => {
    const StatusId = e.target.value;
    setChatsloading(true);
    setAgentStatus(StatusId);
    try {
      const response = await dispatch(
        setAgentstatus({ agentId: UserId, statusId: StatusId })
      ).unwrap();

      if (response.status === 1) {
        await loggerdetails(
          logger,
          `agent status updated to ${StatusId} `,
          "info",
          {
            agentId: UserId,
            type: LogerType.logoutOrstatuschange,
          }
        );
        showSweetAlert({
          title: response.message || "Status updated successfully",
          text: "",
          icon: "success",
        });
      } else {
        showSweetAlert({
          title: response.message || "Status updated successfully",
          text: "",
          icon: "danger",
        });
      }
    } catch (error) {
      showSweetAlert({
        title: error.message || "Failed to update status",
        text: "",
        icon: "error",
      });
    } finally {
      setChatsloading(false); // Hide loader
    }
  };

  useEffect(() => {
    console.log("6");
    // Dispatch an initial check
    dispatch(checkForExpiredConversations());
    // Set up the interval to dispatch the check every 10 seconds
    const intervalId = setInterval(() => {
      dispatch(checkForExpiredConversations());
    }, 10000); // 10 seconds

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    console.log("7");
    // Handle expired conversationList
    expiredConversations.forEach((conversation) => {
      if (conversation.expireType === 1) {
        audioRef.current
          ?.play()
          .catch((err) =>
            console.error("Failed to play notification sound:", err)
          );
        toast.error(
          `Chat with Phone number : ${conversation.phoneNumber} is waiting for your reply.`
        );
        sendPushNotification({
          message: `Chat with Phone number : ${conversation.phoneNumber} is waiting for your reply.`,
          userID: UserId,
        });
      } else if (conversation.expireType === 2) {
        audioRef.current
          ?.play()
          .catch((err) =>
            console.error("Failed to play notification sound:", err)
          );
        toast.error(
          `Person with Phone number : ${conversation.phoneNumber} is waiting for your reply.`
        );
        sendPushNotification({
          message: `Person with Phone number : ${conversation.phoneNumber} is waiting for your reply.`,
          userID: UserId,
        });
      }
    });
  }, [expiredConversations]);

  useEffect(() => {
    console.log("8");
    if (message.length > 0) {
      // Reverse the order to maintain correct sequence
      setChatMessages([...message].reverse());
      setActiveSenderId(message[0].senderId);

      // Check for existing replies and update repliedMessages
      const newRepliedMessages = new Set();
      message.forEach((msg, index) => {
        if (msg.typeId === 2) {
          // If it's a user message
          // Mark all previous agent messages as replied
          message
            .slice(index + 1)
            .filter((m) => m.typeId === 1)
            .forEach((m) => newRepliedMessages.add(m.messageId));
        }
      });
      setRepliedMessages(newRepliedMessages);
    }
  }, [message]);

  useEffect(() => {
    console.log("9");
    // Initialize the audio object only once
    audioRef.current = new Audio("/assets/Notification/chatassigned.mp3");

    audioRef2.current = new Audio("/assets/Notification/alertsound.mp3");
  }, []);

  const handleTemplateSend = async (details) => {
    await loggerdetails(logger, `agent sent template :`, "info", {
      Obj: details,
      conversationId: details?.ChatId,
      agentId: UserId,
      type: LogerType.messagesent,
    });
    setTemplateDetails(details); // Update parent state
    console.log("Received template details:", details);
  };

  const handleCopy = (text) => {
    const phoneNumber = text.startsWith("965") ? text.slice(3) : text;
    navigator.clipboard.writeText(phoneNumber);
    //alert(`Copied: ${phoneNumber}`);
    toast.success(`Copied: ${phoneNumber}`);
  };

  const handleLogout = async () => {
    SweetAlert.fire({
      title: "Are you sure you want to logout?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(
            setAgentstatus({ agentId: UserId, statusId: "0" })
          ).unwrap();

          if (response.status === 1) {
            await loggerdetails(
              logger,
              `Agent with ID:${UserId} logged out`,
              "info",
              {
                agentId: UserId,
                type: LogerType.logoutOrstatuschange,
              }
            );
            const optedOut = await oneSignalService.optOut();
            if (!optedOut) {
              console.warn("Failed to opt-out from OneSignal notifications.");
            }
            //logger.info("Received new message detail ADSFSD:",  extra={     "user_id": 5,response  } )
            // Remove specific session-related items instead of clearing everything
            const logoPath = localStorage.getItem("LogoPath");
            const merchantName = localStorage.getItem("MerchantName");
            localStorage.clear();
            // ✅ Restore preserved values
            if (logoPath) localStorage.setItem("LogoPath", logoPath);
            if (merchantName)
              localStorage.setItem("MerchantName", merchantName);

            // router.push("/auth/login");
            window.location.href = "/auth/login";
          } else {
            SweetAlert.fire({
              title: "Logout Failed",
              text: "Unable to update status. Please try again.",
              icon: "error",
            });
          }
        } catch (error) {
          SweetAlert.fire({
            title: "Error",
            text: "An error occurred during logout. Please try again.",
            icon: "error",
          });
          await loggerdetails(logger, " Error while loging out:", "error", {
            Obj: error,
            logtype: "error",
            conversationId: Activechat,
            agentId: UserId,
            type: LogerType.Error,
          });
        }
      }
    });
  };

  // OneSignal initialization and setup
  useEffect(() => {
    console.log("10");
    const setupOneSignal = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.warn("No userId found in localStorage for OneSignal setup.");
        return;
      }

      // Initialize OneSignal
      const initialized = await oneSignalService.initializeOneSignal();
      if (!initialized) {
        console.error("Failed to initialize OneSignal.");
        return;
      }

      setIsOneSignalLoaded(true);

      // Login with user ID
      const loggedIn = await oneSignalService.login(userId);
      if (!loggedIn) {
        console.error("Failed to log in to OneSignal.");
        return;
      }

      // Check subscription status and prompt if not subscribed
      const isSubscribed = await oneSignalService.isSubscribed();
      if (!isSubscribed) {
        const prompted = await oneSignalService.promptPush();
        if (!prompted) {
          console.warn("Failed to prompt for push notifications.");
        }
      }

      // Opt-in to push notifications
      const optedIn = await oneSignalService.optIn();
      if (!optedIn) {
        console.warn("Failed to opt-in to push notifications.");
      }
    };

    setupOneSignal();
  }, []);

  useEffect(() => {
    console.log("11");
    if (templateDetails) {
      const newMessage = {
        messageId: Date.now(),
        id: templateDetails.conversationID,
        senderId: message[0]?.senderId,
        typeId: 1,
        messageContent: templateDetails.messageContent,
        contentType: templateDetails.contentType
          ? templateDetails.contentType
          : "", // Set content type if there's media
        mediaPath: templateDetails.mediaPath ? templateDetails.mediaPath : "", // Set media path if there's media
        buttonJson: templateDetails.buttonJson
          ? templateDetails.buttonJson
          : "",
        createdDate: new Date().toLocaleString(),
        TemplateId: templateDetails.TemplateId,
      };
      removeUnrepliedMark(templateDetails.ChatId);
      dispatch(addMessageToConversation(newMessage));
      //setChatMessages((prevMessages) => [newMessage, ...prevMessages]);
    }
  }, [templateDetails]);

  //call the fetchConversationList action to fetch agents conversationList
  useEffect(() => {
    console.log("12");
    const fetchData = async () => {
      const AgentId = localStorage.getItem("userId");
      const ClientId = localStorage.getItem("clientId");

      if (AgentId) {
        try {
          setContactsloading(true); // Show loader
          dispatch(getAgentConversations(AgentId));
          dispatch(fetchAgentStats({ clientId: ClientId, agentId: AgentId }));
          const response = await dispatch(
            fetchAgentsById({ agentId: AgentId })
          ).unwrap();
          if (response) {
            setAgentStatus(response.status);
          }
        } catch (error) {
          await loggerdetails(logger, " Error fetching agent data:", "error", {
            Obj: error,
            //logtype: "error",
            conversationId: Activechat,
            agentId: UserId,
            type: LogerType.Error,
          });
        } finally {
          setContactsloading(false); // Hide loader
        }
      }
    };

    fetchData();

    return () => {
      dispatch(clearconversationstate());
    };
  }, [dispatch]);

  // //triggered each time when conversationList changes and assign to local state
  useEffect(() => {
    console.log("13");
    if (conversationList) {
      setContactsloading(false);
      setAgentConversation(conversationList);
    } else {
      setContactsloading(false);
    }
  }, [conversationList]);

  const handleFetchMessages = (conversationId) => {
    setActiveChat(conversationId);
    const conversation = conversationList.find(
      (conv) => conv.id === conversationId
    );
    if (conversation?.messages?.length > 0) {
      const messages = [...conversation.messages].reverse();
      setChatMessages(messages);
      setActiveSenderId(conversation.messages[0].senderId);

      // Check for existing replies in this conversation
      const newRepliedMessages = new Set();
      messages.forEach((msg, index) => {
        if (msg.typeId === 2) {
          messages
            .slice(index + 1)
            .filter((m) => m.typeId === 1)
            .forEach((m) => newRepliedMessages.add(m.messageId));
        }
      });
      setRepliedMessages(newRepliedMessages);
    } else {
      setChatsloading(true);
      dispatch(getAgentMessages(conversationId))
        .then((response) => {
          const messages = [...response.payload.messages].reverse();
          setChatMessages(messages);

          // Check for replies in fetched messages
          const newRepliedMessages = new Set();
          messages.forEach((msg, index) => {
            if (msg.typeId === 2) {
              messages
                .slice(index + 1)
                .filter((m) => m.typeId === 1)
                .forEach((m) => newRepliedMessages.add(m.messageId));
            }
          });
          setRepliedMessages(newRepliedMessages);

          setChatsloading(false);
        })
        .catch(() => {
          setChatsloading(false);
        });
    }
  };
  const handleAgentdefinetemplate = () => {
    setShowDetailedTemplate(true);
  };
  const handleAgenttemplateclose = () => {
    setShowDetailedTemplate(false);
  };
  const handletemplateclose = () => {
    setShowTemplate(false);
  };

  useEffect(() => {
    console.log("14");
    agentChatRef.current = AgentConversation;
  }, [AgentConversation]);

  //Add emoji function
  const addEmoji = (emoji) => {
    setMessageInput((prevMessage) => prevMessage + emoji);
  };

  const handleImageclose = () => {
    setMediaFile(null);
    setPreviewUrl(null);
    setFileType(null);
    setIsImagePreviewOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };
  useEffect(() => {
    console.log("15");
    activeChatRef.current = Activechat;
  }, [Activechat]);

  //called each time to send message
  const HandleSendMessage = async () => {
    if (!messageInput.trim() && !mediaFile) {
      toast.error("Message cannot be empty!");
      return;
    }

    const messageId = Date.now();
    setSendingMessages((prev) => new Set([...prev, messageId]));

    const formData = new FormData();
    formData.append("ClientId", localStorage.getItem("clientId"));
    formData.append("AgentId", localStorage.getItem("userId"));
    formData.append("SenderId", message[0]?.senderId);
    formData.append("Message", messageInput.trim());
    formData.append("ConversationId", Activechat);

    if (mediaFile) {
      formData.append("File", mediaFile);
    }

    try {
      const newMessage = {
        id: Activechat,
        senderId: message[0].senderId,
        messageId: messageId,
        typeId: 1,
        messageContent: messageInput.trim(),
        sentcontentType: mediaFile ? fileType : "",
        sentmediaPath: mediaFile ? previewUrl : "",
        createdDate: new Date().toLocaleString(),
        sentime: new Date().toLocaleString(),
      };

      setChatMessages((prevMessages) => [newMessage, ...prevMessages]);
      dispatch(addMessageToConversation(newMessage));

      setPreviewUrl(null);
      setFileType(null);
      setMessageInput("");
      setMediaFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input value
      }

      await dispatch(NewAgentMessage(formData)).unwrap();
      setSendingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });

      await loggerdetails(
        logger,
        "Message sent successfully on time :",
        "info",
        {
          Obj: new Date().toLocaleString(),
          conversationId: Activechat,
          agentId: UserId,
          type: LogerType.messagesent,
        }
      );

      setMediaFile(null);
      setPreviewUrl(null);
      setFileType(null);
      removeUnrepliedMark(Activechat);
    } catch (error) {
      setSendingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
      await loggerdetails(logger, " Error while sending message:", "error", {
        Obj: error,
        logtype: "error",
        conversationId: Activechat,
        agentId: UserId,
        type: LogerType.Error,
      });

      toast.error("Failed to send message. Please try again.");
    }
  };

  useEffect(() => {
    console.log("16");
    if (AgentConversation && AgentConversation.length > 0) {
      // Filter messages with unread count > 0
      const unreadMessages = AgentConversation.filter(
        (message) => message.unreadCount > 0
      );
      //const unreadMessageIds = unreadMessages.map((message) => message.id);

      // Assign the unread message IDs to the desired functions
      unreadMessages.map((message) => {
        //startTimer(message);
        markChatAsUnreplied(message.id);
      });
    }
  }, [AgentConversation]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file); // Store the selected fil
      setPreviewUrl(URL.createObjectURL(file)); // Generate a temporary URL for preview
      setFileType(file.type.split("/")[0]);
      setIsImagePreviewOpen(true);
    }
  };

  const openFileManager = () => {
    fileInputRef.current.click(); // Trigger the file input click event
  };

  const startSignalRConnection = async (connection, userId) => {
    try {
      await connection.start();
      console.log("Connected to SignalR");
      setErrordisconnect(false);
      setheartbeatAttempts(0);
    } catch (err) {
      console.error("Error starting SignalR connection:", err);
      setErrordisconnect(true);
    }
  };

  useEffect(() => {
    console.log("17");
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("UserId not found in localStorage");
      return;
    }

    setuserId(userId);

    // Initialize SignalR connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${BASE_URL}/conversation?AgentId=${userId}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 20000, 25000])
      .build();

    // Store connection in ref to avoid unnecessary re-renders
    connectionRef.current = newConnection;

    // Message received handler
    const handleIncomingMessage = async (message) => {
      console.log("Received message:", message);
      await loggerdetails(logger, "Agent received message:", "info", {
        Obj: message,
        conversationId: message.conversationId,
        agentId: UserId,
        type: LogerType.newincomingmessage,
      });
      audioRef.current
        ?.play()
        .catch((err) =>
          console.error("Failed to play notification sound:", err)
        );

      // If this is a user message (typeId === 2), mark previous agent messages as replied
      if (message.typeId === 2) {
        setRepliedMessages((prev) => {
          const newSet = new Set(prev);
          // Find all agent messages sent before this reply
          chatMessages
            .filter(
              (m) =>
                m.typeId === 1 &&
                new Date(m.createdDate) < new Date(message.createdDate)
            )
            .forEach((m) => newSet.add(m.messageId));
          return newSet;
        });
      }

      dispatch(addMessageToConversation(message));
    };

    // Handles conversation assignment
    const handleConversationAssigned = async (notification) => {
      console.log("Received notification:", notification);
      await loggerdetails(
        logger,
        "New Conversation assigned to agent:",
        "info",
        {
          Obj: notification,
          conversationId: notification.id,
          agentId: userId,
          type: LogerType.ConversationAssigned,
        }
      );
      audioRef.current
        ?.play()
        .catch((err) =>
          console.error("Failed to play notification sound:", err)
        );

      dispatch(
        fetchAgentStats({
          clientId: localStorage.getItem("clientId"),
          agentId: userId,
        })
      );
      dispatch(addConversation(notification));
    };

    // Handles conversation unassignment
    const handleConversationUnAssigned = async (chatId) => {
      await loggerdetails(
        logger,
        "Conversation unassigned for chat Id:",
        "info",
        {
          conversationId: chatId,
          agentId: userId,
          type: LogerType.Conversationunassigned,
        }
      );
      if (
        !agentChatRef.current.some((conversation) => conversation.id === chatId)
      )
        return;

      dispatch(
        fetchAgentStats({
          clientId: localStorage.getItem("clientId"),
          agentId: userId,
        })
      );
      dispatch(removeConversation(chatId));

      // const updatedConversations = agentChatRef.current.filter(
      //   (conversation) => conversation.id !== chatId
      // );
      const isActiveChat = chatId === activeChatRef.current;

      if (isActiveChat) {
        setChatMessages([]);
        setActiveChat(0);
      }
    };

    const handleHeartbeatAcknowledged = (info) => {
      console.log(info);
    };

    const handleConnected = (info) => {
      console.log(info);
    };

    const handleDisconnect = (info) => {
      console.log(info);
    };

    const Handlestatusupdate = (status) => {
      console.log(status);
    };
    // Setup event listeners
    newConnection.on("MessageReceived", handleIncomingMessage);
    newConnection.on("ConversationAssigned", handleConversationAssigned);
    newConnection.on("ConversationUnAssigned", handleConversationUnAssigned);
    newConnection.on("HeartbeatAcknowledged", handleHeartbeatAcknowledged);
    newConnection.on("Connected", handleConnected);
    newConnection.on("DisConnected", handleDisconnect);
    newConnection.on("StatusUpdate", Handlestatusupdate);
    newConnection.onreconnecting((error) => {
      loggerdetails(logger, "Reconnecting signalR:", {
        Obj: error,
        type: LogerType.Error,
      });
      setErrordisconnect(true);
    });

    newConnection.onreconnected(() => {
      loggerdetails(logger, " signalR reconnected succesfully");
      dispatch(getAgentConversations({ AgentId: userId }));
      setErrordisconnect(false);
      setheartbeatAttempts(0);
    });

    newConnection.onclose((error) => {
      loggerdetails(logger, "SingalR connection closed:");
      setErrordisconnect(true);
    });
    // Start connection
    startSignalRConnection(newConnection, userId);

    const heartbeatInterval = setInterval(() => {
      if (newConnection.state === signalR.HubConnectionState.Connected) {
        newConnection
          .invoke("Heartbeat")
          .then(() => {
            setheartbeatAttempts(0);
          })
          .catch((err) => {
            setheartbeatAttempts((prev) => prev + 1);
          });
      }
    }, HEARTBEAT_CHECK_INTERVAL);

    return () => {
      newConnection
        .stop()
        .catch((err) => console.error("Error stopping connection:", err));
      clearInterval(heartbeatInterval);
      setErrordisconnect(true);
    };
  }, []);

  useEffect(() => {
    console.log("18");
    if (Errordisconnect && connectionRef.current) {
      loggerdetails(logger, "Reconnecting SignalR...", {
        type: LogerType.Error,
      });
      startSignalRConnection(connectionRef.current, UserId);
    }
  }, [Errordisconnect]);

  useEffect(() => {
    console.log("19");
    if (heartbeatAttempts >= 2) {
      setErrordisconnect(true);
    }
  }, [heartbeatAttempts]);

  const markChatAsUnreplied = async (id) => {
    setUnrepliedChats((prev) => [...prev, id]);
    //console.log("Marked chat as unreplied:", unrepliedChats);
  };

  const removeUnrepliedMark = (id) => {
    setUnrepliedChats((prev) => prev.filter((chatId) => chatId !== id));
  };

  // const handleReload = () => {
  //   // Reload the current page
  //   window.location.reload();
  // };

  const handleDownload = async (mediaPath) => {
    // Replace backslashes with forward slashes
    const sanitizedMediaPath = mediaPath.replace(/\\/g, "/");

    // Construct full media URL
    const fullMediaUrl = `${BASE_URL}${sanitizedMediaPath}`;

    // Create proxy URL with encoded full URL
    const proxyUrl = `/api/download?url=${encodeURIComponent(fullMediaUrl)}`;

    // Extract filename
    const fileName = fullMediaUrl.split("/").pop();

    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Error downloading:", err);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to check if a message has a reply
  const hasReply = (messageId) => {
    return chatMessages.some(
      (msg) =>
        msg.typeId === 2 && // Message from user
        msg.createdDate >
          chatMessages.find((m) => m.messageId === messageId)?.createdDate // Created after the sent message
    );
  };

  // Add scroll handler function
  const handleScroll = (e) => {
    const element = e.target;
    const isScrolledUp = element.scrollTop < -100; // Negative because of reverse column
    setShowScrollButton(isScrolledUp);
  };

  // Add scroll to bottom function
  const scrollToBottom = () => {
    const chatContainer = scrollContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTo({
        top: -chatContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Add function to toggle status dropdown
  const toggleStatusDropdown = () => {
    setShowStatusDropdown(!showStatusDropdown);
  };

  const handleSelection = (templateId) => {
    setSelectedOption(templateId);
    // Don't modify chatMessages here
    setParameterValues([]);
    setParameters([]);
    setTemplateView("");

    if (templateId) {
      const cachedDetail = agenttemplatedetails.find(
        (detail) =>
          detail.templateId === templateId && detail.senderId === ActiveSenderId
      );
      if (!cachedDetail) {
        dispatch(
          getAgentTemplateDetail({ templateId, senderId: ActiveSenderId })
        );
      }
    }
  };
  const handleResendClick = (index) => {
    const message = chatMessages[index];
    debugger;
    if (!message) {
      console.warn(`No message found at index ${index}`);
      return;
    }

    console.log("message.messageId", message.messageId);

    // Dispatch action to get agent template details
    if (message.TemplateId || message.messageReferenceId) {
      dispatch(
        getAgentTemplateDetail({
          templateId: message.TemplateId
            ? message.TemplateId
            : message.messageReferenceId,
          senderId: ActiveSenderId,
        })
      ).then((response) => {
        if (response) {
          const templatedetails = Array.isArray(
            response.payload?.templatedetail
          )
            ? response.payload.templatedetail
            : [response.payload.templatedetail];
          debugger;
          const cachedDetail = templatedetails.find((detail) =>
            detail.id === message.TemplateId
              ? message.TemplateId
              : message.messageReferenceId && detail.senderId === ActiveSenderId
          );
          if (cachedDetail) {
            setSelectedOption(
              message.TemplateId
                ? message.TemplateId
                : message.messageReferenceId
            );
            setShowTemplate(true);
          } else {
            setMessageInput(message.messageContent);
          }
        }
      });
    } else {
      setMessageInput(message.messageContent);
    }
  };

  // Update preview when agenttemplatedetails, selectedOption, or parameterValues change
  useEffect(() => {
    console.log("20");
    if (selectedOption) {
      const selectedDetail = agenttemplatedetails.find(
        (detail) =>
          detail.templateId === selectedOption &&
          detail.senderId === ActiveSenderId
      );
      if (selectedDetail) {
        setParameters(selectedDetail.parameters || []);
        let updatedView = selectedDetail.bodyText || "";
        parameterValues.forEach((param) => {
          updatedView = updatedView.replace(
            new RegExp(`{{${param.key}}}`, "g"),
            param.value
          );
        });
        setTemplateView(updatedView);

        // Create preview message
        const previewMessage = {
          messageId: `preview-${selectedOption}`,
          typeId: 1,
          contentType: selectedDetail.contentType || "",
          mediaPath: selectedDetail.mediaPath || "",
          conversationID: Activechat,
          createdDate: new Date().toISOString(),
          messageContent: updatedView,
          headerText: selectedDetail.headerText || "",
          buttonJson: selectedDetail.buttonsJson || [],
          isPreview: true, // Add this flag to identify preview messages
        };

        // Update chatMessages as an array
        setChatMessages((prevMessages) => {
          // Filter out any previous preview messages
          const filteredMessages =
            prevMessages?.filter((msg) => !msg.isPreview) || [];
          // Add the new preview message at the beginning
          return [previewMessage, ...filteredMessages];
        });
      }
    }
  }, [
    agenttemplatedetails,
    selectedOption,
    ActiveSenderId,
    parameterValues,
    Activechat,
  ]);

  // Add this effect to restore original messages when template preview is closed
  useEffect(() => {
    console.log("21");
    if (!ShowDetailedTemplate) {
      // When template preview is closed, remove preview messages
      setChatMessages(
        (prevMessages) => prevMessages?.filter((msg) => !msg.isPreview) || []
      );
    }
  }, [ShowDetailedTemplate]);

  const handleParameterChange = (paramName, value) => {
    setParameterValues((prevValues) => {
      const updatedValues = prevValues.filter((item) => item.key !== paramName);
      return [...updatedValues, { key: paramName, value }];
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const values = parameterValues.map((val) => ({
      key: val.key,
      value: val.value,
    }));

    const formData = new FormData();
    formData.append("ClientId", localStorage.getItem("clientId"));
    formData.append("SenderId", ActiveSenderId);
    formData.append("ConversationId", Activechat);
    formData.append("InteractiveTemplateId", selectedOption);
    formData.append("ActionBy", localStorage.getItem("userId"));
    values.forEach((item, index) => {
      formData.append(`Values[${index}].Key`, item.key);
      formData.append(`Values[${index}].Value`, item.value);
    });

    try {
      const response = await dispatch(SendInteractivetemp(formData)).unwrap();

      if (response.success) {
        dispatch(clearAgentTemplateSentState());
        const selectedDetail = agenttemplatedetails.find(
          (detail) =>
            detail.templateId === selectedOption &&
            detail.senderId === ActiveSenderId
        );
        if (selectedDetail) {
          const messageDetails = {
            messageId: Date.now(),
            conversationID: Activechat,
            messageContent: templateView,
            contentType: selectedDetail.contentType || "",
            mediaPath: selectedDetail.mediaPath || "",
            buttonJson: selectedDetail.buttonsJson || "",
            createdDate: new Date().toLocaleString(),
            TemplateId: selectedOption,
          };
          handleTemplateSend(messageDetails);
        }
        handletemplateclose();
      } else {
        toast.error(response.message || "Failed to send template");
      }
    } catch (err) {
      toast.error("Failed to send template");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header wrapper with padding to prevent content overlap */}
      <div className="w-full" style={{ height: "4rem" }}>
        <nav
          className="text-gray-700 fixed top-0 left-0 right-0 z-40 w-full h-16 border-b"
          style={{
            background: "#F8F9FA",
            borderColor: "rgba(229, 231, 235, 0.5)",
          }}
        >
          <div className="flex justify-between items-center h-full px-2 md:px-4 lg:px-6">
            {/* Logo Section on the Left Side */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                <div className="absolute inset-0 blur-md bg-gray-100 rounded-full"></div>
                <Logo
                  alt="Logo"
                  imageClassName="relative drop-shadow-xl transform hover:scale-105 transition-transform duration-300 w-6 h-6 md:w-8 md:h-[4rem]"
                  imageStyle={{
                    filter:
                      "brightness(1.05) drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                  }}
                />
              </div>
              <span className="hidden md:block text-base lg:text-lg font-semibold text-gray-700 drop-shadow-xl tracking-wide">
                BCT-Chat Portal
              </span>
            </div>

            {/* User Profile Section - Remove status dropdown from here */}
            <div className="flex items-center space-x-2">
              <div className="relative menuitem menuitemButton">
                <div className="flex ButtonUserName items-center gap-2 menuitem">
                  <button className="flex items-center space-x-2 px-2 py-1 md:px-3 md:py-1.5 rounded-xl bg-[#F8F9FA] hover:bg-gray-100 transition-all duration-200 border border-gray-200">
                    <div className="relative w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden">
                      <div className="absolute inset-0 blur-md bg-gray-50"></div>
                      <Image
                        src={UserBadge.src}
                        alt="User"
                        className="relative w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-gray-700 text-xs md:text-sm whitespace-nowrap">
                      {userName}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Stats Sidebar */}
      <div
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] transform transition-width duration-300 ease-in-out flex flex-col justify-between w-20 hover:w-56 group bg-[#F8F9FA] border-r"
        style={{
          zIndex: 30,
          borderColor: "rgba(229, 231, 235, 0.5)",
        }}
      >
        {/* Stats Container */}
        <div className="h-full overflow-y-auto">
          <div className="p-3 space-y-3">
            {/* Agent Status Stats Item */}

            <AgentStatusDropdown
              name="agentStatusId"
              onChange={HandleAgentStatus}
              value={AgentStatus}
            />

            {/* Assigned */}
            <div className="flex items-center md:flex-col group-hover:flex-row space-x-3 p-2 rounded-xl hover:bg-white transition-colors duration-200">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                  <FaComments className="text-blue-600 text-xl" />
                </div>
                <div className="absolute -top-1 -right-1 bg-blue-100 rounded-full px-2 py-0.5 text-xs font-medium text-blue-600">
                  {agentStatsList?.assignedChat ?? "0"}
                </div>
              </div>
              <div className="hidden group-hover:block">
                <p className="text-xs text-gray-500">Assigned</p>
              </div>
            </div>

            {/* Active */}
            <div className="flex items-center md:flex-col group-hover:flex-row space-x-3 p-2 rounded-xl hover:bg-white transition-colors duration-200">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>
                <div className="absolute -top-1 -right-1 bg-green-100 rounded-full px-2 py-0.5 text-xs font-medium text-green-600">
                  {agentStatsList?.activeChat ?? "0"}
                </div>
              </div>
              <div className="hidden group-hover:block">
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>

            {/* Abandoned */}
            <div className="flex items-center md:flex-col group-hover:flex-row space-x-3 p-2 rounded-xl hover:bg-white transition-colors duration-200">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50">
                  <FaBan className="text-red-600 text-xl" />
                </div>
                <div className="absolute -top-1 -right-1 bg-red-100 rounded-full px-2 py-0.5 text-xs font-medium text-red-600">
                  {agentStatsList?.abandonChat ?? "0"}
                </div>
              </div>
              <div className="hidden group-hover:block">
                <p className="text-xs text-gray-500">Abandoned</p>
              </div>
            </div>

            {/* Closed */}
            <div className="flex items-center md:flex-col group-hover:flex-row space-x-3 p-2 rounded-xl hover:bg-white transition-colors duration-200">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50">
                  <FaTimesCircle className="text-gray-600 text-xl" />
                </div>
                <div className="absolute -top-1 -right-1 bg-gray-100 rounded-full px-2 py-0.5 text-xs font-medium text-gray-600">
                  {agentStatsList?.closedChat ?? "0"}
                </div>
              </div>
              <div className="hidden group-hover:block">
                <p className="text-xs text-gray-500">Closed</p>
              </div>
            </div>

            {/* Expired */}
            <div className="flex items-center md:flex-col group-hover:flex-row space-x-3 p-2 rounded-xl hover:bg-white transition-colors duration-200">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-50">
                  <AiOutlineHourglass className="text-yellow-600 text-xl" />
                </div>
                <div className="absolute -top-1 -right-1 bg-yellow-100 rounded-full px-2 py-0.5 text-xs font-medium text-yellow-600">
                  {agentStatsList?.expiredChat ?? "0"}
                </div>
              </div>
              <div className="hidden group-hover:block">
                <p className="text-xs text-gray-500">Expired</p>
              </div>
            </div>

            {/* Force Closed */}
            <div className="flex items-center md:flex-col group-hover:flex-row space-x-3 p-2 rounded-xl hover:bg-white transition-colors duration-200">
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50">
                  <FaClock className="text-purple-600 text-xl" />
                </div>
                <div className="absolute -top-1 -right-1 bg-purple-100 rounded-full px-2 py-0.5 text-xs font-medium text-purple-600">
                  {agentStatsList?.forceClosedChat ?? "0"}
                </div>
              </div>
              <div className="hidden group-hover:block">
                <p className="text-xs text-gray-500">Force Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center group-hover:justify-between p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <div className="flex items-center space-x-2">
              <HiLogout className="text-xl" />
              <span className="hidden group-hover:block text-sm">Logout</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <Container fluid className="MainContainer pt-16">
        <Row className="g-0 h-100">
          {/* Chat List Column */}
          <Col
            xxl="4"
            xl="3"
            lg="3"
            md="3"
            sm="3"
            className="chat-list-container"
            style={{
              height: "calc(100vh - 64px)",
              width: "280px",
              position: "fixed",
              left: "5rem",
              transition: "left 0.3s ease-in-out",
              background: "#F8F9FA",
              borderRight: "1px solid rgba(229, 231, 235, 0.5)",
              zIndex: 20,
            }}
          >
            {/* Chat List Section */}
            <Card
              className="left-sidebar-wrapper h-100"
              style={{
                maxWidth: "280px",
                boxShadow: "none",
                background: "#F8F9FA",
                padding: "0px",
              }}
            >
              {/* Search Bar */}
              <div className="p-1.5 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="w-full pl-7 pr-2 py-1 text-xs rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none transition-all duration-200 bg-white"
                  />
                  <HiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
                </div>
              </div>

              {/* Chat Tabs */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors duration-200 relative ${
                    activeTab === "all"
                      ? "text-gray-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <BsChatDots size={12} />
                    <span>All</span>
                  </div>
                  {activeTab === "all" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors duration-200 relative ${
                    activeTab === "unread"
                      ? "text-gray-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <BsChatDotsFill size={12} />
                    <span>Unread</span>
                  </div>
                  {activeTab === "unread" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("replied")}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors duration-200 relative ${
                    activeTab === "replied"
                      ? "text-gray-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <BsCheckAll size={12} />
                    <span>Replied</span>
                  </div>
                  {activeTab === "replied" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700"></div>
                  )}
                </button>
              </div>

              {/* Chat Messages */}
              <TabContent id="chat-options-tabContent">
                <TabPane id="chats">
                  <ul
                    className="list-unstyled chats-user overflow-auto"
                    style={{
                      height: "calc(100vh - 160px)",
                      margin: "0",
                      backgroundColor: "#F8F9FA",
                    }}
                  >
                    {filteredConversations?.length === 0 && !loading && (
                      <div className="text-center py-6 text-gray-500 text-sm">
                        {customerSearchQuery
                          ? "No matching conversations found"
                          : activeTab === "unread"
                          ? "No unread messages"
                          : activeTab === "replied"
                          ? "No replied messages"
                          : "No conversations found"}
                      </div>
                    )}
                    {filteredConversations?.map((conversation) => (
                      <li
                        key={conversation.id}
                        className={`flex items-center py-1.5 px-2 chat-item hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                          Activechat === conversation.id ? "bg-blue-50" : ""
                        }`}
                        style={
                          Activechat !== conversation.id &&
                          unrepliedChats.includes(conversation.id)
                            ? {
                                animation: "blink 1s infinite",
                                backgroundColor: "#ffcccc",
                              }
                            : {}
                        }
                        onClick={() => handleFetchMessages(conversation.id)}
                      >
                        <div className="flex items-center space-x-2 w-full min-w-0">
                          <div className="relative flex-shrink-0">
                            <Image
                              src={`${BASE_URL}${conversation.logo}`}
                              alt="User Logo"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            {conversation.unreadCount > 0 && (
                              <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-[10px]">
                                  {conversation.unreadCount}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="text-xs font-medium text-gray-900 truncate">
                                {conversation.phoneNumber}
                              </p>
                              <span className="text-[10px] text-gray-500 flex-shrink-0 ml-1">
                                {extractTime(conversation.updatedDate)}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-500 truncate mt-0.5">
                              {conversation.lastMessageText || "Media"}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </TabPane>
              </TabContent>
            </Card>
          </Col>

          {/* Message Section */}
          <Col
            className="message-container"
            style={{
              height: "calc(100vh - 64px)",
              marginLeft: "calc(5rem + 280px)",
              marginRight: "280px",
              width: "calc(100% - (5rem + 560px))",
              transition: "all 0.3s ease-in-out",
              backgroundColor: "#F8F9FA",
              position: "relative",
            }}
          >
            {Activechat !== 0 && (
              <Card
                className="right-sidebar-chat h-100 flex flex-col"
                style={{
                  backgroundColor: "#F8F9FA",
                  boxShadow: "none",
                  Width: "1200px",
                  margin: "0px",
                  width: "100%",
                  padding: "0px",
                }}
              >
                {/* Chat Header */}
                <div className="flex items-center justify-between text-black px-3 py-2 ChatHeader border-b border-gray-100">
                  {AgentConversation.filter(
                    (conversation) => conversation.id === Activechat
                  ).map((conversation) => (
                    <div
                      key={conversation.id}
                      className="flex items-center justify-between w-full"
                    >
                      {/* Left Section */}
                      <div className="flex items-center space-x-3">
                        <Image
                          src={`${BASE_URL}${conversation.logo}`}
                          alt="User Logo"
                          className="rounded-circle"
                          style={{
                            width: "36px",
                            height: "36px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium">
                            {conversation.fullName}
                          </span>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm">
                              {conversation.phoneNumber}
                            </span>
                            <button
                              onClick={() =>
                                handleCopy(conversation.phoneNumber)
                              }
                              className="p-1 rounded hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                              aria-label="Copy Phone Number"
                            >
                              <FaCopy size={14} className="text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Messages Container */}
                <div className="flex-1 overflow-hidden flex flex-col h-[calc(100vh-180px)]">
                  {/* Messages Section */}
                  <div className="flex-1 overflow-y-auto pb-16">
                    <div
                      ref={scrollContainerRef}
                      onScroll={handleScroll}
                      className={`msger-chat space-y-3 px-3 py-2 ${
                        previewUrl ? "hide-messages" : ""
                      }`}
                    >
                      {chatMessages?.map((message, index) => (
                        <div
                          key={message.messageId}
                          className={`mt-2 flex ${
                            message.typeId === 1
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {message.typeId === 1 && (
                            <div className="relative flex items-center gap-2  mr-3 ">
                              <FiRotateCw
                                onClick={() => handleResendClick(index)}
                                className="text-grey-500 cursor-pointer"
                                size={20}
                              />
                            </div>
                          )}
                          <div
                            className={`max-w-2xl p-2 rounded-lg shadow-sm 
                              md:max-w-xl md:p-1.5 md:rounded-md md:shadow-xs 
                              sm:max-w-md sm:p-1 sm:rounded-sm sm:shadow-none 
                              xs:max-w-full xs:p-0.5 xs:rounded-none xs:shadow-none ${
                                message.typeId === 1
                                  ? "bg-[#ddffd9] text-black rounded-br-none"
                                  : "bg-[#ffffff] text-black rounded-bl-none"
                              }`}
                          >
                            <div>
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
                              {message.contentType &&
                                message.contentType !== "" && (
                                  <>
                                    {message.contentType.startsWith(
                                      "image/"
                                    ) && (
                                      <>
                                        <img
                                          src={`${BASE_URL}${message.mediaPath}`}
                                          alt="Image"
                                          className=" max-h-50 w-80 rounded"
                                        />
                                        <button
                                          onClick={() =>
                                            handleDownload(message.mediaPath)
                                          } // Pass function reference here
                                        >
                                          <i
                                            className="fa fa-download"
                                            area-hidden="true"
                                          ></i>
                                        </button>
                                      </>
                                    )}

                                    {message.contentType.startsWith(
                                      "video/"
                                    ) && (
                                      <video
                                        controls
                                        src={`${BASE_URL}${message.mediaPath}`}
                                        className=" max-h-50 w-80 rounded"
                                      />
                                    )}
                                    {message.contentType.startsWith(
                                      "audio/"
                                    ) && (
                                      <audio controls>
                                        <source
                                          src={`${BASE_URL}${message.mediaPath}`}
                                        />
                                        Your browser does not support the audio
                                        element.
                                      </audio>
                                    )}
                                    {message.contentType.startsWith(
                                      "application"
                                    ) && (
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
                                            File
                                          </p>
                                          <button
                                            onClick={() =>
                                              handleDownload(message.mediaPath)
                                            } // Pass function reference here
                                          >
                                            <i
                                              className="fa fa-download"
                                              area-hidde="true"
                                            ></i>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              {/* //for sent content */}
                              {message.sentcontentType &&
                                message.sentcontentType !== "" &&
                                message.sentmediaPath && (
                                  <>
                                    {message.sentcontentType.startsWith(
                                      "image"
                                    ) && (
                                      <img
                                        src={`${message.sentmediaPath}`}
                                        alt="Image"
                                        className=" max-h-50 w-80 rounded"
                                      />
                                    )}
                                    {message.sentcontentType.startsWith(
                                      "video"
                                    ) && (
                                      <video
                                        controls
                                        src={`${message.sentmediaPath}`}
                                        className=" max-h-50 w-80 rounded"
                                      />
                                    )}
                                    {message.sentcontentType.startsWith(
                                      "audio"
                                    ) && (
                                      <audio controls>
                                        <source
                                          src={`${message.sentmediaPath}`}
                                        />
                                        Your browser does not support the audio
                                        element.
                                      </audio>
                                    )}
                                    {message.sentcontentType.startsWith(
                                      "application"
                                    ) && (
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
                                            File
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              <div
                                className="flex items-end justify-between rounded-lg"
                                style={{ width: "auto" }}
                              >
                                <p
                                  className="whitespace-pre-wrap break-words overflow-hidden messageText"
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
                                <div className="ml-2 flex items-center space-x-1">
                                  <span
                                    className="text-gray-500 text-xs"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    {extractTime(message.createdDate)}
                                  </span>
                                  {message.typeId === 1 && (
                                    <span className="message-status">
                                      {sendingMessages.has(
                                        message.messageId
                                      ) ? (
                                        <BsCheck
                                          className="text-gray-400"
                                          size={20}
                                        />
                                      ) : (
                                        <BsCheckAll
                                          className={
                                            repliedMessages.has(
                                              message.messageId
                                            )
                                              ? "text-blue-500"
                                              : "text-gray-400"
                                          }
                                          size={20}
                                        />
                                      )}
                                    </span>
                                  )}
                                </div>
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
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {previewUrl && (
                      <div className="absolute inset-0  flex items-center justify-center z-900">
                        <div className="bg-transparent p-6 rounded w-2/5 ">
                          <div
                            style={{
                              position: "relative",
                              padding: "20px",
                              borderRadius: "12px",
                              maxWidth: "500px",
                              width: "100%", // Full width within the max-width limit
                              margin: "20px auto", // Center the container
                            }}
                          >
                            {/* Close Button */}
                            <button
                              onClick={() => handleImageclose()}
                              style={{
                                position: "absolute",
                                top: "15px",
                                right: "15px",
                                backgroundColor: "rgba(255, 0, 0, 0.8)",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                                fontSize: "18px",
                                lineHeight: "1",
                                transition: "background-color 0.3s ease",
                              }}
                              onMouseOver={(e) =>
                                (e.target.style.backgroundColor =
                                  "rgba(255, 0, 0, 1)")
                              }
                              onMouseOut={(e) =>
                                (e.target.style.backgroundColor =
                                  "rgba(255, 0, 0, 0.8)")
                              }
                            >
                              &times;
                            </button>

                            {fileType === "image" && (
                              <div
                                style={{
                                  width: "400px", // Fixed width
                                  height: "300px", // Fixed height
                                  borderRadius: "8px",
                                  overflow: "hidden", // Hide overflow
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#f0f0f0", // Background for smaller images
                                }}
                              >
                                <img
                                  src={previewUrl}
                                  alt="Preview"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain", // Ensures the image fits within the container
                                  }}
                                />
                              </div>
                            )}

                            {/* Video Preview */}
                            {fileType === "video" && (
                              <div
                                style={{
                                  width: "400px", // Fixed width
                                  height: "300px", // Fixed height
                                  borderRadius: "8px",
                                  overflow: "hidden", // Hide overflow
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "#f0f0f0", // Background for smaller videos
                                }}
                              >
                                <video
                                  controls
                                  src={previewUrl}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain", // Ensures the video fits within the container
                                  }}
                                />
                              </div>
                            )}

                            {/* Audio Preview */}
                            {fileType === "audio" && (
                              <div
                                style={{
                                  width: "100%",
                                  marginTop: "10px",
                                  borderRadius: "8px",
                                  backgroundColor: "#f0f0f0",
                                  padding: "15px",
                                }}
                              >
                                <audio
                                  controls
                                  src={previewUrl}
                                  style={{
                                    width: "100%",
                                  }}
                                />
                              </div>
                            )}

                            {/* Application/File Preview */}
                            {fileType === "application" && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginTop: "10px",
                                  padding: "15px",
                                  borderRadius: "8px",
                                  backgroundColor: "#f0f0f0",
                                }}
                              >
                                <div
                                  style={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "50%",
                                    width: "50px",
                                    height: "50px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "15px",
                                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
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
                                      fontWeight: "600",
                                      color: "#333",
                                      fontSize: "16px",
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
                                      fontSize: "14px",
                                      fontWeight: "500",
                                      transition: "color 0.3s ease",
                                    }}
                                    onMouseOver={(e) =>
                                      (e.target.style.color = "#0056b3")
                                    }
                                    onMouseOut={(e) =>
                                      (e.target.style.color = "#007BFF")
                                    }
                                  >
                                    Download
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Back to Bottom Button */}
                    {showScrollButton && (
                      <button
                        onClick={scrollToBottom}
                        className="fixed bottom-20 right-6 bg-gray-700 hover:bg-gray-800 text-white rounded-full p-3 shadow-lg transition-all duration-200 transform hover:scale-105 z-50 flex items-center space-x-2"
                      >
                        <i className="fa fa-arrow-down text-sm"></i>
                        <span className="text-sm">Back to Bottom</span>
                      </button>
                    )}
                  </div>

                  {/* Fixed Message Input Section at Bottom */}
                  <div className="msger-inputs flex items-center px-3 py-2 bg-white border-t border-gray-100 sticky bottom-0 left-0 right-0">
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Attachment Button */}
                    <Button
                      onClick={openFileManager}
                      className="ClipButton mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <i className="fa fa-paperclip text-gray-600"></i>
                    </Button>

                    {/* Emoji Button and Picker */}
                    <div className="relative">
                      <button
                        className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                      >
                        <i className="fa fa-smile-o text-gray-600"></i>
                      </button>

                      {/* Emoji Picker Dropdown */}
                      {showEmojiPicker && (
                        <div
                          className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-2"
                          style={{
                            width: "350px",
                            zIndex: 1000,
                          }}
                        >
                          <div className="flex justify-between items-center mb-2 border-b pb-2">
                            <span className="text-gray-700 text-sm font-medium">
                              Select Emoji
                            </span>
                            <button
                              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                              onClick={() => setShowEmojiPicker(false)}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </div>
                          <EmojiPicker
                            onEmojiClick={(emojiData) => {
                              addEmoji(emojiData.emoji);
                              setShowEmojiPicker(false);
                            }}
                            width="100%"
                            height="350px"
                          />
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <Input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.shiftKey || e.altKey) && e.key === "Enter") {
                          e.preventDefault();
                          setMessageInput((prevMessage) => prevMessage + "\n");
                        } else if (e.key === "Enter") {
                          e.preventDefault();
                          HandleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      style={{ zIndex: 1000 }}
                      className="flex-1 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 px-3 py-2 text-sm bg-white"
                    />

                    {/* Template Button */}
                    <div className="relative">
                      <button
                        onClick={handleAgentdefinetemplate}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 mx-2"
                      >
                        <i className="fa fa-comment text-gray-600"></i>
                      </button>

                      {ShowDetailedTemplate && (
                        <div className="absolute bottom-full right-0 mb-2">
                          <DefinedTemplates
                            isVisible={true}
                            onClose={handleAgenttemplateclose}
                            SenderId={ActiveSenderId}
                            ChatId={Activechat}
                            onSend={handleTemplateSend}
                          />
                        </div>
                      )}
                    </div>

                    {/* Send Button */}
                    <button
                      type="submit"
                      onClick={HandleSendMessage}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <i className="fa fa-paper-plane text-gray-600"></i>
                    </button>
                  </div>
                </div>
              </Card>
            )}
            {/* Right Templates Section */}
            <div
              className="fixed right-0 top-16 h-[calc(100vh-4rem)] bg-[#F8F9FA] border mt-3 overflow-y-auto"
              style={{
                width: "280px",
                borderColor: "rgba(229, 231, 235, 0.5)",
                zIndex: 20,
              }}
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700">
                    Quick Templates
                  </h3>
                </div>

                {/* Search Bar */}
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Search templates..."
                    className="w-full bg-white text-gray-800 pl-8 py-2 text-sm rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <HiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                </div>

                {/* Template List */}
                {Activechat !== 0 ? (
                  <div className="space-y-1">
                    {filteredTemplates?.length > 0 ? (
                      filteredTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => {
                            setShowTemplate(true);
                            handleSelection(template.id);
                          }}
                          className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white transition-colors duration-200"
                        >
                          {template.name}
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-4 text-sm text-gray-500">
                        No templates found
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-gray-500">
                    Select a chat to view templates
                  </div>
                )}
              </div>
            </div>

            {/* Template Preview Popup */}
            {showTemplate && selectedOption && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800">
                      Template Preview
                    </h3>
                    <button
                      onClick={handletemplateclose}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>

                  <div className="p-4 flex">
                    {/* Parameters Section */}
                    <div className="w-1/2 pr-4">
                      {parameters.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Parameters
                          </h4>
                          {parameters.map((param) => (
                            <div key={param.paramId} className="space-y-1">
                              <label className="text-sm text-gray-600">
                                {param.paramName}
                              </label>
                              <input
                                type="text"
                                value={
                                  parameterValues.find(
                                    (p) => p.key === param.paramName
                                  )?.value || ""
                                }
                                onChange={(e) =>
                                  handleParameterChange(
                                    param.paramName,
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
                                placeholder="Enter value"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Preview Section */}
                    <div className="w-1/2 pl-4 border-l border-gray-100">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Message Preview
                        </h4>
                        <div className="bg-[#ddffd9] rounded-lg p-3 max-h-[400px] overflow-y-auto">
                          {selectedOption &&
                            agenttemplatedetails.find(
                              (detail) =>
                                detail.templateId === selectedOption &&
                                detail.senderId === ActiveSenderId
                            ) && (
                              <div>
                                {/* Header Text */}
                                {agenttemplatedetails.find(
                                  (d) => d.templateId === selectedOption
                                )?.headerText && (
                                  <div className="mb-2 font-medium">
                                    {
                                      agenttemplatedetails.find(
                                        (d) => d.templateId === selectedOption
                                      )?.headerText
                                    }
                                  </div>
                                )}

                                {/* Media Content */}
                                {agenttemplatedetails.find(
                                  (d) => d.templateId === selectedOption
                                )?.contentType && (
                                  <div className="mb-2">
                                    {agenttemplatedetails
                                      .find(
                                        (d) => d.templateId === selectedOption
                                      )
                                      ?.contentType.startsWith("image/") && (
                                      <img
                                        src={`${BASE_URL}${
                                          agenttemplatedetails.find(
                                            (d) =>
                                              d.templateId === selectedOption
                                          )?.mediaPath
                                        }`}
                                        alt="Template Media"
                                        className="max-w-full rounded-lg"
                                      />
                                    )}
                                  </div>
                                )}

                                {/* Message Content */}
                                <div className="whitespace-pre-wrap">
                                  {templateView}
                                </div>

                                {/* Buttons */}
                                {agenttemplatedetails.find(
                                  (d) => d.templateId === selectedOption
                                )?.buttonsJson && (
                                  <div className="mt-3 space-y-2">
                                    {(typeof agenttemplatedetails.find(
                                      (d) => d.templateId === selectedOption
                                    )?.buttonsJson === "string"
                                      ? JSON.parse(
                                          agenttemplatedetails.find(
                                            (d) =>
                                              d.templateId === selectedOption
                                          )?.buttonsJson
                                        )
                                      : agenttemplatedetails.find(
                                          (d) => d.templateId === selectedOption
                                        )?.buttonsJson
                                    )?.map((button, index) => (
                                      <button
                                        key={index}
                                        className="w-full px-3 py-2 text-sm bg-white text-blue-600 rounded-lg border border-gray-200 hover:bg-gray-50"
                                      >
                                        {button.ButtonType === 1 && (
                                          <i className="fa fa-share fa-flip-horizontal mr-2" />
                                        )}
                                        {button.ButtonType === 2 && (
                                          <i className="fa fa-phone mr-2" />
                                        )}
                                        {button.ButtonType === 3 && (
                                          <i className="fa fa-external-link mr-2" />
                                        )}
                                        {button.ButtonText || "Button"}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Send Button Section */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={submitting ? undefined : handleSend}
                      disabled={
                        parameters.length > 0 &&
                        parameterValues.length < parameters.length
                      }
                      className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                        parameters.length > 0 &&
                        parameterValues.length < parameters.length
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      <i className="fa fa-paper-plane" />
                      <span>{submitting ? "Sending..." : "Send"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {Activechat === 0 && (
              <div className="font-bold text-center mt-[30%] text-gray-400 text-2xl">
                Select a chat from left panel
              </div>
            )}
          </Col>

          <style jsx global>{`
            /* Add styles for templates sidebar */
            .templates-sidebar {
              height: calc(100vh - 8rem);
              overflow-y: auto;
            }

            .templates-sidebar::-webkit-scrollbar {
              width: 6px;
            }

            .templates-sidebar::-webkit-scrollbar-track {
              background: transparent;
            }

            .templates-sidebar::-webkit-scrollbar-thumb {
              background-color: rgba(0, 0, 0, 0.1);
              border-radius: 3px;
            }

            .templates-sidebar::-webkit-scrollbar-thumb:hover {
              background-color: rgba(0, 0, 0, 0.2);
            }
          `}</style>
        </Row>
      </Container>
    </>
  );
};

export default ChatPage;

<style jsx global>{`
  /* Updated global styles */
  :root {
    --primary-color: #1a237e;
    --primary-light: #534bae;
    --primary-dark: #000051;
    --text-on-primary: #ffffff;
    --background-light: #f8f9fa;
    --border-color: rgba(229, 231, 235, 0.5);
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Updated transitions */
  .menuitem,
  button {
    transition: all 0.2s ease-in-out;
  }

  /* Updated shadows */
  .shadow-lg {
    box-shadow: 0 2px 10px rgba(26, 35, 126, 0.15);
  }

  /* Updated hover effects */
  .stats-item:hover {
    transform: translateY(-1px);
    background-color: rgba(26, 35, 126, 0.05);
  }

  /* Updated chat list styles */
  .chat-item {
    border-bottom: 1px solid var(--border-color);
    transition: all 0.2s ease-in-out;
  }

  .chat-item:hover {
    background-color: rgba(26, 35, 126, 0.05);
  }

  .chat-item.active {
    background-color: rgba(26, 35, 126, 0.1);
  }

  /* Updated message styles */
  .message-sent {
    background-color: #e3f2fd;
    border-radius: 12px 12px 2px 12px;
  }

  .message-received {
    background-color: #ffffff;
    border-radius: 12px 12px 12px 2px;
  }

  /* Updated input styles */
  .msger-input {
    border: 1px solid var(--border-color);
    border-radius: 8px;
    transition: all 0.2s ease-in-out;
  }

  .msger-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1);
  }

  /* Updated button styles */
  .action-button {
    color: var(--primary-color);
    background-color: transparent;
    transition: all 0.2s ease-in-out;
  }

  .action-button:hover {
    background-color: rgba(26, 35, 126, 0.05);
  }

  /* Updated modal styles */
  .modal-content {
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 20px rgba(26, 35, 126, 0.15);
  }

  /* Updated emoji picker styles */
  .emoji-picker-react {
    box-shadow: 0 4px 20px rgba(26, 35, 126, 0.15) !important;
    border-radius: 12px !important;
    border: 1px solid var(--border-color) !important;
  }

  /* Updated scrollbar styles */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--background-light);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(26, 35, 126, 0.2);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(26, 35, 126, 0.3);
  }

  /* Add these styles to your existing global styles */
  .sidebar-icon {
    position: relative;
    transition: all 0.2s ease-in-out;
  }

  .sidebar-icon:hover {
    transform: scale(1.05);
  }

  .stat-number {
    font-variant-numeric: tabular-nums;
  }

  /* Updated status dropdown styles */
  .status-dropdown-container {
    position: relative;
  }

  .status-dropdown-menu {
    transform-origin: top;
    transition: all 0.2s ease-in-out;
  }

  .status-dropdown-menu.enter {
    opacity: 0;
    transform: scale(0.95);
  }

  .status-dropdown-menu.enter-active {
    opacity: 1;
    transform: scale(1);
  }

  .status-dropdown-menu.exit {
    opacity: 1;
    transform: scale(1);
  }

  .status-dropdown-menu.exit-active {
    opacity: 0;
    transform: scale(0.95);
  }

  /* Status indicator dot */
  .status-indicator {
    transition: all 0.2s ease-in-out;
  }

  /* Status dropdown animation */
  .status-dropdown-menu {
    animation: slideIn 0.2s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Hover effect for status item */
  .status-item:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  /* Status submenu animations */
  .status-submenu-enter {
    max-height: 0;
    opacity: 0;
  }

  .status-submenu-enter-active {
    max-height: 200px;
    opacity: 1;
    transition: all 0.2s ease-out;
  }

  .status-submenu-exit {
    max-height: 200px;
    opacity: 1;
  }

  .status-submenu-exit-active {
    max-height: 0;
    opacity: 0;
    transition: all 0.2s ease-in;
  }

  /* Status option hover effect */
  .status-option:hover {
    background-color: #f8f9fa;
  }

  /* Softer borders for all elements */
  .border {
    border-color: var(--border-color) !important;
  }

  .border-t {
    border-top-color: var(--border-color) !important;
  }

  .border-b {
    border-bottom-color: var(--border-color) !important;
  }

  .border-r {
    border-right-color: var(--border-color) !important;
  }

  .border-l {
    border-left-color: var(--border-color) !important;
  }

  /* Update chat header border */
  .ChatHeader {
    border-bottom-color: var(--border-color) !important;
  }

  /* Update input section border */
  .msger-inputs {
    border-top-color: var(--border-color) !important;
  }

  /* Update status submenu borders */
  .status-submenu {
    border-color: var(--border-color) !important;
  }

  /* Update button borders */
  button.border {
    border-color: var(--border-color) !important;
  }

  /* Update input borders */
  input.border {
    border-color: var(--border-color) !important;
  }

  /* Update card borders */
  .card {
    border-color: var(--border-color) !important;
  }

  /* Update dropdown borders */
  .status-dropdown {
    border-color: var(--border-color) !important;
  }

  /* Softer shadows */
  .shadow-sm {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03) !important;
  }

  .shadow {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05) !important;
  }

  .shadow-lg {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
  }

  /* Update input section positioning */
  .msger-inputs {
    background-color: var(--background-light);
    border-top: 1px solid var(--border-color);
    padding: 0.75rem 1rem;
    position: fixed;
    bottom: 0;
    left: calc(5rem + 280px);
    right: 280px;
    z-index: 10;
    max-width: 1200px;
    margin: 0 auto;
    width: calc(100% - (5rem + 560px));
  }

  /* Center the chat content */
  .msger-chat {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 0 1rem;
  }

  /* Ensure proper spacing for messages */
  .message-container {
    max-width: 1200px;
    margin: 0 auto;
  }
`}</style>;
