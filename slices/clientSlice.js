import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { CLIENTLIST, CLIENTDETAIL, CREATECLIENT, DELETECLIENT, CLIENTUPDATE } from '@/utils/apiConstants';

// Thunks

// Fetch Clients
export const fetchClients = createAsyncThunk(
  'client/fetchClients',
  async ({_,pageNo,pageSize}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${CLIENTLIST}?PageNo=${0}&PageSize=${1000}`);
      if (response?.status === 200 && response.data?.result) {
        return {
          clients: response.data.result,
          totalRecords: response.data.result.length > 0 ? response.data.result[0].total : 0,
        };
      } else {
        throw new Error('Failed to fetch clients');
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);

// Fetch Client by ID
export const fetchClientById = createAsyncThunk(
  'client/fetchClientById',
  async (clientId, { rejectWithValue }) => {
    try {
      const response = await API.get(`${CLIENTDETAIL}?id=${clientId}`);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Create Client
export const createClient = createAsyncThunk(
  'client/createClient',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await API.post(CREATECLIENT, clientData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Update Client
export const updateClient = createAsyncThunk(
  'client/updateClient',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await API.put(CLIENTUPDATE, clientData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Delete Client
export const deleteClient = createAsyncThunk(
  'client/deleteClient',
  async ({ clientId, onSuccess }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`${DELETECLIENT}?clientId=${clientId}`);
      if (onSuccess) onSuccess(); // Handle success callback
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Slice
const clientSlice = createSlice({
  name: 'client',
  initialState: {
    clients: [],
    client: null,
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
    clearClientState: (state) => {
      state.clients = [];
      state.client = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    clearClientDetailState: (state) => {
      state.client = null;
      state.loading = false;
      state.error = null;
    },
    clearClientCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearClientDeleteState: (state) => {
      state.client = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.clients;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Fetch Client by ID
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.client = action.payload;
        state.message = action.payload?.message || '';
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Create Client
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Client created successfully';
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Update Client
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Client updated successfully';
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Delete Client
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Client deleted successfully';
      })
      .addCase(deleteClient.rejected, (state, action) => {
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
  clearClientState,
  clearClientDetailState,
  clearClientCreateState,
  clearClientDeleteState,
} = clientSlice.actions;

export default clientSlice.reducer;
