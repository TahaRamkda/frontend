import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { SENDERNAMELIST, SENDERNAMEDETAIL, CREATESENDERNAME, DELETESENDERNAME, UPDATESENDERNAME, SENDERNAMEDROP } from '@/utils/apiConstants';

// Thunks

// Fetch Clients
export const fetchSendernames = createAsyncThunk(
  'sendername/fetchSendernames',
  async ({client_Id}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${SENDERNAMELIST}?ClientId=${client_Id}`);
      if (response?.status === 200 && response.data?.result) {
        return {
          sendernames: response.data.result,
          totalRecords: response.data.result.length > 0 ? response.data.result[0].total : 0,
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
export const fetchSendernamesDrop = createAsyncThunk(
  'sendername/fetchSendernamesDrop',
  async ({clientId}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${SENDERNAMEDROP}?ClientId=${clientId}`);
      if (response?.status === 200 && response.data?.result) {
        return {
          sendernameDrop: response.data.result,
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
export const fetchSendernameById = createAsyncThunk(
  'sendername/fetchSendernameById',
  async (senderId, { rejectWithValue }) => {
    try {
      const response = await API.get(`${SENDERNAMEDETAIL}?id=${senderId}`);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Create Client
export const createSendername = createAsyncThunk(
  'sendername/createSendername',
  async (sendernameData, { rejectWithValue }) => {
    try {
      const response = await API.post(CREATESENDERNAME, sendernameData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Update Client
export const updateSendername = createAsyncThunk(
  'sendername/updateSendername',
  async (sendernameData, { rejectWithValue }) => {
    try {
      const response = await API.put(UPDATESENDERNAME, sendernameData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Delete Client
export const deleteSendername = createAsyncThunk(
  'sendername/deleteSendername',
  async ({ senderId, onSuccess }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`${DELETESENDERNAME}?SenderNameId=${senderId}`);
      if (onSuccess) onSuccess(); // Handle success callback
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Slice
const sendernameSlice = createSlice({
  name: 'sendername',
  initialState: {
    sendernames: [],
    sendernameDrop:[],
    sendername: null,
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
    clearSendernameState: (state) => {
      state.sendernames = [];
      state.sendername = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    clearSendernameDropState: (state) => {
      state.sendernameDrop = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    
    clearSendernameDetailState: (state) => {
      state.sendername = null;
      state.loading = false;
      state.error = null;
    },
    clearSendernameCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearSendernameDeleteState: (state) => {
      state.sendername = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchSendernames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSendernames.fulfilled, (state, action) => {
        state.loading = false;
        state.sendernames = action.payload.sendernames;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
      })
      .addCase(fetchSendernames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      .addCase(fetchSendernamesDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSendernamesDrop.fulfilled, (state, action) => {
        state.loading = false;
        state.sendernameDrop = action.payload.sendernameDrop;
        state.message = action.payload.message || '';
      })
      .addCase(fetchSendernamesDrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      
      .addCase(fetchSendernameById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSendernameById.fulfilled, (state, action) => {
        state.loading = false;
        state.sendername = action.payload;
        state.message = action.payload?.message || '';
      })
      .addCase(fetchSendernameById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      
      .addCase(createSendername.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSendername.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Created Successfully';
      })
      .addCase(createSendername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      
      .addCase(updateSendername.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSendername.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Updated Successfully';
      })
      .addCase(updateSendername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      
      .addCase(deleteSendername.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteSendername.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Deleted Successfully';
      })
      .addCase(deleteSendername.rejected, (state, action) => {
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
  clearSendernameState,
  clearSendernameDetailState,
  clearSendernameDropState,
  clearSendernameCreateState,
  clearSendernameDeleteState,
} = sendernameSlice.actions;

export default sendernameSlice.reducer;
