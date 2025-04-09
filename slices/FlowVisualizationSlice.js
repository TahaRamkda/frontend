import { FLOWVISUALIZATION } from "@/utils/apiConstants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import Flow from "@/pages/Flows/FlowList";

export const fetchFlowVisualization = createAsyncThunk(
    'flowvisualization/fetchFlowVisualization',
    async ({templateId,intTemplateId}, { rejectWithValue }) => {
      try {
        const response = await API.get(`${FLOWVISUALIZATION}?TemplateId=${templateId}&IntTemplateId=${intTemplateId}`);
        if (response?.status === 200) {
          return {
            flowVisualizationData: response.data.result,
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

const FlowVisualizationSlice = createSlice({
    name: 'flowvisualization',
    initialState: {
        flowVisualizationData: [],
        loading: false,
        error: null,
        success: false,
        message: '',
    },
    reducers: {
        clearFlowVisualization: (state) => {
            state.flowVisualizationData = [];
            state.loading = false;
            state.error = null;
            state.success = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchFlowVisualization.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchFlowVisualization.fulfilled, (state, action) => {
            state.loading = false;
            state.flowVisualizationData = action.payload.flowVisualizationData;
            state.message = action.payload.message || '';
        })
        .addCase(fetchFlowVisualization.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            state.message = action.payload?.message || action.error.message;
        })
    }
})

export const { clearFlowVisualization } = FlowVisualizationSlice.actions;
export default FlowVisualizationSlice.reducer;  