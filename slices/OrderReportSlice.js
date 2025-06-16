  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { ORDERREPORTLIST, ORDERREPORTDETAILS,  UPDATEORDERREPORT, DELETEORDERREPORT } from '@/utils/apiConstants';

// Thunks
// Fetch OrderReport
export const fetchOrderReport = createAsyncThunk(
    'orderReport/fetchOrderReport',
    async ({clientId, pageNo, pageSize, SearchStr}, { rejectWithValue }) => {
      try {
        const response = await API.get(`${ORDERREPORTLIST}?${ SearchStr? `SearchStr=${SearchStr}`:''}&PageNo=${pageNo}&PageSize=${pageSize}`);
        if (response?.status === 200) {
          return {
            orderReportsList: response.data.result,
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


// Fetch OrderReport by ID
export const fetchOrderReportById = createAsyncThunk(
    'orderReport/fetchOrderReportById',
    async ({orderReportId, clientId=localStorage.getItem("clientId")}, { rejectWithValue }) => {
      try {
        const response = await API.get(`${ ORDERREPORTDETAILS}?Id=${orderReportId}`);
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );


// Update OrderReport
export const updateOrderReport = createAsyncThunk(
    'orderReport/updateOrderReports',
    async (orderReportData, { rejectWithValue }) => {
      try {
        const response = await API.put( UPDATEORDERREPORT, orderReportData);
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );
  
  // Delete Client
export const deleteOrderReport = createAsyncThunk(
  'orderReport/deleteOrderReport',
  async ({ orderReportId, onSuccess }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`${DELETEORDERREPORT}?OrderReportId=${orderReportId}`);
      if (onSuccess) onSuccess(); // Handle success callback
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Slice
const OrderReportSlice = createSlice({
  name: 'orderReport',
  initialState: {
    orderReportsList: [],
    orderReportDetail: null,
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
    clearOrderReportState: (state) => {
      state.orderReportsList = [];
      state.orderReportDetail = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    
    clearOrderReportDetailState: (state) => {
      state.orderReport = null;
      state.loading = false;
      state.error = null;
    },
    clearOrderReportDeleteState: (state) => {
      state.orderReport = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchOrderReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderReport.fulfilled, (state, action) => {
        state.loading = false;
        state.orderReportsList = action.payload.orderReportsList;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
      })
      .addCase(fetchOrderReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Fetch Client by ID
      .addCase(fetchOrderReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderReportDetail = action.payload;
        state.message = action.payload?.message || '';
      })
      .addCase(fetchOrderReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Update Client
      .addCase(updateOrderReport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateOrderReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Updated Successfully';
      })
      .addCase(updateOrderReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Delete Client
      .addCase(deleteOrderReport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteOrderReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Deleted Successfully';
      })
      .addCase(deleteOrderReport.rejected, (state, action) => {
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
  clearOrderReportState,
  clearOrderReportDetailState,
  clearOrderReportDeleteState,
} = OrderReportSlice.actions;

export default OrderReportSlice.reducer;
