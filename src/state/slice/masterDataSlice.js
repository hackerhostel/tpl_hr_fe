import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  designations: [],
  departments: [],
  userRoles: [],
  employeeStatuses: [],
  reportingManagers: [],
  trainingLevels: [],
  developmentPlans: [],
  isFormDataLoading: false,
  isFormDataLoadingError: false,
};

export const doGetMasterData = createAsyncThunk(
  "masterData/getMasterData",
  async (_, thunkApi) => {
    try {
      const response = await axios.get("/organizations/master-data");
      const responseData = response.data || {};

      if (responseData) {
        return {
          designations: responseData.designations || [],
          userRoles: responseData.userRoles || [],
          departments: responseData.departments || [],
          employeeStatuses: responseData.employeeStatuses || [],
        };
      } else {
        return thunkApi.rejectWithValue("Master data not found");
      }
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const doGetFormData = createAsyncThunk(
  "masterData/getFormData",
  async (_, thunkApi) => {
    try {
      const response = await axios.get("/employees/form-data");
      const responseData = response.data?.body;


      if (responseData) {
        const trainingLevels = responseData.trainingLevels || [];
        const developmentPlans = responseData.developmentPlans || [];

       

        return { trainingLevels, developmentPlans };
      } else {
        return thunkApi.rejectWithValue("Form data not found");
      }
    } catch (error) {
      console.error("API Error", error);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const doGetReportingManagers = createAsyncThunk(
  "masterData/getReportingManagers",
  async (_, thunkApi) => {
    try {
      const response = await axios.get("/employees/form-data");
      const responseData = response.data?.body?.managers || [];

      if (responseData) {
        return responseData;
      } else {
        return thunkApi.rejectWithValue("Reporting managers not found");
      }
    } catch (error) {
      console.log(error);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const masterDataSlice = createSlice({
  name: "masterData",
  initialState,
  reducers: {
    clearMasterDataState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(doGetMasterData.pending, (state) => {
        state.isFormDataLoading = true;
      })
      .addCase(doGetMasterData.fulfilled, (state, action) => {
        state.designations = action.payload.designations;
        state.departments = action.payload.departments;
        state.userRoles = action.payload.userRoles;
        state.employeeStatuses = action.payload.employeeStatuses;
        state.isFormDataLoading = false;
        state.isFormDataLoadingError = false;
      })
      .addCase(doGetMasterData.rejected, (state) => {
        state.isFormDataLoading = false;
        state.isFormDataLoadingError = true;
      })
      .addCase(doGetReportingManagers.pending, (state) => {
        state.isFormDataLoading = true;
      })
      .addCase(doGetReportingManagers.fulfilled, (state, action) => {
        state.reportingManagers = action.payload;
        state.isFormDataLoading = false;
        state.isFormDataLoadingError = false;
      })
      .addCase(doGetReportingManagers.rejected, (state) => {
        state.isFormDataLoading = false;
        state.isFormDataLoadingError = true;
      })
      .addCase(doGetFormData.pending, (state) => {
        state.isFormDataLoading = true;
      })
      .addCase(doGetFormData.fulfilled, (state, action) => {
        const { trainingLevels, developmentPlans } = action.payload;
        state.trainingLevels = trainingLevels;
        state.developmentPlans = developmentPlans;
        state.isFormDataLoading = false;
        state.isFormDataLoadingError = false;
      })
      .addCase(doGetFormData.rejected, (state) => {
        state.isFormDataLoading = false;
        state.isFormDataLoadingError = true;
      });
  },
});

export const { clearMasterDataState } = masterDataSlice.actions;

export const selectDesignations = (state) => state?.masterData?.designations;
export const selectDepartments = (state) => state?.masterData?.departments;
export const selectUserRoles = (state) => state?.masterData?.userRoles;
export const selectTrainingLevels = (state) => state?.masterData?.trainingLevels;
export const selectDevelopmentPlans = (state) => state?.masterData?.developmentPlans;
export const selectEmployeeStatuses = (state) => state?.masterData?.employeeStatuses;
export const selectReportingManagers = (state) => state?.masterData?.reportingManagers;
export const selectIsFormDataLoading = (state) => state?.masterData?.isFormDataLoading;
export const selectIsFormDataLoadingError = (state) => state?.masterData?.isFormDataLoadingError;

export default masterDataSlice.reducer;
