import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IModule {
  title: string;
  content: string; // Could be a URL or text content
  duration: number; // Duration in minutes
  createdAt: Date; // Created at
  updatedAt: Date; // Updated at
}

export interface ICourse extends Document {
  title: string; // Course title
  topic: string; // Course topic/category
  description: string; // Course description
  price: number; // Course price
  duration: number; // Total duration in hours
  modules: IModule[]; // List of modules
  createdAt: Date; // Created at
  updatedAt: Date; // Updated at
}

const moduleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    duration: { type: Number, required: true, min: 0 }, // Module duration in minutes
  },
  { timestamps: true }
);

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    topic: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 0 }, // Total course duration in hours
    modules: [moduleSchema], // Array of modules
  },
  { timestamps: true }
);

const Course = models?.Course || model<ICourse>("Course", courseSchema);
export default Course;
