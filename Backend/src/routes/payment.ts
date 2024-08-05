import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import {
  allCoupons,
  applyDiscount,
  createPaymentIntent,
  deleteCoupons,
  newCoupon,
} from "../controllers/payment.js";

const app = express.Router();

app.post("/create", createPaymentIntent);

//api/v1/payment/coupon/new
app.post("/coupon/new", newCoupon);

//api/v1/payment/discount
app.get("/discount", applyDiscount);

//api/v1/payment/coupon/all
app.get("/coupon/all", adminOnly, allCoupons);

//-> /api/payment/coupon/delete:id
app.delete("/coupon/:id", adminOnly, deleteCoupons);

export default app;
