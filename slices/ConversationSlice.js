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
  async ({ clientId, ChatId, pageNo = 1 }, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `${CONVERSATIONMESSAGE}?clientId=${clientId}&id=${ChatId}&pageNo=${pageNo}&pageSize=15`
      );
      if (response?.status === 200 && response.data?.result) {
        return {
          conversationMessage: response.data.result,
          totalRecords: response.data.result.length > 0 ? response.data.result[0].totalRecords  : 0,
          pageNo,
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
    messages: [],
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
    resetMessages: (state) => {
      
      state.messages = [];
      state.currentPage = 1;
      state.hasMore = true;
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
      })
      .addCase(fetchConversationMessage.fulfilled, (state, { payload }) => {
        
        const { conversationMessage, totalRecords, pageNo } = payload;

        // Append or prepend messages based on page number
        if (pageNo >= state.currentPage) {
          state.messages = [...conversationMessage,...state.messages];
        } else if (pageNo < state.currentPage) {
          state.messages = [...conversationMessage, ...state.messages];
        }

        state.totalRecords = totalRecords;
        state.currentPage = pageNo;
        state.hasMore = state.messages.length < totalRecords;
        state.loading = false;
      })
      .addCase(fetchConversationMessage.rejected, (state) => {
        state.loading = false;
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
  resetMessages ,
  setCurrentPage,
  clearConversationMessageState,
  clearconversationstate,
} = conversationslice.actions;

export default conversationslice.reducer;
