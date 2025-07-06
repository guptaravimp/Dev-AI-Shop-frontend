import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage
const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

const initialState = {
  totalItems: storedCartItems.length,
  cartItems: storedCartItems,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cartItems.push(action.payload);
      state.totalItems = state.cartItems.length;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("totalItems", state.totalItems.toString());
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        item => item && item._id !== action.payload
      );
      state.totalItems = state.cartItems.length;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      localStorage.setItem("totalItems", state.totalItems.toString());
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalItems = 0;
      localStorage.removeItem("cartItems");
      localStorage.setItem("totalItems", "0");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 