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
import { getAgentConversations ,getAgentMessages,addConversation, addMessageToConversation ,removeConversation , selectExpiredConversations ,checkForExpiredConversations ,setAgentstatus} from "@/slices/ChatBridgeSlice";
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
import SweetAlert from "sweetalert2";
import showSweetAlert from "@/components/Sweetalert";
import { fetchAgentsById,fetchAgentStats } from "@/slices/AgentSlice";
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

import {
  HiLogout,
} from "react-icons/hi";
import { sendPushNotification } from "@/components/SendPushNotification";
import {AppId} from "@/utils/constants";
const ChatPage = () => {
  const router = useRouter();
  const logger = useLogger();
  const [modalOpen, setModalOpen] = useState(false);
  const [tempMessages, setTempMessages] = useState([]);
  const dispatch = useDispatch();
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { conversations } = useSelector(state => state.bridge);
  const {
    messages,
    currentPage,
    hasMore,
    loading,
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
  const connectionRef = useRef(null); // ✅ Store connection persistently
  const [Activechat, setActiveChat] = useState(0);
  const [ActiveSenderId, setActiveSenderId] = useState(0);
  const fileInputRef = useRef(null); // Reference for the file input
  const [Errordisconnect, setErrordisconnect] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const toggleModal = () => setModalOpen((prevState) => !prevState);
  const activeChatRef = useRef(Activechat);
  const agentChatRef = useRef([AgentConversation]);
  const [AgentStatus, setAgentStatus] = useState(0);
  const containerRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [Contactsloading, setContactsloading] = useState(false);
  const [Chatsloading, setChatsloading] = useState(false);
  const [fileType, setFileType] = useState(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const isManualScroll = useRef(false);
  const audioRef = useRef(null);
  const audioRef2 = useRef(null);
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const timersRef = useRef({});
  const [unrepliedChats, setUnrepliedChats] = useState([]);
  const [templateDetails, setTemplateDetails] = useState([]);
  const [heartbeatAttempts, setheartbeatAttempts] = useState(0);
  const [tryReconnect, settryReconnect] = useState(false);
  const lastScrollTop = useRef(0);
  const [UserId, setuserId] = useState(0);
    const [IsOneSignalLoaded, setIsOneSignalLoaded] = useState(false);
  const expiredConversations = useSelector(selectExpiredConversations);
  const message = useSelector((state) =>
    state.bridge.conversations.find((c) => c.id === Activechat)?.messages || []
  );
  

  const HandleAgentStatus = async (e) => {
    const StatusId = e.target.value;
    setChatsloading(true); // Show loader
    setAgentStatus(StatusId);
    try {
      const response = await dispatch(setAgentstatus({ agentId: UserId, statusId: StatusId })).unwrap();
      if (response.success) {
        await loggerdetails(logger, `agent status updated to ${StatusId} `, {
          agentId: UserId,
          type: 5,
        });
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
    // Handle expired conversations
    expiredConversations.forEach((conversation) => {
    
    
      if(conversation.expireType === 1){
        audioRef.current
        ?.play()
        .catch((err) =>
          console.error("Failed to play notification sound:", err)
        );
        toast.error(`Chat with Phone number : ${conversation.phoneNumber} is waiting for your reply.`);
        sendPushNotification({ message: `Chat with Phone number : ${conversation.phoneNumber} is waiting for your reply.`, userID: UserId });
      }
      else if (conversation.expireType === 2){
        audioRef.current
        ?.play()
        .catch((err) =>
          console.error("Failed to play notification sound:", err)
        );
        toast.error(`Person with Phone number : ${conversation.phoneNumber} is waiting for your reply.`);
        sendPushNotification({ message: `Person with Phone number : ${conversation.phoneNumber} is waiting for your reply.`, userID: UserId });
      }
     
    });
  }, [expiredConversations]);


 useEffect(() => {
  if (message.length > 0) {
    setChatMessages([...message]);
    setActiveSenderId(message[0].senderId);
  }
}, [message]);

 
  useEffect(() => {
    // Initialize the audio object only once
    audioRef.current = new Audio("/assets/Notification/chatassigned.mp3");
    
    audioRef2.current = new Audio("/assets/Notification/alertsound.mp3");

  }, []);

  const handleTemplateSend = async (details) => {
   await loggerdetails(logger, `agent sent template :`, {
      Obj : details,
      conversationId: details.ChatId,
      agentId: UserId,
      type: 4,
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
          const response = await dispatch(setAgentstatus({ agentId: UserId, statusId: "0" })).unwrap();
          if (response.success) {
           await loggerdetails(logger, `Agent with ID:${UserId} logged out`, {
             agentId: UserId,
             type: 5,
            })
            const optedOut = await oneSignalService.optOut();
            if (!optedOut) {
              console.warn("Failed to opt-out from OneSignal notifications.");
            }         
            //logger.info("Received new message detail ADSFSD:",  extra={     "user_id": 5,response  } )
            // Remove specific session-related items instead of clearing everything
            localStorage.clear();
            router.push("/auth/login");
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
          await loggerdetails(logger, " Error while loging out:", {
            Obj : error,
            logtype: "error",
            conversationId: Activechat,
            agentId: UserId,
            
           });
        }
      }
    });
  };

 
  // OneSignal initialization and setup
  useEffect(() => {
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
    if (templateDetails) {
      const newMessage = {
        messageId: Date.now(),
        id : templateDetails.ChatId,
        senderId: message[0]?.senderId,
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
      removeUnrepliedMark(templateDetails.ChatId);
       dispatch(addMessageToConversation(newMessage));
      //setChatMessages((prevMessages) => [newMessage, ...prevMessages]);
    }
  }, [templateDetails]);

  //call the fetchConversationList action to fetch agents conversations
  useEffect(() => {
    const fetchData = async () => {
      const AgentId = localStorage.getItem("userId");
      const ClientId = localStorage.getItem("clientId");
  
      if (AgentId) {
        try {
          setContactsloading(true); // Show loader
          dispatch(getAgentConversations(AgentId));
          dispatch(fetchAgentStats({ clientId: ClientId, agentId: AgentId }));
          const response = await dispatch(fetchAgentsById({ agentId: AgentId })).unwrap();
          if (response && response.result) {
            setAgentStatus(response.result.status);
          }
        } catch (error) {
          await loggerdetails(logger, " Error fetching agent data:", {
            Obj : error,
            logtype: "error",
            //conversationId: Activechat,
            agentId: UserId,
            
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

  // //triggered each time when conversations changes and assign to local state
  useEffect(() => {
    
    if (conversations) {
      setContactsloading(false);
      setAgentConversation(conversations);
    } else {
      setContactsloading(false);
    }
  }, [conversations]);

 
 
  const handleFetchMessages = (conversationId) => {
    setActiveChat(conversationId);
    const conversation = conversations.find((conv) => conv.id === conversationId);
    if (conversation?.messages?.length > 0) {
      setChatMessages(conversation.messages);
      setActiveSenderId(conversation.messages[0].senderId);
    } else {
      setChatsloading(true); // Show loader
      dispatch(getAgentMessages(conversationId)).then((response) => {
        setChatMessages(response.payload.messages);
        setChatsloading(false); // Hide loader
      }).catch(() => {
        setChatsloading(false); // Hide loader on error
      });
    }
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



  //Add emoji function
  const addEmoji = (emoji) => {
    setMessageInput((prevMessage) => prevMessage + emoji);
  };

 
  const handleImageclose = () => {
    setMediaFile(null);
    setPreviewUrl(null);
  };

  //called each time to send message
  const HandleSendMessage = async () => {
    if (!messageInput.trim() && !mediaFile) {
      toast.error("Message cannot be empty!");
      return;
    }

    const formData = new FormData();
    formData.append("ClientId", localStorage.getItem("clientId"));
    formData.append("SenderId", message[0].senderId);
    formData.append("Message", messageInput.trim());
    formData.append("ConversationId", Activechat);

    if (mediaFile) {
      formData.append("File", mediaFile); // Append the selected media file
    }

    try {
      const newMessage = {
        id: Activechat,
        senderId: message[0].senderId,
        messageId: Date.now(),
        typeId: 1,
        messageContent: messageInput.trim(),
        sentcontentType: fileType ? fileType : "", // Set content type if there's media
        sentmediaPath: previewUrl ? previewUrl : "",
        createdDate: new Date().toLocaleString(),
      };
      //logger.info("Agent sent message:", newMessage);
       await loggerdetails(logger, "Agent sent message:", {
        Obj : newMessage,
        conversationId: Activechat,
        agentId: UserId,
        type: 4,
       });

      //setChatMessages((prevMessages) => [newMessage, ...prevMessages]);
      dispatch(addMessageToConversation(newMessage));
      setPreviewUrl(null);
      setFileType(null);
      setFileType(null);
      setMessageInput("");
      await dispatch(NewAgentMessage(formData)).unwrap();
      //toast.success("Message sent successfully!");
      setMediaFile(null); // Clear the selected file after sending the message
      setPreviewUrl(null);
      setFileType(null); //get the file type
      //clearTimer(Activechat);
      removeUnrepliedMark(Activechat);
     
    } catch (error) {
      await loggerdetails(logger, " Error while sending message:", {
        Obj : error,
        logtype: "error",
        conversationId: Activechat,
        agentId: UserId,
        
       });

      toast.error("Failed to send message. Please try again.");
    }
  };

  useEffect(() => {
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
      await loggerdetails(logger, "Agent received message:", {
        Obj : message,
        conversationId: message.conversationId,
        agentId: UserId,
        type: 2,
      })
      audioRef.current
        ?.play()
        .catch((err) =>
          console.error("Failed to play notification sound:", err)
        );
        dispatch(addMessageToConversation(message));
     
    };

    // Handles conversation assignment
    const handleConversationAssigned = async(notification) => {
     await loggerdetails(logger, "New Conversation assigned to agent:", {
        Obj : notification,
        conversationId: notification.id,
        agentId: userId,
        type: 1,
      })
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
      
      await loggerdetails(logger, "Conversation unassigned for chat Id:", {
        conversationId: chatId,
        agentId: userId,
        type: 3,
      })
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


    // Setup event listeners
    newConnection.on("MessageReceived", handleIncomingMessage);
    newConnection.on("ConversationAssigned", handleConversationAssigned);
    newConnection.on("ConversationUnAssigned", handleConversationUnAssigned);
    newConnection.on("HeartbeatAcknowledged", handleHeartbeatAcknowledged);
    newConnection.on("Connected", handleConnected);
    newConnection.on("DisConnected", handleDisconnect);

    

      newConnection.onreconnecting((error) => {
        loggerdetails(logger, "Reconnecting signalR:", {
         Obj : error
        })
        setErrordisconnect(true);
      });
    
      newConnection.onreconnected(() => {
        loggerdetails(logger, " signalR reconnected succesfully")
        dispatch(getAgentConversations({ AgentId: userId }));
        setErrordisconnect(false);
        setheartbeatAttempts(0);
      });
    
      newConnection.onclose((error) => {
        loggerdetails(logger, "SingalR connection closed:")
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
    if (Errordisconnect && connectionRef.current) {
     loggerdetails(logger, "Reconnecting SignalR...", {type: 6 });  
      startSignalRConnection(connectionRef.current, UserId);
    }
  }, [Errordisconnect]);

  useEffect(() => {
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

  const handleDownload = (mediapath) => {
    const imageUrl = `${BASE_URL}${mediapath}`;
    const fileName = `file.${mediapath.split(".")[1]}`;

    // Fetch the image as a blob
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob); // Create an object URL for the blob
        link.download = fileName; // Specify the downloaded file's name
        link.click(); // Trigger the download
      })
      .catch((error) => console.error("Download failed", error));
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
          <div className="flex justify-between items-center headerchatmenu">
            {/* Logo Section on the Left Side */}
            <div className="flex items-center space-x-3 gap-5">
              <Image
                className="m-l-10 h-10 w-auto"
                src="/images/logo/Loader.svg"
                alt="Logo"
              />

            </div>
            
            {/* Action Buttons Section on the Right Side */}
            <div className="">
              {/* Sidebar Toggle Button */}
              <div className="flex items-center space-x-4 HeaderChatmenuItemBar">
                {/* Assigned */}
                <div className="flex items-center space-x-2 menuitem">
                  <FaComments className="text-blue-500" />
                  <span className="font-medium text-white text-base md:text-xs lg:text-xs xl:text-xs sm:text-xs xs:text-xs">
                    Assigned:{" "}
                    <span className="font-bold text-base md:text-sm lg:text-sm xl:text-sm sm:text-xs xs:text-xs">
                      {AgentStats?.assignedChat ?? "-/-"}
                    </span>
                  </span>
                </div>

                {/* Active */}
                <div className="flex items-center space-x-2 menuitem">
                  <FaCheckCircle className="text-green-500" />
                  <span className="font-medium text-white text-base md:text-xs lg:text-xs xl:text-xs sm:text-xs xs:text-xs">
                    Active:{" "}
                    <span className="font-bold text-base md:text-sm lg:text-sm xl:text-sm sm:text-xs xs:text-xs">
                      {AgentStats?.activeChat ?? "-/-"}
                    </span>
                  </span>
                </div>
                {/* Abandoned */}
                <div className="flex items-center space-x-2 menuitem">
                  <FaBan className="text-red-500" />
                  <span className="font-medium text-white text-base md:text-xs lg:text-xs xl:text-xs sm:text-xs xs:text-xs">
                    Abandoned:{" "}
                    <span className="font-bold text-base md:text-sm lg:text-sm xl:text-sm sm:text-xs xs:text-xs">
                      {AgentStats?.abandonChat ?? "-/-"}
                    </span>
                  </span>
                </div>
                {/* Closed */}
                <div className="flex items-center space-x-2 menuitem">
                  <FaTimesCircle className="text-red-500" />
                  <span className="font-medium text-white text-base md:text-xs lg:text-xs xl:text-xs sm:text-xs xs:text-xs">
                    Closed:{" "}
                    <span className="font-bold text-base md:text-sm lg:text-sm xl:text-sm sm:text-xs xs:text-xs">
                      {AgentStats?.closedChat ?? "-/-"}
                    </span>
                  </span>
                </div>

                {/* Expired */}
                <div className="flex items-center space-x-2 menuitem">
                  <AiOutlineHourglass className="text-yellow-100" />
                  <span className="font-medium text-white text-base md:text-xs lg:text-xs xl:text-xs sm:text-xs xs:text-xs">
                    Expired:{" "}
                    <span className="font-bold text-base md:text-sm lg:text-sm xl:text-sm sm:text-xs xs:text-xs">
                      {AgentStats?.expiredChat ?? "-/-"}
                    </span>
                  </span>
                </div>
                {/* Force Closed */}
                <div className="flex items-center space-x-2 menuitem menuitem">
                  <FaClock className="text-purple-500" />
                  <span className="font-medium text-white text-base md:text-xs lg:text-xs xl:text-xs sm:text-xs xs:text-xs">
                    Force Closed:{" "}
                    <span className="font-bold text-base md:text-sm lg:text-sm xl:text-sm sm:text-xs xs:text-xs">
                      {AgentStats?.forceClosedChat ?? "-/-"}
                    </span>
                  </span>
                </div>
                {/* Avg Duration */}
                {/* <div className="flex items-center space-x-2 menuitem">
                  <MdOutlineTimer className="text-orange-500" />
                  <span className="font-medium text-white text-base md:text-xs lg:text-xs xl:text-xs sm:text-xs xs:text-xs">
                    Avg Duration:{" "}
                    <span className="font-bold text-base md:text-sm lg:text-sm xl:text-sm sm:text-xs xs:text-xs">
                      {AgentStats.avgChatTime ?? "-/-"}
                    </span>
                  </span>
                </div> */}
                {/* Response Time */}
                {/* <div className="flex items-center space-x-2 menuitem">
                  <MdOutlineTimer className="text-green-500" />
                  <span className="font-medium text-white text-base md:text-xs lg:text-xs xl:text-xs sm:text-xs xs:text-xs">
                    Response Time:{" "}
                    <span className="font-bold text-base md:text-sm lg:text-sm xl:text-sm sm:text-xs xs:text-xs">
                      {AgentStats.avgResponseTime ?? "-/-"}
                    </span>
                  </span>
                </div> */}
                {/* User Badge with Name and Dropdown */}
                <div className="relative menuitem menuitemButton">
                  <div className="flex ButtonUserName items-center gap-3 space-x-2 menuitem ">
                   
                     <div className="relative">
                    
                        <AgentStatusDropdown
                          name="agentStatusId"
                          onChange={HandleAgentStatus}
                          value={AgentStatus}
                        />
                      
                     </div>
                        
                   
                     
                      
                    <button
                      className="flex  bg-gray-800 text-white-800 dark:bg-gray-700 dark:text-gray-200 rounded-md items-center hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none   p-2"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <Image
                        src={UserBadge.src}
                        alt="User"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span>{localStorage.getItem("userName")}</span>
                    </button>
                  {/* User Badge with Name and Dropdown */}
                  </div>

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
      <Container fluid className="h-100 MainContainer">
      {(Chatsloading || Contactsloading) && <Loader />}
        <Row className="g-0 h-100">
          <Col
            xxl="4"
            xl="3"
            lg="3"
            md="3"
            sm="3"
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
                          handleFetchMessages(conversation.id)
                        }
                      >
                        <div className="d-flex align-items-center w-75">
                          <Image
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
                            <span className="d-block text-truncate text-muted  text-left">
                              {conversation.phoneNumber}
                            </span>
                            {conversation.lastMessageText !== "" ? (
                              <p
                                className="d-block text-truncate mt-2 text-muted text-left"
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
            xxl="8"
            xl="9"
            lg="9"
            md="9"
            sm="9"
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
                    className="flex items-center justify-between text-black px-4 py-2 ChatHeader shadow-md"
                  >
                    {/* Left Section */}
                    <div
                      key={conversation.id}
                      className="flex items-center space-x-3"
                    >
                      <Image
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
                      <div>
                        <span>{conversation.phoneNumber}</span>
                        <button
                          onClick={() => handleCopy(conversation.phoneNumber)}
                          className="p-1 rounded hover:bg-gray-300 focus:outline-none"
                          aria-label="Copy Phone Number"
                        >
                          <FaCopy size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                      {/* Search Input */}
                    </div>
                  </div>
                ))}
                <div className="right-sidebar-chat w-full height-chat-box overflow-y-auto chat-background h-100">
                  <div className="msger flex flex-col  h-full">
                    <div
                      ref={scrollContainerRef}
                      className={`msger-chat flex-grow overflow-y-auto space-y-4 px-4 py-2 ${
                        previewUrl ? "hide-messages" : ""
                      }`}
                      style={{
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column-reverse",
                      }}
                    >
                      
                      {chatMessages?.map((message) => (
                        <div
                          key={message.messageId}
                          className={`mt-2 flex ${
                            message.typeId === 1
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
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
                                          Download
                                        </button>
                                      </>
                                    )}

                                    {message.contentType.startsWith(
                                      "video/"
                                    ) && (
                                      <video
                                        controls
                                        src={`${BASE_URL}${message.mediaPath}`}
                                        className="w-full h-auto rounded"
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
                                          Download
                                        </button>
                                        </div>
                                        
                                      </div>
                                    )}
                                  </>
                                )}
                              {/* //for sent content */}
                              {message.sentcontentType &&
                                message.sentcontentType !== "" && (
                                  <>
                                    {message.sentcontentType.startsWith(
                                      "image"
                                    ) && (
                                      <img
                                        src={`${message.sentmediaPath}`}
                                        alt="Image"
                                        className="w-full h-auto rounded"
                                      />
                                    )}
                                    {message.sentcontentType.startsWith(
                                      "video"
                                    ) && (
                                      <video
                                        controls
                                        src={`${message.sentmediaPath}`}
                                        className="w-full h-auto rounded"
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
                                <span
                                  className="ml-2 text-gray-500 text-xs"
                                  style={{ whiteSpace: "nowrap" }}
                                >
                                  {extractTime(message.createdDate)}
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
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                    {previewUrl && (
                      <div className="absolute inset-0  flex items-center justify-center z-50">
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

                    <div className="msger-inputs  flex items-center">
                      <Button
                        onClick={openFileManager}
                        className="ClipButton  mr-2"
                      >
                        <i className="fa fa-paperclip"></i>
                      </Button>
                      {/* Emoji Picker Button */}
                      <button
                        className="mr-2 chatBarEMoji  hover:bg-gray-200 rounded-full"
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        style={{ zIndex: "999" }}
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
                        style={{ zIndex: "999" }}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if ((e.shiftKey || e.altKey) && e.key === "Enter") {
                            e.preventDefault();
                            setMessageInput(
                              (prevMessage) => prevMessage + "\n"
                            );
                            setMessageInput(
                              (prevMessage) => prevMessage + "\n"
                            );
                          } else if (e.key === "Enter") {
                            e.preventDefault();
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
                      <button
                        type="submit"
                        onClick={HandleSendMessage}
                        color="primary"
                        style={{ zIndex: "999" }}
                      >
                        <i className="fa fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>
               
              </Card>
            )}
            {Activechat === 0 && (
              <div className="font-bold text-center mt-[30%] text-gray-400 text-2xl">
                Select a chat from left panel
                <div className='onesignal-customlink-container'></div>
              </div>
              
            )}
          </Col>
        </Row>
      </Container>
      {/* {Errordisconnect && (
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
      )} */}
    </>
  );
};

export default ChatPage;
