"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useNotification } from "./Notifiction";
import { apiClient } from "@/lib/api-client";

interface CourseFormData {
  title: string;
  topic: string;
  description: string;
  price: number;
  duration: number; // Duration in hours
  modules: { title: string; content: string; duration: number }[];
}

export default function AdminCourseForm() {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CourseFormData>({
    defaultValues: {
      title: "",
      topic: "",
      description: "",
      price: 0,
      duration: 0,
      modules: [{ title: "", content: "", duration: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "modules",
  });

  const onSubmit = async (data: CourseFormData) => {
    setLoading(true);
    try {
      await apiClient.createCourse(data);
      showNotification("Course created successfully!", "success");

      // Reset form after submission
      setValue("title", "");
      setValue("topic", "");
      setValue("description", "");
      setValue("price", 0);
      setValue("duration", 0);
      setValue("modules", [{ title: "", content: "", duration: 0 }]);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to create course",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Course Title */}
      <div className="form-control">
        <label className="label">Course Title</label>
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

      {/* Course Topic */}
      <div className="form-control">
        <label className="label">Course Topic</label>
        <input
          type="text"
          className={`input input-bordered ${
            errors.topic ? "input-error" : ""
          }`}
          {...register("topic", { required: "Topic is required" })}
        />
        {errors.topic && (
          <span className="text-error text-sm mt-1">
            {errors.topic.message}
          </span>
        )}
      </div>

      {/* Course Description */}
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

      {/* Course Price */}
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

      {/* Course Duration */}
      <div className="form-control">
        <label className="label">Duration (hours)</label>
        <input
          type="number"
          className={`input input-bordered ${
            errors.duration ? "input-error" : ""
          }`}
          {...register("duration", {
            required: "Duration is required",
            valueAsNumber: true,
            min: {
              value: 0,
              message: "Duration must be greater than or equal to 0",
            },
          })}
        />
        {errors.duration && (
          <span className="text-error text-sm mt-1">
            {errors.duration.message}
          </span>
        )}
      </div>

      {/* Modules */}
      <div className="divider">Modules</div>
      {fields.map((field, index) => (
        <div key={field.id} className="card bg-base-200 p-4 mb-4">
          <div className="form-control">
            <label className="label">Module Title</label>
            <input
              type="text"
              className="input input-bordered"
              {...register(`modules.${index}.title`, {
                required: "Title is required",
              })}
            />
          </div>

          <div className="form-control mt-4">
            <label className="label">Content</label>
            <textarea
              className="textarea textarea-bordered"
              {...register(`modules.${index}.content`, {
                required: "Content is required",
              })}
            />
          </div>

          <div className="form-control mt-4">
            <label className="label">Duration (minutes)</label>
            <input
              type="number"
              className="input input-bordered"
              {...register(`modules.${index}.duration`, {
                required: "Duration is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Duration must be at least 1 minute",
                },
              })}
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="btn btn-error btn-sm"
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4" />
              Remove Module
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-outline btn-block"
        onClick={() => append({ title: "", content: "", duration: 0 })}
      >
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
            Creating Course...
          </>
        ) : (
          "Create Course"
        )}
      </button>
    </form>
  );
}
