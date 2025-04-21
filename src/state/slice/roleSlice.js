import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    selectedRole: undefined,
}

export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setSelectedRole: (state, action) => {
            state.selectedRole = action.payload;
        },
        clearRoleState: () => initialState,
    },
})

export const {setSelectedRole} = roleSlice.actions;

export const selectSelectedRole = (state) => state?.role?.selectedRole;

export default roleSlice.reducer
