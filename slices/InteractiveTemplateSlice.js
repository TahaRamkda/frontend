import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.axios";
import handleError from "../utils/handleError";
import {
  CREATEINTERACTIVETEMPLATE,
  INRERACTIVETEMPLATELIST,
  INTERACTIVETEMPLATEDETAILS,
  UPDATEINTERACTIVETEMPLATE,
  INTERACTIVETEMPLATEDROPWITHOUTPARAM
} from "@/utils/apiConstants";

// Thunks

// Fetch Templates


export const fetchInteractiveTemplates = createAsyncThunk(
  'template/interactiveTemplateList',
  async ({fromDate,searchStr,toDate,pageNo,pageSize, senderId, Language}, { rejectWithValue }) => {
    try {
       const response = await API.post("/api", {
        endpoint: `${INRERACTIVETEMPLATELIST}?senderId=${senderId}${searchStr?`&searchStr=${searchStr}`:''}&senderId=${senderId}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}&lang=${Language}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          interactiveTemplateList: response.data,
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

export const fetchInteractiveTemplateDrop = createAsyncThunk(
  'template/interactiveTemplateList',
  async ({clientId = localStorage.getItem("clientId")}, { rejectWithValue }) => {
    try {
       const response = await API.post("/api", {
        endpoint: `${INRERACTIVETEMPLATELIST}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          interactiveTemplateList: response.data,
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
export const fetchInteractiveTemplateDropWithoutParam = createAsyncThunk(
  'template/fetchInteractiveTemplateDropWithoutParam',
  async ({clientId = localStorage.getItem("clientId"),senderId}, { rejectWithValue }) => {
    try {
       const response = await API.post("/api", {
        endpoint: `${INTERACTIVETEMPLATEDROPWITHOUTPARAM}?senderId=${senderId}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200 ) {
        return {
          interactiveTemplateDropList: response.data,
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



export const fetchInteractiveTemplatesById = createAsyncThunk(
  "template/fetchInteractiveTemplatesById",
  async ({ templateId, ClientId }, { rejectWithValue }) => {
    try {
        const response = await API.post("/api", {
        endpoint: `${INTERACTIVETEMPLATEDETAILS}?interactiveTemplateId=${templateId}`,
        method: "GET",
        //payload: {},
      });
      
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
      //const response = await API.post(CREATEINTERACTIVETEMPLATE, templateData);
       const response = await API.post("/api", {
          endpoint: `${CREATEINTERACTIVETEMPLATE}`,
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




export const updateInteractiveTemplates = createAsyncThunk(
  "template/updateInteractiveTemplates",
  async (templateData, { rejectWithValue }) => {
    try {
      
       const response = await API.post("/api", {
          endpoint: `${UPDATEINTERACTIVETEMPLATE}`,
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



// Slice
const interactiveTemplateSlice = createSlice({
  name: "interactiveTemplate",
  initialState: {
    interactiveTemplateList:[],
    interactiveTemplateDropList:[],
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
    clearInteractiveTemplateListState: (state)=>{
      state.interactiveTemplateList = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    clearInteractiveTemplateDetailState: (state) => {
      state.template = null;
      state.loading = false;
      state.error = null;
    },

    clearInteractiveTemplateCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearInteractiveTemplateDropStateState: (state) => {
      state.interactiveTemplateDropList=[];
      state.loading = false;
      state.error = null;
      state.success = false;
    },

  },
  extraReducers: (builder) => {
    builder
      
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

      .addCase(fetchInteractiveTemplateDropWithoutParam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInteractiveTemplateDropWithoutParam.fulfilled, (state, action) => {
        state.loading = false;
        state.interactiveTemplateDropList = action.payload.interactiveTemplateDropList;
        state.message = action.payload.message || "";
      })
      .addCase(fetchInteractiveTemplateDropWithoutParam.rejected, (state, action) => {
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
        state.interactivetemplatedetail = action.payload;
        state.message = action.payload?.message || "";
      })
      .addCase(fetchInteractiveTemplatesById.rejected, (state, action) => {
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
     
  },
});

// Export actions
export const {
  setPageSize,
  setCurrentPage,
  clearInteractiveTemplateDetailState,
  clearInteractiveTemplateDropStateState,
  clearInteractiveTemplateCreateState,
  clearInteractiveTemplateListState,
} = interactiveTemplateSlice.actions;

export default interactiveTemplateSlice.reducer;
