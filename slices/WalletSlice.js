import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.axios";
import handleError from "../utils/handleError";
import { WALLETBALANCE } from "@/utils/apiConstants";

// Thunks
// Fetch Data
export const fetchWalletBalance = createAsyncThunk(
  "wallet/fetchWalletBalance",
  async ({ }, { rejectWithValue }) => {
    try {
        
      const response = await API.post("/api", {
        endpoint: `${WALLETBALANCE}`,
        method: "GET",
        //payload: {},
      });
      
      if (response?.status === 200) {
        return {
          WalletData: response.data,
          totalRecords:
            response.data.length > 0 ? response.data[0].totalRecords : 0,
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

// Slice
const WalletSlice = createSlice({
  name: "wallet",
  initialState: {
    WalletData: [],
  },
  reducers: {
    // Pagination and reset actions
    clearWalletState: (state) => {
      state.WalletData = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Groups
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.WalletData = action.payload.WalletData;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      });
  },
});

// Export actions
export const { clearGroupState } = WalletSlice.actions;

export default WalletSlice.reducer;
