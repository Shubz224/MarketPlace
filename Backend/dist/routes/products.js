import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getLatestProducts, getSingleProduct, newProduct, updateProduct, } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
//Create new Product - /api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProduct);
//bigest - products with filter
app.get("/all", getAllProducts);
//to get 10 products - /api/v1/product/latest
app.get("/latest", getLatestProducts);
//to get categories - /api/v1/product/categories
app.get("/categories", getAllCategories);
//to get all  products - /api/v1/product/admin-products
app.get("/admin-products", adminOnly, getAdminProducts);
//to get 10 products - /api/v1/product/latest
app.route("/:id").get(getSingleProduct).put(adminOnly, singleUpload, updateProduct).delete(adminOnly, deleteProduct);
export default app;
