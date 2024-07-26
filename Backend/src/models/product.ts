import mongoose, { mongo } from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    photo: {
      type: String,
      required: [true, "Please enter Photo"],
    },
    price: {
      type: Number,
      required: [true, "Please enter Price"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter Stock"],
    },
    category: {
      type: String,
      required: [true, "Please enter Product Category"],
      trim:true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);
