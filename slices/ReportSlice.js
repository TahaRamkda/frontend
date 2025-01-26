import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.axios";
import handleError from "../utils/handleError";
import {
  MESSAGESUMMARY,
  MESSAGEREPORT,
  ACTIVECONVOLIST,
  AGENTSSTATUSLIST,
  DASHBOARDSUMMARY,
  TEMPLATEINSIGHT,
} from "@/utils/apiConstants";

// Thunks

// Fetch Clients
export const fetchMessageSummary = createAsyncThunk(
  "messagereport /fetchMessageSummary",
  async (
    {
      clientId,
      fromDate,
      toDate,
      status,
      templateId,
      srcStr,
      pageSize,
      pageNo,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.get(
        `${MESSAGESUMMARY}?FromDate=${fromDate}&ToDate=${toDate}&Status=${status}&templateId=${templateId}&PageSize=${pageSize}&PageNo=${pageNo}&SearchStr=${srcStr}`
      );
      if (response?.status === 200 && response.data?.result) {
        return {
          messageSummary: response.data.result,
          totalRecords:
            response.data.result.length > 0
              ? response.data.result[0].totalRecords
              : 0,
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

export const fetchMessageReport = createAsyncThunk(
  "messagereport /fetchMessageReport",
  async (
    {
      clientId,
      fromDate,
      toDate,
      moduleId,
      status,
      senderid,
      srcStr,
      pageNo,
      pageSize,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.get(
        `${MESSAGEREPORT}?ModuleId=${moduleId}&SenderId=${senderid}&FromDate=${fromDate}&ToDate=${toDate}&CurrentStatus=${status}&SearchStr=${srcStr}&PageNo=${pageNo}&PageSize=${pageSize}`
      );
      if (response?.status === 200 && response.data?.result) {
        const obj = JSON.stringify(response.data, 2);

        return {
          messagereport: response.data.result,
          totalRecords:
            response.data.result.length > 0
              ? response.data.result[0].totalRecords
              : 0,
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

export const fetchDashboardSummary = createAsyncThunk(
  "messagereport /fetchDashboardSummary",
  async ({ clientId, fromDate, toDate, senderid }, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `${DASHBOARDSUMMARY}?SenderId=${senderid}&FromDate=${fromDate}&ToDate=${toDate}`
      );
      if (response?.status === 200) {
        // const parseddata= JSON.parse(response.data, 2);

        return {
          dashboardsummary: response.data.result,
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

export const fetchTemplateInsight = createAsyncThunk(
  "messagereport /fetchTemplateInsight",
  async ({ clientId, fromDate, toDate, TemplateId }, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `${TEMPLATEINSIGHT}?templateId=${TemplateId}&FromDate=${fromDate}&ToDate=${toDate}`
      );
      if (response?.status === 200 && response.data?.result) {
        // const parseddata= JSON.parse(response.data, 2);

        return {
          templateInsight: response.data.result,
        };
      } else {
        throw new Error("Failed to fetch details ");
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);

export const fetchActiveConvo = createAsyncThunk(
  "activeconvo /fetchActiveConvo",
  async ({ clientId, startDate, endDate, status }, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `${ACTIVECONVOLIST}?startDate=${startDate}&endDate=${endDate}&status=${status}`
      );
      if (response?.status === 200 && response.data?.result) {
        const obj = JSON.stringify(response.data, 2);

        return {
          activeconvo: response.data.result,
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

export const fetchAgentStatus = createAsyncThunk(
  "agentstatus /fetchAgentStatus",
  async ({ clientId, startDate, endDate, status }, { rejectWithValue }) => {
    try {
      //console.log('asd'+ searchString.length);

      const response = await API.get(
        `${AGENTSSTATUSLIST}?startDate=${startDate}&endDate=${endDate}&status=${status}`
      );
      if (response?.status === 200 && response.data?.result) {
        return {
          agentstatus: response.data.result,
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
const reportSlice = createSlice({
  name: "messagereport",
  initialState: {
    messageSummary: [],
    messagereport: [],
    templateInsight: [],
    activeconvo: [],
    agentstatus: [],
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
    clearMessageReportState: (state) => {
      state.messagereport = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    clearDashboardReportState: (state) => {
      state.dashboardsummary = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },

    clearTemplateInsightState: (state) => {
      state.templateInsight = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearMessageSummaryState: (state) => {
      state.messageSummary = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },

    clearMessageReportState: (state) => {
      state.messagereport = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    clearActiveConvoState: (state) => {
      state.activeconvo = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearAgentStatuState: (state) => {
      state.agentstatus = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Message Report
      .addCase(fetchMessageReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessageReport.fulfilled, (state, action) => {
        state.loading = false;
        state.messagereport = action.payload.messagereport;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || "";
      })
      .addCase(fetchMessageReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Fetch Message Report Summary
      .addCase(fetchMessageSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessageSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.messageSummary = action.payload.messageSummary;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || "";
      })
      .addCase(fetchMessageSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      //dashboard summary

      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardsummary = JSON.parse(action.payload.dashboardsummary); //action.payload.messagereportsummary;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || "";
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      //Template Insight
      .addCase(fetchTemplateInsight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplateInsight.fulfilled, (state, action) => {
        state.loading = false;
        state.templateInsight = JSON.parse(action.payload.templateInsight); //action.payload.messagereportsummary;
        state.message = action.payload.message || "";
      })
      .addCase(fetchTemplateInsight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      .addCase(fetchActiveConvo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveConvo.fulfilled, (state, action) => {
        state.loading = false;
        state.activeconvo = action.payload.activeconvo;

        state.message = action.payload.message || "";
      })
      .addCase(fetchActiveConvo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      .addCase(fetchAgentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.agentstatus = action.payload.agentstatus;
        state.message = action.payload.message || "";
      })
      .addCase(fetchAgentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      });
  },
});

// Export actions
export const {
  setPageSize,
  setCurrentPage,
  clearActiveConvoState,
  clearDashboardReportState,
  clearTemplateInsightState,
  clearAgentStatuState,
  clearMessageSummaryState,
  clearMessageReportState,
} = reportSlice.actions;

export default reportSlice.reducer;
