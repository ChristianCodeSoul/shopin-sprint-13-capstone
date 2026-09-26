import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    profile: null,
    status: "idle",
    error: null,
};
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserProfile: (state, action) => {
            state.profile = action.payload;
            state.status = "fulfilled";
            state.error = null;
        },
        clearUserProfile: (state) => {
            state.profile = null;
            state.status = "idle";
            state.error = null;
        },
        setUserLoading: (state) => {
            state.status = "pending";
            state.error = null;
        },
        setUserError: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    },
});
export const {
    setUserProfile,
    clearUserProfile,
    setUserLoading,
    setUserError,
} = userSlice.actions;
export default userSlice.reducer;