import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { TEMPLATELIST, TEMPLATEDETAILS, CREATETEMPLATE, UPDATETEMPLATE, DELETETEMPLATE,SYNCTEMPLATE } from '@/utils/apiConstants';

// Thunks

// Fetch Templates
export const fetchTemplates = createAsyncThunk(
  'template/fetchTemplates',
  async ({clientId,TransactonType}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${TEMPLATELIST}?ClientId=${clientId}&TransactionType=${TransactonType}`);
      if (response?.status === 200 && response.data?.result) {
        return {
          templates: response.data.result,
          totalRecords: response.data.result.length > 0 ? response.data.result[0].total : 0,
        };
      } else {
        throw new Error('Failed to fetch templates');
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);

// Fetch Template by ID
export const  fetchTemplatesById = createAsyncThunk(
  'template/fetchTemplatesById',
  async ({templateId,ClientId}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${TEMPLATEDETAILS}?Id=${templateId}&ClientId=${ClientId}`);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Create Template
export const createTemplates = createAsyncThunk(
  'template/createTemplates',
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await API.post(CREATETEMPLATE, templateData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Create Template
export const syncTemplates = createAsyncThunk(
  'template/syncTemplates',
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await API.post(SYNCTEMPLATE, templateData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);


// Update Template
export const updateTemplates = createAsyncThunk(
  'template/updateTemplates',
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await API.put(UPDATETEMPLATE, templateData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Delete Template
export const deleteTemplates = createAsyncThunk(
  'template/deleteTemplate',
  async ({ templateId }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`${DELETETEMPLATE}?Id=${templateId}`);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Slice
const templateSlice = createSlice({
  name: 'template',
  initialState: {
    templates: [],
    template: null,
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
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearTemplateState: (state) => {
      state.templates = [];
      state.template = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    clearTemplateDetailState: (state) => {
      state.template = null;
      state.loading = false;
      state.error = null;
    },
    clearTemplateCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearTemplateDeleteState: (state) => {
      state.template = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Templates
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.templates;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      
      // Fetch Template by ID
      .addCase(fetchTemplatesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplatesById.fulfilled, (state, action) => {
        state.loading = false;
        state.template = action.payload.result;
        state.message = action.payload?.message || '';
      })
      .addCase(fetchTemplatesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Create Template
      .addCase(createTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Template created successfully';
      })
      .addCase(createTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Update Template
      .addCase(updateTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Template updated successfully';
      })
      .addCase(updateTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Delete Template
      .addCase(deleteTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Template deleted successfully';
      })
      .addCase(deleteTemplates.rejected, (state, action) => {
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
  clearTemplateState,
  clearTemplateDetailState,
  clearTemplateCreateState,
  clearTemplateDeleteState,
} = templateSlice.actions;

export default templateSlice.reducer;
