import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { MESSAGEREPORT, MESSAGEREPORTSUMMARY, ACTIVECONVOLIST, AGENTSSTATUSLIST,DASHBOARDSUMMERY,TEMPLATEINSIGHT} from '@/utils/apiConstants';

// Thunks

// Fetch Clients
export const fetchMessageReport = createAsyncThunk(
  'messagereport /fetchMessageReport',
  async ({clientId, fromDate, toDate, status, templateId, srcStr, pageSize,pageNo}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${MESSAGEREPORT}?ClientId=${clientId}&FromDate=${fromDate}&ToDate=${toDate}&Status=${status}&templateId=${templateId}&PageSize=${pageSize}&PageNo=${pageNo}&SearchStr=${srcStr}`);
      if (response?.status === 200 && response.data?.result) {
        return {
        messagereports: response.data.result,
        totalRecords: response.data.result.length > 0 ? response.data.result[0].totalItems : 0,
        };
      } else {
        throw new Error('Failed to fetch message report');
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
   
  }
);


export const fetchMessageReportSummary = createAsyncThunk(
    'messagereport /fetchMessageReportSummary',
    async ({clientId, fromDate, toDate, status, senderid, srcStr, pageNo, pageSize}, { rejectWithValue }) => {
      try {
        const response = await API.get(`${MESSAGEREPORTSUMMARY}?ClientId=${clientId}&SenderId=${senderid}&FromDate=${fromDate}&ToDate=${toDate}&CurrentStatus=${status}&SearchStr=${srcStr}&PageNo=${pageNo}&PageSize=${pageSize}`);  
        if (response?.status === 200 && response.data?.result) {
          const obj= JSON.stringify(response.data, 2);
         
          return {
            
            messagereportsummary: response.data.result,
            totalRecords: response.data.result.length > 0 ? response.data.result[0].totalItems : 0,
          };
        } else {
          throw new Error('Failed to fetch message report');
        }
      } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }

  }
);

export const fetchDashboardSummary = createAsyncThunk(
  'messagereport /fetchDashboardSummary',
  async ({clientId, fromDate, toDate, senderid}, { rejectWithValue }) => {
    try {
     
      const response = await API.get(`${DASHBOARDSUMMERY}?ClientId=${clientId}&SenderId=${senderid}&FromDate=${fromDate}&ToDate=${toDate}`);  
      if (response?.status === 200 && response.data?.result) {
       // const parseddata= JSON.parse(response.data, 2);
       
        return {
         
          dashboardsummary: response.data.result,
        };
      } else {
        throw new Error('Failed to fetch dashboard report');
      }
    } catch (err) {
    const handledError = handleError(err);
    return rejectWithValue(handledError);
  }
 
}
);
 
export const fetchTemplateInsight = createAsyncThunk(
  'messagereport /fetchTemplateInsight',
  async ({clientId, fromDate, toDate,TemplateId}, { rejectWithValue }) => {
    try {
     
      const response = await API.get(`${TEMPLATEINSIGHT}?ClientId=${clientId}&templateId=${TemplateId}&FromDate=${fromDate}&ToDate=${toDate}`);  
      if (response?.status === 200 && response.data?.result) {
       // const parseddata= JSON.parse(response.data, 2);
       
        return {
         
          templateInsight: response.data.result,
        };
      } else {
        throw new Error('Failed to fetch Template Insight ');
      }
    } catch (err) {
    const handledError = handleError(err);
    return rejectWithValue(handledError);
  }
 
}
);


export const fetchActiveConvo = createAsyncThunk(
    'activeconvo /fetchActiveConvo',
    async ({clientId, startDate, endDate, status}, { rejectWithValue }) => {
      try {
        const response = await API.get(`${ACTIVECONVOLIST}?ClientId=${clientId}&startDate=${startDate}&endDate=${endDate}&status=${status}`);  
        if (response?.status === 200 && response.data?.result) {
          const obj= JSON.stringify(response.data, 2);
         
          return {
            activeconvo: response.data.result,
          };
        } else {
          throw new Error('Failed to fetch message report');
        }
      } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }

  }
);


export const fetchAgentStatus = createAsyncThunk(
    'agentstatus /fetchAgentStatus',
    async ({ clientId, startDate, endDate, status}, { rejectWithValue }) => {
      try {
        //console.log('asd'+ searchString.length);
  
        const response = await API.get(`${AGENTSSTATUSLIST}?ClientId=${clientId}&startDate=${startDate}&endDate=${endDate}&status=${status}`);
        if (response?.status === 200 && response.data?.result) {
         
          return {
          agentstatus: response.data.result,
          };
          
        } else {
          throw new Error('Failed to fetch message report');
        }
      } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
     
  }
);


// Slice
const MessageReportSlice = createSlice({
  name: 'messagereport',
  initialState: {
    messagereports: [],
    messagereportsummary: [],
    templateInsight: [],
    activeconvo: [],
    agentstatus:[],
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
    clearMessageReportState: (state) => {
      state.messagereports = [];
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
    clearMessageReportState: (state) => {
      state.messagereports = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    
    clearMessageReportSummaryState: (state) => {
        state.messagereportsummary = [];
        state.loading = false;
        state.error = null;
        state.success = false;
        state.currentPage = 1;
        state.totalPages = 1;
        state.pageSize = 10;
        state.totalRecords = 0;
    },
    clearActiveConvoState: (state) =>{
        state.activeconvo = [];
        state.loading = false;
        state.error = null;
        state.success = false;
       
    },
    clearAgentStatuState: (state) =>{
        state.agentstatus = [];
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
        state.messagereports = action.payload.messagereports;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
      })
      .addCase(fetchMessageReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Fetch Message Report Summary
      .addCase(fetchMessageReportSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessageReportSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.messagereportsummary = action.payload.messagereportsummary;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
      })
      .addCase(fetchMessageReportSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
    

      //dashboard summery

      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardsummary = JSON.parse(action.payload.dashboardsummary); //action.payload.messagereportsummary;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
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
        state.message = action.payload.message || '';
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
        
        state.message = action.payload.message || '';
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
        state.message = action.payload.message || '';
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
  clearMessageReportState,
  clearMessageReportSummaryState,
} = MessageReportSlice.actions;

export default MessageReportSlice.reducer;
