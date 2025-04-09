import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { post } from "aws-amplify/api";
import { confirmSignUp } from "aws-amplify/auth";
import axios from "axios";
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
        path: "/employees/register-new", // Fixed endpoint
        options: {
          body: {
            user: {
              password,
              email: username, // Align with backend
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

      const result = await response.response;
      if (result.body) {
        const data = await result.body.json(); // Correct response handling
        console.log("Registration response:", data);
        return data; // Expecting { userID }
      } else {
        return thunkApi.rejectWithValue("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      return thunkApi.rejectWithValue(
        error.message || "Failed to register user"
      );
    }
  }
);

export const fetchUserInvitedOrganization = createAsyncThunk(
  "register/fetchUserInvitedOrganization",
  async (email, thunkApi) => {
    try {
      const response = await axios.get(
        `/employees/complete-registration/${email}`, // Fixed endpoint
        {
          headers: {
            "X-Api-Key": getBuildConstant("REACT_APP_X_API_KEY"),
          },
        }
      );
      return response?.data?.body?.inviteDetails || {};
    } catch (error) {
      console.error("Fetch invited organization error:", error);
      return thunkApi.rejectWithValue(error.message || "Failed to get details");
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
      console.error("OTP verification error:", error);
      return thunkApi.rejectWithValue(
        error.message || "OTP verification failed"
      );
    }
  }
);

export const registerInvitedUser = createAsyncThunk(
  "register/registerInvitedUser",
  async (registerDetails, thunkApi) => {
    try {
      const response = await post({
        apiName: "AffoohAPI",
        path: "/employees/complete-registration", // Fixed endpoint
        options: {
          body: {
            user: {
              firstName: registerDetails.firstName,
              lastName: registerDetails.lastName,
              email: registerDetails.username, // Align with backend
            },
          },
          headers: {
            "X-Api-Key": getBuildConstant("REACT_APP_X_API_KEY"),
          },
        },
      });

      const result = await response.response;
      if (result.body) {
        return await result.body.json();
      } else {
        return thunkApi.rejectWithValue("Failed to register invited user");
      }
    } catch (error) {
      console.error("Invited user registration error:", error);
      return thunkApi.rejectWithValue(
        error.message || "Failed to register user"
      );
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
      });
  },
});

export const sendInvitation = createAsyncThunk(
  "invitations/sendInvitation",
  async ({ email, userRole }, thunkApi) => {
    try {
      const response = await axios.post("/organizations/invite-user", {
        email,
        userRole,
      });

      if (!response?.data?.body?.userID) {
        return thunkApi.rejectWithValue("Invalid response format");
      }

      return response.data.body.userID;
    } catch (error) {
      console.error("Send invitation error:", error);
      return thunkApi.rejectWithValue(
        error.message || "Failed to send invitation"
      );
    }
  }
);

const invitationsSlice = createSlice({
  name: "invitations",
  initialState: {
    invitations: [],
    currentInvitation: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearInvitationError: (state) => {
      state.error = null;
    },
    resetInvitationStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.currentInvitation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendInvitation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendInvitation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.invitations.push(action.payload);
        state.currentInvitation = action.payload;
      })
      .addCase(sendInvitation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearRegisterState } = registerSlice.actions;
export const selectRegisterState = (state) => state.register;

export default registerSlice.reducer;
