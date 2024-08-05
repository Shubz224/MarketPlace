import mongoose from "mongoose";
import { invalidadtesCacheProps, OrderItemType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { Document } from "mongoose";

export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, {
      dbName: "store24",
    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

//revalidate caching
export const invalidadtesCache = ({
  product,
  admin,
  order,
  userId,
  orderId,
  productId,
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

  if (admin) {
    myCache.del([
      "admin-stats",
      "admin-pie-charts",
      "admin-bar-charts",
      "admin-line-charts",
    ]);
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

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = (thisMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getInventries = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  const categoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category })
  );

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount: Record<string, number>[] = [];

  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    });
  });

  return categoryCount;
};
//----------------------------------------------------------------------------------------------->
interface MyDocument extends Document {
  createdAt: Date;
  discount?: number;
  total?: number;
}

type funcProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};

//------------------------------------------------------------------------------------------------------>

export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: funcProps) => {
  //const today = new Date();
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      data[length - monthDiff - 1] += property ? i[property]! : 1;
    }
  });
  return data;
};
