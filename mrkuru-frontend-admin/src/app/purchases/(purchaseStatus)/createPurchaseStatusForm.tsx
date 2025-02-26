import React from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from "uuid";
import { X } from "lucide-react";

const schema = yup.object().shape({
  status: yup.string().required("Status is required"),
});

type PurchaseStatusForm = yup.InferType<typeof schema> & {
  purchaseStatusId?: string;
};

type CreatePurchaseStatusFormProps = {
  onCreate: (formData: PurchaseStatusForm) => void;
};

const CreatePurchaseStatusForm = ({
  onCreate,
}: CreatePurchaseStatusFormProps) => {
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
    onCreate({ ...data, purchaseStatusId: uuidv4() });
    reset();
  };

  return (
    <div className="w-full md:w-fit mb-8 p-4 border rounded-lg shadow-md bg-white transition-all ease-in-out duration-200">
      {/* Simple Subheading */}
      <h2 className="text-lg font-semibold mb-3 text-gray-900">
        Add a New Purchase Status
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 ">
            Purchase Status
          </label>
          <Controller
            name="status"
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
          {errors.status && (
            <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
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

export default CreatePurchaseStatusForm;
