import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.axios";
import handleError from "../utils/handleError";
import {
  ACTIVEAGENTS,
  AGENTDROPDOWN,
  CLIENTDROPDOWN,
  FLOWDROPDOWN,
  GROUPDROPDOWN,
  INTERACTIVETEMPLATEDROPDOWN,
  INTERACTIVETEMPLATEDROPWITHOUTPARAM,
  ROLEDROP,
  SENDERNAMEDROP,
  TEMPLATEDROPDOWN,
  TEMPLATECATEGORY, TEMPLATELANGUAGE
} from "@/utils/apiConstants";

export const fetchActiveAgentsDrop = createAsyncThunk(
  "agent/fetchActiveAgentsDrop",
  async ({ clientId, senderId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${ACTIVEAGENTS}?senderId=${senderId}`,
        method: "GET",
        //payload: {},
      });

      if (response.status === 200) {
        return {
          activeAgentDropList: response.data,
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

export const fetchAgentsDrop = createAsyncThunk(
  "agent/fetchAgentsDrop",
  async (
    { clientId, senderId, pageNo, pageSize, searchStr },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${AGENTDROPDOWN}?senderId=${senderId}${
          searchStr ? `&searchStr=${searchStr}` : ""
        }`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          agentDropList: response.data,
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

export const fetchClientsDrop = createAsyncThunk(
  "client/fetchClientsDrop",
  async ({ clientId, searchStr }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${CLIENTDROPDOWN}?${
          searchStr ? `SearchStr=${searchStr}` : ""
        }`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          clientsDropList: response.data,
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

export const fetchFlowDropdown = createAsyncThunk(
  "flowdropdown/fetchFlowDropdown",
  async ({ clientId, SearchStr }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${FLOWDROPDOWN}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          flowDropdownData: response.data,
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

export const fetchGroupsDrop = createAsyncThunk(
  "group/fetchGroupsDrop",
  async ({ clientId, SearchStr }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${GROUPDROPDOWN}`,
        method: "GET",
        //payload: {},
      });

      if (response?.status === 200) {
        return {
          groupDropdownData: response.data,
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

export const fetchInteractiveTemplateDrop = createAsyncThunk(
  "template/fetchInteractiveTemplateDrop",
  async ({ senderId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${INTERACTIVETEMPLATEDROPDOWN}?senderId=${senderId}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          interactiveTemplateDropdownData: response.data,
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

export const fetchInteractiveTemplateDropWithoutParam = createAsyncThunk(
  "template/fetchInteractiveTemplateDropWithoutParam",
  async ({ senderId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${INTERACTIVETEMPLATEDROPWITHOUTPARAM}?senderId=${senderId}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          interactiveTempWithoutParamDropdownData: response.data,
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

export const fetchRolesDrop = createAsyncThunk(
  "role/fetchRolesDrop",
  async ({ clientId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${ROLEDROP}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          roleDrop: response.data,
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

export const fetchSendernamesDrop = createAsyncThunk(
  "sendername/fetchSendernamesDrop",
  async ({ clientId }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${SENDERNAMEDROP}`,
        method: "GET",
        //payload: {},
      });
      if (response?.status === 200) {
        return {
          sendernameDrop: response.data,
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

export const fetchTemplatesDrop = createAsyncThunk(
  "template/fetchTemplatesDrop",

  async ({ senderId=0, TransactionType }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${TEMPLATEDROPDOWN}?transactionType=${
          TransactionType ? TransactionType : 0
        }&senderId=${senderId}`,
        method: "GET",
        //payload: {},
      });

      if (response?.status === 200) {
        return {
          templateDropdownData: response.data,
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

// Slice
const DropdownSlice = createSlice({
  name: "dropdown",
  initialState: {
    activeAgentDropList: [],
    agentDropList: [],
    clientsDropList: [],
    flowDropdownData: [],
    groupDropdownData: [],
    interactiveTemplateDropdownData: [],
    interactiveTempWithoutParamDropdownData: [],
    roleDrop: [],
    sendernameDrop: [],
    templateDropdownData: [],
    templateCategoryList: [],
    languages:[],
    loading: false,
    error: null,
    success: false,
    message: '',
  },
  reducers: {
    // Pagination and reset actions
    cleaActiveAgenDroptState: (state) => {
      state.activeAgentDropList = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    cleaAgenDroptState: (state) => {
      state.agentDropList = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearClientDropState: (state) => {
      state.clientsDropList = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearFlowDropdownState: (state) => {
      state.flowDropdownData = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearGroupDropState: (state) => {
      state.groupDropdownData = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearInteractiveTemplateDropStateState: (state) => {
      state.interactiveTempWithoutParamDropdownData = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearRoleDropState: (state) => {
      state.roleDrop = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearSendernameDropState: (state) => {
      state.sendernameDrop = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearTemplateDropState: (state) => {
      state.templateDropdownData = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.totalRecords = 0;
    },
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
      // Active Agents
      .addCase(fetchActiveAgentsDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveAgentsDrop.fulfilled, (state, action) => {
        state.loading = false;
        state.activeAgentDropList = action.payload.activeAgentDropList;
        state.message = action.payload.message || "";
      })
      .addCase(fetchActiveAgentsDrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      // Agents
      .addCase(fetchAgentsDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentsDrop.fulfilled, (state, action) => {
        state.loading = false;
        state.agentDropList = action.payload.agentDropList;
        state.message = action.payload.message || "";
      })
      .addCase(fetchAgentsDrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      // Clients Dropdown
      .addCase(fetchClientsDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientsDrop.fulfilled, (state, action) => {
        state.loading = false;
        state.clientsDropList = action.payload.clientsDropList;
        state.message = action.payload.message || "";
      })
      .addCase(fetchClientsDrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      // Flow Dropdown
      .addCase(fetchFlowDropdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlowDropdown.fulfilled, (state, action) => {
        state.loading = false;
        state.flowDropdownData = action.payload.flowDropdownData;
        state.message = action.payload.message || "";
      })
      .addCase(fetchFlowDropdown.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      // Group Dropdowns
      .addCase(fetchGroupsDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupsDrop.fulfilled, (state, action) => {
        state.loading = false;
        state.groupDropdownData = action.payload.groupDropdownData;
        state.message = action.payload.message || "";
      })
      .addCase(fetchGroupsDrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      // Interactive Template
      .addCase(fetchInteractiveTemplateDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInteractiveTemplateDrop.fulfilled, (state, action) => {
        state.loading = false;
        state.interactiveTemplateDropdownData =
          action.payload.interactiveTemplateDropdownData;
        state.message = action.payload.message || "";
      })
      .addCase(fetchInteractiveTemplateDrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      // Interactive Template Without Param
      .addCase(fetchInteractiveTemplateDropWithoutParam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchInteractiveTemplateDropWithoutParam.fulfilled,
        (state, action) => {
          state.loading = false;
          state.interactiveTempWithoutParamDropdownData =
            action.payload.interactiveTempWithoutParamDropdownData;
          state.message = action.payload.message || "";
        }
      )
      .addCase(
        fetchInteractiveTemplateDropWithoutParam.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
          state.message = action.payload?.message || action.error.message;
        }
      )
      //   Roles
      .addCase(fetchRolesDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRolesDrop.fulfilled, (state, action) => {
        state.loading = false;
        state.roleDrop = action.payload.roleDrop;
        state.message = action.payload.message || "";
      })
      .addCase(fetchRolesDrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      //   Sendernames
      .addCase(fetchSendernamesDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSendernamesDrop.fulfilled, (state, action) => {
        state.loading = false;
        state.sendernameDrop = action.payload.sendernameDrop;
        state.message = action.payload.message || "";
      })
      .addCase(fetchSendernamesDrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      // Template Dropdown
      .addCase(fetchTemplatesDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplatesDrop.fulfilled, (state, action) => {
        state.loading = false;
        state.templateDropdownData = action.payload.templateDropdownData || [];
        state.message = action.payload.message || "";
      })
      .addCase(fetchTemplatesDrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
        // Template Category
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
      
      // Language 
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
      });
  },
});

// Export actions
export const {
  cleaActiveAgenDroptState,
  cleaAgenDroptState,
  clearClientDropState,
  clearFlowDropdownState,
  clearGroupDropState,
  clearInteractiveTemplateDropState,
  clearInteractiveTemplateDropWithoutParamState,
  clearRoleDropState,
  clearSendernameDropState,
  clearTemplateDropState,
  clearInteractiveTemplateDropStateState,
  cleaTemplateCategoryState,
  clearLanguageState,
} = DropdownSlice.actions;

export default DropdownSlice.reducer;
