import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.axios";
import handleError from "../utils/handleError";
import { MERCHANTDETAILS } from "@/utils/apiConstants";

// Thunks
// Fetch Merchant
export const fetchMerchant = createAsyncThunk(
  "merchant/fetchMerchant",
  async ({ domain }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${MERCHANTDETAILS}?domain=${domain}`,
        method: "GET",
        //payload: {},
      });
      
      if (response?.status === 200) {
        localStorage.setItem("LogoPath", response.data.logo);
        localStorage.setItem("MerchantName", response.data.name);
        return {
          merchantData: response.data,
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
const MerchantSlice = createSlice({
  name: "merchant",
  initialState: {
    merchantData: [],
    loading: false,
    error: null,
    success: false,
    message: "",
  },
  reducers: {
    clearMerchantState: (state) => {
      state.merchantList = [];
      state.merchantData = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Merchants
      .addCase(fetchMerchant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMerchant.fulfilled, (state, action) => {
        state.loading = false;
        state.merchantData = action.payload.merchantData;
      })
      .addCase(fetchMerchant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      });
  },
});

// Export actions
export const { clearMerchantState } = MerchantSlice.actions;

export default MerchantSlice.reducer;
