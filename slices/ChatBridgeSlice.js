import { createSlice, createAsyncThunk ,createSelector } from "@reduxjs/toolkit";
import { ExpireTime_Message, ExpireTime_Message_TRY1,ExpireTime_Message_TRY2,ExpireTime_Message_TRY3,ExpireTime_Message_TRY4,ExpireTime_Message_TRY5, ExpireTime_AssignedChat} from "@/utils/constants";
import {
  fetchConversationList,
  fetchConversationMessage,
} from "./ConversationSlice";

const initialState = {
  conversations: [],
  loading: false,
  error: null,
};

export const getAgentConversations = createAsyncThunk(
  "bridge/getAgentConversations",
  async (agentId, { dispatch, getState }) => {
    const { bridge } = getState();
    //if (bridge.conversations.length > 0) return bridge.conversations;
    const response = await dispatch(fetchConversationList({ AgentId: agentId })).unwrap();
    return response;
  }
);

export const getAgentMessages = createAsyncThunk(
  "bridge/getAgentMessages",
  async (conversationId, { dispatch, getState }) => {
    
    const { bridge } = getState();
    const conversation = bridge.conversations.find(c => c.id === conversationId);
    if (conversation && conversation.messages?.length > 0) {
      return { conversationId, messages: conversation.messages };
    }
    const response = await dispatch(fetchConversationMessage({ ChatId: conversationId })).unwrap();
    return { conversationId, messages: response.conversationMessage };
  }
);

export const checkForExpiredConversations = createAsyncThunk(
  "bridge/checkForExpiredConversations",
  async (_, { getState }) => {
    //debugger
    const state = getState();
    const currentTime = Date.now();
    const expiredConversationIds = [];

    const updatedConversations = state.bridge.conversations.map(
      (conversation) => {
        // Parse expireTime if it's an ISO date string
        const expireTime =
          typeof conversation.expireTime === "string"
            ? Date.parse(conversation.expireTime)
            : conversation.expireTime;

        if (expireTime !== 0 && expireTime <= currentTime) {
          const newRetryCount = (conversation.expireTryCount || 0) + 1;
          let newExpireTime = 0; // Default to no further retries

          switch (newRetryCount) {
            case 1:
              newExpireTime = currentTime + ExpireTime_Message_TRY1;
              break;
            case 2:
              newExpireTime = currentTime + ExpireTime_Message_TRY2;
              break;
            case 3:
              newExpireTime = currentTime + ExpireTime_Message_TRY3;
              break;
            case 4:
              newExpireTime = currentTime + ExpireTime_Message_TRY4;
              break;
            case 5:
              newExpireTime = currentTime + ExpireTime_Message_TRY5;
              break;
            default:
              newExpireTime = currentTime;
              break;
          }

          expiredConversationIds.push(conversation.id);

          return {
            ...conversation,
            expireTryCount: newRetryCount,
            expireTime: newExpireTime,
          };
        }
        return conversation;
      }
    );

    return   { expiredConversationIds, updatedConversations} ;
  }
);


const bridgeSlice = createSlice({
  name: "bridge",
  initialState,
  reducers: {
    addConversation: (state, action) => {
      
      const newConversation = action.payload;
      const existingConversation = state.conversations.find(c => c.id === newConversation.id);
      //const currentTime = Date.now();
      
      if (!existingConversation) {
        state.conversations.unshift({
          ...newConversation,
          messages: newConversation.messages || [],
          //expiryTime: currentTime + ExpireTime_AssignedChat,
        });
      }
    },

    removeConversation: (state, action) => {
     
      state.conversations = state.conversations.filter((c) => c.id !== action.payload);
    },
    
    addMessageToConversation: (state, action) => {
      const { id, messageContent, typeId } = action.payload;
      const conversation = state.conversations.find(c => c.id === id);
    
      if (conversation) {
        // Update the last message text
        conversation.lastMessageText = messageContent;
    
        // Check if the messages array exists and is not empty
        if (Array.isArray(conversation.messages) && conversation.messages.length > 0) {
          // Add the new message to the beginning of the messages array
          conversation.messages.unshift(action.payload);
        }
    
        // Update unread count and expireTime based on message type
        if (typeId === 2) {
          // Customer message
          conversation.unreadCount = (conversation.unreadCount || 0) + 1;
          if (!conversation.expireTime || conversation.expireTime === 0) {
            conversation.expireTime = Date.now() + ExpireTime_Message;
          }
        } else {
          // Agent message
          conversation.unreadCount = 0;
          conversation.expireTime = 0;
        }
    
        // Move the updated conversation to the top of the list
        state.conversations = [
          conversation,
          ...state.conversations.filter(c => c.id !== id),
        ];
      }
    },
    
    // getExpiredConversations: (state) => {
    //   debugger
    //   const currentTime = Date.now();
    //   return state.conversations.filter(
    //     (conversation) => conversation.expiryTime !== 0 && conversation.expiryTime <= currentTime
    //   );
    // },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAgentConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAgentConversations.fulfilled, (state, action) => {
        
        state.loading = false;
        state.conversations = action.payload.conversations.map(conv => ({ ...conv, messages: [] }));
      })
      .addCase(getAgentConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAgentMessages.fulfilled, (state, action) => {
        const { conversationId, messages } = action.payload;
        const conversation = state.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.messages = messages;
        }
      })
      .addCase(checkForExpiredConversations.fulfilled, (state, action) => {
        
        const {expiredConversationIds, updatedConversations} = action.payload;
          state.expiredConversationIds = expiredConversationIds;
          state.conversations = updatedConversations;
        });
  },
});

//const selectConversations = (state) => state.bridge.conversations;

// // Selector to get expired conversations
// export const selectExpiredConversations = createSelector(
  
//   [selectConversations],
//   (conversations) => {
//     debugger
//     const currentTime = Date.now();
//     return conversations.filter(
//       (conversation) =>
//         conversation.expiryTime !== 0 && conversation.expiryTime <= currentTime
//     );
//   }
// );

export const selectExpiredConversations = (state) =>
  state.bridge.conversations.filter((conversation) =>
    state.bridge.expiredConversationIds.includes(conversation.id)
  );

export const { addConversation, addMessageToConversation ,removeConversation  } = bridgeSlice.actions;

export default bridgeSlice.reducer;
