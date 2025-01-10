import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  title: string;
  category: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Product = models?.Product || model<IProduct>("Product", ProductSchema);
export default Product;
