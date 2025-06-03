import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { CREATECAMPAIGN, CAMPAIGNLIST, ACTIVATECAMPAIGN ,CAMPAIGNDETAIL,UPDATECAMPAIGN, CAMPAIGNCONTACTFREQUENTREMOVE , CAMPAIGNCONTACTFREQUENTSTATE,SENDCAMPAIGN} from '@/utils/apiConstants';
 
// Thunks
export const fetchCampaign = createAsyncThunk(
  'campaign/fetchCampaign',
  async ({ FromDate, ToDate, srcStr, PageNo, pageSize,templateId}, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${CAMPAIGNLIST}?${srcStr ? `SearchStr=${srcStr}` : ''}&FromDate=${FromDate}&ToDate=${ToDate}&PageNo=${PageNo}&PageSize=${pageSize}&TemplateId=${templateId}`,
        method: "GET",
      });
      if (response?.status === 200) {
        return {
          campaignList: response.data,
          totalRecords: response.data.length > 0 ? response.data[0].totalRecords : 0,
         
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



export const fetchCampaignContactState = createAsyncThunk(
  'campaign/fetchCampaignContactState',
  async ({ClientId , CampaignId}, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint:`${CAMPAIGNCONTACTFREQUENTSTATE}?CampaignId=${CampaignId}`,
        method: "GET",
      });
      if (response?.status === 200) {
        return {
          campaignContactState: response.data,
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
 
export const fetchCampaignFrequentDelete = createAsyncThunk(
  'campaign/fetchCampaignFrequentDelete',
  async ({ClientId,CampaignId,Removedays}, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${CAMPAIGNCONTACTFREQUENTREMOVE}?CampaignId=${CampaignId}&LastContactedInDays=${Removedays}`,
        method: "GET",
      });
      if (response?.status === 200) {
        
        return {
          campaignFreqDelete: response.data,
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
 
export const fetchCampaignDetail = createAsyncThunk(
  'campaign/fetchCampaignDetail',
  async ({CampaignId ,ClientId}, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${CAMPAIGNDETAIL}?CampaignId=${CampaignId}`,
        method: "GET",
      });
      if (response?.status === 200) {
        return {
          campaigndetail: response.data,
 
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
 
  // Create Roles
  export const  createCampaign = createAsyncThunk(
    'campaign/createCampaign',
    async ( campaignData, { rejectWithValue }) => {
      try {
        const response = await API.post("/api", {
                  endpoint: `${CREATECAMPAIGN}`,
                  method: "POST",
                  payload: campaignData,
                });
                
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );
 
 
  export const  UpdateCampaign = createAsyncThunk(
    'campaign/UpdateCampaign',
    async ( campaignData, { rejectWithValue }) => {
      try {
        const response = await API.post("/api", {
                  endpoint: `${UPDATECAMPAIGN}`,
                  method: "PUT",
                  payload: campaignData,
                });
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );
 
  //first create an api end point and replace it with the curent endpoint and replace clientdata to campaigndata and put method to post
  export const activateCampaign = createAsyncThunk(
    'campaign/activateCampaign',
    async (campaignData, { rejectWithValue }) => {
      try {
        const response = await API.post("/api", {
                  endpoint: `${ACTIVATECAMPAIGN}`,
                  method: "POST",
                  payload: campaignData,
                });
                
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );
 
  export const  sendCampaign = createAsyncThunk(
    'campaign/sendCampaign',
    async ( sendData, { rejectWithValue }) => {
      try {
        
        const response = await API.post("/api", {
                  endpoint: `${SENDCAMPAIGN}`,
                  method: "POST",
                  payload: sendData,
                });
                
        return response.data;
      } catch (error) {
        const handledError = handleError(error);
        return rejectWithValue(handledError);
      }
    }
  );
  // Slice
  const campaignSlice = createSlice({
    name: 'campaign',
    initialState: {
      campaignList: [],
      campaignContactState:[],
      campaignFreqDelete: [],
      campaigndetail:"",
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
      clearCampaignCreeateState: (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
      },
      clearCampaignUpdateState: (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
      },
      clearCampaignListState: (state) => {
       
        state.campaignList=[];
        state.loading = false;
        state.error = null;
        state.success = false;
        state.currentPage = 1;
        state.totalPages = 1;
        state.pageSize = 10;
        state.totalRecords = 0;
      },
      clearCampaignContactState: (state) => {
        state.campaignContactState=[];
        state.loading = false;
        state.error = null;
        state.success = false;
      },
      clearCampaignFreqDeleteState: (state) => {
        state.campaignFreqDelete=[];
        state.loading = false;
        state.error = null;
        state.success = false;
      },
      clearCampaignDetailState: (state) => {
        state.campaigndetail="";
        state.loading = false;
        state.error = null;
        state.success = false;
      },
      clearCampaignActivateState: (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
      },
      clearCampaignSendState: (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
       
      }
    },
    extraReducers: (builder) => {
      builder
        // Create Client
        .addCase( createCampaign.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase( createCampaign.fulfilled, (state, action) => {
          
          state.loading = false;
          state.success = true;
          state.message = action.payload.message || 'Created Successfully';
        })
        .addCase( createCampaign.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
          state.message = action.payload?.message || action.error.message;
        })
       
        .addCase( UpdateCampaign.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase( UpdateCampaign.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = action.payload.message || 'Updated Successfully';
        })
        .addCase( UpdateCampaign.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
          state.message = action.payload?.message || action.error.message;
        })
        .addCase( fetchCampaign.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase( fetchCampaign.fulfilled, (state, action) => {
          
          state.campaignList = action.payload.campaignList ;
          state.loading = false;
          state.success = true;
          state.totalRecords = action.payload.totalRecords || 0;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || "";
        })
        .addCase( fetchCampaign.rejected, (state, action) => {
          state.campaignList =[];
          state.loading = false;
          state.error = action.payload || action.error.message;
          state.message = action.payload?.message || action.error.message;
        })
        .addCase( fetchCampaignContactState.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase( fetchCampaignContactState.fulfilled, (state, action) => {
          state.campaignContactState = action.payload.campaignContactState ;
          state.loading = false;
          state.success = true;
          state.message = action.payload.message || 'Created Successfully';
        })
        .addCase( fetchCampaignContactState.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
          state.message = action.payload?.message || action.error.message;
        })
        .addCase( fetchCampaignFrequentDelete.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase( fetchCampaignFrequentDelete.fulfilled, (state, action) => {
          state.campaignFreqDelete = action.payload.campaignFreqDelete;
          state.loading = false;
          state.success = true;
          // state.message = action.payload.message || 'Created Successfully';
        })
        .addCase( fetchCampaignFrequentDelete.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
          state.message = action.payload?.message || action.error.message;
        })
        .addCase( fetchCampaignDetail.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase( fetchCampaignDetail.fulfilled, (state, action) => {
          state.campaigndetail = action.payload.campaigndetail ;
          state.loading = false;
          state.success = true;
          state.message = action.payload.message || 'Created Successfully';
        })
        .addCase( fetchCampaignDetail.rejected, (state, action) => {
          state.campaigndetail = "";
          state.loading = false;
          state.error = action.payload || action.error.message;
          state.message = action.payload?.message || action.error.message;
        })
        .addCase( activateCampaign.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase( activateCampaign.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = action.payload.message || 'Created Successfully';
        })
        .addCase( activateCampaign.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
          state.message = action.payload?.message || action.error.message;
        })
        .addCase( sendCampaign.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase( sendCampaign.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = action.payload.message;
        })
        .addCase( sendCampaign.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
          state.message = action.payload?.message || action.error.message;
        })
    },
  });
 
  // Export actions
  export const {
    setPageSize,
    setCurrentPage,
    clearCampaignCreeateState,
    clearCampaignUpdateState,
    clearCampaignDetailState,
    clearCampaignListState,
    clearCampaignContactState,
    clearCampaignFreqDeleteState,
    clearCampaignSendState,
    clearCampaignActivateState,
  } = campaignSlice.actions;
 
  export default campaignSlice.reducer;
 