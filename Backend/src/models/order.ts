import mongoose, { mongo } from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        require: true,
      },
      city: {
        type: String,
        require: true,
      },
      state: {
        type: String,
        require: true,
      },
      country: {
        type: String,
        require: true,
      },
      pinCode: {
        type: Number,
        require: true,
      },
    },

    user: {
      type: String,
      ref: "User",
      required: true,
    },
    subtotal: {
      type: Number,
      require: true,
    },
    tax: {
      type: Number,
      require: true,
    },
    shippingCharges: {
      type: Number,
      require: true,
      default:0,
    },
    discount: {
      type: Number,
      require: true,
      default:0,
    },
    total: {
      type: Number,
      require: true,
    },
    status: {
        type: String,
        enum:["Processing","Shipped","Delivered"],
        default:"Processing",
      },
      orderItems: [
        {
          name: String,
          photo: String,
          price: Number,
          quantity: Number,
          productId: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
          },
        },
      ],
    },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", schema);
