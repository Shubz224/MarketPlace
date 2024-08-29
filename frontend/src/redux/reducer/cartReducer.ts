import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cartReducerInitialstate } from "../../types/reducer-types";
import { cartItem } from "../../types/types";

const initialState: cartReducerInitialstate = {
  loading: false,
  cartItems: [],
  subtotal: 0,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  },
};

export const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<cartItem>) => {
      state.loading = true;
      state.cartItems.push(action.payload);
      state.loading = false;
    },

    //jiski id match nahi vo aaray me nahirahegi 

    removeCartItems: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.cartItems = state.cartItems.filter(
        (i) => i.productId !== action.payload
      );
      state.loading = false;
    },
  },
});


export const {addToCart,removeCartItems} = cartReducer.actions;