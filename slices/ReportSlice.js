import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.axios";
import handleError from "../utils/handleError";
import {
  MESSAGESUMMARY,
  MESSAGEREPORT,
  DASHBOARDSUMMARY,
  TEMPLATEINSIGHT,
  CONVERSATIONREPORT,
  SUPERVISORDASHBOARD,
  AGENTREPORT,
  CHATREPORTSTATS,
  CHATREPORTLOGS,
  SURVEYDROPDOWN
} from "@/utils/apiConstants";

// Thunks

// Fetch Message Summary
export const fetchMessageSummary = createAsyncThunk(
  "messagesummary /fetchMessageSummary",
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
      const response = await API.post("/api", {
        endpoint: `${MESSAGESUMMARY}?FromDate=${fromDate}&ToDate=${toDate}&Status=${status}&templateId=${templateId}&PageSize=${pageSize}&PageNo=${pageNo}&SearchStr=${srcStr}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          messageSummary: response.data.data.result,
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

// Fetch Message Report
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
       const response = await API.post("/api", {
        endpoint: `${MESSAGEREPORT}?ModuleId=${moduleId}&SenderId=${senderid}&FromDate=${fromDate}&ToDate=${toDate}&CurrentStatus=${status}&SearchStr=${srcStr}&PageNo=${pageNo}&PageSize=${pageSize}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        const obj = JSON.stringify(response.data, 2);

        return {
          messagereport: response.data.data.result,
          totalRecords:
            response.data.data.result.length > 0
              ? response.data.data.result[0].totalRecords
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

// Fetch Conversation Report
export const fetchConversationReport = createAsyncThunk(
  "conversationreport /fetchConversationReport",
  async (
    {
      status,
      pageSize,
      pageNo,
      senderId,
      FromDate,
      ToDate,
      agentId,
      srcStr,
      fChatInitiated,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${CONVERSATIONREPORT}?senderId=${senderId}${
          srcStr ? `&searchStr=${srcStr}` : ""}&status=${status}&agentId=${agentId}&pageSize=${pageSize}&pageNo=${pageNo}&ToDate=${ToDate}&FromDate=${FromDate}&fChatInitiated=${fChatInitiated}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200 && response.data.data.result) {
        return {
          ConversationReport: response.data.data.result,
          totalRecords:
            response.data.data.result.length > 0
              ? response.data.data.result[0].totalRecords
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

// Fetch Supervisor Dashboard
export const fetchSupervisorDashboard = createAsyncThunk(
  "supervisordashboard /fetchSupervisorDashboard",
  async ({ senderid }, { rejectWithValue }) => {
    try {
       const response = await API.post("/api", {
        endpoint: `${SUPERVISORDASHBOARD}?SenderId=${senderid}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        // const parseddata= JSON.parse(response.data, 2);

        return {
          supervisorDashboard: response.data.data.result,
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

// Fetch Chat Logs
export const fetchChatLogs = createAsyncThunk(
  "chatlogs /fetchChatLogs",
  async ({ conversationId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint:`${CHATREPORTLOGS}?conversationId=${conversationId}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200 && response.data?.data.result) {
        return {
          chatLogs: response.data.data.result,
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

// Fetch Agent Report
export const fetchAgentReport = createAsyncThunk(
  "agentreport /fetchAgentReport",
  async (
    { status, pageSize, pageNo, senderId, FromDate, ToDate, srcStr },
    { rejectWithValue }
  ) => {
    try {
      
      const response = await API.post("/api", {
        endpoint:  `${AGENTREPORT}?pageSize=${pageSize}&senderId=${senderId}${srcStr ? `&searchStr=${srcStr}` : ""}&pageNo=${pageNo}&ToDate=${ToDate}&FromDate=${FromDate}`,
        method: "GET",
        //payload: {},
      });
      
      if (response?.status === 200 && response.data?.data.result) {
        return {
          AgentReportList: response.data.data.result,
          totalRecords:
            response.data.data.result.length > 0
              ? response.data.data.result[0].totalRecords
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

// Fetch Chat Report Stats
export const fetchChatReportStats = createAsyncThunk(
  "chatreportstats /fetchChatReportStats",

  async (
    {
      pageSize,
      pageNo,
      senderId,
      FromDate,
      ToDate,
      srcStr,
      agentId,
      fChatInitiated,
    },
    { rejectWithValue }
  ) => {
    try {
       const response = await API.post("/api", {
        endpoint: `${CHATREPORTSTATS}?pageSize=${pageSize}&senderId=${senderId}${srcStr ? `&searchStr=${srcStr}` : ""}&fChatInitiated=${fChatInitiated}&pageNo=${pageNo}&ToDate=${ToDate}&FromDate=${FromDate}&agentId=${agentId}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200 && response.data?.data.result) {
        return {
          chatReportStats: response.data.data.result,
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

// Fetch Dashboard Summary
export const fetchDashboardSummary = createAsyncThunk(
  "dashboardsummary /fetchDashboardSummary",
  async ({ clientId, fromDate, toDate, senderid }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${DASHBOARDSUMMARY}?SenderId=${senderid}&FromDate=${fromDate}&ToDate=${toDate}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        // const parseddata= JSON.parse(response.data, 2);

        return {
          dashboardsummary: response.data.data.result,
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

// Fetch Template Insight
export const fetchTemplateInsight = createAsyncThunk(
  "templateinsight /fetchTemplateInsight",
  async ({ clientId, fromDate, toDate, TemplateId }, { rejectWithValue }) => {
    try {
      
      const response = await API.post("/api", {
        endpoint: `${TEMPLATEINSIGHT}?templateId=${TemplateId}&FromDate=${fromDate}&ToDate=${toDate}`,
        method: "GET",
        //payload: {},
      });
      
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

export const fetchSurveyDropdown = createAsyncThunk(
  "survey /fetchSurveyDropdown",
  async ({  }, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `${SURVEYDROPDOWN}`
      );
      if (response?.status === 200 && response.data?.result) {
        return {
          SurveyDropdown: response.data.result,
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
  name: "report",
  initialState: {
    messageSummary: [],
    messagereport: [],
    templateInsight: [],
    ConversationReport: [],
    supervisorDashboard: [],
    AgentReportList: [],
    chatReportStats: [],
    SurveyDropdown:[],
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
    clearSupervisorDashboardState: (state) => {
      state.supervisorDashboard = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearDashboardReportState: (state) => {
      state.dashboardsummary = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearChatLogsState: (state) => {
      state.chatLogs = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearChatReportStatsState: (state) => {
      state.chatReportStats = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },

    clearConversationReportState: (state) => {
      state.ConversationReport = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    clearAgentReportState: (state) => {
      state.AgentReportList = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
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
    clearSurveyDropdownState: (state) => {
      state.SurveyDropdown = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    }
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

      // Fetch Chat Logs
      .addCase(fetchChatLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.chatLogs = action.payload.chatLogs;
        state.message = action.payload.message || "";
      })
      .addCase(fetchChatLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Chats Report
      .addCase(fetchConversationReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationReport.fulfilled, (state, action) => {
        state.loading = false;
        state.ConversationReport = action.payload.ConversationReport;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || "";
      })
      .addCase(fetchConversationReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Agents Report
      .addCase(fetchAgentReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentReport.fulfilled, (state, action) => {
        state.loading = false;
        state.AgentReportList = action.payload.AgentReportList;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || "";
      })
      .addCase(fetchAgentReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      //dashboard Summary
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

      // Supervisor Dashboard
      .addCase(fetchSupervisorDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupervisorDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.supervisorDashboard = JSON.parse(
          action.payload.supervisorDashboard
        ); //action.payload.messagereportsummary
        state.message = action.payload.message || "";
      })
      .addCase(fetchSupervisorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Chat Report Stats
      .addCase(fetchChatReportStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatReportStats.fulfilled, (state, action) => {
        state.loading = false;
        state.chatReportStats = action.payload.chatReportStats; //action.payload.messagereportsummary;
        state.message = action.payload.message || "";
      })
      .addCase(fetchChatReportStats.rejected, (state, action) => {
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

      // Fetch Survey Dropdown
      .addCase(fetchSurveyDropdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSurveyDropdown.fulfilled, (state, action) => {
        state.loading = false;
        state.SurveyDropdown = JSON.parse(action.payload.SurveyDropdown); //action.payload.messagereportsummary;
        state.message = action.payload.message || "";
      })
      .addCase(fetchSurveyDropdown.rejected, (state, action) => {
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
  clearDashboardReportState,
  clearTemplateInsightState,
  clearConversationReportState,
  clearMessageSummaryState,
  clearSupervisorDashboardState,
  clearMessageReportState,
  clearChatReportStatsState,
  clearSurveyDropdownState,
  clearAgentReportState,
  clearChatLogsState,
} = reportSlice.actions;

export default reportSlice.reducer;
