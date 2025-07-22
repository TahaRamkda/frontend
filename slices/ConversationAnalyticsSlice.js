import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.axios";
import handleError from "@/utils/handleError";
import { CONVERSATIONANALYTICS } from "@/utils/apiConstants";
import { create } from "axios";

export const fetchConversationAnalytics = createAsyncThunk(
  "conversation/fetchConversationAnalytics",
  async (
    { senderId, pageSize, pageNo, fromDate, toDate },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${CONVERSATIONANALYTICS}?senderId=${senderId}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}`,
        method: "GET",
      });
      if (response?.status === 200) {
        return {
          conversationAnalyticList: response.data,
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

const conversationAnalyticsSlice = createSlice({
  name: "conversation",
  initialState: {
    conversationAnalyticList: [],
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalRecords: 0,
  },
  reducers: {
     setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    cleaConversationAnalyticsState: (state) => {
      state.conversationAnalyticList = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Agents
      .addCase(fetchConversationAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationAnalyticList = action.payload.conversationAnalyticList;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
      })
      .addCase(fetchConversationAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      });
  },
});
export const {
  cleaConversationAnalyticsState,
  setCurrentPage,
  setPageSize
} = conversationAnalyticsSlice.actions;

export default conversationAnalyticsSlice.reducer;
