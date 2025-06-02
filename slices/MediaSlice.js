import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { UPLOADMEDIA, MEDIALIST, DELETEMEDIA } from '@/utils/apiConstants';

// Thunks

// Fetch Medias
export const fetchMedia = createAsyncThunk(
  'media/fetchMedia',
  async ({ClientId,contentTypeStr,senderId,FileName}, { rejectWithValue }) => {
    try {
       const response = await API.post("/api", {
        endpoint: `${MEDIALIST}?contentTypeStr=${contentTypeStr ? contentTypeStr : ''}&senderId=${senderId}&FileName=${FileName}`,
        method: "GET",
      });
      if (response?.status === 200) {
        return {
          mediaList: response.data,
          totalRecords: response.data.length > 0 ? response.data[0].totalRecords  : 0,
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


// upload Media
export const uploadMedia = createAsyncThunk(
  'media/uploadMedia',
  async (mediaData, { rejectWithValue }) => {
    try {

       // Append endpoint and method to FormData so backend can extract them
            mediaData.append("endpoint", `${UPLOADMEDIA}`);
            mediaData.append("method", "POST");
           
            const response = await API.post("/formData", mediaData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);


// Delete Media
export const deleteMedia = createAsyncThunk(
  'media/deleteMedia',
  async ({ mediaId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
          endpoint: `${DELETEMEDIA}?id=${mediaId}`,
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

// Slice
const mediaSlice = createSlice({
  name: 'media',
  initialState: {
    mediaList: [],
    mediaDetails: null,
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
    // Pagination and reset actions
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearMediaState: (state) => {
      state.mediaList = [];
      state.mediaDetails = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
   
    clearMediaUploadState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearMediaDeleteState: (state) => {
      state.mediaDetails = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Medias
      .addCase(fetchMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaList = action.payload.mediaList;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || '';
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

     

      // upload Media
      .addCase(uploadMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Uploaded Successfully';
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      

      // Delete Media
      .addCase(deleteMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || 'Deleted Successfully';
      })
      .addCase(deleteMedia.rejected, (state, action) => {
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
  clearMediaState,
  clearMediaUploadState,
  clearMediaDeleteState,
} = mediaSlice.actions;

export default mediaSlice.reducer;
 