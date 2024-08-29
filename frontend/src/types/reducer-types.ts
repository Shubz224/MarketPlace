import { cartItem, shippingInfo, User } from "./types";

export interface userReducerInitialstate {
  user: User | null;
  loading: boolean;
}

export interface cartReducerInitialstate {
  loading: boolean;
  cartItems: cartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  shippingInfo: shippingInfo;
}
