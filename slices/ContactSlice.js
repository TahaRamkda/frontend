import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { CONTACTLIST, CONTACTDETAILS, CREATECONTACT, DELETECONTACT, UPDATECONTACT } from '@/utils/apiConstants';

// Thunks

// Fetch Clients
export const fetchContact = createAsyncThunk(
  'contact/fetchContact',
  async ({clientId}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${CONTACTLIST}?ClientId=${clientId}`);
      if (response?.status === 200 && response.data?.result) {
        return {
          contacts: response.data.result,
          totalRecords: response.data.result.length > 0 ? response.data.result[0].total : 0,
        };
      } else {
        throw new Error('Failed to fetch contacts');
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);

// Fetch Client by ID
export const fetchContactById = createAsyncThunk(
  'contact/fetchContactById',
  async (contactId, { rejectWithValue }) => {
    try {
      const response = await API.get(`${CONTACTDETAILS}?Id=${contactId}`);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Create Client
export const createContact = createAsyncThunk(
  'contact/createContact',
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await API.post(CREATECONTACT, contactData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Update Client
export const updateContact = createAsyncThunk(
  'contact/updateContact',
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await API.put(UPDATECONTACT, contactData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Delete Client
export const deleteContact = createAsyncThunk(
  'contact/deleteContact',
  async ({ contactId, onSuccess }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`${DELETECONTACT}?ContactId=${contactId}`);
      if (onSuccess) onSuccess(); // Handle success callback
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Slice
const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    contacts: [],
    contact: null,
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
    clearContactState: (state) => {
      state.contacts = [];
      state.contact = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    clearContactDetailState: (state) => {
      state.contact = null;
      state.loading = false;
      state.error = null;
    },
    clearContactCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearContactDeleteState: (state) => {
      state.contact = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.contacts;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
      })
      .addCase(fetchContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Fetch Client by ID
      .addCase(fetchContactById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.loading = false;
        state.contact = action.payload;
        state.message = action.payload?.message || '';
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Create Client
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Client created successfully';
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Update Client
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Client updated successfully';
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Delete Client
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Client deleted successfully';
      })
      .addCase(deleteContact.rejected, (state, action) => {
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
  clearContactState,
  clearContactDetailState,
  clearContactCreateState,
  clearContactDeleteState,
} = contactSlice.actions;

export default contactSlice.reducer;
