import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api.axios";
import handleError from "../utils/handleError";
import {
  SETTINGLIST,
  SETTINGBYID,
  ADDSETTINGS,
  UPDATEAPPSETTING,
  DELETEAPPSETTING,
  APPSETTING,
  APPSETTINGBYKEYNAMES,
} from "@/utils/apiConstants";

// Thunks
// Fatch Setting
export const fetchSetting = createAsyncThunk(
  "appSettings/fetchSetting",
  async (
    { pageNo=1, pageSize=10, SearchStr="", senderId=0, clientId=0 },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${SETTINGLIST}?PageNo=${pageNo}${
          SearchStr ? `&SearchStr=${SearchStr}` : ""
        }&PageSize=${pageSize}&SenderId=${senderId}&ClientId=${clientId}`,
        method: "GET",
        //payload: {},
      });

      if (response?.status === 200) {
        return {
          settingList: response.data,
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

// Fatch Setting By Id
export const fetchSettingById = createAsyncThunk(
  "appSettings/fetchSettingById",
  async ({ Id }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${SETTINGBYID}?id=${Id}`,
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

// ADD GROUP
export const addSettings = createAsyncThunk(
  "appSettings/addSettings",
  async (SettingData, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${ADDSETTINGS}`,
        method: "POST",
        payload: SettingData,
      });
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// UPDATE APP SETTING
export const updateAppSettings = createAsyncThunk(
  "appSettings/updateAppSettings",
  async (updateSetting, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${UPDATEAPPSETTING}`,
        method: "PUT",
        payload: updateSetting,
      });
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);

// delete App Setting
export const deleteAppSetting = createAsyncThunk(
  "appSettings/deleteAppSetting",
  async ({ Id, onSuccess }, { rejectWithValue }) => {
    try {
      const response = await API.post("/api", {
        endpoint: `${DELETEAPPSETTING}?Id=${Id}`,
        method: "DELETE",
        // payload: {},
      });

      if (onSuccess) onSuccess(); // Handle success callback
      return response.data;
    } catch (error) {
      const handledError = handleError(error);
      return rejectWithValue(handledError);
    }
  }
);
export const appSettings = createAsyncThunk(
  "appSettings/appSettings",
  async ({ SearchStr }, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `${APPSETTING}?${SearchStr ? `&SearchStr=${SearchStr}` : ""}`
      );
      if (response?.status === 200) {
        return {
          appSettingsData: response.data,
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
const AppSettingSlice = createSlice({
  name: "appSettings",
  initialState: {
    settingList: [],
    // appSettingsByKeyNameData: [],
    appSettingsData: [],
    settingDetails: null,
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
    clearAppSettingState: (state) => {
      state.settingList = [];
      state.settingDetails = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.pageSize = 10;
      state.totalRecords = 0;
    },

   
    clearAppSettingDetailState: (state) => {
      state.settingDetails = null;
      state.loading = false;
      state.error = null;
    },
    clearAppSettingCreateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearAppSettingDeleteState: (state) => {
      state.settingDetails = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearAppSettingDataState: (state) => {
      state.appSettingsData = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch AppSettings
      .addCase(fetchSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.settingList = action.payload.settingList;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / state.pageSize);
        state.message = action.payload.message || "";
      })
      .addCase(fetchSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Fetch AppSetting by ID
      .addCase(fetchSettingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettingById.fulfilled, (state, action) => {
        state.loading = false;
        state.settingDetails = action.payload;
        // state.message = action.payload || '';
      })
      .addCase(fetchSettingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Create Group Setting
      .addCase(addSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || " Created Successfully";
      })
      .addCase(addSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Update AppSetting
      .addCase(updateAppSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAppSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Updated Successfully";
      })
      .addCase(updateAppSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })

      // Delete AppSetting
      .addCase(deleteAppSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteAppSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Deleted Successfully";
      })
      .addCase(deleteAppSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload?.message || action.error.message;
      })
      // App Setting
      .addCase(appSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(appSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.appSettingsData = action.payload.appSettingsData;
        state.message = action.payload.message || "";
      })
      .addCase(appSettings.rejected, (state, action) => {
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
  clearAppSettingState,
  clearAppSettingDetailState,
  clearAppSettingCreateState,
  clearGroupDropState,
  clearAppSettingDeleteState,
  clearAppSettingDataState,
} = AppSettingSlice.actions;

export default AppSettingSlice.reducer;
