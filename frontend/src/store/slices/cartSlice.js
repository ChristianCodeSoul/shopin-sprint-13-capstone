import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    items: [],
};
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.items.find(
                (item) => item.productId === product._id
            );
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({
                    productId: product._id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: 1,
                });
            }
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                (item) => item.productId !== action.payload
            );
        },
        increaseQuantity: (state, action) => {
            const item = state.items.find(
                (item) => item.productId === action.payload
            );
            if (item) {
                item.quantity += 1;
            }
        },
        decreaseQuantity: (state, action) => {
            const item = state.items.find(
                (item) => item.productId === action.payload
            );
            if (!item) return;
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                state.items = state.items.filter(
                    (cartItem) => cartItem.productId !== action.payload
                );
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});
export const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;