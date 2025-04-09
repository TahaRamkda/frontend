import { TEMPLATEVISUALIZATION } from "@/utils/apiConstants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';

export const fetchTemplateVisualization = createAsyncThunk(
    'templatevisualization/fetchTemplateVisualization',
    async ({templateId,templatetype}, { rejectWithValue }) => {
      try {
        const response = await API.get(`${TEMPLATEVISUALIZATION}?templateType=${templatetype}&templateId=${templateId}`);
        if (response?.status === 200) {
          return {
            templateVisualizationData: response.data,
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

const TemplateVisualizationSlice = createSlice({
    name: 'templatevisualization',
    initialState: {
        templateVisualizationData: [],
        loading: false,
        error: null,
        success: false,
        message: '',
    },
    reducers: {
        clearTemplateVisualization: (state) => {
            state.templateVisualizationData = [];
            state.loading = false;
            state.error = null;
            state.success = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchTemplateVisualization.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchTemplateVisualization.fulfilled, (state, action) => {
            state.loading = false;
            state.templateVisualizationData = action.payload.templateVisualizationData;
            state.message = action.payload.message || '';
        })
        .addCase(fetchTemplateVisualization.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            state.message = action.payload?.message || action.error.message;
        })
    }
})

export const { clearTemplateVisualization } = TemplateVisualizationSlice.actions;
export default TemplateVisualizationSlice.reducer;  