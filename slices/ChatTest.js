import { createSlice } from "@reduxjs/toolkit";
import { store } from "@/store/store";
import {  ExpireTime_Message, ExpireTime_AssignedChat} from "@/utils/constants";
import {
  fetchConversationList,
  fetchConversationMessage,
} from "./ConversationSlice";

const initialState = {
  conversationData: [],
  loading: false,
  error: null,
  data: null,
};

const chatTestSlice = createSlice({
  name: "chatTestSlice",
  initialState,
  reducers: {
    CheckAndUpdateExpiredNotification: (state) => {
      const currentTime = Date.now();

      // Get expired conversationData and also update their expiry and try count
      const expiredRecords = state.conversationData.filter(
        (item) => item.expireTime < currentTime
      );

      state.conversationData = state.conversationData.map((item) => {
        if (item.expireTime < currentTime) {
          return {
            ...item,
            expireTime:
              item.expireType === 2
                ? currentTime + ExpireTime_AssignedChat
                : currentTime + ExpireTime_Message,
            expireTryCount: item.expireTryCount + 1,
          };
        }
        return item;
      });

      // Return expired records as payload
      return expiredRecords;
    },
    ResetAlertSound: (state) => {
      state.playAlertSound = false;
      state.alertphoneNumber = "";
      state.alertexpiryMins = "";
      state.alertexpirytype = "";
      state.alertpriority = "";
    },

    addCustomer: (state, action) => {
      const { phoneNumber, fullName, brandName, id, agentId } = action.payload;
      const existingCustomer = state.conversationData.find(
        (customer) => customer.phoneNumber === phoneNumber
      );

      if (!existingCustomer) {
        const newCustomer = {
          conversationId: 0,
          senderId: 0,
          phoneNumber,
          fullName,
          brandName,
          expireType: 2,
          expireTime: new Date().getTime() + ExpireTime_AssignedChat,
          expireTryCount: 0,
          updatedDate: new Date().getTime(),
          lastMessageId: 0,
          lastMessageText: "",
          lastMessageTypeId: 0,
          agentId: agentId,
          agentName: "",
          status: 0,
          statusName: "",
          logo: "",
          unreadCount: 0,
          line: 0,
          messages: [],
          totalRecords: 0,
        };
        
        state.conversationData.push(newCustomer);
        
      }
    },
    addMultipleCustomers: (state, newCustomers) => {
    
      const filteredCustomers = newCustomers.payload.filter((newCustomer) => {
        return !state.conversationData.some(
          (existingdata) => existingdata.phoneNumber === newCustomer.phoneNumber
        );
      });
      state.conversationData.push(...filteredCustomers);
    
      ;
    },
    addMultipleMessage: (state,Messages) => {
      debugger
      const existingConversation = state.conversationData.find(
        (convo) => convo.id === Messages.payload[0]?.id
      );
    
      if (existingConversation) {
        existingConversation.message = [...(existingConversation.message || []), ...Messages];
      }
    },
    
    
    addMessage: (state, message,conversationId) => {
      
      const { phoneNumber, messageContent, messageTypeId, id } = action.payload;
      state.conversationData = state.conversationData.map((customer) => {
        if (customer.phoneNumber === phoneNumber) {
          const newMessage = {
            agentId: 0,
            agentName: "",
            messageId: "",
            clientId: "",
            contentType: "",
            conversationId: 0,
            createdDate: "",
            fileName: "",
            messageTypeId,
            id,
            line: 0,
            logo: "",
            messageId: 0,
            messageContent,
            parentMediaId: 0,
            parentMessageContent: "",
            parentMessageId: 0,
            parentMessageTypeId: 0,
            senderId: 0,
            status: 0,
            totalRecords: 0,
            typeId: 0,
            createdDate: new Date().toLocaleString(),
          };
          if (messageTypeId === 2) {
            customer.expireType = 1;
            customer.expireTime = new Date().getTime() + ExpireTime_Message;
            customer.expireTryCount = 0;
          } else {
            customer.expireType = 0;
            customer.expireTime = new Date().getTime();
            customer.expireTryCount = 0;
          }
          return {
            ...customer,
            messages: [...customer.messages, newMessage],
          };
        }
        return customer;
      });
    },

    setData: (state, action) => {
      state.data = action.payload;
    }
      
    },
});

export const {
  addCustomer,
  addMultipleCustomers,
  addMessage,
  CheckAndUpdateExpiredNotification,
  ResetAlertSound,
  addMultipleMessage,
  setData,
} = chatTestSlice.actions;


export const fetchExpiredNotifications = () => (dispatch, getState) => {
  
  // Dispatch action to update state and get expired notifications
  const expired = CheckAndUpdateExpiredNotification(getState().chatTest.conversationData);
  return expired;
};

export const GetConversations = (AgentId) => async (dispatch, getState) => {
  try {
    debugger
    const result = await dispatch(fetchConversationList({ AgentId: AgentId })).unwrap();

    // Ensure the result is an array of conversations
    if (result.conversations) {
      // Dispatch the action properly
      await dispatch(addMultipleCustomers(result.conversations));
    }

    // Return the updated state
    //return getState().chatTest.conversationData;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};


export const GetConversationMessage = (id) => async (dispatch, getState) => {
  debugger
  const { conversationData } = getState().chatTest;

  const existingConversation = conversationData.find(convo => convo.id === id);

  if (existingConversation) {
    if (existingConversation.message && existingConversation.message.length > 0) {
      return existingConversation.message;
    }
  }

  try {
    const result = await dispatch(fetchConversationMessage({ ChatId: id })).unwrap();
    
    if (result.conversationMessage.length > 0) {
      dispatch(addMultipleMessage(result.conversationMessage));
    }

    return result.conversationMessage;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};




export const AddChat = (params) => async (dispatch, getState) => {
  const agentId = localStorage.getItem("userId");

  // Fetch conversation list from API
  const result = await dispatch(fetchConversationList({ AgentId: 32 })).unwrap();

  // Check if result is an array and has conversationData
  if (Array.isArray(result) && result.length > 0) {
    result.forEach((conversation) => {
      // Dispatch addCustomer for each conversation object
      dispatch(
        addCustomer({
          phoneNumber: conversation.phoneNumber,
          fullName: conversation.fullName,
          brandName: conversation.brandName,
          id: conversation.id,
          agentId: 32,
          lastMessageText: conversation.lastMessageText,
          updatedDate: conversation.updatedDate,
          logo: conversation.logo,
          unreadCount: conversation.unreadCount,
        })
      );
    });
  }
;
  // Return the updated state
  const updatedItems = getState().chatTest.conversationData;
  return updatedItems;
};





export default chatTestSlice.reducer;
