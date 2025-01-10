"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useNotification } from "./Notifiction";
import { apiClient } from "@/lib/api-client";

interface ProductFormData {
  title: string;
  category: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminProductForm() {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      price: 0,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      await apiClient.createProduct(data);
      showNotification("Product created successfully!", "success");

      // Reset form after submission
      setValue("title", "");
      setValue("category", "");
      setValue("description", "");
      setValue("price", 0);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to create Product",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Product Title */}
      <div className="form-control">
        <label className="label">Product Title</label>
        <input
          type="text"
          className={`input input-bordered ${
            errors.title ? "input-error" : ""
          }`}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <span className="text-error text-sm mt-1">
            {errors.title.message}
          </span>
        )}
      </div>

      {/* Product category */}
      <div className="form-control">
        <label className="label">Product category</label>
        <input
          type="text"
          className={`input input-bordered ${
            errors.category ? "input-error" : ""
          }`}
          {...register("category", { required: "category is required" })}
        />
        {errors.category && (
          <span className="text-error text-sm mt-1">
            {errors.category.message}
          </span>
        )}
      </div>

      {/* Product Description */}
      <div className="form-control">
        <label className="label">Description</label>
        <textarea
          className={`textarea textarea-bordered h-24 ${
            errors.description ? "textarea-error" : ""
          }`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <span className="text-error text-sm mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      {/* Product Price */}
      <div className="form-control">
        <label className="label">Price ($)</label>
        <input
          type="number"
          step="0.01"
          className={`input input-bordered ${
            errors.price ? "input-error" : ""
          }`}
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true,
            min: {
              value: 0,
              message: "Price must be greater than or equal to 0",
            },
          })}
        />
        {errors.price && (
          <span className="text-error text-sm mt-1">
            {errors.price.message}
          </span>
        )}
      </div>

      <button type="button" className="btn btn-outline btn-block">
        <Plus className="w-4 h-4 mr-2" />
        Add Module
      </button>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving Product...
          </>
        ) : (
          "Create Product"
        )}
      </button>
    </form>
  );
}
