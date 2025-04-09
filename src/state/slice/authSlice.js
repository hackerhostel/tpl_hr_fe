import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from "axios";

const initialState = {
  appConfig: {},
  user: { permissions: [] },
  initialDataLoading: true,
  initialDataError: false,
}

export const doGetWhoAmI = createAsyncThunk('src/auth/doGetWhoAmI', async (_, thunkApi) => {
  try {
    const response = await axios.get('/employees/who-am-i');

    const responseData = response.data.body;
    if (responseData) {
      return responseData.userDetails;
    } else {
      return thunkApi.rejectWithValue('User details not found');
    }
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(doGetWhoAmI.pending, (state) => {
      state.initialDataLoading = true;
    });
    builder.addCase(doGetWhoAmI.fulfilled, (state, action) => {
      state.initialDataLoading = false;
      state.initialDataError = false;
      state.user = action.payload;
    });
    builder.addCase(doGetWhoAmI.rejected, (state) => {
      state.initialDataLoading = false;
      state.initialDataError = true;
    });
  }
});

export const { clearAuthState } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectInitialUserDataLoading = (state) => state.auth.initialDataLoading;
export const selectInitialUserDataError = (state) => state.auth.initialDataError;

export default authSlice.reducer;
