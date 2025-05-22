import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { FLOWSLIST, FLOWDETAILS,CREATEFLOW, UPDATEFLOW, DELETEFLOW, FLOWDROPDOWN ,PUBLISHFLOW} from '@/utils/apiConstants';

// Thunks
// Fetch Group
export const fetchFlowsListData = createAsyncThunk(
    'flow/fetchFlowsListData',
    async ({clientId, pageNo, pageSize, SearchStr,senderId, Language}, { rejectWithValue }) => {
      try {
        //const response = await API.get(`${FLOWSLIST}?senderid=${senderId}&lang=${Language}&PageNo=${pageNo}&PageSize=${pageSize}${ SearchStr? `&SearchStr=${SearchStr}`:''}`);
         const response = await API.post("/api", {
        endpoint: `${FLOWSLIST}?senderid=${senderId}&lang=${Language}&PageNo=${pageNo}&PageSize=${pageSize}${ SearchStr? `&SearchStr=${SearchStr}`:''}`,
        method: "GET",
        //payload: {},
      });
        if (response?.status === 200) {
          return {
            flowsList: response.data.data.result,
            totalRecords: response.data.data.result.length > 0 ? response.data.data.result[0].totalRecords  : 0,
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

export const fetchFlowDropdown = createAsyncThunk(
    'flowdropdown/fetchFlowDropdown',
    async ({clientId, SearchStr}, { rejectWithValue }) => {
      try {
         const response = await API.post("/api", {
        endpoint: `${FLOWDROPDOWN}`,
        method: "GET",
        //payload: {},
      });
        if (response?.status === 200) {
          return {
            flowDropdownData: response.data.data.result,
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

// Fetch Group by ID
export const fetchFlowDetailsById = createAsyncThunk(
    'flowdetails/fetchFlowDetailsById',
    async ({id}, { rejectWithValue }) => {
      try {
         const response = await API.post("/api", {
        endpoint: `${FLOWDETAILS}?flowId=${id}`,
        method: "GET",
        //payload: {},
      });
        return response.data.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );

  // Create Group
export const createFlows = createAsyncThunk(
  'flowcreate/createFlows',
  async (flowData, { rejectWithValue }) => {
    try {
         const response = await API.post("/api", {
                endpoint: `${CREATEFLOW}`,
                method: "POST",
                payload: flowData,
              });
              debugger
      return response.data.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

export const publishFlow = createAsyncThunk(
  'publishflow/publishFlow',
  async (id, { rejectWithValue }) => {
    try {
       const response = await API.post("/api", {
                endpoint: `${PUBLISHFLOW}?flowId=${id}`,
                method: "POST",
                payload: '',
              });
      if(response.data.data.result === null){
        throw new Error(response.data.data.message);
      }else{
        return response.data.data;
      }
      
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);


// Update Group
export const updateFlow = createAsyncThunk(
    'flowupdate/updateFlow',
    async (flowData, { rejectWithValue }) => {
      try {
        debugger
         const response = await API.post("/api", {
                endpoint: `${UPDATEFLOW}`,
                method: "PUT",
                payload: flowData,
              });
              debugger
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );
// Delete Flow
  export const deleteFlow = createAsyncThunk(
  'flowdelete/deleteFlow',
  async ({ id, onSuccess }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${DELETEFLOW}?flowId=${id}`,
        method: "DELETE",
      });

      if (onSuccess) onSuccess();
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Slice
const FlowSlice = createSlice({
  name: 'flow',
  initialState: {
    flowsList: [],
    flowDropdownData:[],
    flow: null,
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
    clearFlowListState: (state) => {
      state.flowsList = [];
      state.flow = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    clearFlowDropdownState: (state) => {
      state.flowDropdownData = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearFlowPublishState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    
    clearFlowDetailState: (state) => {
      state.flow = null;
      state.loading = false;
      state.error = null;
    },
    clearFlowCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearFlowDeleteState: (state) => {
      state.flow = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchFlowsListData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlowsListData.fulfilled, (state, action) => {
        state.loading = false;
        state.flowsList = action.payload.flowsList;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
      })
      .addCase(fetchFlowsListData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      // Group Dropdowns
      .addCase(fetchFlowDropdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlowDropdown.fulfilled, (state, action) => {
        state.loading = false;
        state.flowDropdownData = action.payload.flowDropdownData;
        state.message = action.payload.message || '';
      })
      .addCase(fetchFlowDropdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Fetch Client by ID
      .addCase(fetchFlowDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlowDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.flow = action.payload;
        state.message = action.payload?.message || '';
      })
      .addCase(fetchFlowDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Create Client
      .addCase(createFlows.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createFlows.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || ' Created Successfully';
      })
      .addCase(createFlows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Publish Flow
       .addCase(publishFlow.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase(publishFlow.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = action.payload?.message || 'Uploaded Successfully';
        })
        .addCase(publishFlow.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
          state.message = action.payload?.message || action.error.message;
        })
      
      // Update Client
      .addCase(updateFlow.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateFlow.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.data.message || 'Updated Successfully';
      })
      .addCase(updateFlow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Delete Client
      .addCase(deleteFlow.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteFlow.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Deleted Successfully';
      })
      .addCase(deleteFlow.rejected, (state, action) => {
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
  clearFlowCreateState,
  clearFlowDeleteState,
  clearFlowDetailState,
  clearFlowDropdownState,
  clearFlowPublishState,
  clearFlowListState,
} = FlowSlice.actions;

export default FlowSlice.reducer;
