import { Request, Response, NextFunction } from "express";

export interface NewUserrequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}

export interface NewProductrequestBody {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

//cutomized it to access id of any time in update producct function but we wot do that w'll remove the types and use default (req) types

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface baseQuerytype {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };

  category?: string;
}

export type invalidadtesCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  review?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string | string[];
};

export type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};


export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemType[];
}