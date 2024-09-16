import { cartItem, Order, Product, shippingInfo, User } from "./types";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type UserResponse = {
  success: boolean;
  user: User;
};

//product array
export type AllProductsResponse = {
  success: boolean;
  products: Product[];
};

export type CategoriesResponse = {
  success: boolean;
  categories: string[];
};

export type SearchProductsResponse = {
  success: boolean;
  products: Product[];
  totalPage: number;
};

export type SearchProductsRequest = {
  search: string;
  price: number;
  category: string;
  page: number;
  sort: string;
};

export type NewProductRequest = {
  id: string;
  formData: FormData;
};

export type ProductResponse = {
  success: boolean;
  product: Product;
};

export type UpdateProductResponse = {
  userId: string;
  productId: string;
  formData: FormData;
};

export type DeleteProductResponse = {
  userId: string;
  productId: string;
};

export type NewOrderRequest = {
  shippingInfo: shippingInfo;

  orderItems: cartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  user:string;
};

export type UpdateOrderRequest = {
  userId:string;
  orderId:string;
  
};

//orders
export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
};


export type OrderDetailsResponse = {
  success: boolean;
  orders: Order;
};