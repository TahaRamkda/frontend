import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { CONVERSATIONLIST, CONVERSATIONMESSAGE ,AGENTMESSAGE} from '@/utils/apiConstants';

// Thunks


export const fetchConversationList = createAsyncThunk(
  'conversation/fetchConversationList',
  async ({clientId,AgentId}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${CONVERSATIONLIST}?clientId=${clientId}&agentId=${AgentId}`);
      if (response?.status === 200 && response.data?.result) {
        return {
          conversations: response.data.result,
          totalRecords: response.data.result.length > 0 ? response.data.result[0].total : 0,
        };
      } else {
        throw new Error('Failed to fetch details');
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);

export const fetchConversationMessage = createAsyncThunk(
    'conversation/fetchConversationMessage',
    async ({clientId,ChatId}, { rejectWithValue }) => {
      try {
        const response = await API.get(`${CONVERSATIONMESSAGE}?clientId=${clientId}&id=${ChatId}`);
        if (response?.status === 200 && response.data?.result) {
          return {
            conversationMessage: response.data.result,
            totalRecords: response.data.result.length > 0 ? response.data.result[0].total : 0,
          };
        } else {
          throw new Error('Failed to fetch details');
        }
      } catch (err) {
        const handledError = handleError(err);
        return rejectWithValue(handledError);
      }
    }
  );
  
  export const NewAgentMessage = createAsyncThunk(
    'conversation/NewAgentMessage',
    async (messageData, { rejectWithValue }) => {
      try {
        const response = await API.post(AGENTMESSAGE, messageData);
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );




// Slice
const conversationslice = createSlice({
  name: 'conversation',
  initialState: {
    conversations: [],
    conversationMessage: [],
    loading: false,
    error: null,
    success: false,
    message: '',
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalRecords: 0,
  },
  reducers: {
    // Pagination and reset actions
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearconversationstate: (state) => {
      state.conversations = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    clearConversationMessageState: (state) => {
        state.conversationMessage = [];
        state.loading = false;
        state.error = null;
        state.success = false;
        state.currentPage = 1;
        state.totalPages = 1;
        state.pageSize = 10;
        state.totalRecords = 0;
    },
    clearNewAgentMessageState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchConversationList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationList.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.conversations;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
      })
      .addCase(fetchConversationList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      
      .addCase(fetchConversationMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationMessage = action.payload.conversationMessage;
        state.message = action.payload?.message || '';
      })
      .addCase(fetchConversationMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
       .addCase(NewAgentMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
       })
      .addCase(NewAgentMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
       })
      .addCase(NewAgentMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
        })
  },
});

// Export actions
export const {
  setPageSize,
  setCurrentPage,
  clearConversationMessageState,
  clearconversationstate,
} = conversationslice.actions;

export default conversationslice.reducer;
