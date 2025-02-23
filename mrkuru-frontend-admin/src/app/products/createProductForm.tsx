"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useGetProductStatusQuery } from "@/state/api";
import { v4 as uuidv4 } from "uuid";

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  price: yup
    .number()
    .integer("Price must be an integer")
    .positive("Price must be above 0")
    .required("Price is required"),
  stockQuantity: yup
    .number()
    .integer("Stock must be an integer")
    .min(1, "Stock cannot be zero or negative")
    .required("Stock is required"),
  details: yup.string().required("Product details are required"),
  image: yup.mixed<File>().required("Product image is required"),
});

type ProductFormData = yup.InferType<typeof schema> & {
  status?: string;
  productId?: string;
};

type CreateProductFormProps = {
  onCreate: (formData: ProductFormData) => void;
};

const CreateProductForm = ({ onCreate }: CreateProductFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    data: productStatusData,
    isLoading,
    isError,
  } = useGetProductStatusQuery();

  const [defaultStatus, setDefaultStatus] = useState<string>("");

  useEffect(() => {
    if (productStatusData) {
      const defaultStatusObj = productStatusData.find(
        (status) => status.status === "In Stock"
      );
      if (defaultStatusObj) {
        setDefaultStatus(defaultStatusObj.productStatusId);
      }
    }
  }, [productStatusData]);

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

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("image", null as unknown as File);
  };

  const onSubmit = (data: ProductFormData) => {
    console.log("ProductFormData", data);
    onCreate({ ...data, status: defaultStatus, productId: uuidv4() });
    reset();
    setImagePreview(null);
  };

  return (
    <div className="mb-8 p-4 border rounded-lg shadow-md bg-white transition-all ease-in-out duration-200">
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
              <div className="relative">
                <input
                  {...field}
                  type="text"
                  className="block w-full p-2 border-gray-300 border rounded-md bg-white text-gray-900 pr-10"
                />
                {field.value !== "" && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    onClick={() => field.onChange("")}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
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
                <>
                  <input
                    {...field}
                    type="number"
                    step={0.01}
                    className="block w-full p-2 border-gray-300 border rounded-md pr-12 bg-white text-gray-900"
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        field.onChange(value.toFixed(2));
                      }
                    }}
                  />
                  {field.value > 0 && field.value !== 0.0 && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-16 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      onClick={() => field.onChange(0)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </>
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
          <label className="block text-sm font-medium">Stock Quantity</label>
          <div className="relative">
            <Controller
              name="stockQuantity"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="number"
                    className="block w-full p-2 border-gray-300 border rounded-md pr-12 bg-white text-gray-900"
                  />
                  {field.value > 0 && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-16 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      onClick={() => field.onChange(0)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </>
              )}
            />

            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-900">Pcs</span>
            </div>
          </div>
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
          <select
            value={defaultStatus}
            disabled
            className="block w-full p-2 border-gray-300 border rounded-md bg-gray-100"
          >
            {isLoading && <option className="animate-spin"></option>}

            {isError && !isLoading && (
              <option className="text-red-700">Error loading statuses</option>
            )}
            {(productStatusData?.length ?? 0) > 0 &&
              productStatusData?.map((productStatus) => (
                <option
                  key={productStatus.productStatusId}
                  value={productStatus.productStatusId}
                  className="text-black"
                >
                  {productStatus.status}
                </option>
              ))}
          </select>
        </div>

        {/* Details */}
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Details
          </label>
          <Controller
            name="details"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="relative">
                <textarea
                  {...field}
                  className="block w-full p-2 border-gray-300 border rounded-md resize-none h-28 bg-white pr-17"
                  rows={3}
                />
                {field.value !== "" && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    onClick={() => field.onChange("")}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
          />
          {errors.details && (
            <p className="text-red-500 text-xs mt-1">
              {errors.details.message}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={96}
                    height={96}
                    priority
                    quality={40}
                    className="object-cover rounded-md mx-auto"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-3 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
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
                          console.log("produtImage", e.target.files);
                          field.onChange(e.target.files?.[0]);
                          handleImageChange(e);
                        }}
                      />
                    )}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
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
