import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.axios";
import handleError from "../utils/handleError";
import {
  TEMPLATELIST,
  TEMPLATEDETAILS,
  CREATETEMPLATE,
  UPDATETEMPLATE,
  DELETETEMPLATE,
  SYNCTEMPLATE,
  TEMPLATEDROPDOWN,
  CREATEINTERACTIVETEMPLATE,
  INRERACTIVETEMPLATELIST,
  INTERACTIVETEMPLATEDETAILS,
  UPDATEINTERACTIVETEMPLATE,
} from "@/utils/apiConstants";

// Thunks

// Fetch Templates
export const fetchTemplates = createAsyncThunk(
  'template/fetchTemplates',
 
  async ({TransactonType,searchStr,pageNo,pageSize,senderId}, { rejectWithValue }) => {
    
    try {
      const response = await API.get(`${TEMPLATELIST}?TransactionType=${TransactonType ? TransactonType : 1}${searchStr?`&searchStr=${searchStr}`:''}&senderId=${senderId}&pageNo=${pageNo}&pageSize=${pageSize}`);
      if (response?.status === 200 ) {
        return {
          templates: response.data.result,
          totalRecords:
            response.data.result.length > 0 ? response.data.result[0].totalRecords  : 0,
        };
      } else {
        throw new Error("Failed to fetch details");
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);
export const fetchInteractiveTemplates = createAsyncThunk(
  'template/interactiveTemplateList',
  async ({clientId = localStorage.getItem("clientId"),fromDate,searchStr,toDate,pageNo,pageSize}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${INRERACTIVETEMPLATELIST}?${searchStr?`searchStr=${searchStr}`:''}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}`);
      if (response?.status === 200) {
        return {
          interactiveTemplateList: response.data.result,
          totalRecords:
            response.data.result.length > 0 ? response.data.result[0].totalRecords  : 0,
        };
      } else {
        throw new Error("Failed to fetch details");
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);

export const fetchInteractiveTemplateDrop = createAsyncThunk(
  'template/interactiveTemplateList',
  async ({clientId = localStorage.getItem("clientId")}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${INRERACTIVETEMPLATELIST}`);
      if (response?.status === 200) {
        return {
          interactiveTemplateList: response.data.result,
          totalRecords:
            response.data.result.length > 0 ? response.data.result[0].totalRecords  : 0,
        };
      } else {
        throw new Error("Failed to fetch details");
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);
export const fetchTemplatesDrop = createAsyncThunk(
  "template/fetchTemplatesDrop",

  async ({ clientId, TransactionType }, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `${TEMPLATEDROPDOWN}?transactionType=${
          TransactionType ? TransactionType : 0
        }`
      );
      if (response?.status === 200 ) {
        return {
          templateDrop: response.data.result,
        };
      } else {
        throw new Error("Failed to fetch details");
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);

// Fetch Template by ID
export const fetchTemplatesById = createAsyncThunk(
  "template/fetchTemplatesById",
 
  async ({ templateId, ClientId }, { rejectWithValue }) => {
    
    
    try {
      const response = await API.get(
        `${TEMPLATEDETAILS}?Id=${templateId}`
      );
      return response.data.result;
      
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

export const fetchInteractiveTemplatesById = createAsyncThunk(
  "template/fetchInteractiveTemplatesById",
  async ({ templateId, ClientId }, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `${INTERACTIVETEMPLATEDETAILS}?interactiveTemplateId=${templateId}`
      );
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Create Template
export const createTemplates = createAsyncThunk(
  "template/createTemplates",
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
export const createInteractiveTemplates = createAsyncThunk(
  "template/createInteractiveTemplates",
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await API.post(CREATEINTERACTIVETEMPLATE, templateData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Create Template
export const syncTemplates = createAsyncThunk(
  "template/syncTemplates",
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
  "template/updateTemplates",
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

export const updateInteractiveTemplates = createAsyncThunk(
  "template/updateInteractiveTemplates",
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await API.post(UPDATEINTERACTIVETEMPLATE, templateData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Delete Template
export const deleteTemplates = createAsyncThunk(
  "template/deleteTemplate",
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
  name: "template",
  initialState: {
    templates: [],
    templateDrop: [],
    interactiveTemplateList:[],
    template: null,
    interactivetemplatedetail: null,
    loading: false,
    error: null,
    success: false,
    message: "",
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
    clearTemplateDropState: (state) => {
      state.templateDrop = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.totalRecords = 0;
    },
    clearInteractiveTemplateListState: ()=>{
      state.interactiveTemplateList = [];
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
    clearInteractiveTemplateDetailState: (state) => {
      state.template = null;
      state.loading = false;
      state.error = null;
    },
    clearTemplateCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearInteractiveTemplateCreateState: (state) => {
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
        state.message = action.payload.message || "";
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      
      .addCase(fetchInteractiveTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInteractiveTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.interactiveTemplateList = action.payload.interactiveTemplateList;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || "";
      })
      .addCase(fetchInteractiveTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      // Template Dropdown
      .addCase(fetchTemplatesDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplatesDrop.fulfilled, (state, action) => {
        state.loading = false;
        state.templateDrop = action.payload.templateDrop;
        state.message = action.payload.message || "";
      })
      .addCase(fetchTemplatesDrop.rejected, (state, action) => {
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
        state.template = action.payload;
        state.message = action.payload?.message || "";
      })
      .addCase(fetchTemplatesById.rejected, (state, action) => {
        
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      .addCase(fetchInteractiveTemplatesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInteractiveTemplatesById.fulfilled, (state, action) => {
        state.loading = false;
        state.interactivetemplatedetail = action.payload.result;
        state.message = action.payload?.message || "";
      })
      .addCase(fetchInteractiveTemplatesById.rejected, (state, action) => {
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
        state.message = action.payload.message || "Created Successfully";
      })
      .addCase(createTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      // Create Interactive Template
      .addCase(createInteractiveTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createInteractiveTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Created Successfully";
      })
      .addCase(createInteractiveTemplates.rejected, (state, action) => {
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
        state.message = action.payload.message || "Updated Successfully";
      })
      .addCase(updateTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      .addCase(updateInteractiveTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateInteractiveTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Updated Successfully";
      })
      .addCase(updateInteractiveTemplates.rejected, (state, action) => {
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
        state.message = action.payload.message || "Deleted Successfully";
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
  clearTemplateDropState,
  clearInteractiveTemplateDetailState,
  clearInteractiveTemplateCreateState,
  clearInteractiveTemplateListState,
  clearTemplateDetailState,
  clearTemplateCreateState,
  clearTemplateDeleteState,
} = templateSlice.actions;

export default templateSlice.reducer;
