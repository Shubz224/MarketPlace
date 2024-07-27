import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
export const connectDB = () => {
    mongoose
        .connect("mongodb://localhost:27017", {
        dbName: "store24",
    })
        .then((c) => console.log(`DB connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
//revalidate caching 
export const invalidadtesCache = async ({ product, admin, order, }) => {
    if (product) {
        const productkeys = [
            "all-products",
            "categories",
            "latest-products"
        ];
        const product = await Product.find({}).select("_id");
        product.forEach(element => {
            productkeys.push(`product-${element._id}`);
        });
        myCache.del(productkeys);
    }
    if (admin) {
    }
};
