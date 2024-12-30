import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { CHATSMONITOR, AGENTSMONITOR} from '@/utils/apiConstants';

// Fetch Clients
export const fetchChatsMonitor = createAsyncThunk(
    'chatsmonitor /fetchChatsMonitor',
    async ({clientId, pageSize,pageNo,senderId}, { rejectWithValue }) => {
      try {
        const response = await API.get(`${CHATSMONITOR}?clientId=${clientId}&senderId=${senderId}&pageSize=${pageSize}&pageNo=${pageNo}`);
        if (response?.status === 200 && response.data?.result) {
          return {
          chatsMonitor: response.data.result,
          totalRecords: response.data.result.length > 0 ? response.data.result[0].totalItems : 0,
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
  
export const fetchAgentsMonitor = createAsyncThunk(
    'agentmonitor/fetchAgentsMonitor',
    async ({clientId, fromDate, toDate, status, templateId, srcStr, pageSize,pageNo}, { rejectWithValue }) => {
      try {
        const response = await API.get(`${AGENTSMONITOR}?ClientId=${clientId}&FromDate=${fromDate}&ToDate=${toDate}&Status=${status}&PageSize=${pageSize}&PageNo=${pageNo}&SearchStr=${srcStr}`);
        if (response?.status === 200 && response.data?.result) {
          return {
          agentsMonitor: response.data.result,
          totalRecords: response.data.result.length > 0 ? response.data.result[0].totalItems : 0,
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
  

  // Slice
const Supervisor = createSlice({
    name: 'messagereport',
    initialState: {
      chatsMonitor:[],
      agentsMonitor: [],
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
      setPageSize: (state, action) => {
        state.pageSize = action.payload;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
      },
      setCurrentPage: (state, action) => {
        state.currentPage = action.payload;
      },
        clearChatsMonitorState: (state) => {
            state.chatsMonitor = [];
            state.loading = false;
            state.error = null;
            state.success = false;
            state.currentPage = 1;
            state.totalPages = 1;
            state.pageSize = 10;
            state.totalRecords = 0;
          }, 
        clearAgentMonitorState: (state) => {
            state.agentsMonitor = [];
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
              // Fetch Message Report
              .addCase(fetchAgentsMonitor.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(fetchAgentsMonitor.fulfilled, (state, action) => {
                state.loading = false;
                state.agentsMonitor = action.payload.agentsMonitor;
                state.totalRecords = action.payload.totalRecords;
                state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
                state.message = action.payload.message || '';
              })
              .addCase(fetchAgentsMonitor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.message = action.payload?.message || action.error.message;
              })
              .addCase(fetchChatsMonitor.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(fetchChatsMonitor.fulfilled, (state, action) => {
                state.loading = false;
                state.chatsMonitor = action.payload.chatsMonitor;
                state.totalRecords = action.payload.totalRecords;
                state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
                state.message = action.payload.message || '';
              })
              .addCase(fetchChatsMonitor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.message = action.payload?.message || action.error.message;
              });
            },
        });
export const {
  setPageSize,
  setCurrentPage,
  clearAgentMonitorState,
  clearChatsMonitorState,
} = Supervisor.actions;

export default Supervisor.reducer;        