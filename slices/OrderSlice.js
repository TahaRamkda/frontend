import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.axios";
import handleError from "../utils/handleError";
import {
  ORDERLIST,
  ORDERDETAILS,
  UPDATEORDER,
  DELETEORDER,
} from "@/utils/apiConstants";

// Thunks
// Fetch Order
export const fetchOrder = createAsyncThunk(
  "order/fetchOrder",
  async (
    {
      clientId,
      pageNo,
      pageSize,
      SearchStr,
      senderId,
      orderId,
      FromDate,
      ToDate,
      searchPhoneNo,
      searchStatus,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${ORDERLIST}?${SearchStr ? `SearchStr=${SearchStr}&` : ""}${
          senderId ? `senderId=${senderId}&` : ""
        }${orderId ? `orderId=${orderId}&` : ""}${
          FromDate ? `FromDate=${FromDate}&` : ""
        }${ToDate ? `ToDate=${ToDate}&` : ""}${
          searchPhoneNo ? `searchPhoneNo=${searchPhoneNo}&` : ""
        }${
          searchStatus ? `searchStatus=${searchStatus}&` : ""
        }PageNo=${pageNo}&PageSize=${pageSize}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          ordersList: response.data,
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

// Fetch Order by ID
export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (
    { orderId, clientId = localStorage.getItem("clientId") },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${ORDERDETAILS}?orderId=${orderId}`,
        method: "GET",
        //payload: {},
      });

      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// // Update Order
// export const updateOrder = createAsyncThunk(
//   "order/updateOrders",
//   async (orderData, { rejectWithValue }) => {
//     try {
//       const response = await API.put(UPDATEORDER, orderData);
//       return response.data;
//     } catch (error) {
//       const handledError = handleError(error);
//       return rejectWithValue(handledError);
//     }
//   }
// );

// // Delete Client
// export const deleteOrder = createAsyncThunk(
//   "order/deleteOrder",
//   async ({ orderId, onSuccess }, { rejectWithValue }) => {
//     try {
//       const response = await API.delete(`${DELETEORDER}?OrderId=${orderId}`);
//       if (onSuccess) onSuccess(); // Handle success callback
//       return response.data;
//     } catch (error) {
//       const handledError = handleError(error);
//       return rejectWithValue(handledError);
//     }
//   }
// );

// Slice
const OrderSlice = createSlice({
  name: "order",
  initialState: {
    ordersList: [],
    orderDetail: null,
    loading: false,
    error: null,
    success: false,
    message: "",
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
    clearOrderState: (state) => {
      state.ordersList = [];
      state.orderDetail = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },

    clearOrderDetailState: (state) => {
      state.order = null;
      state.loading = false;
      state.error = null;
    },
    // clearOrderDeleteState: (state) => {
    //   state.order = null;
    //   state.loading = false;
    //   state.error = null;
    //   state.success = false;
    // },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.ordersList = action.payload.ordersList;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || "";
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Fetch Client by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload;
        state.message = action.payload?.message || "";
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      });

    // // Update Client
    // .addCase(updateOrder.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    //   state.success = false;
    // })
    // .addCase(updateOrder.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.success = true;
    //   state.message = action.payload.message || "Updated Successfully";
    // })
    // .addCase(updateOrder.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload || action.error.message;
    //   state.message = action.payload?.message || action.error.message;
    // })

    // // Delete Client
    // .addCase(deleteOrder.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    //   state.success = false;
    // })
    // .addCase(deleteOrder.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.success = true;
    //   state.message = action.payload.message || "Deleted Successfully";
    // })
    // .addCase(deleteOrder.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload || action.error.message;
    //   state.message = action.payload?.message || action.error.message;
    // });
  },
});

// Export actions
export const {
  setPageSize,
  setCurrentPage,
  clearOrderState,
  clearOrderDetailState,
  // clearOrderDeleteState,
} = OrderSlice.actions;

export default OrderSlice.reducer;
