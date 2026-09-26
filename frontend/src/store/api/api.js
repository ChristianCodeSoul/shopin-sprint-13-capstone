import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth?.token;

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        headers.set("Content-Type", "application/json");

        return headers;
    },
});

export const api = createApi({
    reducerPath: "api",

    baseQuery,

    tagTypes: ["Product", "User", "Order"],

    endpoints: (builder) => ({
        // PRODUCTS
        getProducts: builder.query({
            query: () => "/products",
            providesTags: ["Product"],
        }),

        getProduct: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [
                { type: "Product", id },
            ],
        }),

        createProduct: builder.mutation({
            query: (product) => ({
                url: "/products",
                method: "POST",
                body: product,
            }),
            invalidatesTags: ["Product"],
        }),

        updateProduct: builder.mutation({
            query: ({ id, ...product }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body: product,
            }),

            async onQueryStarted(
                { id, ...patch },
                { dispatch, queryFulfilled }
            ) {
                const patchResult = dispatch(
                    api.util.updateQueryData(
                        "getProduct",
                        id,
                        (draft) => {
                            Object.assign(draft, patch);
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },

            invalidatesTags: (result, error, { id }) => [
                { type: "Product", id },
                "Product",
            ],
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),

        // USERS
        getUsers: builder.query({
            query: () => "/users",
            providesTags: ["User"],
        }),

        getUser: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [
                { type: "User", id },
            ],
        }),

        getMyProfile: builder.query({
            query: () => "/users/me",
            providesTags: ["User"],
        }),

        updateMyProfile: builder.mutation({
            query: (profile) => ({
                url: "/users/me",
                method: "PUT",
                body: profile,
            }),
            invalidatesTags: ["User"],
        }),

        changePassword: builder.mutation({
            query: (passwordData) => ({
                url: "/users/me/password",
                method: "PUT",
                body: passwordData,
            }),
        }),

        createUser: builder.mutation({
            query: (user) => ({
                url: "/users",
                method: "POST",
                body: user,
            }),
            invalidatesTags: ["User"],
        }),

        updateUser: builder.mutation({
            query: ({ id, ...user }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: user,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "User", id },
                "User",
            ],
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),

        // ORDERS
        getOrders: builder.query({
            query: () => "/orders",
            providesTags: ["Order"],
        }),

        getOrder: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [
                { type: "Order", id },
            ],
        }),

        createOrder: builder.mutation({
            query: (order) => ({
                url: "/orders",
                method: "POST",
                body: order,
            }),
            invalidatesTags: ["Order"],
        }),

        updateOrder: builder.mutation({
            query: ({ id, ...order }) => ({
                url: `/orders/${id}`,
                method: "PUT",
                body: order,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Order", id },
                "Order",
            ],
        }),

        deleteOrder: builder.mutation({
            query: (id) => ({
                url: `/orders/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Order"],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,

    useGetUsersQuery,
    useGetUserQuery,
    useGetMyProfileQuery,
    useUpdateMyProfileMutation,
    useChangePasswordMutation,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,

    useGetOrdersQuery,
    useGetOrderQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
} = api;