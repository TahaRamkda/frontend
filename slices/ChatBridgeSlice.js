import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {  ExpireTime_Message, ExpireTime_AssignedChat} from "@/utils/constants";
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

const bridgeSlice = createSlice({
  name: "bridge",
  initialState,
  reducers: {
    addConversation: (state, action) => {
      debugger
      const newConversation = action.payload;
      const existingConversation = state.conversations.find((c) => c.id === newConversation.id);
      const currentTime = Date.now();
      if (!existingConversation) {
        state.conversations.unshift({ ...newConversation,
           messages: newConversation.messages || [] ,
           expiryTime: currentTime + 30 * 1000,
          });
      }
    },

    removeConversation: (state, action) => {
     debugger
      state.conversations = state.conversations.filter((c) => c.id !== action.payload);
    },
    
    addMessageToConversation: (state, action) => {
      const conversationIndex = state.conversations.findIndex((c) => c.id === action.payload.id);
    
      if (conversationIndex !== -1) {
        // Extract the conversation
        const conversation = state.conversations[conversationIndex];
    
        // Update the messages array and metadata
        conversation.messages.unshift(action.payload); // Add message at the beginning
        conversation.lastMessageText = action.payload.messageContent;
    
        if (action.payload.typeId === 2) {
          conversation.unreadCount = (conversation.unreadCount || 0) + 1;
          if(conversation.expiryTime === 0){
            conversation.expiryTime = Date.now() + 5 * 60 * 1000;
          }
          
        } else {
          conversation.unreadCount = 0;
          conversation.expiryTime = 0;
        }
    
        // Remove the conversation from its current position
        state.conversations.splice(conversationIndex, 1);
    
        // Insert the updated conversation at the beginning of the array
        state.conversations.unshift(conversation);
      }
    },
    
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
      });
  },
});
export const { addConversation, addMessageToConversation ,removeConversation } = bridgeSlice.actions;

export default bridgeSlice.reducer;
