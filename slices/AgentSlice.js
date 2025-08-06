import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.axios";
import handleError from "../utils/handleError";
import {
  AGENTLIST,
  AGENTDETAILS,
  CREATEAGENT,
  DELETEAGENT,
  UPDATEAGENT,
  AGENTSTIMINGLIST,
  ADDAGENTSTIMING,
  AGENTDROPDOWN,
  GETAGENTSTATS,
  ACTIVEAGENTS,
  AGENTSHIFTBULKUPLOAD,
  MASTERDATA,
  AGENTSTATUS,
  AGENTCHANGERPASS,
} from "@/utils/apiConstants";

// Thunks

// Fetch Clients
export const fetchAgents = createAsyncThunk(
  "agent/fetchAgents",
  async ({ searchStr, senderId, pageSize, pageNo }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${AGENTLIST}?senderId=${senderId}${
          searchStr ? `&searchStr=${searchStr}` : ""
        }&pageNo=${pageNo}&pageSize=${pageSize}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          agentList: response.data,
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

export const fetchMasterData = createAsyncThunk(
  "agent/fetchMasterData",
  async ({ type }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${MASTERDATA}?type=${type}`,
        method: "GET",
        //payload: {},
      });

      if (response?.status === 200) {
        return {
          masterDataList: response.data,
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

export const setAgentStatus = createAsyncThunk(
  "agent/setAgentStatus",
  async ({ agentId, statusId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${AGENTSTATUS}?agentId=${agentId}&status=${statusId}`,
        method: "GET",
        //payload: {},
      });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to fetch details");
      }
    } catch (err) {
      const handledError = handleError(err);
      return rejectWithValue(handledError);
    }
  }
);

export const fetchAgentsTimingList = createAsyncThunk(
  "agent/fetchAgentsTimingList",
  async (
    { clientId, agentId, senderId, pageNo, pageSize },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${AGENTSTIMINGLIST}?agentId=${agentId}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          agentsTiming: response.data,
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

export const fetchAgentStats = createAsyncThunk(
  "agent/fetchAgentStats",
  async (
    {
      clientId = localStorage.getItem("clientId"),
      agentId = localStorage.getItem("userId"),
      senderId = 0,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${GETAGENTSTATS}?senderId=${senderId}&agentId=${agentId}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          agentStatsList: response.data,
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

export const createAgentTiming = createAsyncThunk(
  "agent/createAgentTiming",
  async (agentTimingData, { rejectWithValue }) => {
    try {
      const response = await API.post(ADDAGENTSTIMING, agentTimingData);
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

export const agentShiftBulkUpload = createAsyncThunk(
  "agent/agentShiftBulkUpload",
  async (agentShiftUploadData, { rejectWithValue }) => {
    try {
      const response = await API.post(
        AGENTSHIFTBULKUPLOAD,
        agentShiftUploadData
      );
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);
// Fetch Client by ID
export const fetchAgentsById = createAsyncThunk(
  "agent/fetchAgentsById",
  async ({ agentId, clientId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${AGENTDETAILS}?agentId=${agentId}`,
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

// Create Client
export const createAgent = createAsyncThunk(
  "agent/createAgent",
  async (agentData, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${CREATEAGENT}`,
        method: "POST",
        payload: agentData,
      });

      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Update Client
export const updateAgent = createAsyncThunk(
  "agent/updateAgent",
  async (agentData, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${UPDATEAGENT}`,
        method: "PUT",
        payload: agentData,
      });

      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// Delete Client
export const deleteAgent = createAsyncThunk(
  "agent/deleteAgent",
  async ({ agentId, onSuccess }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${DELETEAGENT}?Id=${agentId}`,
        method: "DELETE",
      });
      if (onSuccess) onSuccess(); // Handle success callback
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

export const agentChangePassword = createAsyncThunk(
  "agent/agentChangePassword",
  async (changePass, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${AGENTCHANGERPASS}`,
        method: "PUT",
        payload: changePass,
      });

      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);
// Slice
const agentSlice = createSlice({
  name: "agent",
  initialState: {
    agentList: [],
    agentsTiming: [],
    agentStatsList: [],
    masterDataList: [],
    agentTagsDropdown: [],
    agentDetails: null,
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
    cleaAgentState: (state) => {
      state.agentList = [];
      state.agentDetails = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },
    clearMasterDataState: (state) => {
      state.masterDataList = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearAgentsTimingListState: (state) => {
      state.agentsTiming = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },

    cleaAgentStats: (state) => {
      state.agentStatsList = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearAgentTimingCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearAgentDetailState: (state) => {
      state.agentDetails = null;
      state.loading = false;
      state.error = null;
    },
    clearAgentCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },

    clearAgentDeleteState: (state) => {
      state.agentDetails = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearBulkUploadState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Agents
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agentList = action.payload.agentList;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      // Fetch Agents Perfomance

      // Active Agents Reasons Dropdown
      .addCase(fetchMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasterData.fulfilled, (state, action) => {
        state.loading = false;
        state.masterDataList = action.payload.masterDataList;
        state.message = action.payload.message || "";
      })
      .addCase(fetchMasterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Agents Shift Bulk Upload
      .addCase(agentShiftBulkUpload.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(agentShiftBulkUpload.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Uploaded Successfully";
      })
      .addCase(agentShiftBulkUpload.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Fetch Agents Timing List
      .addCase(fetchAgentsTimingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentsTimingList.fulfilled, (state, action) => {
        state.loading = false;
        state.agentsTiming = action.payload.agentsTiming; // Correct payload key
        state.message = action.payload.message || "";
      })
      .addCase(fetchAgentsTimingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Agents Stats
      .addCase(fetchAgentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.agentStatsList = action.payload.agentStatsList; // Correct payload key
        state.message = action.payload.message || "";
      })
      .addCase(fetchAgentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Create Agents Timming
      .addCase(createAgentTiming.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAgentTiming.fulfilled, (state, action) => {
        debugger
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Created Successfully";
      })
      .addCase(createAgentTiming.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Fetch Agents by ID
      .addCase(fetchAgentsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentsById.fulfilled, (state, action) => {
        state.loading = false;
        state.agentDetails = action.payload;
        state.message = action.payload?.message || "";
      })
      .addCase(fetchAgentsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Create Agents
      .addCase(createAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAgent.fulfilled, (state, action) => {
        debugger
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Created Successfully";
      })
      .addCase(createAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Update Agents
      .addCase(updateAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAgent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Updated Successfully";
      })
      .addCase(updateAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Delete Agents
      .addCase(deleteAgent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteAgent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Deleted Successfully";
      })
      .addCase(deleteAgent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      .addCase(agentChangePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(agentChangePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Changed Successfully";
      })
      .addCase(agentChangePassword.rejected, (state, action) => {
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
  cleaAgentState,
  clearAgentDetailState,
  clearAgentCreateState,
  clearBulkUploadState,
  cleaAgentStats,
  clearMasterDataState,
  clearAgentDeleteState,
  clearAgentTagsDroptState,
  cleaAgenDroptState,
  clearAgentTimingCreateState,
  clearAgentsTimingListState,
} = agentSlice.actions;

export default agentSlice.reducer;
