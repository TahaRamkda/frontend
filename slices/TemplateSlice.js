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
  EXCELEXPORTTEMPLATEANALYTICS
} from "@/utils/apiConstants";

// Thunks

// Fetch Templates
export const fetchTemplates = createAsyncThunk(
  'template/fetchTemplates',
 
  async ({TransactonType,searchStr,pageNo,pageSize,senderId,Language, Category }, { rejectWithValue }) => {
    
    try {
      
      //const response = await API.get(`${TEMPLATELIST}?TransactionType=${TransactonType ? TransactonType : 1}${searchStr?`&searchStr=${searchStr}`:''}&senderId=${senderId}&pageNo=${pageNo}&lang=${Language}&Category=${Category}&pageSize=${pageSize}`);
        const response = await API.post("/api", {
        endpoint: `${TEMPLATELIST}?TransactionType=${TransactonType ? TransactonType : 1}${searchStr?`&searchStr=${searchStr}`:''}&senderId=${senderId}&pageNo=${pageNo}&lang=${Language}&Category=${Category}&pageSize=${pageSize}`,
        method: "GET",
      });
      
      if (response?.status === 200 ) {
        return {
          templateList: response.data,
          totalRecords:
            response.data.length > 0 ? response.data[0].totalRecords  : 0,
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
       const response = await API.post("/api", {
        endpoint: `${TEMPLATEDETAILS}?Id=${templateId}`,
        method: "GET",
      });
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
      //const response = await API.post(CREATETEMPLATE, templateData);

       const response = await API.post("/api", {
          endpoint: `${CREATETEMPLATE}`,
          method: "POST",
          payload: templateData,
        });
        
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
     // const response = await API.post(SYNCTEMPLATE, templateData);
       const response = await API.post("/api", {
          endpoint: `${SYNCTEMPLATE}`,
          method: "POST",
          payload: templateData,
        });
      returnresponse.data;
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
      //const response = await API.put(UPDATETEMPLATE, templateData);
       const response = await API.post("/api", {
          endpoint: `${UPDATETEMPLATE}`,
          method: "POST",
          payload: templateData,
        });
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
       const response = await API.post("/api", {
          endpoint: `${DELETETEMPLATE}?Id=${templateId}`,
          method: "DELETE",
          // payload: {},
        });
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

export const excelExportTemplateAnalyticReport = createAsyncThunk(
  "templateAnalyticReport/excelExportTemplateAnalyticReport",
  async ({ senderId, startDate, endDate, templateId }, { rejectWithValue }) => {
    ;
    try {
      const surveyReportUrl = `${EXCELEXPORTTEMPLATEANALYTICS}?senderId=${senderId}&startDate=${startDate}&endDate=${endDate}&templateId=${templateId}`;
      const response = await API.post("/api",{
          endpoint: surveyReportUrl,
          method: "GET",
        },
      );
      if (response?.status === 200) {
        return {
          templateSummaryList: response.data,
        };
      } else {
        throw new Error("Failed to fetch details");
      }
    } catch (err) {
      handleError(err);
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);


// Slice
const templateSlice = createSlice({
  name: "template",
  initialState: {
    templateList: [],
    templateSummaryList: [],
    templateDetails: null,
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
      state.templateList = [];
      state.templateDetails = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    clearTemplateDetailState: (state) => {
      
      state.templateDetails = null;
      state.loading = false;
      state.error = null;
    },
    clearInteractiveTemplateDetailState: (state) => {
      state.templateDetails = null;
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
      state.templateDetails = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearTemplateAnalyticState: (state) => {
      state.templateSummaryList = [];
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
        state.templateList = action.payload.templateList;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || "";
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      
      .addCase(excelExportTemplateAnalyticReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(excelExportTemplateAnalyticReport.fulfilled, (state, action) => {
        state.loading = false;
        state.templateSummaryList = action.payload.templateSummaryList;
        state.message = action.payload.message || "";
      })
      .addCase(excelExportTemplateAnalyticReport.rejected, (state, action) => {
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
        state.templateDetails = action.payload;
        state.message = action.payload?.message || "";
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
        state.message = action.payload.message || "Created Successfully";
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
        state.message = action.payload.message || "Updated Successfully";
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
  clearTemplateAnalyticState,
  clearTemplateDeleteState,
} = templateSlice.actions;

export default templateSlice.reducer;
