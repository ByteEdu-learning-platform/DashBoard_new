import mongoose, { Schema, model, models, Document, ObjectId } from "mongoose";
import { ImageVariantType } from "./Product";

interface PopulatedUser {
  _id: mongoose.Types.ObjectId;
  email: string;
}

interface PopulatedProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  imageUrl: string;
}

export interface IVariant {
  type: "SQUARE" | "WIDE" | "PORTRAIT";
  price: number;
  license: "personal" | "commercial";
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  userId: ObjectId | PopulatedUser;
  productId: ObjectId | PopulatedProduct;
  variant: IVariant;
  // razorpayPaymentId: string;
  // razorpayOrderId: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  downloadUrl?: string;
  previewUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    variant: {
      type: {
        type: String,
        required: true,
        enum: ["SQUARE", "WIDE", "PORTRAIT"],
      },
      price: { type: Number, required: true },
      license: {
        type: String,
        required: true,
        enum: ["personal", "commercial"],
      },
    },
    // razorpayPaymentId: { type: String, required: true },
    // razorpayOrderId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    downloadUrl: { type: String },
    previewUrl: { type: String },
  },
  { timestamps: true }
);

const Order = models?.Order || model<IOrder>("Order", orderSchema);
export default Order;
