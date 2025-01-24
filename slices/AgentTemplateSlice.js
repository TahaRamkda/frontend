import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { AGENTINTERACTIVETEMPLATLIST, AGENTINTERACTIVETEMPLATLISTDETAIL } from '@/utils/apiConstants';


// Thunks

// Fetch Clients
export const fetchAgentTemplate = createAsyncThunk(
  'agenttemplate/fetchAgentTemplate',
  async ({clientId, searchStr,senderId,}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${AGENTINTERACTIVETEMPLATLIST}?clientId=${clientId}${searchStr?`&searchStr=${searchStr}`:''}&senderId=${senderId}`);
      if (response?.status === 200) {
        return {
          agenttemplates: response.data.result,
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
export const fetchAgentTemplatesDetail = createAsyncThunk(
  'agenttemplate/fetchAgentTemplatesDetail',
  async ({senderId,TemplateId,clientId}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${AGENTINTERACTIVETEMPLATLISTDETAIL}?clientId=${clientId}&interactiveTemplateId=${TemplateId}&senderId=${senderId}`);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);


// Slice
const agenttemplateSlice = createSlice({
  name: 'agenttemplate',
  initialState: {
    agenttemplates: [],
    agenttemplatedetail: null,
    loading: false,
    error: null,
    success: false,
    message: '',
  },
  reducers: {
  
    cleaAgentTemplateState: (state) => {
      state.agenttemplates = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearAgentTemplateDetailState: (state) => {
      state.agenttemplatedetail = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchAgentTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.agenttemplates = action.payload.agenttemplates;
        state.message = action.payload.message || '';
      })
      .addCase(fetchAgentTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
     
      // Fetch Client by ID
      .addCase(fetchAgentTemplatesDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentTemplatesDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.agenttemplatedetail = action.payload.result;
        state.message = action.payload?.message || '';
      })
      .addCase(fetchAgentTemplatesDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
  },
});

// Export actions
export const {
    cleaAgentTemplateState,
    clearAgentTemplateDetailState,
} = agenttemplateSlice.actions;

export default agenttemplateSlice.reducer;
