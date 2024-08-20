import { Product, User } from "./types";

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
