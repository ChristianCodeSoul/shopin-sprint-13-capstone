import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    isSidebarOpen: false,
    activeModal: null,
};
const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        openModal: (state, action) => {
            state.activeModal = action.payload;
        },
        closeModal: (state) => {
            state.activeModal = null;
        },
    },
});
export const {
    toggleSidebar,
    openModal,
    closeModal,
} = uiSlice.actions;
export default uiSlice.reducer;