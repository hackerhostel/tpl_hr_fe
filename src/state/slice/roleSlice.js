import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    selectedRole: {},
    isRolesLoading: false,
    isRolesLoadingError: false,
    roles: [],
}

export const doGetRoles = createAsyncThunk(
    'roles/getRoles',
    async (thunkApi) => {
        try {
            const response = await axios.get(`/designations`)
            const responseData = response.data?.body?.designations || [];

            if (responseData) {
                return responseData
            } else {
                return thunkApi.rejectWithValue('Roles not found');
            }
        } catch (error) {
            console.log(error)
            return thunkApi.rejectWithValue(error.message);
        }
    }
);

export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setSelectedRole: (state, action) => {
            state.selectedRole = action.payload;
        },
        clearRoleState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(doGetRoles.pending, (state) => {
                state.isRolesLoading = true;
            })
            .addCase(doGetRoles.fulfilled, (state, action) => {
                state.roles = action.payload;
                state.isRolesLoading = false;
                state.isRolesLoadingError = false;
            })
            .addCase(doGetRoles.rejected, (state, action) => {
                state.isRolesLoading = false;
                state.isRolesLoadingError = true;
            });
    },
})

export const {setSelectedRole} = roleSlice.actions;

export const selectSelectedRole = (state) => state?.role?.selectedRole;
export const selectRoles = (state) => state?.role?.roles;
export const selectIsRolesLoading = (state) => state?.role?.isRolesLoading;
export const selectIsRolesLoadingError = (state) => state?.role?.isRolesLoadingError;

export default roleSlice.reducer
