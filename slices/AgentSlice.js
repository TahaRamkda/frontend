import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { AGENTLIST, AGENTDETAILS, CREATEAGENT, DELETEAGENT, UPDATEAGENT, AGENTSTIMINGLIST, ADDAGENTSTIMING, AGENTDROPDOWN ,GETAGENTSTATS } from '@/utils/apiConstants';


// Thunks

// Fetch Clients
export const fetchAgents = createAsyncThunk(
  'agent/fetchAgents',
  async ({clientId, searchStr,senderId,pageSize,pageNo}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${AGENTLIST}?ClientId=${clientId}${searchStr?`&searchStr=${searchStr}`:''}&senderId=${senderId}&pageNo=${pageNo}&pageSize=${pageSize}`);
      if (response?.status === 200 && response.data?.result) {
        return {
          agents: response.data.result,
          totalRecords: response.data.result.length > 0 ? response.data.result[0].totalRecords  : 0,
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


export const fetchAgentsDrop = createAsyncThunk(
  'agent/fetchAgentsDrop',
  async ({clientId,senderId,pageNo,pageSize,searchStr}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${AGENTDROPDOWN}?ClientId=${clientId}&senderId=${senderId}${searchStr?`&searchStr=${searchStr}`: ''}`);
      if (response?.status === 200 && response.data?.result) {
        return {
          agentDrop: response.data.result,
         
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


export const fetchAgentsTimingList = createAsyncThunk(
  'agent/fetchAgentsTimingList',
  async ({clientId, agentId, senderId, pageNo, pageSize}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${AGENTSTIMINGLIST}?ClientId=${clientId}&agentId=${agentId}`);
      if (response?.status === 200 && response.data?.result) {
        return {
          agentsTiming: response.data.result,
          totalRecords: response.data.result.length > 0 ? response.data.result[0].totalRecords  : 0,
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


export const fetchAgentStats = createAsyncThunk(
  'agent/fetchAgentStats',
  async ({clientId = localStorage.getItem("clientId"), agentId = localStorage.getItem("userId"),senderId = 0}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${GETAGENTSTATS}?clientId=${clientId}&senderId=${senderId}&agentId=${agentId}`);
      if (response?.status === 200 && response.data?.result) {
        return {
          AgentStats: response.data.result,
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




export const createAgentTiming = createAsyncThunk(
  'agent/createAgentTiming',
  async (agentTimingData, { rejectWithValue }) => {
    try {
      const response = await API.post(ADDAGENTSTIMING, agentTimingData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);
// Fetch Client by ID
export const fetchAgentsById = createAsyncThunk(
  'agent/fetchAgentsById',
  async ({agentId,clientId}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${AGENTDETAILS}?clientId=${clientId}&agentId=${agentId}`);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Create Client
export const createAgent = createAsyncThunk(
  'agent/createAgent',
  async (agentData, { rejectWithValue }) => {
    try {
      const response = await API.post(CREATEAGENT, agentData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);


// Update Client
export const updateAgent = createAsyncThunk(
  'agent/updateAgent',
  async (agentData, { rejectWithValue }) => {
    try {
      const response = await API.put(UPDATEAGENT, agentData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Delete Client
export const deleteAgent = createAsyncThunk(
  'agent/deleteAgent',
  async ({ agentId, onSuccess }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`${DELETEAGENT}?Id=${agentId}`);
      if (onSuccess) onSuccess(); // Handle success callback
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Slice
const agentSlice = createSlice({
  name: 'agent',
  initialState: {
    agents: [],
    agentDrop:[],
    agentsTiming: [],
    AgentStats: [],
    agent: null,
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
    cleaAgentState: (state) => {
      state.agents = [];
      state.agent = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    cleaAgenDroptState: (state) => {
      state.agentDrop = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      
    },
    clearAgentsTimingListState: (state) => {
      state.agentsTiming = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    cleaAgentStats: (state) => {
      state.AgentStats = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearAgentTimingCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearAgentDetailState: (state) => {
      state.agent = null;
      state.loading = false;
      state.error = null;
    },
    clearAgentCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    
    clearAgentDeleteState: (state) => {
      state.agent = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload.agents;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      // Agents Dropdown
      .addCase(fetchAgentsDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentsDrop.fulfilled, (state, action) => {
        state.loading = false;
        state.agentDrop = action.payload.agentDrop;
        state.message = action.payload.message || '';
      })
      .addCase(fetchAgentsDrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Fetch Agents Timing List
      .addCase(fetchAgentsTimingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentsTimingList.fulfilled, (state, action) => {
        state.loading = false;
        state.agentsTiming = action.payload.agentsTiming; // Correct payload key
        state.message = action.payload.message || '';
      })
      .addCase(fetchAgentsTimingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })


      .addCase(fetchAgentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.AgentStats = action.payload.AgentStats; // Correct payload key
        state.message = action.payload.message || '';
      })
      .addCase(fetchAgentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })




      .addCase(createAgentTiming.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAgentTiming.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Created Successfully';
      })
      .addCase(createAgentTiming.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Fetch Client by ID
      .addCase(fetchAgentsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentsById.fulfilled, (state, action) => {
        state.loading = false;
        state.agent = action.payload.result;
        state.message = action.payload?.message || '';
      })
      .addCase(fetchAgentsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Create Client
      .addCase(createAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAgent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Updated Successfully';
      })
      .addCase(createAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      

      // Update Client
      .addCase(updateAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAgent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Updated Successfully';
      })
      .addCase(updateAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Delete Client
      .addCase(deleteAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteAgent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Deleted Successfully';
      })
      .addCase(deleteAgent.rejected, (state, action) => {
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
  cleaAgentState,
  clearAgentDetailState,
  clearAgentCreateState,
  cleaAgentStats,
  clearAgentDeleteState,
  cleaAgenDroptState,
  clearAgentTimingCreateState,
  clearAgentsTimingListState,
} = agentSlice.actions;

export default agentSlice.reducer;
