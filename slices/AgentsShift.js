import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { AGENTSSHIFT, CREATEAGENTSHIFT, AGENTSHIFTDETAILS, UPDATEAGENTSHIFT, DELETEAGENTSHIFT } from '@/utils/apiConstants';


// Thunks

// Fetch Clients
export const fetchAgentShiftList = createAsyncThunk(
  'agent/fetchAgentsShift',
  async ({clientId, searchStr,senderId,pageSize,pageNo}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${AGENTSSHIFT}?${searchStr?`searchStr=${searchStr}`:''}&senderId=${senderId}&pageNo=${pageNo}&pageSize=${pageSize}`);
      if (response?.status === 200 && response.data?.result) {
        return {
          agentsShift: response.data.result,
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








export const createAgentsShift = createAsyncThunk(
  'agent/createAgentsShift',
  async (agentTimingData, { rejectWithValue }) => {
    try {
      const response = await API.post(CREATEAGENTSHIFT, agentTimingData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Fetch Client by ID
export const fetchAgentsShiftById = createAsyncThunk(
  'agent/fetchAgentsShiftById',
  async ({agentId,clientId}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${AGENTSHIFTDETAILS}?agentId=${agentId}`);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);


// Update Client
export const updateAgentsShift = createAsyncThunk(
  'agent/updateAgentsShift',
  async (agentShiftData, { rejectWithValue }) => {
    try {
      const response = await API.put(UPDATEAGENTSHIFT, agentShiftData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Delete Client
export const deleteAgentShift = createAsyncThunk(
  'agent/deleteAgent',
  async ({ agentShiftId, onSuccess }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`${DELETEAGENTSHIFT}?Id=${agentShiftId}`);
      if (onSuccess) onSuccess(); // Handle success callback
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Slice
const agentShiftSlice = createSlice({
  name: 'agent',
  initialState: {
    agentShiftList: [],
    agentShift: null,
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
    clearAgentShiftState: (state) => {
      state.agentShiftList = [];
      state.agentShift = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    
    clearAgentShiftDetailState: (state) => {
      state.agentShift = null;
      state.loading = false;
      state.error = null;
    },
    clearAgentShiftCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    
    clearAgentShiftDeleteState: (state) => {
      state.agentShift = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchAgentShiftList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentShiftList.fulfilled, (state, action) => {
        state.loading = false;
        state.agentShiftList = action.payload.agentShiftList;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
      })
      .addCase(fetchAgentShiftList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      

    
      .addCase(fetchAgentsShiftById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentsShiftById.fulfilled, (state, action) => {
        state.loading = false;
        state.agentShift = action.payload.result;
        state.message = action.payload?.message || '';
      })
      .addCase(fetchAgentsShiftById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

     
      .addCase(createAgentsShift.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAgentsShift.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Updated Successfully';
      })
      .addCase(createAgentsShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      

      
      .addCase(updateAgentsShift.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAgentsShift.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Updated Successfully';
      })
      .addCase(updateAgentsShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      
      .addCase(deleteAgentShift.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteAgentShift.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Deleted Successfully';
      })
      .addCase(deleteAgentShift.rejected, (state, action) => {
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
  clearAgentShiftCreateState,
  clearAgentShiftDeleteState,
  clearAgentShiftDetailState,
  clearAgentShiftState,
} = agentShiftSlice.actions;

export default agentShiftSlice.reducer;
