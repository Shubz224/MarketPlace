import { TryCatch } from "../middlewares/error.js";
import { Request, Response, NextFunction } from "express";
import {
  baseQuerytype,
  NewProductrequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductrequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;

    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please add photo", 400));
    if (!name || !price || !stock || !category) {
      rm(photo.path, () => console.log("Deleted"));

      return next(new ErrorHandler("Please Enter All Fields", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
    });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);

//for latest products
export const getLatestProducts = TryCatch(async (req, res, next) => {
  //querry
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

  return res.status(200).json({
    success: true,
    products,
  });
});

//for categories

export const getAllCategories = TryCatch(async (req, res, next) => {
  //querry
  const categories = await Product.distinct("category");

  return res.status(200).json({
    success: true,
    categories,
  });
});

//admin all products

export const getAdminProducts = TryCatch(async (req, res, next) => {
  //querry
  const products = await Product.find({});

  return res.status(200).json({
    success: true,
    products,
  });
});

//id get single product

export const getSingleProduct = TryCatch(async (req, res, next) => {
  //querry
  const product = await Product.findById(req.params.id);

  return res.status(200).json({
    success: true,
    product,
  });
});

//put request on updating and product

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const { name, price, stock, category } = req.body;

  const photo = req.file;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Invalid Product ID", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log(" Old photo Deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
});

//deleting product

export const deleteProduct = TryCatch(async (req, res, next) => {
  //querry

  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  rm(product.photo!, () => {
    console.log(" Product photo Deleted");
  });

  await Product.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Product deleted Successfully",
  });
});

//sorting and searching function for search page (All a Wala function)

export const getAllProducts = TryCatch(
  async (
    req: Request<{}, {}, {}, SearchRequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;

    const skip = (page - 1) * limit;

    const baseQuery: baseQuerytype = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    const productPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyproducts] = await Promise.all([
      productPromise,
      Product.find(baseQuery),
    ]);

    const totalpage = Math.ceil(filteredOnlyproducts.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalpage,
    });
  }
);


