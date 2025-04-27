import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.axios";
import handleError from "../utils/handleError";
import { CLEARAPICACHE, CLEARBRIDGECACHE } from "@/utils/apiConstants";

export const clearAPICache = createAsyncThunk(
  "clearapicache/clearAPICache",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.post(CLEARAPICACHE);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

export const clearBridgeCache = createAsyncThunk(
  "clearbridgecache/clearBridgeCache",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.post(CLEARBRIDGECACHE);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

const ClearCache = createSlice({
  name: "clearCache",
  initialState: {
    loading: false,
    error: null,
    success: false,
    message: "",
  },
  reducers: {
    clearAPICacheState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
    },
    clearBridgeCacheState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Clear API Cache
      .addCase(clearAPICache.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(clearAPICache.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "API cache cleared successfully";
      })
      .addCase(clearAPICache.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || "Failed to clear API cache";
      })
      // Clear Bridge Cache
      .addCase(clearBridgeCache.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(clearBridgeCache.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Bridge cache cleared successfully";
      })
      .addCase(clearBridgeCache.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || "Failed to clear bridge cache";
      });
  },
});

// Export actions
export const { clearAPICacheState, clearBridgeCacheState } = ClearCache.actions;

export default ClearCache.reducer;