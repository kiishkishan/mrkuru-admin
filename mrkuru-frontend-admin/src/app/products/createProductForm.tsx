"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Upload } from "lucide-react";
import Image from "next/image";

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  price: yup
    .number()
    .positive("Price must be positive")
    .required("Price is required"),
  stockQuantity: yup
    .number()
    .integer("Stock must be an integer")
    .min(1, "Stock cannot be zero or negative")
    .required("Stock is required"),
  details: yup.string().required("Product details are required"),
  status: yup.string().required("Product status is required"),
  image: yup.mixed().required("Product image is required"),
});

type ProductFormData = yup.InferType<typeof schema>;

type CreateProductFormProps = {
  onCreate: (formData: ProductFormData) => void;
};

const CreateProductForm = ({ onCreate }: CreateProductFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProductFormData) => {
    onCreate(data); // Pass form data to parent
    reset(); // Reset the form after submission
    setImagePreview(null); // Clear image preview
  };

  return (
    <div className="mb-8 p-4 border rounded-lg shadow-md bg-white">
      {/* Simple Subheading */}
      <h2 className="text-lg font-semibold mb-3 text-gray-900">
        Add a New Product
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 ">
            Product Name
          </label>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="block w-full p-2 border-gray-300 border rounded-md bg-white text-gray-900"
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium">Price</label>
          <div className="relative">
            <Controller
              name="price"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  step="0.01"
                  className="block w-full p-2 border-gray-300 border rounded-md pr-12 bg-white text-gray-900"
                />
              )}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-900">LKR</span>
            </div>
          </div>
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Stock Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock Quantity
          </label>
          <Controller
            name="stockQuantity"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                className="block w-full p-2 border-gray-300 border rounded-md bg-white text-gray-900"
              />
            )}
          />
          {errors.stockQuantity && (
            <p className="text-red-500 text-xs mt-1">
              {errors.stockQuantity.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <Controller
            name="status"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <select
                {...field}
                className="block w-full p-2 border-gray-300 border rounded-md bg-white"
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="On Hold">On Hold</option>
              </select>
            )}
          />
          {errors.status && (
            <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Details */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Details
          </label>
          <Controller
            name="details"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <textarea
                {...field}
                className="block w-full p-2 border-gray-300 border rounded-md resize-none h-20 bg-white"
                rows={3}
              />
            )}
          />
          {errors.details && (
            <p className="text-red-500 text-xs mt-1">
              {errors.details.message}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={96}
                  height={96}
                  className="object-cover rounded-md mx-auto"
                />
              ) : (
                <Upload className="mx-auto h-8 w-8 text-gray-400" /> // Lucide icon
              )}
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]);
                          handleImageChange(e);
                        }}
                      />
                    )}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          {errors.image && (
            <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="sm:col-span-2 text-right">
          <button
            type="submit"
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductForm;
