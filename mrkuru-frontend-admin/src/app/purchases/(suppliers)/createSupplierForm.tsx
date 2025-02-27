import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from "uuid";
import { X } from "lucide-react";

const schema = yup.object().shape({
  supplierName: yup
    .string()
    .required("Supplier Name is required")
    .min(5, "Supplier Name should have 5 characters minimum"),
  supplierContact: yup
    .string()
    .required("Supplier Contact is required")
    .matches(
      /^0[0-9]+$/,
      "Supplier Contact must start with 0 and only contain numbers"
    )
    .length(10, "Supplier Contact must be exactly 10 digits"),
  supplierAddress: yup
    .string()
    .required("Supplier Address is required")
    .min(10, "Supplier Address should have 5 characters minimum"),
});

type PurchaseStatusForm = yup.InferType<typeof schema> & {
  supplierId?: string;
};

type CreateSupplierFormProps = {
  onCreate: (formData: PurchaseStatusForm) => void;
};

const CreateSupplierForm = ({ onCreate }: CreateSupplierFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PurchaseStatusForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: PurchaseStatusForm) => {
    console.log("ProductFormData", data);
    onCreate({
      ...data,
      supplierContact: `+94${data.supplierContact}`,
      supplierId: uuidv4(),
    });
    reset();
  };

  return (
    <div className="w-full lg:w-3/5 xl:w-4/7 mb-8 p-4 border rounded-lg shadow-md bg-white transition-all ease-in-out duration-200">
      {/* Simple Subheading */}
      <h2 className="text-lg font-semibold mb-3 text-gray-900">
        Add a New Purchase Status
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {/* Supplier Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 ">
            Supplier Name
          </label>
          <Controller
            name="supplierName"
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
          {errors.supplierName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.supplierName.message}
            </p>
          )}
        </div>

        {/* Supplier Contact */}
        <div>
          <label className="block text-sm font-medium">Supplier Contact</label>
          <div className="relative">
            <Controller
              name="supplierContact"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  {/* Prefix */}
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">+94</span>
                  </div>
                  {/* Input Field */}
                  <input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    className="block w-full p-2 border-gray-300 border rounded-md pl-14 bg-white text-gray-900"
                  />
                  {/* Clear Button */}
                  {field.value !== "" && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      onClick={() => field.onChange("")}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </>
              )}
            />
          </div>
          {errors.supplierContact && (
            <p className="text-red-500 text-xs mt-1">
              {errors.supplierContact.message}
            </p>
          )}
        </div>

        {/* Supplier Address */}
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Supplier Address
          </label>
          <Controller
            name="supplierAddress"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className="relative">
                <textarea
                  {...field}
                  className="block w-full p-2 border-gray-300 border rounded-md resize-none h-22 bg-white pr-17"
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
          {errors.supplierAddress && (
            <p className="text-red-500 text-xs mt-1">
              {errors.supplierAddress.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="sm:col-span-2 text-left">
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

export default CreateSupplierForm;
