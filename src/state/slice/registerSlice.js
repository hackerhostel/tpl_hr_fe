import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { post } from "aws-amplify/api";
import { confirmSignUp } from "aws-amplify/auth";
import { getBuildConstant } from "../../constants/build-constants.jsx";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const doRegisterUser = createAsyncThunk(
  "register/doRegisterUser",
  async (userDetails, thunkApi) => {
    const { organization, firstName, lastName, username, password } =
      userDetails;
    try {
      const response = await post({
        apiName: "AffoohAPI",
        path: "/employees/register-new", // Corrected endpoint
        options: {
          body: {
            user: {
              password,
              email: username,
              firstName,
              lastName,
              organizationName: organization,
            },
          },
          headers: {
            "X-Api-Key": getBuildConstant("REACT_APP_X_API_KEY"),
          },
        },
      });

      const data = await response.response;
      if (data.body) {
        return data.body.userID;
      } else {
        return thunkApi.rejectWithValue("Registration failed");
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.message || "Network error");
    }
  }
);

export const doVerifyOTP = createAsyncThunk(
  "register/doVerifyOTP",
  async (verificationDetails, thunkApi) => {
    const { username, otp } = verificationDetails;
    try {
      const verificationResult = await confirmSignUp({
        username,
        confirmationCode: otp,
      });

      if (!verificationResult.isSignUpComplete) {
        return thunkApi.rejectWithValue("OTP verification failed");
      }
      return verificationResult;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.message || "OTP verification error"
      );
    }
  }
);

export const fetchUserInvitedOrganization = createAsyncThunk(
  "register/fetchUserInvitedOrganization",
  async (email, thunkApi) => {
    try {
      const response = await post({
        apiName: "AffoohAPI",
        path: `/employees/complete-registration/${email}`,
        options: {
          headers: {
            "X-Api-Key": getBuildConstant("REACT_APP_X_API_KEY"),
          },
        },
      });
      const data = await response.response;
      return data.body.inviteDetails || {};
    } catch (error) {
      return thunkApi.rejectWithValue(error.message || "Failed to get details");
    }
  }
);

export const registerInvitedUser = createAsyncThunk(
  "register/registerInvitedUser",
  async (registerDetails, thunkApi) => {
    try {
      const response = await post({
        apiName: "AffoohAPI",
        path: "/employees/complete-registration",
        options: {
          body: {
            user: {
              firstName: registerDetails.firstName,
              lastName: registerDetails.lastName,
              email: registerDetails.username,
            },
          },
          headers: {
            "X-Api-Key": getBuildConstant("REACT_APP_X_API_KEY"),
          },
        },
      });
      const data = await response.response;
      return data.body.userID;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message || "Failed Register User");
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    clearRegisterState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(doRegisterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doRegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(doRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(doVerifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doVerifyOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(doVerifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserInvitedOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInvitedOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserInvitedOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerInvitedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerInvitedUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerInvitedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRegisterState } = registerSlice.actions;
export default registerSlice.reducer;
