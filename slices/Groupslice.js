import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { GROUPLIST, CREATEGROUP, GROUPDETAILS,  UPDATEGROUP, DELETEGROUP } from '@/utils/apiConstants';

// Thunks
// Fetch Group
export const fetchGroup = createAsyncThunk(
    'group/fetchGroup',
    async ({clientId, pageNo, pageSize, SearchStr}, { rejectWithValue }) => {
      try {
        const response = await API.get(`${GROUPLIST}?ClientId=${clientId}&PageNo=${pageNo}&PageSize=${pageSize}`);
        if (response?.status === 200 && response.data?.result) {
          return {
            groups: response.data.result,
            totalRecords: response.data.result.length > 0 ? response.data.result[0].total : 0,
          };
        } else {
          throw new Error('Failed to fetch Groups');
        }
      } catch (err) {
        const handledError = handleError(err);
        return rejectWithValue(handledError);
      }
    }
  );

// Fetch Group by ID
export const fetchGroupById = createAsyncThunk(
    'group/fetchGroupById',
    async (groupId, { rejectWithValue }) => {
      try {
        const response = await API.get(`${ GROUPDETAILS}?Id=${groupId}`);
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );

  // Create Group
export const createGroup = createAsyncThunk(
  'group/createGroups',
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await API.post(CREATEGROUP, groupData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Update Group
export const updateGroup = createAsyncThunk(
    'group/updateGroups',
    async (groupData, { rejectWithValue }) => {
      try {
        const response = await API.put( UPDATEGROUP, groupData);
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );
  
  // Delete Client
export const deleteGroup = createAsyncThunk(
  'group/deleteGroup',
  async ({ groupId, onSuccess }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`${DELETEGROUP}?GroupId=${groupId}`);
      if (onSuccess) onSuccess(); // Handle success callback
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Slice
const GroupSlice = createSlice({
  name: 'group',
  initialState: {
    groups: [],
    group: null,
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
    clearGroupState: (state) => {
      state.groups = [];
      state.group = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    
    clearGroupDetailState: (state) => {
      state.group = null;
      state.loading = false;
      state.error = null;
    },
    clearGroupCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearGroupDeleteState: (state) => {
      state.group = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload.groups;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
      })
      .addCase(fetchGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Fetch Client by ID
      .addCase(fetchGroupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        state.loading = false;
        state.group = action.payload;
        state.message = action.payload?.message || '';
      })
      .addCase(fetchGroupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Create Client
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Client created successfully';
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Update Client
      .addCase(updateGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Client updated successfully';
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Delete Client
      .addCase(deleteGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Client deleted successfully';
      })
      .addCase(deleteGroup.rejected, (state, action) => {
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
  clearGroupState,
  clearGroupDetailState,
  clearGroupCreateState,
  clearGroupDeleteState,
} = GroupSlice.actions;

export default GroupSlice.reducer;
