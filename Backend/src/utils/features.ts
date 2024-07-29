import mongoose from "mongoose";
import { invalidadtesCacheProps, OrderItemType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";

export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, {
      dbName: "store24",
    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

//revalidate caching
export const invalidadtesCache = async ({
  product,
  admin,
  order,
  userId,
  orderId,
  productId
}: invalidadtesCacheProps) => {
  //----------------------------------------------------------------------------->product
  if (product) {
    const productkeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
    ];

    if (typeof productId === "string") productkeys.push(`product-${productId}`);

    if (typeof productId === "object") {
      productId.forEach((i) => productkeys.push(`product-${i}`));
    }

    myCache.del(productkeys);
  }

  /////order----------------------------------------->
  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];
    myCache.del(orderKeys);
  }
};

//reduce stock feature which reduces stock after order is placed

export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product Not Found");

    product.stock -= order.quantity;
    await product.save();
  }
};
