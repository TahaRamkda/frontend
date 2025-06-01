import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { CHATSMONITOR, AGENTSMONITOR,AGENTDISABLE, SENDCLOSECHATTEMPLATE} from '@/utils/apiConstants';

// Fetch Clients
export const fetchChatsMonitor = createAsyncThunk(
    'chatsmonitor /fetchChatsMonitor',
    async ({status, pageSize,pageNo,senderId,srcStr,fChatInitiated,agentId}, { rejectWithValue }) => {
      try {
         const response = await API.post("/api", {
        endpoint: `${CHATSMONITOR}?senderId=${senderId}&agentId=${agentId}${srcStr? `&searchStr=${srcStr}`: ''}&status=${status}&fChatInitiated=${fChatInitiated}&pageSize=${pageSize}&pageNo=${pageNo}`,
        method: "GET",
        //payload: {},
      });
        if (response?.status === 200 ) {
          return {
          chatsMonitorList: response.data,
          totalRecords: response.data.length > 0 ? response.data[0].totalRecords : 0,
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
    async ({clientId, fromDate, toDate, senderId, srcStr,}, { rejectWithValue }) => {
      try {
        const response = await API.post("/api", {
        endpoint: `${AGENTSMONITOR}?senderId=${senderId}${srcStr? `&searchStr=${srcStr}`:''}`,
        method: "GET",
        //payload: {},
      });
        if (response?.status === 200 ) {
          return {
          agentsMonitorList: response.data,
          totalRecords: response.data.length > 0 ? response.data[0].totalRecords : 0,
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
  
  export const agentDisable = createAsyncThunk(
    'agent/agentDisable',
    async ({agentId, disable,clientId}, { rejectWithValue }) => {
      try {
         const response = await API.post("/api", {
        endpoint: `${AGENTDISABLE}?agentId=${agentId}&disable=${disable}`,
        method: "GET",
        //payload: {},
      });
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );
  
  export const SupervisorCloseChat = createAsyncThunk(
    'chat/sendCloseChatTemplate',
    async (ChatId, { rejectWithValue }) => {
      try {
        const response = await API.post("/api", {
        endpoint: `${SENDCLOSECHATTEMPLATE}?id=${ChatId}`,
        method: "GET",
        //payload: {},
      });
      
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );

  // Slice
const Supervisor = createSlice({
    name: 'messagereport',
    initialState: {
      chatsMonitorList:[],
      agentsMonitorList: [],
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
            state.chatsMonitorList = [];
            state.loading = false;
            state.error = null;
            state.success = false;
            state.currentPage = 1;
            state.totalPages = 1;
            state.pageSize = 10;
            state.totalRecords = 0;
          }, 
       
        clearAgentMonitorState: (state) => {
            state.agentsMonitorList = [];
            state.loading = false;
            state.error = null;
            state.success = false;
            state.currentPage = 1;
            state.totalPages = 1;
            state.pageSize = 10;
            state.totalRecords = 0;
          }, 
          clearAgentDisableState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
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
                state.agentsMonitorList = action.payload.agentsMonitorList;
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
                state.chatsMonitorList = action.payload.chatsMonitorList;
                state.totalRecords = action.payload.totalRecords;
                state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
                state.message = action.payload.message || '';
              })
              .addCase(fetchChatsMonitor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.message = action.payload?.message || action.error.message;
              })

              .addCase(agentDisable.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
              })
              .addCase(agentDisable.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message || 'Updated Successfully';
              })
              .addCase(agentDisable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                state.message = action.payload?.message || action.error.message;
              })
              
              
                    // Close Chat
                    .addCase(SupervisorCloseChat.pending, (state) => {
                      state.loading = true;
                      state.error = null;
                      state.success = false;
                    })
                    .addCase(SupervisorCloseChat.fulfilled, (state, action) => {
                      state.loading = false;
                      state.success = true;
                      state.message = action.payload.message || 'Closed Successfully';
                    })
                    .addCase(SupervisorCloseChat.rejected, (state, action) => {
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
  clearAgentDisableState,
  clearConversationMonitorState,
  clearChatsMonitorState,
} = Supervisor.actions;

export default Supervisor.reducer;        