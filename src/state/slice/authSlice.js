import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setProjectList, setSelectedProject } from "./projectSlice.js";

const initialState = {
  appConfig: {},
  user: { permissions: [] },
  initialDataLoading: true,
  initialDataError: false,
};

export const doGetWhoAmI = createAsyncThunk(
  "src/auth/doGetWhoAmI",
  async (_, thunkApi) => {
    try {
      const response = await axios.get("/employees/who-am-i");

      const responseData = response.data.body;
      if (responseData && responseData.userDetails) {
        // Check if projects exist and is not empty
        if (responseData.projects && responseData.projects.length > 0) {
          thunkApi.dispatch(setProjectList(responseData.projects));
          thunkApi.dispatch(setSelectedProject(responseData.projects[0]));
        } else {
          // If projects are not available, set an empty list to avoid errors
          thunkApi.dispatch(setProjectList([]));
          thunkApi.dispatch(setSelectedProject(null)); // or handle as needed
        }

        return responseData.userDetails;
      } else {
        return thunkApi.rejectWithValue("User details not found");
      }
    } catch (error) {
      // Pass only the error message (string) to avoid non-serializable payload
      return thunkApi.rejectWithValue(
        error.message || "Failed to fetch user details"
      );
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(doGetWhoAmI.pending, (state) => {
        state.initialDataLoading = true;
        state.initialDataError = false; // Reset error state on pending
      })
      .addCase(doGetWhoAmI.fulfilled, (state, action) => {
        state.initialDataLoading = false;
        state.initialDataError = false;
        state.user = action.payload;
      })
      .addCase(doGetWhoAmI.rejected, (state) => {
        state.initialDataLoading = false;
        state.initialDataError = true;
      });
  },
});

export const { clearAuthState } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectInitialUserDataLoading = (state) =>
  state.auth.initialDataLoading;
export const selectInitialUserDataError = (state) =>
  state.auth.initialDataError;

export default authSlice.reducer;
