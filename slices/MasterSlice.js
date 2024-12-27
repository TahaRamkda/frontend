import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { TEMPLATECATEGORY, TEMPLATELANGUAGE } from '@/utils/apiConstants';


export const fetchtemplatecategory = createAsyncThunk(
  'master/fetchtemplatecategory',
  async ({}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${TEMPLATECATEGORY}`);
      if (response?.status === 200 && response.data?.result) {
        return {
          templatecategory: response.data.result
        };
      } else {
        throw new Error('Failed to fetch category');
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);


export const fetchlanguage = createAsyncThunk(
  'master/fetchlanguage',
  async ({}, { rejectWithValue }) => {
    try {
      const response = await API.get(`${TEMPLATELANGUAGE}`);
      if (response?.status === 200 && response.data?.result) {
        return {
          languages: response.data.result
        };
      } else {
        throw new Error('Failed to fetch category');
      }
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);


const MasterSlice = createSlice({
  name: 'master',
  initialState: {
    templatecategory: [],
    languages:[],
    loading: false,
    error: null,
    success: false,
    message: '',
  },
  reducers: {
    cleaTemplateCategoryState: (state) => {
      state.templatecategory = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearLanguageState: (state) => {
      state.languages = [];
      state.loading = false;
      state.error = null;
      state.success = false;

    },
   
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchtemplatecategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchtemplatecategory.fulfilled, (state, action) => {
        state.loading = false;
        state.templatecategory = action.payload.templatecategory;
        state.message = action.payload.message || '';
      })
      .addCase(fetchtemplatecategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
     
      .addCase(fetchlanguage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchlanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.languages = action.payload.languages;
        state.message = action.payload.message || '';
      })
      .addCase(fetchlanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

  },
});

// Export actions
export const {
  
  cleaTemplateCategoryState,
  clearLanguageState,
} = MasterSlice.actions;

export default MasterSlice.reducer;
