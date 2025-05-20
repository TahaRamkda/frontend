  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { ORDERLIST, ORDERDETAILS,  UPDATEORDER, DELETEORDER } from '@/utils/apiConstants';

// Thunks
// Fetch Menu
export const fetchMenu = createAsyncThunk(
    'menu/fetchMenu',
    async ({clientId, pageNo, pageSize, SearchStr}, { rejectWithValue }) => {
      try {
        const response = await API.get(`${ORDERLIST}?${ SearchStr? `SearchStr=${SearchStr}`:''}&PageNo=${pageNo}&PageSize=${pageSize}`);
        if (response?.status === 200) {
          return {
            menusList: response.data.result,
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


// Fetch Menu by ID
export const fetchMenuById = createAsyncThunk(
    'menu/fetchMenuById',
    async ({menuId}, { rejectWithValue }) => {
      try {
        const response = await API.get(`${ ORDERDETAILS}?Id=${menuId}`);
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );


// Update Menu
export const updateMenu = createAsyncThunk(
    'menu/updateMenus',
    async (menuData, { rejectWithValue }) => {
      try {
        const response = await API.put( UPDATEORDER, menuData);
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );
  
  // Delete Client
export const deleteMenu = createAsyncThunk(
  'menu/deleteMenu',
  async ({ menuId, onSuccess }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`${DELETEORDER}?MenuId=${menuId}`);
      if (onSuccess) onSuccess(); // Handle success callback
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Slice
const MenuSlice = createSlice({
  name: 'menu',
  initialState: {
    menusList: [],
    menuDetail: null,
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
    clearMenuState: (state) => {
      state.menusList = [];
      state.menuDetail = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    
    clearMenuDetailState: (state) => {
      state.menu = null;
      state.loading = false;
      state.error = null;
    },
    clearMenuDeleteState: (state) => {
      state.menu = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menusList = action.payload.menusList;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Fetch Client by ID
      .addCase(fetchMenuById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuById.fulfilled, (state, action) => {
        state.loading = false;
        state.menuDetail = action.payload;
        state.message = action.payload?.message || '';
      })
      .addCase(fetchMenuById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Update Client
      .addCase(updateMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Updated Successfully';
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Delete Client
      .addCase(deleteMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Deleted Successfully';
      })
      .addCase(deleteMenu.rejected, (state, action) => {
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
  clearMenuState,
  clearMenuDetailState,
  clearMenuDeleteState,
} = MenuSlice.actions;

export default MenuSlice.reducer;
