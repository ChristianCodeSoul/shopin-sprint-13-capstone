import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    status: "idle",
    error: null,
};

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(credentials),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    data.message || "Invalid username or password."
                );
            }

            return data;
        } catch (error) {
            return rejectWithValue("Network error");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.status = "fulfilled";
            state.error = null;
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.status = "idle";
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.status = "rejected";
                state.error =
                    action.payload || "Invalid username or password.";
            });
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;