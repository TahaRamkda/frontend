import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { ROLELIST, ROLEDETAILS, CREATEROLES, UPDATEROLES,  DELETEROLES } from '@/utils/apiConstants';

// Thunks

// Fetch Clients
export const  fetchRoles = createAsyncThunk(
    'role/fetchRoles',
    async ({clientId}, { rejectWithValue }) => {
      try {
      
        const response = await API.get(`${ROLELIST}?clientId=${clientId}`);
        if (response?.status === 200 && response.data?.result) { 
          return {
             roles: response.data.result,
            totalRecords: response.data.result.length > 0 ? response.data.result[0].total : 0,
          };
        } else {
          throw new Error('Failed to fetch  roles');
        }
      } catch (err) {
        const handledError = handleError(err);
        return rejectWithValue(handledError);
      }
    }
  );
  
  // Fetch Client by ID
  export const  fetchRoleById = createAsyncThunk(
    ' role/ fetchRoleById',
    async ( roleId, { rejectWithValue }) => { 
      try {
        const response = await API.get(`${ROLEDETAILS}?id=${roleId}`);
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );
  
  // Create Roles
  export const  createRole = createAsyncThunk(
    ' role/ createRole',
    async ( roleData, { rejectWithValue }) => {
      try {
        const response = await API.post(CREATEROLES,  roleData);
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );
  
  // Update Roles
  export const  updateRole = createAsyncThunk(
    ' role/ updateRole',
    async ( roleData, { rejectWithValue }) => {
      try {
        const response = await API.put( UPDATEROLES,  roleData);
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );
  
  // Delete Roles
  export const deleteRole = createAsyncThunk(
    ' role/deleteRole',
    async ({  roleId, onSuccess }, { rejectWithValue }) => {
      try {
        const response = await API.delete(`${ DELETEROLES}?roleId=${ roleId}`);
        if (onSuccess) onSuccess(); // Handle success callback
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );
  
  // Slice
  const roleSlice = createSlice({
    name: 'role',
    initialState: {
       roles: [],
       role: null,
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
      clearRoleState: (state) => {
        state.roles = [];
        state.role = null;
        state.loading = false;
        state.error = null;
        state.success = false;
        state.currentPage = 1;
        state.totalPages = 1;
        state.pageSize = 10;
        state.totalRecords = 0;
      },
      
      clearRoleDetailState: (state) => {
        state.role = null;
        state.loading = false;
        state.error = null;
      },
      clearRoleCreateState: (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
      },
      clearRoleDeleteState: (state) => {
        state.role = null;
        state.loading = false;
        state.error = null;
        state.success = false;
      },
    },
    extraReducers: (builder) => {
      builder
        // Fetch Clients
        .addCase( fetchRoles.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase( fetchRoles.fulfilled, (state, action) => {
          state.loading = false;
          state. roles = action.payload. roles;
          state.totalRecords = action.payload.totalRecords;
          state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
          state.message = action.payload.message || '';
        })
        .addCase( fetchRoles.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
          state.message = action.payload?.message || action.error.message;
        })
  
        // Fetch Client by ID
        .addCase( fetchRoleById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase( fetchRoleById.fulfilled, (state, action) => {
          state.loading = false;
          state. role = action.payload;
          state.message = action.payload?.message || '';
        })
        .addCase( fetchRoleById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
          state.message = action.payload?.message || action.error.message;
        })
  
        // Create Client
        .addCase( createRole.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase( createRole.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = action.payload.message || 'Client created successfully';
        })
        .addCase( createRole.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
          state.message = action.payload?.message || action.error.message;
        })
  
        // Update Client
        .addCase( updateRole.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase( updateRole.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = action.payload.message || 'Client updated successfully';
        })
        .addCase( updateRole.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
          state.message = action.payload?.message || action.error.message;
        })
  
        // Delete Client
        .addCase(deleteRole.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase(deleteRole.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = action.payload.message || 'Client deleted successfully';
        })
        .addCase(deleteRole.rejected, (state, action) => {
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
    clearRoleState,
    clearRoleDetailState,
    clearRoleCreateState,
    clearRoleDeleteState,
  } = roleSlice.actions;
  
  export default roleSlice.reducer;
  
