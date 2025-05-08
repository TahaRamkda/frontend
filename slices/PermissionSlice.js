import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { PERMISSIONLIST,  CREATEPERMISSION } from '@/utils/apiConstants';

// Thunks

// FetchPermissions
export const fetchPermissions = createAsyncThunk(
    'permission/fetchPermissions',
    async ({role_Id,client_Id}, { rejectWithValue }) => {
      try {
        debugger
        // Ensure that the Client_Id and role_Id parameters are correctly formatted
        const response = await API.get(`${PERMISSIONLIST}?RoleId=${role_Id}`);
        if (response?.status === 200) {
          debugger
          if(response.data.result != null){
            return {
              permissions: response?.data?.result,
              totalRecords: response?.data?.result.length > 0 ? response?.data.result[0].totalRecords  : 0,
            };
          }
         
        } else {
          throw new Error('Failed to fetch details');
        }
        debugger
      } catch (err) {
        const handledError = handleError(err);
        return rejectWithValue(handledError);
      }
    }
  );
  
// Create Permission
export const createPermission = createAsyncThunk(
  'permission/createPermission',
  async (permissionData, { rejectWithValue }) => {
    try {
      const response = await API.post(CREATEPERMISSION, permissionData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Slice
const permissionSlice = createSlice({
  name: 'permission',
  initialState: {
    permissions: [],
    permission: null,
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
    clearPermissionState: (state) => {
      state.permissions = [];
      state.permission = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    
    clearPermissionCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
   
  },
  extraReducers: (builder) => {
    builder
      // FetchPermissions
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        debugger
        state.loading = false;
        state.permissions = action.payload?.permissions;
        state.totalRecords = action.payload?.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload?.message || '';
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      

      // Create Permission
      .addCase(createPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Created Successfully';
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

     
  },
});

// Export actions
export const {
  setPageSize,
  setCurrentPage,
  clearPermissionState,
  clearPermissionCreateState,
} = permissionSlice.actions;

export default permissionSlice.reducer;
