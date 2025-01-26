import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { CONTACTLIST, CONTACTDETAILS, CREATECONTACT, DELETECONTACT, UPDATECONTACT, BULKUPLOAD } from '@/utils/apiConstants';

// Thunks

export const fetchContact = createAsyncThunk(
  'contact/fetchContact',
  async ({clientId,groupId,searchStr,pageNo,pageSize}, { rejectWithValue }) => {
    try {
     const response = await API.get(`${CONTACTLIST}?GroupId=${groupId}&PageNo=${pageNo}&PageSize=${pageSize}${searchStr ? `&SearchStr=${searchStr}` : ''}`);
      if (response?.status === 200 && response.data?.result) {
        console.log("Total Recordsssssss:", response.data.result[0]);
        return {
          contacts: response.data.result,
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

export const fetchContactById = createAsyncThunk(
  'contact/fetchContactById',
  async ({contactId,clientId=localStorage.getItem("clientId")}, { rejectWithValue }) => {
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

// Bulk Upload
export const bulkUpload = createAsyncThunk(
  'media/bulkUpload',
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await API.post(BULKUPLOAD, contactData);
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
    clearBulkUploadState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Contact
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

      // Fetch Contact by ID
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

      // Create Contact
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Created Successfully';
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Update Contact
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Updated Successfully';
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Delete Contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Deleted Successfully';
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Bulk Upload
      .addCase(bulkUpload.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(bulkUpload.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Uploaded Successfully';
      })
      .addCase(bulkUpload.rejected, (state, action) => {
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
  clearBulkUploadState,
  clearContactDeleteState,
} = contactSlice.actions;

export default contactSlice.reducer;
