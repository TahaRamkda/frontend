import { createSlice, createAsyncThunk ,createSelector } from "@reduxjs/toolkit";
import { ExpireTime_Message, ExpireTime_Message_TRY1,ExpireTime_Message_TRY2,ExpireTime_Message_TRY3,ExpireTime_Message_TRY4,ExpireTime_Message_TRY5, ExpireTime_AssignedChat ,ExpireTime_AssignedChat_TRY1,ExpireTime_AssignedChat_TRY2} from "@/utils/constants";
import {
  fetchConversationList,
  fetchConversationMessage,
} from "./ConversationSlice";
import {
  fetchAgentTemplate,
  fetchAgentTemplatesDetail,
} from "./AgentTemplateSlice";
import { fetchAgentsById } from "./AgentSlice";
import {setAgentStatus} from './AgentSlice';
import { date } from "yup";
const initialState = {
  conversationList: [],
  agentTemplatesList: [],
  agenttemplatedetails: [],
  loading: false,
  error: null,
};

export const getAgentConversations = createAsyncThunk(
  "bridge/getAgentConversations",
  async (agentId, { dispatch, getState }) => {
    
    const { bridge } = getState();
    //if (bridge.conversationList.length > 0) return bridge.conversationList;
    const response = await dispatch(fetchConversationList({ AgentId: agentId })).unwrap();
    return response;
  }
);

export const getAgentMessages = createAsyncThunk(
  "bridge/getAgentMessages",
  async (conversationId, { dispatch, getState }) => {
    
    
    const { bridge } = getState();
    const conversation = bridge.conversationList.find(c => c.id === conversationId);
    if (conversation && conversation.messages?.length > 0) {
      return { conversationId, messages: conversation.messages };
    }
    const response = await dispatch(fetchConversationMessage({ ChatId: conversationId })).unwrap();
    return { conversationId, messages: response.conversationMessage };
  }
);

export const checkForExpiredConversations = createAsyncThunk(
  'bridge/checkForExpiredConversations',
  async (_, { getState }) => {
    const state = getState();
    const currentTime = Date.now();
    const expiredConversationIds = [];
    const updatedConversations = state.bridge.conversationList.map((conversation) => {
      const { expireTime, expireType, expireTryCount = 0, id } = conversation;
      const timestamp = typeof expireTime === 'string' ? new Date(expireTime).getTime() : expireTime;

      // Check if the conversation has expired
      if (timestamp !== 0 && timestamp <= currentTime && expireType !== 0) {
        let newExpireTime = null;
        const newRetryCount = expireTryCount + 1;

        switch (expireType) {
          case 1:
            // No retries; expire immediately
            expiredConversationIds.push(id);
            break;

          case 2:
            // Retry logic with predefined intervals
            const retryIntervals = [
              ExpireTime_Message_TRY1,
              ExpireTime_Message_TRY2,
              ExpireTime_Message_TRY3,
              ExpireTime_Message_TRY4,
              ExpireTime_Message_TRY5,
            ];

            if (newRetryCount <= retryIntervals.length) {
              newExpireTime = currentTime + retryIntervals[newRetryCount - 1];
             
            } else {
              newExpireTime = currentTime;
            }
            expiredConversationIds.push(id);
            break;

          default:
            console.warn(`Unhandled expireType: ${expireType} for conversation ID: ${id}`);
            break;
        }

        return {
          ...conversation,
          expireTryCount: newRetryCount,
          expireTime: newExpireTime,
        };
      }

      return conversation;
    });

    return { expiredConversationIds, updatedConversations };
  }
);

export const setAgentById = createAsyncThunk(
  "bridge/setAgentById",
  async ({agentId}, { dispatch }) => {
    const response = await dispatch(fetchAgentsById({ agentId: agentId })).unwrap();
  }
);

export const setAgentstatus = createAsyncThunk(
  "bridge/setAgentstatus",
  async ({agentId,statusId}, { rejectWithValue ,dispatch }) => {
    
    const response = await dispatch(setAgentStatus({ agentId: agentId, statusId: statusId })).unwrap();
    //console.log("set status response", response)
    return response;
  }
);

// getagenttemplate thunk
export const getAgentTemplate = createAsyncThunk(
  "bridge/getAgentTemplate",
  async ({ senderId }, { dispatch, getState }) => {
    const { bridge } = getState();
    
    // Check if any template in the agentTemplatesList list has the given senderId
    const templateExists = bridge.agentTemplatesList.some(
      (template) => template.senderId === senderId
    );

    if (templateExists) {
      // If a template with the senderId exists, return the existing templates
      return { senderId, templates: bridge.agentTemplatesList };
    }

    // If no template with the senderId exists, fetch the list of templates
    const response = await dispatch(fetchAgentTemplate({ senderId })).unwrap();
    
    return { senderId, templates: response }; // Expecting response to be a list of templates
  }
);

