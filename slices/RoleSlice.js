import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { ROLELIST, ROLEDETAILS, CREATEROLES, UPDATEROLES,  DELETEROLES,ROLEDROP } from '@/utils/apiConstants';

// Thunks

// Fetch Clients
export const  fetchRoles = createAsyncThunk(
    'role/fetchRoles',
    async ({clientId}, { rejectWithValue }) => {
      try {
         const response = await API.post("/api", {
                  endpoint: `${ROLELIST}`,
                  method: "GET",
                  //payload: {},
                });
        if (response?.status === 200 ) { 
          return {
             roles: response.data.data.result,
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
export const  fetchRolesDrop = createAsyncThunk(
    'role/fetchRolesDrop',
    async ({clientId}, { rejectWithValue }) => {
      try {
        const response = await API.post("/api", {
          endpoint: `${ROLEDROP}`,
          method: "GET",
          //payload: {},
        });
        if (response?.status === 200 ) { 
          return {
             roleDrop: response.data.data.result,
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
  
  // Fetch Client by ID
  export const  fetchRoleById = createAsyncThunk(
    ' role/ fetchRoleById',
    async ( {roleId,clientId=localStorage.getItem("clientId")}, { rejectWithValue }) => { 
      try {
        debugger
        const response = await API.post("/api", {
          endpoint: `${ROLEDETAILS}?Id=${roleId}`,
          method: "GET",
          //payload: {},
        });
        debugger
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
        const response = await API.post("/api", {
                  endpoint: `${CREATEROLES}`,
                  method: "POST",
                  payload: roleData,
                });
                debugger
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
        const response = await API.post("/api", {
          endpoint: `${UPDATEROLES}`,
          method: "PUT",
          payload: roleData,
        });
        debugger
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
        const response = await API.post("/api", {
          endpoint: `${ DELETEROLES}?roleId=${ roleId}`,
          method: "DELETE",
          // payload: {},
        });
        debugger
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
      roleDrop:[],
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
      
      clearRoleDropState: (state) => {
        state.roleDrop = [];
        state.loading = false;
        state.error = null;
        state.success = false;
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

        .addCase( fetchRolesDrop.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase( fetchRolesDrop.fulfilled, (state, action) => {
          state.loading = false;
          state. roleDrop = action.payload.roleDrop;
          state.message = action.payload.message || '';
        })
        .addCase( fetchRolesDrop.rejected, (state, action) => {
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
          state. role = action.payload.data.result;
          state.message = action.payload.data?.message || '';
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
          state.message = action.payload.data.message || 'Created Successfully';
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
          state.message = action.payload.data.message || 'Updated Successfully';
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
          state.message = action.payload.message || 'Deleted Successfully';
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
    clearRoleDropState,
    clearRoleCreateState,
    clearRoleDeleteState,
  } = roleSlice.actions;
  
  export default roleSlice.reducer;
  
