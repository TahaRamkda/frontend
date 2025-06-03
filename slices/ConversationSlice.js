import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.axios";
import handleError from "../utils/handleError";
import {
  CONVERSATIONLIST,
  CONVERSATIONMESSAGE,
  AGENTMESSAGE,
  SENDAGENTINTERACTIVETEMPLATLIS,
  TRANSFERCHAT,
} from "@/utils/apiConstants";

// Thunks

export const fetchConversationList = createAsyncThunk(
  "conversation/fetchConversationList",
  async ({ clientId, AgentId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${CONVERSATIONLIST}?agentId=${AgentId}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          conversationList: response.data,
          totalRecords:
            response.data.length > 0 ? response.data[0].totalRecords : 0,
        };
      } else {
        throw new Error("Failed to fetch details");
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);

export const fetchConversationMessage = createAsyncThunk(
  "conversation/fetchConversationMessage",
  async ({ clientId, ChatId, pageNo = 0 }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${CONVERSATIONMESSAGE}?id=${ChatId}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          conversationMessage: response.data,
          totalRecords:
            response.data.length > 0 ? response.data[0].totalRecords : 0,
          pageNo,
        };
      } else {
        throw new Error("Failed to fetch details");
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);

export const NewAgentMessage = createAsyncThunk(
  "conversation/NewAgentMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      messageData.append("endpoint", `${AGENTMESSAGE}`);
      messageData.append("method", "POST");

      const response = await API.post("/formData", messageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

export const SendInteractivetemp = createAsyncThunk(
  "conversation/SendInteractivetemp",
  async (templatedata, { rejectWithValue }) => {
    try {
      templatedata.append("endpoint", `${SENDAGENTINTERACTIVETEMPLATLIS}`);
      templatedata.append("method", "POST");

      const response = await API.post("/formData", templatedata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

export const Transferchat = createAsyncThunk(
  "conversation/Transferchat",
  async (
    { clientId, AgentId, ChatId, Comment, oldAgentId },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${TRANSFERCHAT}?oldAgentId=${oldAgentId}&agentId=${AgentId}&id=${ChatId}&Comment=${Comment}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return response.data; // Pass API response to fulfilled reducer
      } else {
        throw new Error("Failed to transfer chat");
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);

export const fetchConversationMessageReport = createAsyncThunk(
  "conversation/fetchConversationMessageReport",
  async ({ clientId, ChatId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${CONVERSATIONMESSAGE}?id=${ChatId}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200 && response.data) {
        return {
          conversationMessagereport: response.data,
        };
      } else {
        throw new Error("Failed to fetch details");
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);

// Slice
const conversationslice = createSlice({
  name: "conversation",
  initialState: {
    conversationList: [],
    messages: [],
    conversationMessagereport: [],
    conversationMessage: [],
    loading: false,
    error: null,
    success: false,
    message: "",
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
      state.conversationList = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },

    clearMessagesReportState: (state) => {
      state.conversationMessagereport = [];
      state.loading = false;
      state.error = null;
      state.success = false;
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
    clearAgentTemplateSentState: (state) => {
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
        state.conversationList = action.payload.conversationList;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || "";
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

        // Append messages if loading next page
        if (pageNo > state.currentPage) {
          state.messages = [...state.messages, ...conversationMessage];
        } else if (pageNo === 1) {
          // On first page or reset, replace all messages
          state.messages = [...conversationMessage];
        }

        state.totalRecords = totalRecords;
        state.currentPage = pageNo;

        // Determine if more messages can be fetched
        state.hasMore = state.messages.length < totalRecords;
        state.loading = false;
      })

      .addCase(fetchConversationMessage.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchConversationMessageReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversationMessageReport.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationMessagereport =
          action.payload.conversationMessagereport.reverse();

        state.message = action.payload.message || "";
      })

      .addCase(fetchConversationMessageReport.rejected, (state) => {
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
      .addCase(SendInteractivetemp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(SendInteractivetemp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(SendInteractivetemp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      .addCase(Transferchat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Transferchat.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message =
          action.payload?.message || "Chat transferred successfully!";
      })
      .addCase(Transferchat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      });
  },
});

// Export actions
export const {
  setPageSize,
  resetMessages,
  setCurrentPage,
  clearConversationMessageState,
  clearconversationstate,
  clearMessagesReportState,
  clearAgentTemplateSentState,
} = conversationslice.actions;

export default conversationslice.reducer;