export const getAgentTemplateDetail = createAsyncThunk(
  "bridge/getAgentTemplateDetail", // Unique action type
  async ({ senderId, templateId }, { dispatch, getState }) => { // Renamed templaterId to templateId for consistency
    const { bridge } = getState();
    
    // Check if the specific template detail exists in agenttemplatedetails
    const templateDetailExists = bridge.agenttemplatedetails.some(
      (detail) => detail.senderId === senderId && detail.templateId === templateId
    );

    if (templateDetailExists) {
      // Return the existing agenttemplatedetails array if the specific detail exists
      return { senderId, templateId, templatedetail: bridge.agenttemplatedetails };
    }

    // Fetch the template detail if it doesn’t exist
    const response = await dispatch(fetchAgentTemplatesDetail({ senderId, TemplateId:templateId })).unwrap();
    
    return { senderId, templateId, templatedetail: response }; // Assuming response is a single detail object
  }
);


const bridgeSlice = createSlice({
  name: "bridge",
  initialState,
  reducers: {
    addConversation: (state, action) => {
      
      const newConversation = action.payload;
      const existingConversation = state.conversationList.find(c => c.id === newConversation.id);
      const currentTime = Date.now();
    
      if (!existingConversation) {
        const updatedConversations = [
          {
            ...newConversation,
            messages: newConversation.messages || [],
            expireType: 1,
            expireTime: currentTime + ExpireTime_AssignedChat, // Ensure 'expireTime' is correctly named
          },
          ...state.conversationList
        ];
    
        return {
          ...state,
          conversationList: updatedConversations
        };
      }
    
      // If the conversation already exists, return the current state unchanged
      return state;
    },
    

    removeConversation: (state, action) => {
     
      state.conversationList = state.conversationList.filter((c) => c.id !== action.payload);
    },
    
    addMessageToConversation: (state, action) => {
      
      const { id, messageContent, typeId, createdDate } = action.payload;
      const conversation = state.conversationList.find(c => c.id === id);
    
      if (conversation) {
        // Update the last message text
        // Update the last message text and updated date
        conversation.lastMessageText = messageContent;
        conversation.updatedDate = createdDate;
    
        // Check if the messages array exists and is not empty
        if (Array.isArray(conversation.messages) && conversation.messages.length > 0) {
          // Add the new message to the beginning of the messages array
          conversation.messages.unshift(action.payload);
        }
    
        // Update unread count and expireTime based on message type
        if (typeId === 2) {
          // Customer message
          conversation.unreadCount = (conversation.unreadCount || 0) + 1;
          if (conversation.expireTime === 0) {
            conversation.expireType = 2
            conversation.expireTime = Date.now() + ExpireTime_Message;
          }
          else if (conversation.expireTime && conversation.expireType === 0 ){
            conversation.expireType = 2
            conversation.expireTime = Date.now() + ExpireTime_Message;
          }
         
        } else {
          // Agent message
          conversation.unreadCount = 0;
          conversation.expireTime = 0;
          conversation.expireType = 0;
          conversation.expireTryCount = 0;
        }
    
        // Move the updated conversation to the top of the list
        state.conversationList = [
          conversation,
          ...state.conversationList.filter(c => c.id !== id),
        ];
        console.log("Added message to conversation:", state.conversationList);
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
        state.conversationList = action.payload.conversationList.map(conv => ({ ...conv, messages: [] }));
      })
      .addCase(getAgentConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAgentMessages.fulfilled, (state, action) => {
        const { conversationId, messages } = action.payload;
        const conversation = state.conversationList.find(c => c.id === conversationId);
        if (conversation) {
          conversation.messages = messages;
        }
      })
      .addCase(checkForExpiredConversations.fulfilled, (state, action) => {
        const {expiredConversationIds, updatedConversations} = action.payload;
          state.expiredConversationIds = expiredConversationIds;
          state.conversationList = updatedConversations;
        })

        .addCase(getAgentTemplate.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getAgentTemplate.fulfilled, (state, action) => {
          
          state.loading = false;
          const { senderId, templates } = action.payload;
  
          // Check if any template in the list has the given senderId
          const templateExists = state.agentTemplatesList.some(
            (template) => template.senderId === senderId
          );
  
          if (!templateExists) {
            // If no template with the senderId exists, append the new list of templates
            // Ensure each template in the list has a senderId
            const templatesWithSenderId = templates.agentTemplatesList.map((template) => ({
              ...template,
              senderId: template.senderId || senderId, // Use the provided senderId if the template doesn't have one
            }));
            state.agentTemplatesList = [...state.agentTemplatesList, ...templatesWithSenderId];
          }
        })
        .addCase(getAgentTemplate.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(getAgentTemplateDetail.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getAgentTemplateDetail.fulfilled, (state, action) => {
          state.loading = false;
          const { senderId, templateId, templatedetail } = action.payload;
  
          // Check if the specific template detail already exists
          const detailExists = state.agenttemplatedetails.some(
            (detail) => detail.senderId === senderId && detail.templateId === templateId
          );
  
          if (!detailExists) {
            state.agenttemplatedetails = [
              ...state.agenttemplatedetails,
              { ...templatedetail, senderId, templateId }
            ];
          }
        })
        .addCase(getAgentTemplateDetail.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
  },
});

export const selectExpiredConversations = (state) =>
  state.bridge.conversationList.filter((conversation) =>
    state.bridge.expiredConversationIds.includes(conversation.id)
  );

export const { addConversation, addMessageToConversation ,removeConversation  } = bridgeSlice.actions;

export default bridgeSlice.reducer;
