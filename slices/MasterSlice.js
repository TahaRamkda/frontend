import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { TEMPLATECATEGORY, TEMPLATELANGUAGE } from '@/utils/apiConstants';


export const fetchtemplatecategory = createAsyncThunk(
  'master/fetchtemplatecategory',
  async ({}, { rejectWithValue }) => {
    try {
       const response = await API.post("/api", {
                endpoint: `${TEMPLATECATEGORY}`,
                method: "GET",
                //payload: {},
              });
      if (response?.status === 200) {
        return {
          templateCategoryList: response.data
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
      const response = await API.post("/api", {
                endpoint: `${TEMPLATELANGUAGE}`,
                method: "GET",
                //payload: {},
              });
      if (response?.status === 200) {
        return {
          languages: response.data
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
    templateCategoryList: [],
    languages:[],
    loading: false,
    error: null,
    success: false,
    message: '',
  },
  reducers: {
    cleaTemplateCategoryState: (state) => {
      state.templateCategoryList = [];
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
        state.templateCategoryList = action.payload.templateCategoryList;
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
