  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../utils/api.axios';
import handleError from '../utils/handleError';
import { ENQUIRYLIST } from '@/utils/apiConstants';


// Thunks
// Fetch Enquiry
export const fetchEnquiry = createAsyncThunk(
    'enquiry/fetchEnquiry',
    async ({senderId,enquiryId, pageNo, pageSize, toDate, fromDate}, { rejectWithValue }) => {
      try {
        
        const response = await API.post("/api", {
          endpoint: `${ENQUIRYLIST}?senderId=${senderId}&enquiryId=${enquiryId}&PageNo=${pageNo}&PageSize=${pageSize}&FromDate=${fromDate}&ToDate=${toDate}`,
          method: "GET",
          //payload: {},
        });
        
        if (response?.status === 200) {
          return {
            enquiryList: response.data,
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



// Slice
const enquirySlice = createSlice({
  name: 'enquiry',
  initialState: {
    enquiryList: [],
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
    clearEnquiryState: (state) => {
      state.enquiryList = [];
      state.EnquiryDetails = null;
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
      // Fetch Enquirys
      .addCase(fetchEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnquiry.fulfilled, (state, action) => {
        
        state.loading = false;
        state.enquiryList = action.payload.enquiryList;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        // state.message = action.payload.message || '';
      })
      .addCase(fetchEnquiry.rejected, (state, action) => {
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
  clearEnquiryState
} = enquirySlice.actions;

export default enquirySlice.reducer;
