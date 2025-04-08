import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setRedirectSprint } from "./sprintSlice.js";
import { setClickedUser } from "./projectUsersSlice.js";

const initialState = {
  appConfig: {},
  organizationUsers: undefined,
  initialDataLoading: true,
  initialDataError: false,
};

export const doGetMasterData = createAsyncThunk(
  "src/app/doGetMasterData",
  async (_, thunkApi) => {
    try {
      const response = await axios.get("/organizations/master-data");

      thunkApi.dispatch(doGetOrganizationUsers());

      const responseData = response.data;
      if (responseData) {
        return responseData;
      } else {
        return thunkApi.rejectWithValue("App details not found");
      }
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.message || "Failed to fetch master data"
      );
    }
  }
);

export const doGetOrganizationUsers = createAsyncThunk(
  "src/app/doGetOrganizationUsers",
  async (_, thunkApi) => {
    try {
      const response = await axios.get("/organizations/users");

      const responseData = response.data.body;
      if (responseData && responseData.length > 0) {
        thunkApi.dispatch(setClickedUser(responseData[0]));
        return responseData;
      } else {
        return thunkApi.rejectWithValue(
          "Organization users not found or empty"
        );
      }
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.message || "Failed to fetch organization users"
      );
    }
  }
);

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    clearAppState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(doGetMasterData.pending, (state) => {
        state.initialDataLoading = true;
        state.initialDataError = false; // Reset error state on pending
      })
      .addCase(doGetMasterData.fulfilled, (state, action) => {
        state.initialDataLoading = false;
        state.initialDataError = false;
        state.appConfig = action.payload;
      })
      .addCase(doGetMasterData.rejected, (state) => {
        state.initialDataLoading = false;
        state.initialDataError = true;
      })
      .addCase(doGetOrganizationUsers.pending, (state) => {
        state.initialDataLoading = true;
        state.initialDataError = false; // Reset error state on pending
      })
      .addCase(doGetOrganizationUsers.fulfilled, (state, action) => {
        state.initialDataLoading = false;
        state.initialDataError = false;
        state.organizationUsers = action.payload;
      })
      .addCase(doGetOrganizationUsers.rejected, (state) => {
        state.initialDataLoading = false;
        state.initialDataError = true;
      });
  },
});

export const { clearAppState } = appSlice.actions;

export const selectAppConfig = (state) => state.app.appConfig;
export const selectInitialDataLoading = (state) => state.app.initialDataLoading;
export const selectInitialDataError = (state) => state.app.initialDataError;
export const selectOrganizationUsers = (state) => state.app.organizationUsers;

export default appSlice.reducer;
