import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import uiReducer from "./slices/uiSlice";
import cartReducer from "./slices/cartSlice";

import { api } from "./api/api";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        ui: uiReducer,
        cart: cartReducer,
        [api.reducerPath]: api.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});